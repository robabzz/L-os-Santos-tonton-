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
const EMS_ROLE_ID = "1540698540567691456";

const CADET_ROLE_ID = process.env.CADET_ROLE_ID;
const OFFICIER_ROLE_ID = process.env.OFFICIER_ROLE_ID;
const CAPORAL_ROLE_ID = process.env.CAPORAL_ROLE_ID;
const SERGENT_ROLE_ID = process.env.SERGENT_ROLE_ID;
const HAUT_GRADE_ROLE_ID = process.env.HAUT_GRADE_ROLE_ID;

// =========================
// RÔLES HAUTS GRADÉS
// =========================

const EXTRA_HAUT_GRADE_ROLES = [
  "1540571631695433790",
  "1540572645672747129"
];

// =========================
// RÔLES TICKETS
// =========================

const CITIZEN_ROLE_ID = "1540079350034989071";

const TICKET1_LSPD_ROLE_ID = "1540079350043643927";
const TICKET1_PPA_ROLE_ID = "1540079350076940294";
const TICKET1_DOA_ROLE_ID = "1540079350123339962";
const TICKET1_HAUT_GRADE_ROLE_ID = "1540079350165147650";

const SETUP_TICKET_ROLE_ID = "1540079350165147650";

const SETUP_TICKET_ROLES = [
  SETUP_TICKET_ROLE_ID,
  "1540571631695433790",
  "1540572645672747129"
];

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
  { name: "👮‍♂️・Unité 1", id: "1540079353818517612" },
  { name: "👮‍♂️・Unité 2", id: "1540079354367840436" },
  { name: "👮‍♂️・Unité 3", id: "1540079354367840437" },
  { name: "👮‍♂️・Unité 4", id: "1540079354367840438" },
  { name: "👮‍♂️・Unité 5", id: "1540079354367840439" },
  { name: "👮‍♂️・Unité 6", id: "1540079354367840441" },
  { name: "👮‍♂️・Unité 7", id: "1540079354367840440" },
  { name: "👮‍♂️・Unité 8", id: "1540079354367840442" },
  { name: "👮‍♂️・Unité 9", id: "1540079354367840443" },
  { name: "👮‍♂️・Unité 10", id: "1540079354367840444" },
  { name: "👮‍♂️・Brigade Motorisée 1", id: "1540079354367840445" },
  { name: "👮‍♂️・Brigade Motorisée 2", id: "1540079354812305488" },
  { name: "👮‍♂️・Unité Goliath", id: "1540079354812305489" },
  { name: "👮‍♂️・Unité CP 1", id: "1540079354812305490" },
  { name: "👮‍♂️・Unité CP 2", id: "1540079354812305491" },
  { name: "💼・Bureau", id: "1540079355290452110" },
  { name: "💼・Bureau 2", id: "1540079355290452111" },
  { name: "💼・Bureau 3", id: "1540079355290452112" }
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

const DATA_FILE = path.join(
  __dirname,
  "userdata.json"
);

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
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        userdata,
        null,
        2
      )
    );
  } catch (error) {
    console.error(
      "Erreur sauvegarde userdata :",
      error
    );
  }
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
// FONCTIONS UTILITAIRES
// =========================
function getAgent(user) {
  if (!userdata.agents[user.id]) {
    userdata.agents[user.id] = {
      username: user.username,
      totalMinutes: 0
    };

    saveData();
  }

  userdata.agents[user.id].username =
    user.username;

  return userdata.agents[user.id];
}

