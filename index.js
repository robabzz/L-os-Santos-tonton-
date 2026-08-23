const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =========================
// VARIABLES
// =========================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const REPORT_CHANNEL_ID =
  process.env.REPORT_CHANNEL_ID;

// =========================
// RÔLES
// =========================

const LSPD_ROLE_ID =
  process.env.LSPD_ROLE_ID;

const CADET_ROLE_ID =
  process.env.CADET_ROLE_ID;

const OFFICIER_ROLE_ID =
  process.env.OFFICIER_ROLE_ID;

const CAPORAL_ROLE_ID =
  process.env.CAPORAL_ROLE_ID;

const SERGENT_ROLE_ID =
  process.env.SERGENT_ROLE_ID;

const HAUT_GRADE_ROLE_ID =
  process.env.HAUT_GRADE_ROLE_ID;

// =========================
// TARIFS
// =========================

const PAY_RATES = {
  [CADET_ROLE_ID]: 3500,
  [OFFICIER_ROLE_ID]: 5500,
  [CAPORAL_ROLE_ID]: 7500,
  [SERGENT_ROLE_ID]: 15000,
  [HAUT_GRADE_ROLE_ID]: 35000
};

// =========================
// PRIMES
// =========================

const BONUS_15H = 100000;
const BONUS_45H = 600000;

// =========================
// FICHIER USERDATA
// =========================

const DATA_FILE =
  path.join(__dirname, "userdata.json");

let userdata = {
  agents: {}
};

if (fs.existsSync(DATA_FILE)) {
  try {
    userdata = JSON.parse(
      fs.readFileSync(
        DATA_FILE,
        "utf8"
      )
    );
  } catch (error) {
    console.error(
      "Erreur lors du chargement de userdata.json"
    );
  }
}

function saveData() {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      userdata,
      null,
      2
    )
  );
}

// =========================
// COMMANDES
// =========================

