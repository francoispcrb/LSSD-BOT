const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(53608447)
const chalk = require("chalk");
const fs = require('fs')
const Client = new Discord.Client({intents})

if (!globalThis.clientData) {
    globalThis.clientData = {}; // Initialise un objet global
}
const config     = require('../config/config.json')
const shiftFile  = require('../config/shift.json')
const ticketFile = require('../config/ticket.json')
const warnFile   = require("../config/warn.json")
const muteFile   = require("../config/muted.json")
const kickFile   = require("../config/kick.json")
const banFile    = require("../config/ban.json")
const indicatifFile = require('../config/indicatif.json')

const { EmbedBuilder } = require('discord.js')
const { ActionRowBuilder } = require('discord.js')
const { ButtonBuilder, ButtonStyle } = require('discord.js')
const { PermissionsBitField } = require('discord.js')
const { ThreadAutoArchiveDuration } = require('discord.js')
const { ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js')
const { ActivityType } = require('discord.js')

const { saveBan, saveConfig, saveKick, saveMute, saveShift, saveTicket, saveWarn } = require('../functions')
const { commands, RANKS, CORPS } = require('../utils')
const { sendLog } = require('..');
module.exports = {
    name: 'messageDelete',

    async execute(message) {
        if (message.author.bot) return;

	    var contentValue = message.content

    if (contentValue.length > 1024) {
        contentValue = contentValue.substring(0, 1021) + '...'
    }

    const embed = new EmbedBuilder()
        .setTitle("🗑 Message supprimé")
        .setColor("Red")
        .addFields(
        { name: "Auteur", value: `<@${message.author.id}>`, inline: true },
        { name: "Salon", value: `<#${message.channel.id}>`, inline: true },
        { name: "Message", value: contentValue || "*Aucun contenu*" }
        )
        .setTimestamp();

    sendLog(embed);
      console.log(chalk.blueBright("[MESSAGE_REMOVE]"), chalk.green(message.author.tag), chalk.reset("a supprimé"), chalk.green(contentValue || null), chalk.reset("dans"), chalk.green(message.channel.name))

    }
}