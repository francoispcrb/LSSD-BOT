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
const { timeStamp } = require('console');
module.exports = {
    name: 'guildMemberRemove',

    async execute(member) {
        const embed = new EmbedBuilder()
        .setTitle("❌ Membre parti")
        .setColor("Red")
        .setDescription(`**${member.user.tag}** a quitté ou a été expulsé du serveur.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();
    
      sendLog(embed);
      console.log(`$[MEMBER REMOVE] ${member.user.tag} est parti à ${timeStamp}`)

    }
}