const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("clockin")
    .setDescription("Prendre son service"),

  new SlashCommandBuilder()
    .setName("clockout")
    .setDescription("Terminer son service"),

  new SlashCommandBuilder()
    .setName("dispatch")
    .setDescription("Prendre le dispatch"),

  new SlashCommandBuilder()
    .setName("dispatchout")
    .setDescription("Quitter le dispatch"),

  new SlashCommandBuilder()
    .setName("dispatchlist")
    .setDescription("Voir les personnes au dispatch"),

  new SlashCommandBuilder()
    .setName("services")
    .setDescription("Voir les personnes actuellement en service"),

  new SlashCommandBuilder()
    .setName("addminute")
    .setDescription("Ajouter une minute de service")
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Nombre de minutes à ajouter")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("force-clockout")
    .setDescription("Forcer la fin de service d'un membre")
    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription("Membre concerné")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("force-clockoutall")
    .setDescription("Forcer la fin de service de tout le monde"),

  new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Réinitialiser les services")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

let services = new Map();
let dispatchers = new Map();

async function deployCommands() {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log("Commandes slash installées.");
}

client.once("ready", async () => {
  console.log(`Bot connecté : ${client.user.tag}`);

  try {
    await deployCommands();
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;
  const member = interaction.member;

  if (command === "clockin") {
    services.set(interaction.user.id, {
      username: interaction.user.username,
      startedAt: Date.now()
    });

    await interaction.reply({
      content: `🟢 ${interaction.user} a pris son service.`,
      ephemeral: false
    });
  }

  if (command === "clockout") {
    const service = services.get(interaction.user.id);

    if (!service) {
      return interaction.reply({
        content: "🔴 Vous n'êtes pas actuellement en service.",
        ephemeral: true
      });
    }

    const minutes = Math.floor(
      (Date.now() - service.startedAt) / 60000
    );

    services.delete(interaction.user.id);

    await interaction.reply(
      `🔴 ${interaction.user} a terminé son service.\nDurée : ${minutes} minute(s).`
    );
  }

  if (command === "dispatch") {
    dispatchers.set(interaction.user.id, {
      username: interaction.user.username,
      startedAt: Date.now()
    });

    await interaction.reply(
      `📡 ${interaction.user} est maintenant au dispatch.`
    );
  }

  if (command === "dispatchout") {
    if (!dispatchers.has(interaction.user.id)) {
      return interaction.reply({
        content: "Vous n'êtes pas actuellement au dispatch.",
        ephemeral: true
      });
    }

    dispatchers.delete(interaction.user.id);

    await interaction.reply(
      `📡 ${interaction.user} a quitté le dispatch.`
    );
  }

  if (command === "dispatchlist") {
    if (dispatchers.size === 0) {
      return interaction.reply("📡 Aucun membre au dispatch.");
    }

    const list = [...dispatchers.values()]
      .map(user => `• ${user.username}`)
      .join("\n");

    await interaction.reply(`📡 Membres au dispatch :\n${list}`);
  }

  if (command === "services") {
    if (services.size === 0) {
      return interaction.reply("🚔 Aucun membre en service.");
    }

    const list = [...services.values()]
      .map(user => `• ${user.username}`)
      .join("\n");

    await interaction.reply(`🚔 Membres en service :\n${list}`);
  }

  if (command === "addminute") {
    const minutes = interaction.options.getInteger("minutes");

    const service = services.get(interaction.user.id);

    if (!service) {
      return interaction.reply({
        content: "Vous devez être en service.",
        ephemeral: true
      });
    }

    service.startedAt -= minutes * 60000;

    await interaction.reply(
      `⏱️ ${minutes} minute(s) ajoutée(s) à votre service.`
    );
  }

  if (command === "force-clockout") {
    const user = interaction.options.getUser("membre");

    if (!services.has(user.id)) {
      return interaction.reply({
        content: "Cette personne n'est pas en service.",
        ephemeral: true
      });
    }

    services.delete(user.id);

    await interaction.reply(
      `🔴 ${user} a été retiré du service par ${interaction.user}.`
    );
  }

  if (command === "force-clockoutall") {
    services.clear();

    await interaction.reply(
      `🔴 Tous les services ont été arrêtés par ${interaction.user}.`
    );
  }

  if (command === "reset") {
    services.clear();
    dispatchers.clear();

    await interaction.reply(
      `♻️ Les services et le dispatch ont été réinitialisés.`
    );
  }
});

client.login(TOKEN);
