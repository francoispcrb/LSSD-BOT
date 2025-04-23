if (!globalThis.clientData) {
    globalThis.clientData = {}; // Initialise un objet global
}


const { EmbedBuilder } = require('discord.js')

const { commands, RANKS, CORPS } = require('../utils')
const { sendLog } = require('..');
module.exports = {
  name: 'messageUpdate',

    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot || oldMessage.content === newMessage.content) return;

        if(oldMessage.content > 1024) {
          var contentOfOldMessage = oldMessage.content.substring(0, 1021) + '...' 
        }
        if(newMessage.content > 1024) {
          var contentOfNewMessage = newMessage.content.substring(0, 1021) + '...'
        }
      
        const embed = new EmbedBuilder()
          .setTitle("✏ Message modifié")
          .setColor("Yellow")
          .addFields(
            { name: "Auteur", value: `<@${oldMessage.author.id}>`, inline: true },
            { name: "Salon", value: `<#${oldMessage.channel.id}>`, inline: true },
            { name: "Avant", value: contentOfOldMessage || "*Aucun contenu*" },
            { name: "Après", value: contentOfNewMessage || "*Aucun contenu*" }
          )
          .setTimestamp();
      
        sendLog(embed);
        console.log(`$[MESSAGE UPTATED] ${contentOfOldMessage || null } a été modifié par ${contentOfNewMessage} ${oldMessage.author.tag} dans ${oldMessage.channel.name}`)

    }
}