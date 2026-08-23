const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// =========================
// VARIABLES
// =========================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const REPORT_CHANNEL_ID = process.env.REPORT_CHANNEL_ID;

// =========================
// RÔLES PRINCIPAUX
// =========================

const LSPD_ROLE_ID = process.env.LSPD_ROLE_ID;

const CADET_ROLE_ID = process.env.CADET_ROLE_ID;
const OFFICIER_ROLE_ID = process.env.OFFICIER_ROLE_ID;
const CAPORAL_ROLE_ID = process.env.CAPORAL_ROLE_ID;
const SERGENT_ROLE_ID = process.env.SERGENT_ROLE_ID;
const HAUT_GRADE_ROLE_ID = process.env.HAUT_GRADE_ROLE_ID;

// =========================
// RÔLES TICKETS
// =========================

const CITIZEN_ROLE_ID = "1540079350034989071";

const TICKET1_LSPD_ROLE_ID =
  "1540079350043643927";

const TICKET1_PPA_ROLE_ID =
  "1540079350076940294";

const TICKET1_DOA_ROLE_ID =
  "1540079350123339962";

const TICKET1_HAUT_GRADE_ROLE_ID =
  "1540079350165147650";

const SETUP_TICKET_ROLE_ID =
  "1540079350165147650";

// =========================
// TICKET 2
// =========================

const TICKET2_RH_ROLES = [
  "1540079350165147650"
];

const TICKET2_COMMANDANT_ROLES = [
  "1540079350182052004",
  "1540079350182052003",
  "1540079350182052002"
];

const TICKET2_CAPITAINE_ROLES = [
  "1540079350182052003",
  "1540079350182052004",
  "1540079350182052002",
  "1540079350169338006",
  "1540079350169338007"
];

const TICKET2_HAUT_GRADE_ROLES = [
  "1540079350165147650"
];

const TICKET2_MU_ROLES = [
  "1540079350114820234",
  "1540079350114820235",
  "1540079350165147650"
];

const TICKET2_DEMISSION_ROLES = [
  "1540079350165147650"
];

const TICKET2_SERGENT_ROLES = [
  "1540079350169337999",
  "1540079350169338000",
  "1540079350165147650"
];

const TICKET2_SWAT_ROLES = [
  "1540079350123339961",
  "1540079350123339960",
  "1540079350123339958",
  "1540079350123339959",
  "1540079350165147650"
];

const TICKET2_DOA_ROLES = [
  "1540079350123339966",
  "1540079350123339964",
  "1540079350123339965",
  "1540079350123339963",
  "1540079350165147650"
];

// =========================
// HIÉRARCHIE
// =========================

const GRADE_HIERARCHY = [
  {
    name: "Cadet",
    roleId: "1540079350165147651"
  },
  {
    name: "Officier",
    roleId: "1540079350165147652"
  },
  {
    name: "Officier II",
    roleId: "1540079350165147653"
  },
  {
    name: "Officier III",
    roleId: "1540079350165147654"
  },
  {
    name: "Senior Lead Officier",
    roleId: "1540079350165147655"
  },
  {
    name: "Caporal",
    roleId: "1540079350165147656"
  },
  {
    name: "Caporal-chef",
    roleId: "1540079350165147657"
  },
  {
    name: "Sergent",
    roleId: "1540079350169337999"
  },
  {
    name: "Sergent II",
    roleId: "1540079350169338000"
  },
  {
    name: "Lieutenant",
    roleId: "1540079350169338003"
  },
  {
    name: "Lieutenant II",
    roleId: "1540079350169338004"
  },
  {
    name: "Vice-Capitaine",
    roleId: "1540079350169338006"
  },
  {
    name: "Capitaine",
    roleId: "1540079350169338007"
  },
  {
    name: "Sectaire",
    roleId: "1540079350182052002"
  },
  {
    name: "Commandants seconds",
    roleId: "1540079350182052003"
  },
  {
    name: "Commandant",
    roleId: "1540079350182052004"
  }
];

