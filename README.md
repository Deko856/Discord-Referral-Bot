# Discord-Referral-Bot
Discord bot that can allow users to sign up to the referral program using this bot to then track how many people they invite to your Discord server.

This project is currently abandoned but no plans to make furthur improvements or add new features.

## Requirements
1. Discord Bot Token [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. Node.js [Download](https://nodejs.org/en/)
3. Discord.js [Install](https://discord.js.org/#/)

## 🚀 Getting Started & Installation
1. Enter your Discord bot token into the `.env` file
2. Run `npm install`


## ⚙️ Configuration
```javascript
{
"prefix": "r!",
"embed_color": "00DCFF",
"embed_image": "INSERT IMAGE LINK"
}
```



## 💬 Commands
`r!help` Shows commands available to the user they can use.

`r!getreferral` Generates a personal referral code for you.

`r!referralcount [optionally, user mention or id]` Shows how many referrals you have. If you provide a user mention or ID, shows how many referrals that user has.

`r!referraltop` Displays the top 10 users with the most referrals

## ✨ Features

`requiredRoles: ["758733011742359642"]` Allows you to set commands to only be used by certain roles. If a user uses the Help command and does not have the role for a command that require for a certain command, it will not be displayed in the Help command embed to the user.

## Dependencies
- better-sqlite3
- discord.js v12
- dotenv
- fs-readdir-recursive
