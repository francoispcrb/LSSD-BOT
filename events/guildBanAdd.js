const chalk = require("chalk");

if (!globalThis.clientData) {
    globalThis.clientData = {}; // Initialise un objet global
};


const { EmbedBuilder } = require('discord.js')
const { sendLog } = require('..');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban) {
        const embed = new EmbedBuilder()
        .setTitle("🚨 Membre banni")
        .setColor("DarkRed")
        .setDescription(`**${ban.user.tag}** a été banni du serveur.`)
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp();
    
      sendLog(embed);
      console.log(chalk.bgYellowBright.red("[BAN ADD]"), chalk.red(ban.user.tag), chalk.reset("a été banni à"), chalk.green("null"));
    }
};