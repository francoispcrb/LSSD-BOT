const fs            = require('fs').promises
const config        = require('./config/config.json')
const shiftFile     = require('./config/shift.json')
const ticketFile    = require('./config/ticket.json')
const warnFile      = require("./config/warn.json")
const muteFile      = require("./config/muted.json")
const kickFile      = require("./config/kick.json")
const banFile       = require("./config/ban.json")
const indicatifFile = require('./config/indicatif.json')
const pex           = require('./config/pex.json')
const chalk         = require('chalk')
const axios         = require('axios')
const ped = require('./config/database/ped.json')
const veh = require('./config/database/veh.json')

function loader() {
    const package = require('./package.json')
    console.log(
        chalk.bgGreen.black('Chargement des informations du package.\n'),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Auth. : ${package.author}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Depd. : ${package.dependencies ? Object.keys(package.dependencies).join(", "): "Aucune"}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Desc. : ${package.description}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Lisc. : ${package.license}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Main. : ${package.main}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Name. : ${package.name}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Scrp. : ${package.scripts}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Vers. : ${package.version}\n`),
        chalk.bgCyan('[PACKAGE]'), chalk.green(`Patch Note. : ${package.patchnote}\n`)
    );
};

function savePex() {
    fs.writeFile('./config/pex.json', JSON.stringify(pex, null, 4), (err) => {
        if(err) console.error('Une erreur est survenue, ', err)
    })
};

function saveConfig() {
    fs.writeFile("./config/config.json", JSON.stringify(config, null, 4), (err) => {
        if(err) console.error('Une erreur est survenue.')
    })
};

function saveTicket() {
    fs.writeFile(config.plugin.ticket_plugin.ticket_file, JSON.stringify(ticketFile, null, 4), (err) => {
        if(err) {console.error('Une erreur est survenue.')}
    })
};

function saveWarn() {
    fs.writeFile('./config/warn.json', JSON.stringify(warnFile, null, 4), (err) => {
        if(err) {console.error('Une erreur est survenue.')}
    })
};

function saveMute() {
    fs.writeFile('./config/muted.json', JSON.stringify(muteFile, null, 4), (err) => {
        if(err) {console.error('Une erreur est survenue.', err)}
    })
};

function saveKick() {
    fs.writeFile('./config/kick.json', JSON.stringify(kickFile, null, 4), (err) => {
        if(err) {console.log('Une erreur est survenue.', err)}
    })
};

function saveBan() {
    fs.writeFile('./config/ban.json', JSON.stringify(banFile, null, 4), (err) => {
        if(err) {console.log('Une erreur est survenue.', err)}
    })
};

function saveIndicatif() {
    fs.writeFile('./config/indicatif.json', JSON.stringify(indicatifFile, null, 4), (err) => {
        if(err) {console.log('Une erreur est survenue.', err)}
    })
};

function saveShift() {
    fs.writeFile("./config/shift.json", JSON.stringify(shiftFile, null, 4), (err) => {
        if (err) console.error('Une erreur est survenue.', err);
    });
};

async function saveDb(type) {
    if(!type) {
        return console.notify("hot", "Aucun type dans la fonction saveDb.")
    }
    switch (type) {
        case 'ped':
            fs.writeFile('./config/database/ped.json', JSON.stringify(ped, null, 4), (err) => {
                if(err) console.error('Une erreur est survenue :', err)
            });
        case 'veh':
            fs.writeFile('./config/database/veh.json', JSON.stringify(veh, null, 4), (err) => {
                if(err) console.error('Une erreur est survenue :', err)
            })
    }
}

async function saveFile(path, asImport) {
    try {
        const filePath = `${path}.json`;
        const data = JSON.stringify(asImport, null, 4);

        await fs.writeFile(filePath, data);
        console.log(`✅ Fichier ${path}.json enregistré avec succès !`);


    } catch (err) {
        console.error(`❌ Erreur lors de l'écriture dans ${file}.json : ${err}`);
    }
}


function addFooterToEmbeds(message) {
    if (message.embeds?.length > 0) {
        const { EmbedBuilder } = require('discord.js');

        message.embeds = message.embeds.map(embedData => {
            const embed = EmbedBuilder.from(embedData);
            const package = require('./package.json')
            embed.setFooter({ text: `${package.name} • ${package.version}`});
            return embed;
        });
    }
};

function patchSendMethod() {
    const { TextChannel } = require('discord.js');
    const originalSend = TextChannel.prototype.send;

    TextChannel.prototype.send = async function (content, options) {
        if (typeof content === 'object' && content.embeds) {
            addFooterToEmbeds(content);
        } else if (typeof options === 'object' && options.embeds) {
            addFooterToEmbeds(options);
        }

        return originalSend.apply(this, [content, options]);
    };
};

async function searchYouTube(query) {
    const apiKey = config.token_youtube; // Remplace par ta clé API YouTube
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
    
    try {
        const response = await axios.get(searchUrl);
        const video = response.data.items[0];
        return { title: video.snippet.title, url: `https://www.youtube.com/watch?v=${video.id.videoId}` };
    } catch (error) {
        console.error('Erreur lors de la recherche sur YouTube', error);
        return void (null);
    }
};


try {
    module.exports = {
        saveBan,
        saveConfig,
        saveIndicatif,
        saveKick,
        saveMute,
        savePex,
        saveShift,
        saveTicket,
        saveWarn,
        loader,
        patchSendMethod,
        saveFile,
        searchYouTube,
        saveDb
    };
    console.log("Les modules ", chalk.green('functions'), chalk.reset(" ont correctement été exporté."));
} catch(err) {
    console.error("[FATAL_ERROR] Les fonctions n'ont pas été exporté correctement. Le processus va s'arrêter., ", err);
    process.exit(0); 
};