const commands = [

  new SlashCommandBuilder()
    .setName("clockin")
    .setDescription(
      "Prendre son service"
    ),

  new SlashCommandBuilder()
    .setName("clockout")
    .setDescription(
      "Terminer son service"
    ),

  new SlashCommandBuilder()
    .setName("dispatch")
    .setDescription(
      "Prendre le dispatch"
    ),

  new SlashCommandBuilder()
    .setName("dispatchout")
    .setDescription(
      "Quitter le dispatch"
    ),

  new SlashCommandBuilder()
    .setName("dispatchlist")
    .setDescription(
      "Voir les personnes au dispatch"
    ),

  new SlashCommandBuilder()
    .setName("services")
    .setDescription(
      "Voir les personnes actuellement en service"
    ),

  new SlashCommandBuilder()
    .setName("userdata")
    .setDescription(
      "Voir son temps de service"
    ),

  new SlashCommandBuilder()
    .setName("paye")
    .setDescription(
      "Calculer la paye des agents"
    ),

  new SlashCommandBuilder()
    .setName("addminute")
    .setDescription(
      "Ajouter des minutes à son service"
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription(
          "Nombre de minutes"
        )
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("force-clockout")
    .setDescription(
      "Forcer la fin de service d'un membre"
    )
    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription(
          "Membre concerné"
        )
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("force-clockoutall")
    .setDescription(
      "Forcer la fin de service de tout le monde"
    ),

  new SlashCommandBuilder()
    .setName("reset")
    .setDescription(
      "Réinitialiser les services"
    )

].map(command =>
  command.toJSON()
);

// =========================
// VARIABLES TEMPORAIRES
// =========================

const services =
  new Map();

const dispatchers =
  new Map();

// =========================
// PERMISSIONS
// =========================

function hasRole(member, roleId) {

  if (!roleId) {
    return false;
  }

  return member.roles.cache.has(
    roleId
  );
}

// Le dispatch est accessible
// à tout le LSPD
function canUseDispatch(member) {

  return hasRole(
    member,
    LSPD_ROLE_ID
  );
}

// Commandes de gestion
// réservées aux Hauts Gradés
function canManageServices(member) {

  return hasRole(
    member,
    HAUT_GRADE_ROLE_ID
  );
}

// =========================
// GRADE
// =========================

function getGrade(member) {

  if (
    hasRole(
      member,
      HAUT_GRADE_ROLE_ID
    )
  ) {
    return "Haut Gradé";
  }

  if (
    hasRole(
      member,
      SERGENT_ROLE_ID
    )
  ) {
    return "Sergent";
  }

  if (
    hasRole(
      member,
      CAPORAL_ROLE_ID
    )
  ) {
    return "Caporal";
  }

  if (
    hasRole(
      member,
      OFFICIER_ROLE_ID
    )
  ) {
    return "Officier";
  }

  if (
    hasRole(
      member,
      CADET_ROLE_ID
    )
  ) {
    return "Cadet";
  }

  return "Grade inconnu";
}

// =========================
// TARIF DU GRADE
// =========================

function getPayRate(member) {

  if (
    hasRole(
      member,
      HAUT_GRADE_ROLE_ID
    )
  ) {
    return 35000;
  }

  if (
    hasRole(
      member,
      SERGENT_ROLE_ID
    )
  ) {
    return 15000;
  }

  if (
    hasRole(
      member,
      CAPORAL_ROLE_ID
    )
  ) {
    return 7500;
  }

  if (
    hasRole(
      member,
      OFFICIER_ROLE_ID
    )
  ) {
    return 5500;
  }

  if (
    hasRole(
      member,
      CADET_ROLE_ID
    )
  ) {
    return 3500;
  }

  return 0;
}

// =========================
// PRIME
// =========================

function getBonus(totalMinutes) {

  const hours =
    totalMinutes / 60;

  if (hours >= 45) {
    return BONUS_45H;
  }

  if (hours >= 15) {
    return BONUS_15H;
  }

  return 0;
}

// =========================
// USERDATA
// =========================

function getAgent(user) {

  if (!userdata.agents[user.id]) {

    userdata.agents[user.id] = {
      username: user.username,
      totalMinutes: 0
    };
  }

  userdata.agents[user.id].username =
    user.username;

  return userdata.agents[user.id];
}

// =========================
// TEMPS
// =========================

function formatTime(minutes) {

  const hours =
    Math.floor(
      minutes / 60
    );

  const mins =
    minutes % 60;

  return `${hours}h ${mins}min`;
}

// =========================
// ARGENT
// =========================

function formatMoney(amount) {

  return new Intl.NumberFormat(
    "fr-FR"
  ).format(
    Math.round(amount)
  );
}

// =========================
// INSTALLATION COMMANDES
// =========================

const rest =
  new REST({
    version: "10"
  }).setToken(TOKEN);

async function deployCommands() {

  await rest.put(
    Routes.applicationGuildCommands(
      CLIENT_ID,
      GUILD_ID
    ),
    {
      body: commands
    }
  );

  console.log(
    "Commandes slash installées."
  );
}

// =========================
// READY
// =========================

client.once(
  "ready",
  async () => {

    console.log(
      `Bot connecté : ${client.user.tag}`
    );

    try {

      await deployCommands();

    } catch (error) {

      console.error(
        "Erreur commandes :",
        error
      );
    }

    setInterval(
      checkSundayReport,
      60 * 1000
    );
  }
);

// =========================
// INTERACTIONS
// =========================

client.on(
  "interactionCreate",
  async interaction => {

    if (
      !interaction.isChatInputCommand()
    ) {
      return;
    }

    const command =
      interaction.commandName;

    const user =
      interaction.user;

    const member =
      interaction.member;

    // =========================
    // CLOCKIN
    // =========================

    if (
      command === "clockin"
    ) {

      if (
        !hasRole(
          member,
          LSPD_ROLE_ID
        )
      ) {

        return interaction.reply({
          content:
            "❌ Vous devez avoir le rôle LSPD pour prendre votre service.",
          ephemeral: true
        });
      }

      if (
        services.has(user.id)
      ) {

        return interaction.reply({
          content:
            "⚠️ Vous êtes déjà en service.",
          ephemeral: true
        });
      }

      services.set(
        user.id,
        {
          username:
            user.username,

          startedAt:
            Date.now()
        }
      );

      getAgent(user);

      saveData();

      return interaction.reply(
        `🟢 ${user} a pris son service.`
      );
    }

    // =========================
    // CLOCKOUT
    // =========================

    if (
      command === "clockout"
    ) {

      const service =
        services.get(
          user.id
        );

      if (!service) {

        return interaction.reply({
          content:
            "🔴 Vous n'êtes pas actuellement en service.",
          ephemeral: true
        });
      }

      const minutes =
        Math.floor(
          (
            Date.now() -
            service.startedAt
          ) / 60000
        );

      const agent =
        getAgent(user);

      agent.totalMinutes +=
        minutes;

      services.delete(
        user.id
      );

      saveData();

      return interaction.reply(
        `🔴 ${user} a terminé son service.\n` +
        `⏱️ Durée : ${formatTime(minutes)}\n` +
        `📊 Total : ${formatTime(agent.totalMinutes)}`
      );
    }

    // =========================
    // DISPATCH
    // =========================

    if (
      command === "dispatch"
    ) {

      if (
        !canUseDispatch(member)
      ) {

        return interaction.reply({
          content:
            "❌ Vous devez avoir le rôle LSPD pour prendre le dispatch.",
          ephemeral: true
        });
      }

      if (
        dispatchers.has(user.id)
      ) {

        return interaction.reply({
          content:
            "⚠️ Vous êtes déjà au dispatch.",
          ephemeral: true
        });
      }

      dispatchers.set(
        user.id,
        {
          username:
            user.username,

          startedAt:
            Date.now()
        }
      );

      return interaction.reply(
        `📡 ${user} est maintenant au dispatch.`
      );
    }

    // =========================
    // DISPATCH OUT
    // =========================

    if (
      command === "dispatchout"
    ) {

      if (
        !dispatchers.has(user.id)
      ) {

        return interaction.reply({
          content:
            "❌ Vous n'êtes pas au dispatch.",
          ephemeral: true
        });
      }

      dispatchers.delete(
        user.id
      );

      return interaction.reply(
        `📡 ${user} a quitté le dispatch.`
      );
    }

    // =========================
    // DISPATCH LIST
    // =========================

    if (
      command === "dispatchlist"
    ) {

      if (
        dispatchers.size === 0
      ) {

        return interaction.reply(
          "📡 Aucun membre au dispatch."
        );
      }

      const list =
        [
          ...dispatchers.values()
        ]
          .map(
            agent =>
              `• ${agent.username}`
          )
          .join("\n");

      return interaction.reply(
        `📡 **Membres au dispatch :**\n${list}`
      );
    }

    // =========================
    // SERVICES
    // =========================

    if (
      command === "services"
    ) {

      if (
        services.size === 0
      ) {

        return interaction.reply(
          "🚔 Aucun membre en service."
        );
      }

      const list =
        [
          ...services.values()
        ]
          .map(
            agent =>
              `• ${agent.username}`
          )
          .join("\n");

      return interaction.reply(
        `🚔 **Membres actuellement en service :**\n${list}`
      );
    }

    // =========================
    // USERDATA
    // =========================

    if (
      command === "userdata"
    ) {

      const agent =
        getAgent(user);

      let totalMinutes =
        agent.totalMinutes;

      const service =
        services.get(
          user.id
        );

      if (service) {

        const currentMinutes =
          Math.floor(
            (
              Date.now() -
              service.startedAt
            ) / 60000
          );

        totalMinutes +=
          currentMinutes;
      }

      return interaction.reply(
        `📊 **Votre userdata**\n\n` +
        `👮 Agent : ${user}\n` +
        `⏱️ Temps de service : **${formatTime(totalMinutes)}**`
      );
    }

    // =========================
    // PAYE
    // =========================

    if (
      command === "paye"
    ) {

      if (
        !canManageServices(member)
      ) {

        return interaction.reply({
          content:
            "❌ Cette commande est réservée aux Hauts Gradés.",
          ephemeral: true
        });
      }

      const agentEntries =
        Object.entries(
          userdata.agents
        );

      if (
        agentEntries.length === 0
      ) {

        return interaction.reply(
          "💰 Aucun agent n'a encore de données."
        );
      }

      let message =
        "💰 **PAYE DES AGENTS**\n\n";

      for (
        const [
          userId,
          agent
        ] of agentEntries
      ) {

        let totalMinutes =
          agent.totalMinutes;

        const service =
          services.get(
            userId
          );

        if (service) {

          const currentMinutes =
            Math.floor(
              (
                Date.now() -
                service.startedAt
              ) / 60000
            );

          totalMinutes +=
            currentMinutes;
        }

        let targetMember;

        try {

          targetMember =
            await interaction.guild.members.fetch(
              userId
            );

        } catch (error) {

          targetMember = null;
        }

        let grade =
          "Grade inconnu";

        let rate =
          0;

        if (targetMember) {

          grade =
            getGrade(
              targetMember
            );

          rate =
            getPayRate(
              targetMember
            );
        }

        // =========================
        // CALCUL PAYE
        // =========================

        const salary =
          (
            totalMinutes / 60
          ) * rate;

        // =========================
        // CALCUL PRIME
        // =========================

        const bonus =
          getBonus(
            totalMinutes
          );

        // =========================
        // TOTAL
        // =========================

        const total =
          salary + bonus;

        let bonusText =
          "Aucune prime";

        if (
          bonus === BONUS_15H
        ) {
          bonusText =
            "100 000 $";
        }

        if (
          bonus === BONUS_45H
        ) {
          bonusText =
            "600 000 $";
        }

        message +=
          `👮 ${agent.username}\n` +
          `🎖️ Grade : **${grade}**\n` +
          `⏱️ Temps : **${formatTime(totalMinutes)}**\n` +
          `💵 Taux : **${formatMoney(rate)} $/h**\n` +
          `💰 Paye : **${formatMoney(salary)} $**\n` +
          `🎁 Prime : **${bonusText}**\n` +
          `💸 Total : **${formatMoney(total)} $**\n\n`;
      }

      return interaction.reply(
        message
      );
    }

    // =========================
    // ADD MINUTE
    // =========================

    if (
      command === "addminute"
    ) {

      const minutes =
        interaction.options.getInteger(
          "minutes"
        );

      if (
        minutes <= 0
      ) {

        return interaction.reply({
          content:
            "❌ Le nombre de minutes doit être supérieur à 0.",
          ephemeral: true
        });
      }

      const service =
        services.get(
          user.id
        );

      if (!service) {

        return interaction.reply({
          content:
            "❌ Vous devez être en service.",
          ephemeral: true
        });
      }

      service.startedAt -=
        minutes * 60000;

      return interaction.reply(
        `⏱️ ${minutes} minute(s) ajoutée(s) à votre service.`
      );
    }

    // =========================
    // FORCE CLOCKOUT
    // =========================

    if (
      command === "force-clockout"
    ) {

      if (
        !canManageServices(member)
      ) {

        return interaction.reply({
          content:
            "❌ Vous n'avez pas les permissions nécessaires.",
          ephemeral: true
        });
      }

      const target =
        interaction.options.getUser(
          "membre"
        );

      const service =
        services.get(
          target.id
        );

      if (!service) {

        return interaction.reply({
          content:
            "❌ Cette personne n'est pas en service.",
          ephemeral: true
        });
      }

      const minutes =
        Math.floor(
          (
            Date.now() -
            service.startedAt
          ) / 60000
        );

      const agent =
        getAgent(target);

      agent.totalMinutes +=
        minutes;

      services.delete(
        target.id
      );

      saveData();

      return interaction.reply(
        `🔴 ${target} a été retiré du service par ${user}.\n` +
        `⏱️ Temps ajouté : ${formatTime(minutes)}`
      );
    }

    // =========================
    // FORCE CLOCKOUT ALL
    // =========================

    if (
      command === "force-clockoutall"
    ) {

      if (
        !canManageServices(member)
      ) {

        return interaction.reply({
          content:
            "❌ Vous n'avez pas les permissions nécessaires.",
          ephemeral: true
        });
      }

      let count =
        0;

      for (
        const [
          userId,
          service
        ] of services
      ) {

        const minutes =
          Math.floor(
            (
              Date.now() -
              service.startedAt
            ) / 60000
          );

        const agent =
          getAgent({
            id: userId,
            username:
              service.username
          });

        agent.totalMinutes +=
          minutes;

        count++;
      }

      services.clear();

      saveData();

      return interaction.reply(
        `🔴 ${count} service(s) ont été arrêtés par ${user}.`
      );
    }

    // =========================
    // RESET
    // =========================

    if (
      command === "reset"
    ) {

      if (
        !canManageServices(member)
      ) {

        return interaction.reply({
          content:
            "❌ Vous n'avez pas les permissions nécessaires.",
          ephemeral: true
        });
      }

      services.clear();
      dispatchers.clear();

      return interaction.reply(
        `♻️ Les services et le dispatch ont été réinitialisés par ${user}.`
      );
    }
  }
);

// =========================
// BILAN DU DIMANCHE
// =========================

let lastReportKey =
  null;

async function checkSundayReport() {

  const now =
    new Date();

  const day =
    now.getDay();

  const hour =
    now.getHours();

  const minute =
    now.getMinutes();

  if (
    day !== 0 ||
    hour !== 17 ||
    minute !== 0
  ) {
    return;
  }

  const reportKey =
    `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  if (
    lastReportKey ===
    reportKey
  ) {
    return;
  }

  lastReportKey =
    reportKey;

  await sendWeeklyReport();
}

// =========================
// BILAN
// =========================

async function sendWeeklyReport() {

  try {

    const channel =
      await client.channels.fetch(
        REPORT_CHANNEL_ID
      );

    if (!channel) {

      console.error(
        "Canal du bilan introuvable."
      );

      return;
    }

    const agents =
      Object.values(
        userdata.agents
      );

    if (
      agents.length === 0
    ) {

      await channel.send(
        "📊 **Bilan hebdomadaire LSPD**\n\nAucune donnée cette semaine."
      );

      return;
    }

    agents.sort(
      (a, b) =>
        b.totalMinutes -
        a.totalMinutes
    );

    let message =
      "📊 **BILAN HEBDOMADAIRE LSPD**\n\n";

    for (
      const agent of agents
    ) {

      message +=
        `👮 ${agent.username} : **${formatTime(agent.totalMinutes)}**\n`;
    }

    message +=
      "\n♻️ Les données ont été réinitialisées.";

    await channel.send(
      message
    );

    userdata.agents =
      {};

    saveData();

    console.log(
      "Bilan hebdomadaire envoyé."
    );

  } catch (error) {

    console.error(
      "Erreur lors de l'envoi du bilan :",
      error
    );
  }
}

// =========================
// CONNEXION
// =========================

client.login(TOKEN);