// =========================
// DISPATCH
// =========================

const DISPATCH_CHANNELS = [
  {
    name: "👮‍♂️・Unité 1",
    id: "1540079353818517612"
  },
  {
    name: "👮‍♂️・Unité 2",
    id: "1540079354367840436"
  },
  {
    name: "👮‍♂️・Unité 3",
    id: "1540079354367840437"
  },
  {
    name: "👮‍♂️・Unité 4",
    id: "1540079354367840438"
  },
  {
    name: "👮‍♂️・Unité 5",
    id: "1540079354367840439"
  },
  {
    name: "👮‍♂️・Unité 6",
    id: "1540079354367840441"
  },
  {
    name: "👮‍♂️・Unité 7",
    id: "1540079354367840440"
  },
  {
    name: "👮‍♂️・Unité 8",
    id: "1540079354367840442"
  },
  {
    name: "👮‍♂️・Unité 9",
    id: "1540079354367840443"
  },
  {
    name: "👮‍♂️・Unité 10",
    id: "1540079354367840444"
  },
  {
    name: "👮‍♂️・Brigade Motorisée 1",
    id: "1540079354367840445"
  },
  {
    name: "👮‍♂️・Brigade Motorisée 2",
    id: "1540079354812305488"
  },
  {
    name: "👮‍♂️・Unité Goliath",
    id: "1540079354812305489"
  },
  {
    name: "👮‍♂️・Unité CP 1",
    id: "1540079354812305490"
  },
  {
    name: "👮‍♂️・Unité CP 2",
    id: "1540079354812305491"
  },
  {
    name: "💼・Bureau",
    id: "1540079355290452110"
  },
  {
    name: "💼・Bureau 2",
    id: "1540079355290452111"
  },
  {
    name: "💼・Bureau 3",
    id: "1540079355290452112"
  }
];

