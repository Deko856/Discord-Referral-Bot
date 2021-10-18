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

  const targetUser = message.mentions.members.array().length > 0 ? message.mentions.users.first() : message.author;

  const embed = new Discord.MessageEmbed();
  embed.setTitle("Referral Count");
  embed.setDescription("Here is the referral count for <@" + targetUser.id + ">.");
  embed.setColor(config.embed_color);
  embed.setFooter("Requested by " + message.author.tag);
  embed.setTimestamp(Date.now());
  embed.setThumbnail(config.embed_image);

  const referralData = data.getReferralData(message.guild.id, targetUser.id);
  if (!referralData || !referralData.referralCode) {
    embed.setTitle("Error");
    if (targetUser == message.author)
      embed.setDescription("You have not setup your referral link yet.\nRun '" + prefix + "getreferral` to get started.");
    else
      embed.setDescription("<@" + targetUser.id + "> has not setup their referral link yet.")
    embed.setColor("RED");
    return message.channel.send(embed);
  }

  embed.addField("Referral Code", referralData.referralCode, referralData.fakeReferrals == 0);
  embed.addField("Referrals", referralData.referrals, true);
  if (referralData.fakeReferrals > 0) {
    embed.addField("Fake Referrals", referralData.fakeReferrals, true);
    embed.addField("Total", referralData.referrals + referralData.fakeReferrals, true);
  }

  message.channel.send(embed);
}

module.exports.info = {
  name: "referralcount",
  usage: "[optionally, user mention or id]",
  alias: ["referrals"],
  requiredRoles: [""],
  help: "Shows how many referrals you have. If you provide a user mention or ID, shows how many referrals that user has."
}
