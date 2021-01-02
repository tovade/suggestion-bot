const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "USER"],
});
const glob = require("glob");
const mongoose = require("mongoose");
const config = require("./config");
mongoose.connect(config.mongo_url, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client.prefix = config.prefix;
client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = glob.sync("./commands/**/*.js");
for (const file of commandFiles) {
  const command = require(file);
  client.commands.set(command.name, command);
}

const eventFiles = glob.sync("./events/**/*.js");
for (const file of eventFiles) {
  const event = require(file);
  const eventName = /\/events.(.*).js/.exec(file)[1];
  client.on(eventName, event.bind(null, client));
}
client.login(config.token);
