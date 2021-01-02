const { MessageEmbed } = require("discord.js");
const suggestionModel = require("../../models/suggestion");
const config = require("../../config");
module.exports = {
  name: "suggestion",
  description: "yeet",
  async execute(client, message, args) {
    const option = args[0];
    if (!option) {
      const embed = new MessageEmbed()
        .setTitle(`**Invalid option: ${option}**`)
        .addField(`**Member Commands**`, "$suggestion suggest <suggestion>")
        .addField(
          `**Proficient Commands**`,
          "$suggestion reply <suggest-token> <reply>"
        )
        .setAuthor("**Commands**", client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
      message.channel.send(embed);
    }

    switch (option) {
      case "suggest":
        function generateToken() {
          var length = 6,
            charset =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
            retVal = "";
          for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
          }
          return retVal;
        }
        const suggestion = args.slice(1).join(" ");
        if (!suggestion) return message.channel.send(":x: Invalid suggestion!");
        const channel = await client.channels.cache.get(
          config.suggestion_channelID
        );
        const token = generateToken();
        if (!channel) return;
        if (channel && suggestion) {
          const embed = new MessageEmbed()
            .setAuthor(
              `${message.author.username}`,
              message.author.displayAvatarURL()
            )
            .setDescription(suggestion)
            .setFooter(`token: ${token}`);
          const random = await channel.send(embed);
          message.channel.send(`Done suggestion has been send to ${channel}!`);
          const sug = new suggestionModel({
            token: token,
            suggestion: suggestion,
            msg_id: random.id,
            author: message.author.id,
          });
          await sug.save();
        }
        break;
      case "reply":
        if (
          !message.member.roles.cache.some(
            (r) => r.id === config.developer_role
          )
        )
          return message.channel.send(
            "You do not have the right role to do this!"
          );
        const final = await suggestionModel.findOne({ token: args[1] });
        if (!final) return message.channel.send("Invalid token!");
        if (final) {
          const msg = await client.channels.cache
            .get(config.suggestion_channelID)
            .messages.fetch(final.msg_id);

          if (!msg) return message.channel.send("I did not find a message :c");
          const reply = args.slice(2).join(" ");
          if (!reply) return message.channel.send("Give a valid reply please!");
          const author = await client.users.cache.find(
            (u) => u.id === final.author
          );
          const embed = new MessageEmbed()
            .setAuthor(`${author.username}`, author.displayAvatarURL())
            .setDescription(final.suggestion)
            .addField(`Response`, reply)
            .setFooter(`token: ${args[1]}`);
          msg.edit(embed);
          message.channel.send("Succesfully replied!");
          const e = author
            .send(
              `Your suggestion: **${final.suggestion}** has been replied with: **${reply}**`
            )
            .catch((err) => {
              message.channel.send(
                `I tried to dm the suggestion owner but hes dms are closed!`
              );
            });
        }
    }
  },
};
