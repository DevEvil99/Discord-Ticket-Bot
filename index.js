const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { Collection, Client } = require("discord.js");
const { token, default_prefix } = require("./config.json");
const config = require("./config.json");
const db = require("quick.db");
const activities = [
  "https://devevil.com",
  "Server : https://discord.gg/jsQ9UP7kCA",
  "🐢",
];

const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true,
});

client.on("ready", () => {
  console.log('Looser');
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
    const newActivity = activities[randomIndex];

    client.user.setActivity(newActivity);
  }, 10000);
});

client.on("error", console.error);
client.on("warn", console.warn);

process.on("unhandledRejection", (error) => {
  console.error(`Uncaught Promise Error: \n${error.stack}`);
});

process.on("uncaughtException", (err) => {
  let errmsg = (err ? err.stack || err : "")
    .toString()
    .replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error(errmsg);
});

client.commands = new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = await db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = default_prefix;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(config.token)