// =========================
// PAYE
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
// USERDATA
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

    if (!userdata.agents) {
      userdata.agents = {};
    }
  } catch (error) {
    console.error(
      "Erreur userdata.json :",
      error
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
// SERVICES
// =========================

const services = new Map();
const dispatchers = new Map();

// =========================
// TICKETS
// =========================

const ticketConfigs = {
  ticket1: {
    categoryName: "🎫・Tickets citoyens",
    title: "🎫 Support LSPD",
    description:
      "Sélectionnez le type de demande pour contacter le service concerné."
  },

  ticket2: {
    categoryName: "🎫・Tickets LSPD",
    title: "🎫 Support interne LSPD",
    description:
      "Sélectionnez le service que vous souhaitez contacter."
  }
};

const ticketTypes = {
  ticket1: {
    affaire_interne: {
      label: "Affaire interne",
      description:
        "Contacter les hauts gradés du LSPD",
      emoji: "👑",
      roles: [
        TICKET1_HAUT_GRADE_ROLE_ID
      ]
    },

    ppa: {
      label: "PPA",
      description:
        "Prendre un rendez-vous pour le PPA",
      emoji: "🔫",
      roles: [
        TICKET1_PPA_ROLE_ID
      ]
    },

    doa: {
      label: "D.O.A",
      description:
        "Contacter la D.O.A",
      emoji: "🔒",
      roles: [
        TICKET1_DOA_ROLE_ID
      ]
    },

    affaire_courante: {
      label: "Affaire courante",
      description:
        "Contacter le LSPD pour une affaire courante",
      emoji: "🚔",
      roles: [
        TICKET1_LSPD_ROLE_ID
      ]
    }
  },

  ticket2: {
    ressources_humaines: {
      label: "Ressources humaines / Secrétariat",
      description:
        "Contacter le secrétariat du LSPD",
      emoji: "📝",
      roles: TICKET2_RH_ROLES
    },

    commandant: {
      label: "Commandant",
      description:
        "Contacter les commandants du LSPD",
      emoji: "👑",
      roles: TICKET2_COMMANDANT_ROLES
    },

    capitaine: {
      label: "Capitaine",
      description:
        "Contacter les capitaines du LSPD",
      emoji: "👨🏻‍✈️",
      roles: TICKET2_CAPITAINE_ROLES
    },

    hauts_grades: {
      label: "Hauts gradés",
      description:
        "Contacter les hauts gradés du LSPD",
      emoji: "🚨",
      roles: TICKET2_HAUT_GRADE_ROLES
    },

    mu: {
      label: "M.U",
      description:
        "Contacter les hauts gradés de la M.U",
      emoji: "🏍️",
      roles: TICKET2_MU_ROLES
    },

    demission: {
      label: "Démission",
      description:
        "Contacter les hauts gradés du LSPD pour une démission",
      emoji: "🚪",
      roles: TICKET2_DEMISSION_ROLES
    },

    sergent: {
      label: "Sergent",
      description:
        "Contacter les sergents du LSPD",
      emoji: "👮🏻‍♂️",
      roles: TICKET2_SERGENT_ROLES
    },

    swat: {
      label: "S.W.A.T",
      description:
        "Contacter les hauts gradés du S.W.A.T",
      emoji: "🚛",
      roles: TICKET2_SWAT_ROLES
    },

    doa: {
      label: "D.O.A",
      description:
        "Contacter la D.O.A",
      emoji: "🔒",
      roles: TICKET2_DOA_ROLES
    }
  }
};

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
    .setName("userdata")
    .setDescription(
      "Voir ses statistiques LSPD"
    ),

  new SlashCommandBuilder()
    .setName("dispatch")
    .setDescription(
      "Générer le dispatch des unités"
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
    .setName("paye")
    .setDescription(
      "Calculer la paye des agents"
    ),

  new SlashCommandBuilder()
    .setName("addminutes")
    .setDescription(
      "Ajouter des minutes à un agent"
    )
    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(true)
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
    .setName("delminutes")
    .setDescription(
      "Retirer des minutes à un agent"
    )
    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(true)
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
    ),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription(
      "Configurer un système de tickets"
    )
    .addStringOption(option =>
      option
        .setName("type")
        .setDescription(
          "Système de tickets à installer"
        )
        .setRequired(true)
        .addChoices(
          {
            name: "Ticket 1",
            value: "ticket1"
          },
          {
            name: "Ticket 2",
            value: "ticket2"
          }
        )
    )

].map(command =>
  command.toJSON()
);

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

function hasAnyRole(member, roleIds) {
  return roleIds.some(roleId =>
    hasRole(member, roleId)
  );
}

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

  for (
    let i = GRADE_HIERARCHY.length - 1;
    i >= 0;
    i--
  ) {

    const grade =
      GRADE_HIERARCHY[i];

    if (
      member.roles.cache.has(
        grade.roleId
      )
    ) {

      return {
        name: grade.name,
        roleId: grade.roleId,
        level: i
      };
    }
  }

  return {
    name: "Grade inconnu",
    roleId: null,
    level: -1
  };
}

// =========================
// PATROUILLES
// =========================

function getPatrolLeaders(members) {

  if (
    !members ||
    members.size === 0
  ) {
    return [];
  }

  let highestLevel = -1;

  for (
    const member of members.values()
  ) {

    const grade =
      getGrade(member);

    if (
      grade.level > highestLevel
    ) {
      highestLevel =
        grade.level;
    }
  }

  if (highestLevel < 0) {
    return [];
  }

  return [
    ...members.values()
  ].filter(member => {

    return (
      getGrade(member).level ===
      highestLevel
    );
  });
}

// =========================
// PAYE
// =========================

function getPayRate(member) {

  const grade =
    getGrade(member);

  if (!grade.roleId) {
    return 0;
  }

  return (
    PAY_RATES[grade.roleId] ||
    0
  );
}

// =========================
// PRIME
// =========================