function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}h ${mins}min`;
}

function getCurrentServiceMinutes(userId) {
  const service = services.get(userId);

  if (!service) {
    return 0;
  }

  return Math.floor(
    (Date.now() - service.startedAt) / 60000
  );
}

function getTotalMinutes(userId) {
  const agent =
    userdata.agents[userId];

  if (!agent) {
    return getCurrentServiceMinutes(userId);
  }

  return (
    agent.totalMinutes +
    getCurrentServiceMinutes(userId)
  );
}

function getGrade(member) {
  if (!member || !member.roles) {
    return null;
  }

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
      return grade;
    }
  }

  return null;
}

function hasLSPDRole(member) {
  if (!member) {
    return false;
  }

  return (
    member.roles.cache.has(
      LSPD_ROLE_ID
    ) ||
    GRADE_HIERARCHY.some(
      grade =>
        member.roles.cache.has(
          grade.roleId
        )
    )
  );
}

function isHautGrade(member) {
  if (!member) {
    return false;
  }

  return (
    member.roles.cache.has(
      HAUT_GRADE_ROLE_ID
    ) ||
    member.roles.cache.has(
      "1540571631695433790"
    ) ||
    member.roles.cache.has(
      "1540572645672747129"
    ) ||
    member.roles.cache.has(
      "1540079350182052002"
    ) ||
    member.roles.cache.has(
      "1540079350182052003"
    ) ||
    member.roles.cache.has(
      "1540079350182052004"
    )
  );
}

function getHourlyRate(member) {
  if (!member) {
    return 0;
  }

  const grade =
    getGrade(member);

  if (!grade) {
    return 0;
  }

  const roleId =
    grade.roleId;

  if (
    PAY_RATES[roleId]
  ) {
    return PAY_RATES[roleId];
  }

  if (
    [
      "1540079350165147652",
      "1540079350165147653",
      "1540079350165147654",
      "1540079350165147655"
    ].includes(roleId)
  ) {
    return 5500;
  }

  if (
    [
      "1540079350165147656",
      "1540079350165147657"
    ].includes(roleId)
  ) {
    return 7500;
  }

  if (
    [
      "1540079350169337999",
      "1540079350169338000"
    ].includes(roleId)
  ) {
    return 15000;
  }

  if (
    [
      "1540079350169338003",
      "1540079350169338004",
      "1540079350169338006",
      "1540079350169338007",
      "1540079350182052002",
      "1540079350182052003",
      "1540079350182052004"
    ].includes(roleId)
  ) {
    return 35000;
  }

  return 0;
}

function calculateBonus(totalMinutes) {
  const hours =
    totalMinutes / 60;

  let bonus = 0;

  if (hours >= 45) {
    bonus = BONUS_45H;
  } else if (hours >= 15) {
    bonus = BONUS_15H;
  }

  return bonus;
}

function calculatePay(member) {
  if (!member) {
    return {
      minutes: 0,
      hours: 0,
      hourlyRate: 0,
      salary: 0,
      bonus: 0,
      total: 0
    };
  }

  const minutes =
    getTotalMinutes(
      member.id
    );

  const hours =
    minutes / 60;

  const hourlyRate =
    getHourlyRate(member);

  const salary =
    Math.floor(hours) *
    hourlyRate;

  const bonus =
    calculateBonus(minutes);

  return {
    minutes,
    hours,
    hourlyRate,
    salary,
    bonus,
    total:
      salary + bonus
  };
}

// =========================
// PERMISSIONS
// =========================

function canManageClock(member) {
  if (!member) {
    return false;
  }

  return isHautGrade(member);
}

function canUseSetup(member) {
  if (!member) {
    return false;
  }

  return member.roles.cache.has(
    SETUP_TICKET_ROLE_ID
  );
}

// =========================
// SLASH COMMANDS
// =========================

const commands = [

  new SlashCommandBuilder()
    .setName("clockin")
    .setDescription(
      "Commencer son service"
    ),

  new SlashCommandBuilder()
    .setName("clockout")
    .setDescription(
      "Terminer son service"
    ),

  new SlashCommandBuilder()
    .setName("dispatch")
    .setDescription(
      "Afficher le dispatch actuel"
    ),

  new SlashCommandBuilder()
    .setName("dispatchout")
    .setDescription(
      "Quitter le dispatch"
    ),

  new SlashCommandBuilder()
    .setName("dispatchlist")
    .setDescription(
      "Afficher la liste des unités du dispatch"
    ),

  new SlashCommandBuilder()
    .setName("services")
    .setDescription(
      "Afficher les agents actuellement en service"
    ),

  new SlashCommandBuilder()
    .setName("userdata")
    .setDescription(
      "Afficher les statistiques d'un agent"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent à consulter"
        )
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("paye")
    .setDescription(
      "Calculer la paye d'un agent"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("addminutes")
    .setDescription(
      "Ajouter des minutes à un agent"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription(
          "Nombre de minutes à ajouter"
        )
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("delminutes")
    .setDescription(
      "Retirer des minutes à un agent"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription(
          "Nombre de minutes à retirer"
        )
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("force-clockout")
    .setDescription(
      "Forcer la fin de service d'un agent"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("force-clockoutall")
    .setDescription(
      "Forcer la fin de service de tous les agents"
    ),

  new SlashCommandBuilder()
    .setName("reset")
    .setDescription(
      "Réinitialiser les statistiques"
    )
    .addUserOption(option =>
      option
        .setName("agent")
        .setDescription(
          "Agent concerné"
        )
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription(
      "Installer un système de tickets"
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
// ENREGISTREMENT COMMANDES
// =========================

async function registerCommands() {
  try {
    const rest =
      new REST({
        version: "10"
      }).setToken(
        TOKEN
      );

    console.log(
      "🔄 Enregistrement des commandes..."
    );

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
      "✅ Commandes enregistrées."
    );
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'enregistrement des commandes :",
      error
    );
  }
}

// =========================
// CRÉATION DU MENU TICKET
// =========================

function createTicketMenu(type) {
  const config =
    ticketConfigs[type];

  const types =
    ticketTypes[type];

  if (!config || !types) {
    return null;
  }

  const options =
    Object.entries(types)
      .map(
        ([value, ticket]) => ({
          label: ticket.label,
          description:
            ticket.description,
          value,
          emoji: ticket.emoji
        })
      );

  const menu =
    new StringSelectMenuBuilder()
      .setCustomId(
        `ticket_select_${type}`
      )
      .setPlaceholder(
        "Sélectionnez votre demande"
      )
      .addOptions(
        options
      );

  return new ActionRowBuilder()
    .addComponents(
      menu
    );
}

// =========================
// CRÉATION DES BOUTONS TICKET
// =========================

function createTicketButtons() {
  const closeButton =
    new ButtonBuilder()
      .setCustomId(
        "ticket_close"
      )
      .setLabel(
        "Fermer le ticket"
      )
      .setEmoji("🔒")
      .setStyle(
        ButtonStyle.Danger
      );

  return new ActionRowBuilder()
    .addComponents(
      closeButton
    );
}

// =========================
// NOM DU TICKET
// =========================

function sanitizeChannelName(name) {
  return name
    .toLowerCase()
    .replace(
      /[^a-z0-9-]/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .substring(
      0,
      90
    );
}

// =========================
// CRÉATION D'UN TICKET
// =========================

async function createTicket(
  interaction,
  type,
  ticketType
) {
  try {
    const guild =
      interaction.guild;

    if (!guild) {
      return;
    }

    const config =
      ticketTypes[type]?.[
        ticketType
      ];

    if (!config) {
      return interaction.reply({
        content:
          "❌ Type de ticket invalide.",
        ephemeral: true
      });
    }

    const existing =
      guild.channels.cache.find(
        channel =>
          channel.type ===
            ChannelType.GuildText &&
          channel.topic ===
            `ticket:${interaction.user.id}`
      );

    if (existing) {
      return interaction.reply({
        content:
          `❌ Vous avez déjà un ticket ouvert : ${existing}`,
        ephemeral: true
      });
    }

    const permissionOverwrites = [
      {
        id:
          guild.roles.everyone.id,
        deny: [
          PermissionFlagsBits.ViewChannel
        ]
      },
      {
        id:
          interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      }
    ];

    for (
      const roleId of config.roles
    ) {
      permissionOverwrites.push({
        id: roleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      });
    }

    const channel =
      await guild.channels.create({
        name:
          sanitizeChannelName(
            `ticket-${interaction.user.username}`
          ),
        type:
          ChannelType.GuildText,
        parent:
          interaction.channel?.parentId ||
          null,
        topic:
          `ticket:${interaction.user.id}`,
        permissionOverwrites
      });

    const embed =
      new EmbedBuilder()
        .setTitle(
          `${config.emoji} ${config.label}`
        )
        .setDescription(
          `Bonjour ${interaction.user},\n\nVotre ticket a été créé.\n\nUn membre du service concerné viendra vous répondre.`
        )
        .setColor(
          0x2b2d31
        )
        .setTimestamp();

    await channel.send({
      content:
        config.roles
          .map(
            roleId =>
              `<@&${roleId}>`
          )
          .join(" "),
      embeds: [
        embed
      ],
      components: [
        createTicketButtons()
      ]
    });

    await interaction.reply({
      content:
        `✅ Votre ticket a été créé : ${channel}`,
      ephemeral: true
    });

  } catch (error) {
    console.error(
      "Erreur création ticket :",
      error
    );

    if (
      interaction.replied ||
      interaction.deferred
    ) {
      await interaction.followUp({
        content:
          "❌ Une erreur est survenue lors de la création du ticket.",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content:
          "❌ Une erreur est survenue lors de la création du ticket.",
        ephemeral: true
      });
    }
  }
} // =========================
// CRÉATION DU MENU DE SETUP
// =========================

function createSetupEmbed(type) {
  const config =
    ticketConfigs[type];

  if (!config) {
    return null;
  }

  return new EmbedBuilder()
    .setTitle(config.title)
    .setDescription(
      config.description
    )
    .setColor(0x2b2d31)
    .setTimestamp();
}

// =========================
// SETUP TICKET
// =========================

async function setupTicket(
  interaction,
  type
) {
  if (!canUseSetup(interaction.member)) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  const config =
    ticketConfigs[type];

  if (!config) {
    return interaction.reply({
      content:
        "❌ Type de ticket invalide.",
      ephemeral: true
    });
  }

  try {
    const embed =
      createSetupEmbed(type);

    const menu =
      createTicketMenu(type);

    await interaction.channel.send({
      embeds: [
        embed
      ],
      components: [
        menu
      ]
    });

    await interaction.reply({
      content:
        `✅ Le système ${type} a été installé dans ce salon.`,
      ephemeral: true
    });

  } catch (error) {
    console.error(
      "Erreur setup ticket :",
      error
    );

    if (
      interaction.replied ||
      interaction.deferred
    ) {
      await interaction.followUp({
        content:
          "❌ Impossible d'installer le système de tickets.",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content:
          "❌ Impossible d'installer le système de tickets.",
        ephemeral: true
      });
    }
  }
}

// =========================
// FERMETURE TICKET
// =========================

async function closeTicket(
  interaction
) {
  const channel =
    interaction.channel;

  if (!channel) {
    return;
  }

  if (
    !channel.topic ||
    !channel.topic.startsWith(
      "ticket:"
    )
  ) {
    return interaction.reply({
      content:
        "❌ Ce salon n'est pas un ticket.",
      ephemeral: true
    });
  }

  const ownerId =
    channel.topic
      .replace(
        "ticket:",
        ""
      )
      .trim();

  const canClose =
    interaction.user.id ===
      ownerId ||
    isHautGrade(
      interaction.member
    ) ||
    interaction.member.permissions.has(
      PermissionFlagsBits.ManageChannels
    );

  if (!canClose) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission de fermer ce ticket.",
      ephemeral: true
    });
  }

  await interaction.reply({
    content:
      "🔒 Fermeture du ticket dans 5 secondes..."
  });

  setTimeout(
    async () => {
      try {
        await channel.delete(
          "Ticket fermé"
        );
      } catch (error) {
        console.error(
          "Erreur suppression ticket :",
          error
        );
      }
    },
    5000
  );
}

// =========================
// DISPATCH
// =========================

function getDispatchUnits(guild) {
  const units = [];

  for (
    const dispatchChannel of DISPATCH_CHANNELS
  ) {
    const channel =
      guild.channels.cache.get(
        dispatchChannel.id
      );

    if (
      !channel ||
      channel.type !==
        ChannelType.GuildVoice
    ) {
      continue;
    }

    const members =
      channel.members.filter(
        member =>
          hasLSPDRole(member)
      );

    if (
      members.size === 0
    ) {
      continue;
    }

    units.push({
      channel,
      members
    });
  }

  return units;
}

function getPatrolLeader(
  members
) {
  let leader = null;
  let highestIndex = -1;

  for (
    const member of members.values()
  ) {
    const grade =
      getGrade(member);

    if (!grade) {
      continue;
    }

    const index =
      GRADE_HIERARCHY.findIndex(
        item =>
          item.roleId ===
          grade.roleId
      );

    if (
      index > highestIndex
    ) {
      highestIndex = index;
      leader = member;
    }
  }

  return leader;
}

function buildDispatchText(
  guild
) {
  const units =
    getDispatchUnits(guild);

  if (
    units.length === 0
  ) {
    return "🚔 Aucun agent n'est actuellement présent dans les salons du dispatch.";
  }

  const now =
    new Date();

  const date =
    now.toLocaleDateString(
      "fr-FR",
      {
        timeZone:
          "Europe/Paris"
      }
    );

  const time =
    now.toLocaleTimeString(
      "fr-FR",
      {
        timeZone:
          "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  let text =
    `🚔 **DISPATCH LSPD**\n\n` +
    `📅 Date : ${date}\n` +
    `🕐 Heure : ${time}\n\n`;

  for (
    const unit of units
  ) {
    const leader =
      getPatrolLeader(
        unit.members
      );

    text +=
      `**${unit.channel.name}**\n`;

    for (
      const member of unit.members.values()
    ) {
      const grade =
        getGrade(member);

      let line =
        `👮 ${member}`;

      if (grade) {
        line +=
          ` • ${grade.name}`;
      }

      if (
        leader &&
        leader.id ===
          member.id
      ) {
        line +=
          ` • **Chef de patrouille**`;
      }

      text +=
        `${line}\n`;
    }

    text += "\n";
  }

  return text;
}

// =========================
// SERVICES
// =========================

function getServiceAgents() {
  const agents = [];

  for (
    const [
      userId,
      service
    ] of services.entries()
  ) {
    agents.push({
      userId,
      service
    });
  }

  return agents;
}

function buildServicesText(
  guild
) {
  const agents =
    getServiceAgents();

  if (
    agents.length === 0
  ) {
    return "🚔 Aucun agent n'est actuellement en service.";
  }

  let text =
    "🚔 **AGENTS EN SERVICE**\n\n";

  for (
    const agent of agents
  ) {
    const member =
      guild.members.cache.get(
        agent.userId
      );

    if (!member) {
      continue;
    }

    const grade =
      getGrade(member);

    const minutes =
      Math.floor(
        (Date.now() -
          agent.service.startedAt) /
          60000
      );

    text +=
      `👮 ${member} `;

    if (grade) {
      text +=
        `• ${grade.name} `;
    }

    text +=
      `• ${formatMinutes(minutes)}\n`;
  }

  return text;
}

// =========================
// CLOCKIN
// =========================

async function handleClockin(
  interaction
) {
  const member =
    interaction.member;

  if (
    !hasLSPDRole(member)
  ) {
    return interaction.reply({
      content:
        "❌ Vous devez avoir un grade LSPD pour pointer.",
      ephemeral: true
    });
  }

  if (
    services.has(
      interaction.user.id
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous êtes déjà en service.",
      ephemeral: true
    });
  }

  const agent =
    getAgent(
      interaction.user
    );

  services.set(
    interaction.user.id,
    {
      startedAt:
        Date.now(),
      username:
        interaction.user.username
    }
  );

  saveData();

  const grade =
    getGrade(member);

  await interaction.reply({
    content:
      `🟢 **Prise de service réussie**\n\n` +
      `👮 Agent : ${interaction.user}\n` +
      `🎖️ Grade : ${grade ? grade.name : "Inconnu"}\n` +
      `🕐 Début : <t:${Math.floor(Date.now() / 1000)}:F>`
  });
}

// =========================
// CLOCKOUT
// =========================

async function handleClockout(
  interaction
) {
  const service =
    services.get(
      interaction.user.id
    );

  if (!service) {
    return interaction.reply({
      content:
        "❌ Vous n'êtes pas actuellement en service.",
      ephemeral: true
    });
  }

  const elapsed =
    Math.floor(
      (Date.now() -
        service.startedAt) /
        60000
    );

  const agent =
    getAgent(
      interaction.user
    );

  agent.totalMinutes +=
    elapsed;

  agent.username =
    interaction.user.username;

  services.delete(
    interaction.user.id
  );

  saveData();

  await interaction.reply({
    content:
      `🔴 **Fin de service**\n\n` +
      `👮 Agent : ${interaction.user}\n` +
      `⏱️ Durée : ${formatMinutes(elapsed)}\n` +
      `📊 Total cumulé : ${formatMinutes(agent.totalMinutes)}`
  });
}

// =========================
// USERDATA
// =========================

async function handleUserdata(
  interaction
) {
  const target =
    interaction.options.getUser(
      "agent"
    ) ||
    interaction.user;

  const agent =
    getAgent(target);

  const totalMinutes =
    getTotalMinutes(
      target.id
    );

  const currentMinutes =
    getCurrentServiceMinutes(
      target.id
    );

  const grade =
    interaction.guild.members.cache.get(
      target.id
    );

  const gradeData =
    getGrade(grade);

  const embed =
    new EmbedBuilder()
      .setTitle(
        `📊 Statistiques de ${target.username}`
      )
      .setDescription(
        `👮 Agent : ${target}\n` +
        `🎖️ Grade : ${gradeData ? gradeData.name : "Inconnu"}\n\n` +
        `⏱️ Temps total : **${formatMinutes(totalMinutes)}**\n` +
        `🟢 Service actuel : **${formatMinutes(currentMinutes)}**`
      )
      .setColor(
        0x2b2d31
      )
      .setTimestamp();

  await interaction.reply({
    embeds: [
      embed
    ]
  });
}

// =========================
// PAYE
// =========================

async function handlePaye(
  interaction
) {
  if (
    !isHautGrade(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Cette commande est réservée aux hauts gradés.",
      ephemeral: true
    });
  }

  const target =
    interaction.options.getUser(
      "agent"
    ) ||
    interaction.user;

  const member =
    await interaction.guild.members.fetch(
      target.id
    );

  const data =
    calculatePay(
      member
    );

  const embed =
    new EmbedBuilder()
      .setTitle(
        `💰 Paye de ${target.username}`
      )
      .setDescription(
        `👮 Agent : ${target}\n` +
        `🎖️ Grade : ${getGrade(member)?.name || "Inconnu"}\n\n` +
        `⏱️ Temps travaillé : **${formatMinutes(data.minutes)}**\n` +
        `💵 Taux horaire : **${data.hourlyRate.toLocaleString("fr-FR")} $/h**\n` +
        `💰 Salaire : **${data.salary.toLocaleString("fr-FR")} $**\n` +
        `🎁 Prime : **${data.bonus.toLocaleString("fr-FR")} $**\n\n` +
        `💳 **Total : ${data.total.toLocaleString("fr-FR")} $**`
      )
      .setColor(
        0x2b2d31
      )
      .setTimestamp();

  await interaction.reply({
    embeds: [
      embed
    ]
  });
}

// =========================
// ADD MINUTES
// =========================

async function handleAddMinutes(
  interaction
) {
  if (
    !canManageClock(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  const target =
    interaction.options.getUser(
      "agent"
    );

  const minutes =
    interaction.options.getInteger(
      "minutes"
    );

  const agent =
    getAgent(target);

  agent.totalMinutes +=
    minutes;

  agent.username =
    target.username;

  saveData();

  await interaction.reply({
    content:
      `✅ **${minutes} minutes** ont été ajoutées à ${target}.\n` +
      `📊 Nouveau total : **${formatMinutes(agent.totalMinutes)}**`
  });
}

// =========================
// DELETE MINUTES
// =========================

async function handleDelMinutes(
  interaction
) {
  if (
    !canManageClock(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  const target =
    interaction.options.getUser(
      "agent"
    );

  const minutes =
    interaction.options.getInteger(
      "minutes"
    );

  const agent =
    getAgent(target);

  agent.totalMinutes =
    Math.max(
      0,
      agent.totalMinutes -
        minutes
    );

  saveData();

  await interaction.reply({
    content:
      `✅ **${minutes} minutes** ont été retirées à ${target}.\n` +
      `📊 Nouveau total : **${formatMinutes(agent.totalMinutes)}**`
  });
}// =========================
// FORCE CLOCKOUT
// =========================

async function handleForceClockout(
  interaction
) {
  if (
    !canManageClock(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  const target =
    interaction.options.getUser(
      "agent"
    );

  const service =
    services.get(
      target.id
    );

  if (!service) {
    return interaction.reply({
      content:
        `❌ ${target} n'est pas actuellement en service.`,
      ephemeral: true
    });
  }

  const elapsed =
    Math.floor(
      (Date.now() -
        service.startedAt) /
        60000
    );

  const agent =
    getAgent(target);

  agent.totalMinutes +=
    elapsed;

  agent.username =
    target.username;

  services.delete(
    target.id
  );

  saveData();

  await interaction.reply({
    content:
      `🔴 **Fin de service forcée**\n\n` +
      `👮 Agent : ${target}\n` +
      `⏱️ Durée du service : **${formatMinutes(elapsed)}**\n` +
      `📊 Total cumulé : **${formatMinutes(agent.totalMinutes)}**`
  });
}

