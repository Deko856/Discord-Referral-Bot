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
module.exports.execute = async (bot, message, args, data, config) => {
  if (!(message.channel instanceof Discord.GuildChannel)) return;

  const embed = new Discord.MessageEmbed();
  embed.setTitle("Your Referral Code");
  embed.setColor(config.embed_color);
  embed.setThumbnail(config.embed_image);

  var invite = data.getReferralCode(message.guild.id, message.author.id);

  if (!invite) {
    invite = (await message.channel.createInvite({
      maxAge: 0,
      unique: true
    })).code;
    data.setReferralCode(message.guild.id, message.author.id, invite);

    embed.setDescription("Thank you for joining the referral program!");
    embed.addField("Your personal referral code", "https://discord.gg/" + invite);
    embed.addField("Information", "The bot will now be tracking how many individual people use your code. Please note that if you invite a user and their account has been created less than 72 hours before joining the server, it will be classed as a fake referral to stop people from abusing the system.");
  } else {
    embed.setDescription("You already have a referral code.");
    embed.addField("Your personal referral code", "https://discord.gg/" + invite);
    embed.addField("Information", "The bot is tracking how many individual people use your code. Please note that if you invite a user and their account has been created less than 72 hours before joining the server, it will be classed as a fake referral to stop people from abusing the system.");
  }

  data.setInviteAmount(message.guild.id, invite, 0);

  message.author.send(embed);
  message.react("📩");
}

module.exports.info = {
  name: "getreferral",
  usage: "",
  alias: ["referral"],
  help: "Generates a personal referral code for you."
}