function getBonus(totalMinutes) {

  if (
    totalMinutes >= 45 * 60
  ) {
    return BONUS_45H;
  }

  if (
    totalMinutes >= 15 * 60
  ) {
    return BONUS_15H;
  }

  return 0;
}

// =========================
// AGENT
// =========================

function getAgent(user) {

  if (
    !userdata.agents[user.id]
  ) {

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

  const safeMinutes =
    Math.max(
      0,
      Math.floor(minutes)
    );

  const hours =
    Math.floor(
      safeMinutes / 60
    );

  const mins =
    safeMinutes % 60;

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
// DATE
// =========================

function getDate() {

  return new Date().toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  );
}

function getTime() {

  return new Date().toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

// =========================
// SETUP TICKET
// =========================

async function setupTicket(
  interaction,
  ticketSystem
) {

  const config =
    ticketConfigs[ticketSystem];

  const types =
    ticketTypes[ticketSystem];

  if (!config || !types) {

    return interaction.reply({
      content:
        "❌ Système de tickets invalide.",
      ephemeral: true
    });
  }

  const options =
    Object.entries(types)
      .map(
        ([value, ticket]) => ({
          label: ticket.label,
          description: ticket.description,
          value,
          emoji: ticket.emoji
        })
      );

  const menu =
    new StringSelectMenuBuilder()
      .setCustomId(
        `ticket_menu_${ticketSystem}`
      )
      .setPlaceholder(
        "Sélectionnez votre demande"
      )
      .addOptions(options);

  const row =
    new ActionRowBuilder()
      .addComponents(menu);

  const embed =
    new EmbedBuilder()
      .setTitle(
        config.title
      )
      .setDescription(
        config.description
      )
      .setFooter({
        text:
          "LSPD • Système de tickets"
      });

  await interaction.channel.send({
    embeds: [embed],
    components: [row]
  });

  return interaction.reply({
    content:
      `✅ Le système ${ticketSystem === "ticket1" ? "Ticket 1" : "Ticket 2"} a été installé dans ce salon.`,
    ephemeral: true
  });
}

// =========================
// CREATION TICKET
// =========================

async function createTicket(
  interaction,
  ticketSystem,
  ticketType
) {

  const config =
    ticketConfigs[ticketSystem];

  const type =
    ticketTypes[ticketSystem]?.[ticketType];

  if (!config || !type) {

    return interaction.reply({
      content:
        "❌ Type de ticket invalide.",
      ephemeral: true
    });
  }

  const member =
    interaction.member;

  // =========================
  // ACCÈS TICKET 1
  // =========================

  if (
    ticketSystem === "ticket1" &&
    !hasRole(
      member,
      CITIZEN_ROLE_ID
    )
  ) {

    return interaction.reply({
      content:
        "❌ Vous devez avoir le rôle Citoyen pour utiliser ce système.",
      ephemeral: true
    });
  }

  // =========================
  // ACCÈS TICKET 2
  // =========================

  if (
    ticketSystem === "ticket2" &&
    !hasRole(
      member,
      LSPD_ROLE_ID
    )
  ) {

    return interaction.reply({
      content:
        "❌ Vous devez avoir le rôle LSPD pour utiliser ce système.",
      ephemeral: true
    });
  }

  const guild =
    interaction.guild;

  // =========================
  // CATÉGORIE
  // =========================

  let category =
    guild.channels.cache.find(
      channel =>
        channel.type === ChannelType.GuildCategory &&
        channel.name === config.categoryName
    );

  if (!category) {

    category =
      await guild.channels.create({
        name: config.categoryName,
        type: ChannelType.GuildCategory
      });
  }

  // =========================
  // TICKET DÉJÀ OUVERT
  // =========================

  const existing =
    guild.channels.cache.find(
      channel =>
        channel.type === ChannelType.GuildText &&
        channel.parentId === category.id &&
        channel.topic ===
          `ticket:${interaction.user.id}:${ticketSystem}:${ticketType}`
    );

  if (existing) {

    return interaction.reply({
      content:
        `❌ Vous avez déjà un ticket ouvert pour cette demande : ${existing}`,
      ephemeral: true
    });
  }

  // =========================
  // NOM DU SALON
  // =========================

  const safeName =
    interaction.user.username
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 20);

  const channelName =
    `${type.emoji}-${safeName}`;

  // =========================
  // PERMISSIONS
  // =========================

  const permissionOverwrites = [
    {
      id: guild.roles.everyone.id,
      deny: [
        PermissionFlagsBits.ViewChannel
      ]
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    }
  ];

  for (
    const roleId of type.roles
  ) {

    if (!roleId) {
      continue;
    }

    permissionOverwrites.push({
      id: roleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    });
  }

  // =========================
  // CRÉATION
  // =========================

  const ticketChannel =
    await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: category.id,
      topic:
        `ticket:${interaction.user.id}:${ticketSystem}:${ticketType}`,
      permissionOverwrites
    });

  // =========================
  // BOUTON FERMETURE
  // =========================

  const closeButton =
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("Fermer le ticket")
      .setEmoji("🔒")
      .setStyle(
        ButtonStyle.Danger
      );

  const row =
    new ActionRowBuilder()
      .addComponents(
        closeButton
      );

  // =========================
  // EMBED
  // =========================

  const embed =
    new EmbedBuilder()
      .setTitle(
        `${type.emoji} ${type.label}`
      )
      .setDescription(
        `Bienvenue ${interaction.user}.\n\n` +
        `${type.description}.\n\n` +
        `Un membre autorisé pourra prendre en charge votre demande.`
      )
      .addFields(
        {
          name: "👤 Demandeur",
          value: `${interaction.user}`,
          inline: true
        },
        {
          name: "📂 Service",
          value: type.label,
          inline: true
        }
      )
      .setFooter({
        text:
          "LSPD • Système de tickets"
      });

  const roleMentions =
    type.roles
      .filter(Boolean)
      .map(
        role =>
          `<@&${role}>`
      )
      .join(" ");

  await ticketChannel.send({
    content:
      `${interaction.user}${roleMentions ? ` ${roleMentions}` : ""}`,
    embeds: [embed],
    components: [row]
  });

  return interaction.reply({
    content:
      `✅ Votre ticket a été créé : ${ticketChannel}`,
    ephemeral: true
  });
}