// =========================
// FORCE CLOCKOUT ALL
// =========================

async function handleForceClockoutAll(
  interaction
) {
  if (
    !canManageClock(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  if (
    services.size === 0
  ) {
    return interaction.reply({
      content:
        "❌ Aucun agent n'est actuellement en service.",
      ephemeral: true
    });
  }

  let count = 0;

  for (
    const [
      userId,
      service
    ] of services.entries()
  ) {
    const elapsed =
      Math.floor(
        (Date.now() -
          service.startedAt) /
          60000
      );

    const user =
      await client.users
        .fetch(userId)
        .catch(() => null);

    if (!user) {
      services.delete(
        userId
      );
      continue;
    }

    const agent =
      getAgent(user);

    agent.totalMinutes +=
      elapsed;

    agent.username =
      user.username;

    services.delete(
      userId
    );

    count++;
  }

  saveData();

  await interaction.reply({
    content:
      `🔴 **Fin de service générale**\n\n` +
      `👮 Agents concernés : **${count}**`
  });
}

// =========================
// RESET
// =========================

async function handleReset(
  interaction
) {
  if (
    !canManageClock(
      interaction.member
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
  }

  const target =
    interaction.options.getUser(
      "agent"
    );

  if (target) {
    userdata.agents[
      target.id
    ] = {
      username:
        target.username,
      totalMinutes: 0
    };

    saveData();

    return interaction.reply({
      content:
        `✅ Les statistiques de ${target} ont été réinitialisées.`
    });
  }

  userdata = {
    agents: {}
  };

  saveData();

  await interaction.reply({
    content:
      "✅ Toutes les statistiques ont été réinitialisées."
  });
}

// =========================
// DISPATCH
// =========================

async function handleDispatch(
  interaction
) {
  try {
    const text =
      buildDispatchText(
        interaction.guild
      );

    await interaction.reply({
      content: text
    });
  } catch (error) {
    console.error(
      "Erreur dispatch :",
      error
    );

    if (
      !interaction.replied &&
      !interaction.deferred
    ) {
      await interaction.reply({
        content:
          "❌ Impossible de récupérer le dispatch.",
        ephemeral: true
      });
    }
  }
}

// =========================
// DISPATCH OUT
// =========================

async function handleDispatchOut(
  interaction
) {
  const userId =
    interaction.user.id;

  if (
    !dispatchers.has(
      userId
    )
  ) {
    return interaction.reply({
      content:
        "❌ Vous n'êtes pas enregistré dans le dispatch.",
      ephemeral: true
    });
  }

  dispatchers.delete(
    userId
  );

  await interaction.reply({
    content:
      "✅ Vous avez quitté le dispatch.",
    ephemeral: true
  });
}

// =========================
// DISPATCH LIST
// =========================

async function handleDispatchList(
  interaction
) {
  const units =
    getDispatchUnits(
      interaction.guild
    );

  if (
    units.length === 0
  ) {
    return interaction.reply({
      content:
        "🚔 Aucun agent n'est actuellement présent dans les unités.",
      ephemeral: true
    });
  }

  let text =
    "🚔 **LISTE DU DISPATCH**\n\n";

  for (
    const unit of units
  ) {
    const leader =
      getPatrolLeader(
        unit.members
      );

    text +=
      `**${unit.channel.name}**\n`;

    if (leader) {
      text +=
        `👑 Chef de patrouille : ${leader}\n`;
    }

    text +=
      `👮 Agents : ${unit.members.size}\n\n`;
  }

  await interaction.reply({
    content: text
  });
}

// =========================
// SERVICES
// =========================

async function handleServices(
  interaction
) {
  try {
    const text =
      buildServicesText(
        interaction.guild
      );

    await interaction.reply({
      content: text
    });
  } catch (error) {
    console.error(
      "Erreur services :",
      error
    );

    await interaction.reply({
      content:
        "❌ Impossible de récupérer les agents en service.",
      ephemeral: true
    });
  }
}

// =========================
// INTERACTIONS
// =========================

client.on(
  "interactionCreate",
  async interaction => {
    try {

      // =====================
      // SLASH COMMANDS
      // =====================

      if (
        interaction.isChatInputCommand()
      ) {

        switch (
          interaction.commandName
        ) {

          case "clockin":
            await handleClockin(
              interaction
            );
            break;

          case "clockout":
            await handleClockout(
              interaction
            );
            break;

          case "dispatch":
            await handleDispatch(
              interaction
            );
            break;

          case "dispatchout":
            await handleDispatchOut(
              interaction
            );
            break;

          case "dispatchlist":
            await handleDispatchList(
              interaction
            );
            break;

          case "services":
            await handleServices(
              interaction
            );
            break;

          case "userdata":
            await handleUserdata(
              interaction
            );
            break;

          case "paye":
            await handlePaye(
              interaction
            );
            break;

          case "addminutes":
            await handleAddMinutes(
              interaction
            );
            break;

          case "delminutes":
            await handleDelMinutes(
              interaction
            );
            break;

          case "force-clockout":
            await handleForceClockout(
              interaction
            );
            break;

          case "force-clockoutall":
            await handleForceClockoutAll(
              interaction
            );
            break;

          case "reset":
            await handleReset(
              interaction
            );
            break;

          case "setup":
            await setupTicket(
              interaction,
              interaction.options.getString(
                "type"
              )
            );
            break;

          default:
            break;
        }

        return;
      }

      // =====================
      // MENU TICKET
      // =====================

      if (
        interaction.isStringSelectMenu()
      ) {

        if (
          !interaction.customId.startsWith(
            "ticket_select_"
          )
        ) {
          return;
        }

        const type =
          interaction.customId.replace(
            "ticket_select_",
            ""
          );

        const ticketType =
          interaction.values[0];

        await createTicket(
          interaction,
          type,
          ticketType
        );

        return;
      }

      // =====================
      // BOUTON FERMETURE
      // =====================

      if (
        interaction.isButton()
      ) {

        if (
          interaction.customId ===
          "ticket_close"
        ) {
          await closeTicket(
            interaction
          );
        }

        return;
      }

    } catch (error) {

      console.error(
        "Erreur interaction :",
        error
      );

      try {

        if (
          interaction.replied ||
          interaction.deferred
        ) {

          await interaction.followUp({
            content:
              "❌ Une erreur est survenue lors de l'exécution de cette action.",
            ephemeral: true
          });

        } else {

          await interaction.reply({
            content:
              "❌ Une erreur est survenue lors de l'exécution de cette action.",
            ephemeral: true
          });

        }

      } catch (replyError) {

        console.error(
          "Impossible de répondre à l'interaction :",
          replyError
        );

      }
    }
  }
);

// =========================
// READY
// =========================

client.once(
  "ready",
  async () => {

    console.log(
      `✅ Bot connecté : ${client.user.tag}`
    );

    console.log(
      `🤖 Node.js : ${process.version}`
    );

    console.log(
      `📡 Serveurs : ${client.guilds.cache.size}`
    );

    await registerCommands();

    console.log(
      "🚔 Bot LSPD opérationnel."
    );
  }
);

// =========================
// ERREURS
// =========================

client.on(
  "error",
  error => {
    console.error(
      "❌ Erreur Discord :",
      error
    );
  }
);

process.on(
  "unhandledRejection",
  error => {
    console.error(
      "❌ Unhandled Rejection :",
      error
    );
  }
);

process.on(
  "uncaughtException",
  error => {
    console.error(
      "❌ Uncaught Exception :",
      error
    );
  }
);

// =========================
// DÉMARRAGE
// =========================

if (!TOKEN) {
  console.error(
    "❌ TOKEN manquant dans les variables d'environnement."
  );
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error(
    "❌ CLIENT_ID manquant dans les variables d'environnement."
  );
  process.exit(1);
}

if (!GUILD_ID) {
  console.error(
    "❌ GUILD_ID manquant dans les variables d'environnement."
  );
  process.exit(1);
}

console.log(
  `🚀 Démarrage du bot avec Node.js ${process.version}...`
);

client.login(
  TOKEN
);
