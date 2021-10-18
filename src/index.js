const Discord = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const Commands = require("./commands");
const Data = require("./data");

dotenv.config();

const bot = new Discord.Client();
bot.login(process.env.DISCORD_TOKEN);

const commands = Commands.loadCommands();
const data = new Data();

bot.on("ready", async () => {
  console.log("Client is ready. Logged in as " + bot.user.tag);

  for (const guild of bot.guilds.cache.array()) {
    const invites = await guild.fetchInvites();
    for (const invite of invites.array()) {
      data.setInviteAmount(guild.id, invite.code, invite.uses);
    }

    const members = await guild.members.fetch();
    data.cacheExistingMembers(guild.id, members);
  }
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(getConfig().prefix)) return;

  const prefix = getConfig().prefix;
  const params = message.content.substr(prefix.length).split(/ +/g);
  const command = params.shift();

  const member = await message.member.fetch();
  const memberRoles = member.roles.cache.keyArray();
  for (const cmd of commands) {
    if (cmd.info.name == command || (cmd.info.alias && cmd.info.alias.includes(command))) {
      const roles = cmd.info.requiredRoles;
      if (!member.hasPermission("ADMINISTRATOR") && roles && roles.length > 0 && roles.filter(r => memberRoles.includes(r)).length == 0) {
        const embed = new Discord.MessageEmbed();
        embed.setColor("RED");
        embed.setTitle("Error");
        embed.setDescription("You do not have the required role to use this command.");
        embed.setThumbnail(getConfig().embed_image);
        message.channel.send(embed);
      } else {
        cmd.execute(bot, message, params, data, getConfig());
      }
    }
  }
});

bot.on("guildMemberAdd", async member => {
  if (!data.isFirstTimeJoin(member.guild.id, member.id)) return;
  data.cacheFirstTimeJoin(member.guild.id, member.id);

  const invites = await member.guild.fetchInvites();
  for (const invite of invites.array()) {
    const oldNum = data.getInviteAmount(member.guild.id, invite.code);
    if (invite.uses > oldNum) {
      var date = member.user.createdAt;
      data.setInviteAmount(member.guild.id, invite.code, invite.uses);
      const user = data.getUserFromInvite(invite.guild.id, invite.code);
      if (!date.setUTCHours(date.getUTCHours() + 72) < Date.now())
        data.setReferralCount(member.guild.id, user, data.getReferralCount(member.guild.id, user) + 1);
      else
        data.setFakeReferralCount(member.guild.id, user, data.getFakeReferralCount(member.guild.id, user) + 1);
    }
  }
});

bot.on("inviteCreate", invite => {
  data.setInviteAmount(invite.guild.id, invite.code, invite.uses);
});

/**
 * @returns {typeof import("../config.json")}
 */
function getConfig() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8"));
}