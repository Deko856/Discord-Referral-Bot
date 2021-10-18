const Discord = require("discord.js");
const Data = require("../data");

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @param {Data} data 
 * @param {typeof import("../../config.json")} config
 */
module.exports.execute = (bot, message, args, data, config) => {
  if (!(message.channel instanceof Discord.GuildChannel)) return;

  const embed = new Discord.MessageEmbed();
  embed.setTitle("Top Referrers");
  embed.setDescription("Here are the top 10 users with the most amount of referrals.");
  embed.setColor(config.embed_color);
  embed.setFooter("Requested by " + message.author.tag);
  embed.setTimestamp(Date.now());
  embed.setThumbnail(config.embed_image);

  const topReferrers = data.getTopReferrers(message.guild.id);

  if (topReferrers.length == 0) {
    embed.setDescription("There are no referrers yet.");
    return message.channel.send(embed);
  }

  var field = "";
  for (const referrer in topReferrers) {
    field += `${parseInt(referrer) + 1}. <@${topReferrers[referrer].id}> (\`${topReferrers[referrer].referralCode}\`): ${topReferrers[referrer].referrals} referrals\n`;
  }

  embed.addField("Users", field);

  message.channel.send(embed);
}

module.exports.info = {
  name: "referraltop",
  usage: "",
  alias: [],
  requiredRoles: [""],
  help: "Displays the top 10 users with the most referrals"
}