// =========================
// COMMANDES
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
    "✅ Commandes slash installées."
  );
}

// =========================
// READY
// =========================

client.once(
  "ready",
  async () => {

    console.log(
      `✅ Bot connecté : ${client.user.tag}`
    );

    try {

      await deployCommands();

    } catch (error) {

      console.error(
        "❌ Erreur commandes :",
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

    try {

      // =========================
      // MENUS TICKETS
      // =========================

      if (
        interaction.isStringSelectMenu()
      ) {

        if (
          interaction.customId.startsWith(
            "ticket_menu_"
          )
        ) {

          const ticketSystem =
            interaction.customId.replace(
              "ticket_menu_",
              ""
            );

          const ticketType =
            interaction.values[0];

          return createTicket(
            interaction,
            ticketSystem,
            ticketType
          );
        }

        return;
      }

      // =========================
      // BOUTONS
      // =========================

      if (
        interaction.isButton()
      ) {

        if (
          interaction.customId ===
          "ticket_close"
        ) {

          const channel =
            interaction.channel;

          if (!channel) {
            return;
          }

          const member =
            interaction.member;

          const topic =
            channel.topic || "";

          const parts =
            topic.split(":");

          if (
            parts.length < 4 ||
            parts[0] !== "ticket"
          ) {

            return interaction.reply({
              content:
                "❌ Impossible de récupérer les informations du ticket.",
              ephemeral: true
            });
          }

          const creatorId =
            parts[1];

          const system =
            parts[2];

          const ticketTypeKey =
            parts[3];

          const ticketType =
            ticketTypes[system]?.[
              ticketTypeKey
            ];

          const allowedRoles =
            ticketType?.roles || [];

          const canClose =
            creatorId ===
              interaction.user.id ||
            hasAnyRole(
              member,
              allowedRoles
            ) ||
            canManageServices(member);

          if (!canClose) {

            return interaction.reply({
              content:
                "❌ Vous n'avez pas la permission de fermer ce ticket.",
              ephemeral: true
            });
          }

          await interaction.reply(
            "🔒 Ticket fermé. Suppression dans 2 secondes..."
          );

          setTimeout(
            async () => {

              try {
                await channel.delete();
              } catch (error) {
                console.error(
                  "Erreur suppression ticket :",
                  error
                );
              }

            },
            2000
          );

          return;
        }

        return;
      }

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
      // SETUP
      // =========================

      if (
        command === "setup"
      ) {

        if (
          !hasRole(
            member,
            SETUP_TICKET_ROLE_ID
          )
        ) {

          return interaction.reply({
            content:
              "❌ Cette commande est réservée aux Hauts Gradés.",
            ephemeral: true
          });
        }

        const ticketSystem =
          interaction.options.getString(
            "type"
          );

        return setupTicket(
          interaction,
          ticketSystem
        );
      }

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
          `## 🟢 Clockin réussi !\n` +
          `Vous êtes maintenant en service LSPD\n\n` +
          `**👤 Agent**\n` +
          `${user}\n\n` +
          `**⏰ Heure**\n` +
          `${getTime()}\n` +
          `-# LSPD - Los Santos Police Department • ${getDate()}`
        );
      }

      // =========================
      // CLOCKOUT
      // =========================

      if (
        command === "clockout"
      ) {

        const service =
          services.get(user.id);

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
          `## 🔴 Clockout réussi !\n` +
          `Vous avez terminé votre service LSPD\n\n` +
          `**👤 Agent**\n` +
          `${user}\n\n` +
          `**⏱️ Temps travaillé**\n` +
          `${formatTime(minutes)}\n\n` +
          `**📈 UserData**\n` +
          `${formatTime(agent.totalMinutes)}\n` +
          `-# LSPD - Los Santos Police Department • ${getDate()}`
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
          services.get(user.id);

        if (service) {

          totalMinutes +=
            Math.floor(
              (
                Date.now() -
                service.startedAt
              ) / 60000
            );
        }

        return interaction.reply(
          `## 🟢 Statistiques de l'utilisateur\n` +
          `Voici vos statistiques de travail LSPD\n\n` +
          `**👤 Agent**\n` +
          `${user}\n\n` +
          `**🏢 Service**\n` +
          `LSPD\n\n` +
          `**⏰ Temps total**\n` +
          `${formatTime(totalMinutes)}\n` +
          `-# LSPD - Los Santos Police Department • ${getDate()}`
        );
      }

      // =========================
      // DISPATCH
      // =========================

      if (
        command === "dispatch"
      ) {

        if (
          !hasRole(
            member,
            LSPD_ROLE_ID
          )
        ) {

          return interaction.reply({
            content:
              "❌ Vous devez avoir le rôle LSPD pour utiliser le dispatch.",
            ephemeral: true
          });
        }

        const now =
          new Date();

        const date =
          now.toLocaleDateString(
            "fr-FR"
          );

        const time =
          now.toLocaleTimeString(
            "fr-FR"
          );

        let message =
          `**Dispatch du ${date} ${time}**\n\n`;

        let foundUnit =
          false;

        for (
          const channelInfo of DISPATCH_CHANNELS
        ) {

          const channel =
            interaction.guild.channels.cache.get(
              channelInfo.id
            );

          if (!channel) {
            continue;
          }

          if (!channel.isVoiceBased()) {
            continue;
          }

          const membersInChannel =
            channel.members;

          if (
            membersInChannel.size === 0
          ) {
            continue;
          }

          foundUnit = true;

          const leaders =
            getPatrolLeaders(
              membersInChannel
            );

          message +=
            `- ${channelInfo.name}\n`;

          for (
            const agent of membersInChannel.values()
          ) {

            message +=
              `> ${agent}\n`;
          }

          if (
            leaders.length > 0
          ) {

            const leaderMentions =
              leaders
                .map(
                  leader =>
                    `${leader}`
                )
                .join(", ");

            message +=
              `Secteur 1 & 2 (Chef de patrouille) : ${leaderMentions}\n`;
          }

          message +=
            "\n";
        }

        if (!foundUnit) {

          return interaction.reply({
            content:
              "📡 Aucun agent n'est actuellement présent dans les unités.",
            ephemeral: true
          });
        }

        message +=
          "**Bonne patrouille à tous et faites attention aux prises d'otages !** :lspd:";

        if (
          message.length <= 2000
        ) {

          return interaction.reply({
            content:
              message
          });
        }

        const lines =
          message.split("\n");

        const chunks = [];
        let current = "";

        for (
          const line of lines
        ) {

          if (
            current.length +
            line.length +
            1 >
            1900
          ) {

            if (current) {
              chunks.push(current);
            }

            current = "";
          }

          current +=
            line +
            "\n";
        }

        if (current) {
          chunks.push(current);
        }

        await interaction.reply({
          content:
            chunks[0]
        });

        for (
          let i = 1;
          i < chunks.length;
          i++
        ) {

          await interaction.followUp({
            content:
              chunks[i]
          });
        }

        return;
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
            services.get(userId);

          if (service) {

            totalMinutes +=
              Math.floor(
                (
                  Date.now() -
                  service.startedAt
                ) / 60000
              );
          }

          let targetMember;

          try {

            targetMember =
              await interaction.guild.members.fetch(
                userId
              );

          } catch {

            targetMember = null;
          }

          let grade =
            "Grade inconnu";

          let rate = 0;

          if (targetMember) {

            grade =
              getGrade(
                targetMember
              ).name;

            rate =
              getPayRate(
                targetMember
              );
          }

          const salary =
            (
              totalMinutes / 60
            ) * rate;

          const bonus =
            getBonus(
              totalMinutes
            );

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
      // ADD MINUTES
      // =========================

      if (
        command === "addminutes"
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

        const target =
          interaction.options.getUser(
            "membre"
          );

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

        const agent =
          getAgent(target);

        agent.totalMinutes +=
          minutes;

        saveData();

        return interaction.reply({
          content:
            `⏱️ **${minutes} minutes** ajoutées à ${target}.\n` +
            `📊 Nouveau total : **${formatTime(agent.totalMinutes)}**`,
          ephemeral: true
        });
      }

      // =========================
      // DELETE MINUTES
      // =========================

      if (
        command === "delminutes"
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

        const target =
          interaction.options.getUser(
            "membre"
          );

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

        const agent =
          getAgent(target);

        agent.totalMinutes =
          Math.max(
            0,
            agent.totalMinutes -
            minutes
          );

        saveData();

        return interaction.reply({
          content:
            `⏱️ **${minutes} minutes** retirées à ${target}.\n` +
            `📊 Nouveau total : **${formatTime(agent.totalMinutes)}**`,
          ephemeral: true
        });
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

        let count = 0;

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

    } catch (error) {

      console.error(
        "❌ Erreur interaction :",
        error
      );

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        return interaction.followUp({
          content:
            "❌ Une erreur est survenue.",
          ephemeral: true
        });

      } else {

        return interaction.reply({
          content:
            "❌ Une erreur est survenue.",
          ephemeral: true
        });
      }
    }
  }
);

// =========================
// BILAN DIMANCHE 17H
// =========================

let lastReportKey = null;

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
    lastReportKey === reportKey
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
        "❌ Canal du bilan introuvable."
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

    userdata.agents = {};

    saveData();

    console.log(
      "✅ Bilan hebdomadaire envoyé."
    );

  } catch (error) {

    console.error(
      "❌ Erreur bilan :",
      error
    );
  }
}

// =========================
// CONNEXION
// =========================

client.login(TOKEN);
