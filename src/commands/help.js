const Discord = require("discord.js");

const Commands = require("../commands");
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
  const embed = new Discord.MessageEmbed();
  embed.setColor(config.embed_color);
  embed.setTitle("Help");
  embed.setDescription("Here is a list of all commands you have access to."); // TODO
  embed.setThumbnail(config.embed_image);

  const member = await message.member.fetch();
  const memberRoles = member.roles.cache.keyArray();
  const commands = Commands.loadCommands().map(c => c.info).sort((a, b) => a.name.localeCompare(b.name));
  for (const command of commands) {
    const roles = command.requiredRoles;
    if (member.hasPermission("ADMINISTRATOR") || !roles || roles.length == 0 || roles.filter(r => memberRoles.includes(r)).length > 0) {
      embed.addField(config.prefix + command.name + " " + command.usage, `${command.help}`);
    }
  }

  message.author.send(embed);
  message.react("📩");
}

module.exports.info = {
  name: "help",
  usage: "",
  alias: [],
  requiredRoles: [""],
  help: "Shows this list."
}
