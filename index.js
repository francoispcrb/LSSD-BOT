const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(53608447);
const chalk = require("chalk");
const fs = require('fs');
const Client = new Discord.Client({intents});
const config = require('./config/config.json');
const { loader, patchSendMethod } = require('./functions');
const keepAlive = require('./keep_alive')

require('./loggers');

function sendLog(embed) {
    const LOG_CHANNEL_ID = config.channel.log; 
    const logChannel = Client.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) logChannel.send({ embeds: [embed] });
} module.exports = {sendLog};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        Client.once(event.name, (...args) => event.execute(...args, Client));
    } else {
        Client.on(event.name, (...args) => event.execute(...args, Client));
    }
}

console.notify(eventFiles)

globalThis.clientData = {};

try {
    const rawData = fs.readFileSync('./config/config.json', 'utf8');
    const config = JSON.parse(rawData);

    // Charger les données sauvegardées
    if (config.openservice_last_id && config.openservice_participants) {
        globalThis.clientData = {
            messageId: config.openservice_last_id,
            participants: config.openservice_participants
        };
        console.log("✅ Données rechargées depuis config.json :", globalThis.clientData);
    } else {
        console.log("⚠️ Aucune donnée trouvée dans config.json");
    }
} catch (error) {
    console.error("❌ Erreur lors du chargement de config.json :", error);
}

console.debug('Hi !!');
console.log(chalk.bgGreen.black("Chargement du fichier index.js"));
console.notify('hot', 'Hey!')

loader();
patchSendMethod();

Client.commands = require('./interactions/commands');
Client.buttons = require('./interactions/buttons');
Client.modals = require('./interactions/modals');

require('dotenv').config()
Client.login(process.env.TOKEN);