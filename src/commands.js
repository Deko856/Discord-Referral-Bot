const Discord = require("discord.js");
const path = require("path");
const readdir = require("fs-readdir-recursive");

const Data = require("./data");

/**
 * @returns {{
     execute: (bot: Discord.Client, message: Discord.Message, args: string[], data: Data) => void,
     info: {name: string, usage: string, alias: string[], help: string, requiredRoles: string[]}
   }[]}
 */
module.exports.loadCommands = function () {
  const commands = [];
  const files = readdir(path.join(__dirname, "commands"), f => f.endsWith(".js"));

  for (const file of files) {
    commands.push(require(path.join(__dirname, "commands", file)));
  }

  return commands;
}