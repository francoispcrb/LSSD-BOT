const chalk = require("chalk");

if (!globalThis.clientData) {
    globalThis.clientData = {}; // Initialise un objet global
}


const { EmbedBuilder } = require('discord.js')

const { sendLog } = require('..');
module.exports = {
  name: 'messageCreate',

    async execute(message) {
        if (message.author.bot) return;
    
        var contentValue = message.content
    
        if (contentValue.length > 1024) {
            contentValue = contentValue.substring(0, 1021) + '...'
        }
    
        const embed = new EmbedBuilder()
          .setTitle("📝 Nouveau message")
          .setColor("Green")
          .addFields(
            { name: "Auteur", value: `<@${message.author.id}>`, inline: true },
            { name: "Salon", value: `<#${message.channel.id}>`, inline: true },
            { name: "Contenu", value: contentValue || "*Aucun contenu*" }
          )
        .setTimestamp();
        sendLog(embed);
      console.log(chalk.blueBright("[MESSAGE_SENT]"), chalk.green(message.author.tag), chalk.reset("a envoyé"), chalk.green(contentValue || null),  chalk.reset("dans"), chalk.green(message.channel.name))
    }
}