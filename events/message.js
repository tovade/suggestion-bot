module.exports = async (client, message) => {
  if (message.channel.type === "dm") return;
  if (message.author.id === client.user.id || message.author.bot) return;
  const prefix = client.prefix;
  if (message.guild.id === null)
    if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.log(error);
    message.reply("there was an error trying to execute that command!");
  }
};
