const chalk = require("chalk");
const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(53608447)
const Client = new Discord.Client({
    intents: intents
})
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
const register = require('../config/register.json')
const vehdb = require('../config/database/veh.json')
const peddb = require('../config/database/ped.json')

const { EmbedBuilder, MessageFlags, Message, AttachmentBuilder, ChannelType } = require('discord.js')
const { ActionRowBuilder } = require('discord.js')
const { ButtonBuilder, ButtonStyle } = require('discord.js')
const { PermissionsBitField } = require('discord.js')

const package = require('../package.json')

const { saveBan, saveKick, saveMute, saveShift, saveTicket, saveWarn, savePex, searchYouTube, saveFile, saveDb} = require('../functions')
const { RANKS, CORPS, PEX, DESC_COMMAND, ROLE_MAP, DIV_MAP } = require('../utils')
const pex = require('../config/pex.json');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');
const ephemeral = MessageFlags.Ephemeral

module.exports = Client;

try {
    module.exports = {
        name: 'interactionCreate',
        async executeCommands(interaction) {
    
            if(interaction.isCommand){

                if (interaction.commandName === 'createreport') {
                    const name = interaction.options.getString('name')

                    const channel = await interaction.guild.channels.create({
                        name: name,
                        type: ChannelType.GuildText,
                        parent: config.category.ticket2,
                        reason: "Via commande /createreport"
                    })
                    await interaction.reply(`Salon crée : <#${channel.id}>`)
                }

                if (interaction.commandName === 'div') {
                    const targetUser = interaction.options.getUser('user');
                    const action = interaction.options.getString('action');
                    const divKey = interaction.options.getString('div');

                    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
                    if (!member) {
                        return interaction.reply({ content: `❌ Impossible de trouver cet utilisateur dans le serveur.`, ephemeral: true });
                    }

                    const roleId = DIV_MAP[divKey];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return interaction.reply({ content: `❌ La division spécifiée est introuvable.`, ephemeral: true });
                    }

                    try {
                        if (action === 'add') {
                            if (member.roles.cache.has(role.id)) {
                                return interaction.reply({ content: `⚠️ ${member.user.tag} est déjà dans la division **${role.name}**.`, ephemeral: true });
                            }
                            await member.roles.add(role);
                            return interaction.reply({ content: `✅ La division **${role.name}** a été attribuée à ${member.user.tag}.` });
                        } else if (action === 'remove') {
                            if (!member.roles.cache.has(role.id)) {
                                return interaction.reply({ content: `⚠️ ${member.user.tag} n'est pas dans la division **${role.name}**.`, ephemeral: true });
                            }
                            await member.roles.remove(role);
                            return interaction.reply({ content: `✅ La division **${role.name}** a été retirée de ${member.user.tag}.` });
                        } else {
                            return interaction.reply({ content: `❌ Action invalide.`, ephemeral: true });
                        }
                    } catch (err) {
                        console.error(err);
                        return interaction.reply({ content: `❌ Une erreur est survenue lors du traitement.`, ephemeral: true });
                    }
                }

                if (interaction.commandName === 'role') {
                    const targetUser = interaction.options.getUser('user');
                    const action = interaction.options.getString('action');
                    const roleKey = interaction.options.getString('role');

                    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
                    if (!member) {
                        return interaction.reply({ content: `❌ Impossible de trouver cet utilisateur dans le serveur.`, ephemeral: true });
                    }

                    const roleId = ROLE_MAP[roleKey];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return interaction.reply({ content: `❌ Le rôle spécifié est introuvable.`, ephemeral: true });
                    }

                    try {
                        if (action === 'add') {
                            if (member.roles.cache.has(role.id)) {
                                return interaction.reply({ content: `⚠️ ${member.user.tag} a déjà le rôle **${role.name}**.`, ephemeral: true });
                            }
                            await member.roles.add(role);
                            return interaction.reply({ content: `✅ Le rôle **${role.name}** a été ajouté à ${member.user.tag}.` });
                        } else if (action === 'remove') {
                            if (!member.roles.cache.has(role.id)) {
                                return interaction.reply({ content: `⚠️ ${member.user.tag} n'a pas le rôle **${role.name}**.`, ephemeral: true });
                            }
                            await member.roles.remove(role);
                            return interaction.reply({ content: `✅ Le rôle **${role.name}** a été retiré de ${member.user.tag}.` });
                        } else {
                            return interaction.reply({ content: `❌ Action invalide.`, ephemeral: true });
                        }
                    } catch (err) {
                        console.error(err);
                        return interaction.reply({ content: `❌ Une erreur est survenue lors du traitement.`, ephemeral: true });
                    }
                }

                if (interaction.commandName === 'cleardata') {
                    const fileName = interaction.options.getString('config');
                    const configDir = path.join(__dirname, '..', 'config');
                    const filePath = path.join(configDir, fileName);

                    try {
                        if (!fs.existsSync(filePath)) {
                            return interaction.reply({
                                content: `❌ Le fichier \`${fileName}\` est introuvable.`,
                                ephemeral: true
                            });
                        }

                        await fs.promises.writeFile(filePath, JSON.stringify({}, null, 2), 'utf8');

                        await interaction.reply({
                            content: `✅ Le fichier \`${fileName}\` a bien été vidé.`,
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error(`Erreur lors du vidage de ${fileName}:`, error);
                        await interaction.reply({
                            content: `❌ Une erreur est survenue en tentant de vider \`${fileName}\`.`,
                            ephemeral: true
                        });
                    }
                }

                if (interaction.commandName === 'viewdata') {
                    const fileName = interaction.options.getString('config');
                    const configDir = path.join(__dirname, '..', 'config');
                    const filePath = path.join(configDir, fileName);

                    // Vérifier si le fichier existe
                    if (!fs.existsSync(filePath)) {
                        return interaction.reply({
                            content: `❌ Le fichier \`${fileName}\` est introuvable.`,
                            ephemeral: true
                        });
                    }

                    try {
                        const file = new AttachmentBuilder(filePath, { name: fileName });  // Utiliser filePath ici

                        await interaction.reply({
                            content: `📄 Voici le fichier \`${fileName}\` :`,
                            files: [file],
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error('Erreur en envoyant le fichier :', error);
                        await interaction.reply({
                            content: '❌ Une erreur est survenue lors de l\'envoi du fichier.',
                            ephemeral: true
                        });
                    }
                }

                if (interaction.commandName === 'checklog') {

                    const logsDir = path.join(__dirname, '..', 'logs');
                    const logFileName = interaction.options.getString('log');
                    const logFilePath = path.join(logsDir, logFileName);

                    if (!fs.existsSync(logFilePath)) {
                        return interaction.reply({
                            content: `❌ Le fichier \`${logFileName}\` est introuvable.`,
                            ephemeral: true
                        });
                    }

                    try {
                        const file = new AttachmentBuilder(logFilePath, { name: logFileName });

                        await interaction.reply({
                            content: `📄 Voici le fichier \`${logFileName}\` :`,
                            files: [file],
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error('Erreur en envoyant le fichier :', error);
                        await interaction.reply({
                            content: '❌ Une erreur est survenue lors de l\'envoi du fichier.',
                            ephemeral: true
                        });
                    }
                }

                if (interaction.commandName === 'register') {
                    if (interaction.options.getSubcommand() === 'veh') {
                        const marque = interaction.options.getString('marque');
                        const modele = interaction.options.getString('modele');
                        const pripio = interaction.options.getString('proprio');
                        const remarque = interaction.options.getString('remarque');
                        const immat = interaction.options.getString('immat');
                        const couleur = interaction.options.getString('couleur');

                        if (!vehdb[immat]) {
                            vehdb[immat] = {
                                "modele": modele,
                                "marque": marque,
                                "proprio": pripio,
                                "remarque": remarque ? [remarque] : [],
                                "couleur": couleur,
                            };
                        } else {
                            if (!Array.isArray(vehdb[immat]['remarque'])) {
                                vehdb[immat]['remarque'] = [];
                            }
                            if (remarque) vehdb[immat]['remarque'].push(remarque);
                        }
                        fs.writeFileSync('./config/database/veh.json', JSON.stringify(vehdb, null, 2));

                        const embed = new EmbedBuilder()
                            .setTitle('🚗 Véhicule Enregistré')
                            .setColor(0x00FF00)
                            .addFields(
                                { name: '🚘 Modèle', value: modele, inline: true },
                                { name: '🏷️ Marque', value: marque, inline: true },
                                { name: '👤 Propriétaire', value: pripio, inline: true },
                                { name: '🔢 Immatriculation', value: immat, inline: true },
                                { name: '🎨 Couleur', value: couleur, inline: true },
                                { name: '📝 Remarque(s)', value: vehdb[immat]['remarque'].join(', ') || 'Aucune', inline: false }
                            )
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });
                    }

                    if (interaction.options.getSubcommand() === 'individu') {
                        const name = interaction.options.getString('name');
                        const desc = interaction.options.getString('desc_physique');
                        const age = interaction.options.getString('age');
                        const remarque = interaction.options.getString('remarque');
                        const tel = interaction.options.getString('tel');
                        const residencer = interaction.options.getString('residencer');

                        if (!peddb[name]) {
                            peddb[name] = {
                                "desc": desc,
                                "age": age,
                                "remarque": remarque ? [remarque] : [],
                                "tel": tel,
                                "residencer": residencer,
                            };
                        } else {
                            if (!Array.isArray(peddb[name]['remarque'])) {
                                peddb[name]['remarque'] = [];
                            }
                            if (remarque) peddb[name]['remarque'].push(remarque);
                        }
                        fs.writeFileSync('./config/database/ped.json', JSON.stringify(peddb, null, 2));

                        const embed = new EmbedBuilder()
                            .setTitle('🧑 Individu Enregistré')
                            .setColor(0x0000FF)
                            .addFields(
                                { name: '🆔 Nom', value: name, inline: true },
                                { name: '📋 Description', value: desc, inline: true },
                                { name: '🎂 Âge', value: age, inline: true },
                                { name: '📞 Téléphone', value: tel, inline: true },
                                { name: '🏠 Résidence', value: residencer, inline: true },
                                { name: '📝 Remarque(s)', value: peddb[name]['remarque'].join(', ') || 'Aucune', inline: false }
                            )
                            .setTimestamp();

                        interaction.reply({ embeds: [embed] });
                    }

                    if (interaction.options.getSubcommand() === 'addvehmark') {
                        const immat = interaction.options.getString('immat');
                        if (!vehdb[immat]) {
                            return interaction.reply({ content: "🚨 Véhicule introuvable !", ephemeral: true });
                        }
                        vehdb[immat]['marked'] = true;
                        fs.writeFileSync('./config/database/veh.json', JSON.stringify(vehdb, null, 2));
                        interaction.reply({ content: `✅ Véhicule \`${immat}\` marqué avec succès !` });
                    }

                    if (interaction.options.getSubcommand() === 'addpedmark') {
                        const name = interaction.options.getString('name');
                        if (!peddb[name]) {
                            return interaction.reply({ content: "🚨 Individu introuvable !", ephemeral: true });
                        }
                        peddb[name]['marked'] = true;
                        fs.writeFileSync('./config/database/ped.json', JSON.stringify(peddb, null, 2));
                        interaction.reply({ content: `✅ Individu \`${name}\` marqué avec succès !` });
                    }

                    if (interaction.options.getSubcommand() === 'viewvehmark') {
                        const immat = interaction.options.getString('immat');
                        if (!vehdb[immat] || !vehdb[immat]['marked']) {
                            return interaction.reply({ content: "🚨 Véhicule non marqué ou introuvable !", ephemeral: true });
                        }
                        const veh = vehdb[immat];
                        const embed = new EmbedBuilder()
                            .setTitle(`🚗 Informations du véhicule marqué: ${immat}`)
                            .setColor(0x00FF00)
                            .addFields(
                                { name: '🏷️ Marque', value: veh.marque, inline: true },
                                { name: '🚘 Modèle', value: veh.modele, inline: true },
                                { name: '👤 Propriétaire', value: veh.proprio, inline: true },
                                { name: '🎨 Couleur', value: veh.couleur, inline: true },
                                { name: '📝 Remarque(s)', value: veh.remarque.length ? veh.remarque.join(', ') : 'Aucune', inline: false }
                            );
                        interaction.reply({ embeds: [embed] });
                    }

                    if (interaction.options.getSubcommand() === 'viewpedmark') {
                        const name = interaction.options.getString('name');
                        if (!peddb[name] || !peddb[name]['marked']) {
                            return interaction.reply({ content: "🚨 Individu non marqué ou introuvable !", ephemeral: true });
                        }
                        const ped = peddb[name];
                        const embed = new EmbedBuilder()
                            .setTitle(`🧑 Informations de l'individu marqué: ${name}`)
                            .setColor(0x0000FF)
                            .addFields(
                                { name: '📋 Description', value: ped.desc, inline: true },
                                { name: '🎂 Âge', value: ped.age, inline: true },
                                { name: '📞 Téléphone', value: ped.tel, inline: true },
                                { name: '🏠 Résidence', value: ped.residencer, inline: true },
                                { name: '📝 Remarque(s)', value: ped.remarque.length ? ped.remarque.join(', ') : 'Aucune', inline: false }
                            );
                        interaction.reply({ embeds: [embed] });
                    }
                }

                if (interaction.commandName === 'requestroleinit') {
                    const data = new EmbedBuilder()
                        .setTitle('📌 Demander un rôle')
                        .setDescription("Cliquez ci-dessous pour vous ajouter un rôle.");

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('role_gov')
                                .setLabel('🔰 Rôle Gouvernement')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('role_lspd')
                                .setLabel('🚔 Rôle LSPD')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('role_lsmc')
                                .setLabel('🚑 Rôle LSMC')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('role_doj')
                                .setLabel('🧑‍⚖️ Rôle DOJ')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('wazel_news')
                                .setLabel('📰 Wazel News')
                                .setStyle(ButtonStyle.Success)
                        );

                    await interaction.reply({
                        embeds: [data],
                        components: [row]
                    });
                }

                if (interaction.commandName === 'bypass') {
                    if(interaction.options.getSubcommand() === 'shift') {
                        const user = interaction.options.getUser('user');
                        if(!user) {
                            return interaction.reply({
                                content: ":x: Vous n'avez pas inscrit d'utilisateur.",
                                flags: MessageFlags.Ephemeral
                            })
                        }
                        const userId = user.id;
                        const now = Date.now();

                        const dateKey = `service du ${new Date().toISOString().split('T')[0]}`;

                        if (!shiftFile[userId]) {
                            shiftFile[userId] = {};
                        }

                        if (shiftFile[userId].start) {

                            interaction.deferReply({content: "Thinking!", flags: MessageFlags.Ephemeral})

                            const startTime = shiftFile[userId].start;
                            const durationMs = now - startTime;
                            const durationSec = Math.floor(durationMs / 1000);
                            const hours = Math.floor(durationSec / 3600);
                            const minutes = Math.floor((durationSec % 3600) / 60);
                            const seconds = durationSec % 60;

                            // const durationMsg = ;

                            const durationMsg = new EmbedBuilder()
                                .setTitle("🚨 Fin de service")
                                .setDescription(`⏳ <@${userId}> a terminé son shift après **${hours}h ${minutes}m ${seconds}s** ! (bypass)`)
                                .setColor('Red').setTimestamp()

                            if (!shiftFile[userId][dateKey]) {
                                shiftFile[userId][dateKey] = [];
                            }
                            shiftFile[userId][dateKey].push(`${hours}h ${minutes}m ${seconds}s`);

                            delete shiftFile[userId].start;

                            saveShift()
                            await interaction.channel.send({ embeds: [durationMsg]});
                            await interaction.editReply({content: "Good!!", flags: MessageFlags.Ephemeral })
                        } else {
                            shiftFile[userId].start = now;
                            saveShift()

                            const embed = new EmbedBuilder()
                                .setTitle("🚨 Début de service")
                                .setDescription(`✅ <@${userId}> a commencé son service ! (bypass)`)
                                .setColor("Green");
                            await interaction.channel.send({ embeds: [embed] });
                            await interaction.reply({ content: "done !", flags: MessageFlags.Ephemeral });
                        }
                    }
                }

                if (interaction.commandName === 'music') {
                    const musicName = interaction.options.getString('music');
                    
                    try {
                        // Recherche sur YouTube via API ou autre méthode (à remplacer selon ton besoin)
                        const videoInfo = await searchYouTube(musicName);  // Utilise ta propre fonction pour chercher la musique
                        if (!videoInfo) {
                            return interaction.reply('Aucune musique trouvée.');
                        }
            
                        const connection = joinVoiceChannel({
                            channelId: interaction.member.voice.channel.id,
                            guildId: interaction.guild.id,
                            adapterCreator: interaction.guild.voiceAdapterCreator,
                        });
            
                        const stream = await ytdl(videoInfo.url, { filter: 'audioonly' });  // Utilisation de ytdl-core-discord
            
                        const resource = createAudioResource(stream);
                        const player = createAudioPlayer();
            
                        player.play(resource);
                        connection.subscribe(player);
            
                        // Gestion des erreurs de lecture
                        player.on('error', (error) => {
                            console.error('Erreur de lecture audio :', error);
                            interaction.reply('Erreur de lecture de la musique.');
                        });
            
                        player.on(AudioPlayerStatus.Idle, () => {
                            connection.destroy();  // Détruire la connexion quand la musique est terminée
                        });
            
                        return interaction.reply(`Lecture de "${videoInfo.title}" dans votre canal vocal.`);
                    } catch (error) {
                        console.error('Erreur lors de la lecture de la musique:', error);
                        return interaction.reply('Erreur lors de la lecture de la musique.');
                    }
                }

                if (interaction.commandName === 'info') {
                    const package = require('../package.json')
                    const embed = new EmbedBuilder()
                    .setTitle("Info sur Catherine")
                    .addFields(
                        { name: "Nom", value: package.name?.toString() || "Inconnu" },
                        { name: "Développeur", value: package.author?.toString() || "Inconnu" },
                        { name: "Dépendences utilisées", value: package.dependencies ? Object.keys(package.dependencies).join(", ") : "Aucune" },
                        { name: "Description", value: package.description?.toString() || "Aucune description" },
                        { name: "Licence JS", value: package.license?.toString() || "Non spécifiée" },
                        { name: "Fichier principal", value: package.main?.toString() || "Inconnu" },
                        { name: "Scripts", value: package.scripts ? Object.keys(package.scripts).join(", ") : "Aucun" },
                        { name: "Version", value: package.version?.toString() || "Inconnue" },
                        { name: "Patch Note", value: package.patchnote?.toString() || "Inconnue" }
                    )
                    .setColor('DarkGreen');
                    try {
                        await interaction.reply({ embeds: [embed] });
                    } catch (err) { interaction.reply(err), console.log(err)}
                }
                
                if (interaction.commandName === 'pex') {
                    const user = interaction.options.getUser('user');
                    const action = interaction.options.getString('action');
                    const perm = interaction.options.getString('permission');
                    const userId = user.id;
            
                    if (action === 'check') {
                        const userPermissions = [];
            
                        for (const permission in pex) {
                            if (pex[permission] && pex[permission][userId] === true) {
                                userPermissions.push(permission);
                            }
                        }
                        
                        if(pex['*']['userId']) {
                            const embed = new EmbedBuilder()
                                .setTitle(`Cette utilisateur a la permission *.`)
                                .setColor('Blue')
                            return interaction.reply({
                                embeds: [embed],
                                flags: MessageFlags.Ephemeral
                            })
                        }

                        if (userPermissions.length > 0) {
                            const embed = new EmbedBuilder()
                                .setTitle(`Permissions accordées à ${user.tag}`)
                                .setColor('Green')
                                .setDescription(userPermissions.join('\n'))
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            });
                        } else {
                            return interaction.reply({
                                content: `${user.tag} ne possède aucune des permissions spécifiées.`,
                                ephemeral: true
                            });
                        }
                    }
            
                    if (!perm && (action === 'add' || action === 'remove')) {
                        return interaction.reply({ content: '⛔ Vous devez spécifier une permission pour cette action.', ephemeral: true });
                    }
    
                    const bypass = pex['*'][interaction.user.id] === true;
    
                    if ((!pex['ADD_REMOVE_PEX'][user.id] || pex['ADD_REMOVE_PEX'][user.id] === false) &&  (action === 'add' || action === 'remove') && !bypass) {
                        return interaction.reply({ content: "⛔ Vous n'avez pas les permissions nécessaires.", ephemeral: true });
                    }
                    
            
                    if (action === 'add') {
                        if (!pex[perm]) {
                            return interaction.reply({ content: `⛔ La permission ${perm} n'existe pas.`, ephemeral: true });
                        }
            
                        if (perm === 'ADD_REMOVE_PEX' || perm === '*_SHUTDOWN' || perm === '*') {
                            console.log(`⚠️ Demande de modification de 'ADD_REMOVE_PEX' par ${interaction.user.tag} (${interaction.user.id})`);
                            console.log("Confirmer l'action en tapant 'oui' dans la console dans les 30 secondes.");
                        
                            await interaction.reply({ content: "Vous avez demandé un permission sensible. Une requête a été envoyé en console.", ephemeral: true})
    
                            const readline = require('readline');
                            const rl = readline.createInterface({
                                input: process.stdin,
                                output: process.stdout
                            });
                        
                            rl.question(chalk.bgYellow.red("Confirmer (oui/non) : "), (answer) => {
                                if (answer.toLowerCase() === "oui") {
                                    console.log("✅ Action confirmée. Exécution en cours...");
                                        if (pex[perm][userId]) {
                                            return interaction.followUp({ content: `✅ ${user.tag} possède déjà la permission ${perm}.`, ephemeral: true });
                                        }
                                        pex[perm][userId] = true;
                                        savePex()
                                        return interaction.followUp({ content: `✅ Permission ${perm} ajoutée à ${user.tag}.`, ephemeral: true });                  
                                    } else {
                                    console.log("⛔ Action annulée.");
                                    interaction.followUp({ content: "⛔ Modification annulée ou refusée par un développeur.", ephemeral: true });
                                }
                                rl.close();
                            });
                        
                            return;
                        }
                        
    
                        if (pex[perm][userId]) {
                            return interaction.reply({ content: `✅ ${user.tag} possède déjà la permission ${perm}.`, ephemeral: true });
                        }
            
                        pex[perm][userId] = true;
                        savePex()
                        return interaction.reply({ content: `✅ Permission ${perm} ajoutée à ${user.tag}.`, ephemeral: true });
                    }
            
                    if (action === 'remove') {
                        if (!pex[perm]) {
                            return interaction.reply({ content: `⛔ La permission ${perm} n'existe pas.`, ephemeral: true });
                        }
            
                        if (!pex[perm][userId]) {
                            return interaction.reply({ content: `⛔ ${user.tag} ne possède pas la permission ${perm}.`, ephemeral: true });
                        }
            
                        delete pex[perm][userId];
                        savePex()
            
                        return interaction.reply({ content: `✅ Permission ${perm} retirée à ${user.tag}.`, ephemeral: true });
                    }
            
                    savePex()
                    interaction.reply({ content: `✅ Permission ${perm} ${action === 'add' ? 'ajoutée' : 'retirée'} à ${user.tag}.`, ephemeral: true });
                }
    
                if (interaction.commandName === 'userinfo') { // DONE
                    let user = interaction.options.getUser('user');

                    if(!user) {
                        user = interaction.user;
                        console.notify('soft', "Aucun utilisateur inscrit pour /userinfo, il sera pris en compte ", interaction.user.id)
                    }

                    const userId = user.id;
                    const embed = new EmbedBuilder()
                        .setTitle(`📋 **Historique de ${user.username}**`)
                        .setColor('Yellow');
                    let member = interaction.guild.members.cache.get(user.id)
                    embed.addFields({
                        name: 'Informations sur le Client',
                        value: `Tag : **${user.tag}**\nID : **${user.id}**\nNick : **${member.nickname || user.name} **\nArrivé le <t:${Math.floor(parseInt(member?.joinedTimestamp, 10) / 1000)}:R>`
                    })

                    const userPermission = [];
                    for (const permission in pex) {
                        if(pex[permission] && pex[permission][user.id] === true) {
                            userPermission.push(permission)
                        }
                    }
                    if(pex['*'][user.id] === true) {
                        embed.addFields({
                            name: 'Permissions octroyées sur le Client.',
                            value: "Cet utilisateur a la **`Permission '*'`**."
                        })
                    } else {
                        if(userPermission.length > 0) {
                            embed.addFields({
                                name: 'Permissions octroyées sur le Client',
                                value: `**${userPermission.join('\n')}**`
                            })
                        } else {
                            embed.addFields({
                                name: 'Permissions octroyées sur le Client',
                                value: 'Aucune permission sauf les permissions de bases.'
                            })
                        }
                    }

                    if (kickFile[userId]) {
                        const kickList = [];
                        for (let i = 1; i <= kickFile[userId].count; i++) {
                            const kick = kickFile[userId][`kick_0${i}`];
                            kickList.push(`- ${kick.date} | **Raison:** ${kick.reason} | **Auteur:** <@${kick.author}>`);
                        }
                        embed.addFields({ name: `🚫 Kicks (${kickFile[userId].count})`, value: kickList.join("\n"), inline: true });
                    }

                    if (muteFile[userId]) {
                        const muteList = [];
                        for (let i = 1; i <= muteFile[userId].count; i++) {
                            const mute = muteFile[userId][`mute_0${i}`];
                            muteList.push(`- ${mute.date} | **Raison:** ${mute.reason} | **Durée:** ${mute.duration} | **Auteur:** <@${mute.author}>`);
                        }
                        embed.addFields({ name: `🔇 Mutes (${muteFile[userId].count})`, value: muteList.join("\n"), inline: true });
                    }

                    if (banFile[userId]) {
                        const banList = [];
                        for (let i = 1; i <= banFile[userId].count; i++) {
                            const ban = banFile[userId][`ban_0${i}`];
                            banList.push(`- ${ban.date} | **Raison:** ${ban.reason} | **Auteur:** <@${ban.author}> | **Durée:** ${ban.duration}`);
                        }
                        embed.addFields({ name: `❌ Bans (${banFile[userId].count})`, value: banList.join("\n"), inline: true });
                    }

                    if (warnFile[userId]) {
                        const warnList = [];
                        for (let i = 1; i <= warnFile[userId].count; i++) {
                            const warn = warnFile[userId][`warn_0${i}`];
                            warnList.push(`- ${warn.date} | **Raison:** ${warn.mark} | **Auteur:** <@${warn.author}>`);
                        }
                        embed.addFields({ name: `⚠️ Avertissements (${warnFile[userId].count})`, value: warnList.join("\n"), inline: true });
                    }

                    if (!kickFile[userId] && !muteFile[userId] && !banFile[userId] && !warnFile[userId]) {
                        embed.setDescription("✅ Aucun historique trouvé pour cet utilisateur.");
                    }

                    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        
                }
        
                if (interaction.commandName === 'ban') { // DONE
                    const user = interaction.options.getUser('user');
                    const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
                    const temp = interaction.options.getInteger('temp'); 
                    
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                        return interaction.reply({ content: 'Tu n\'as pas la permission de bannir des membres.', ephemeral: true });
                    }
                
                    try {
                        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
                        
                        if (!member) {
                            return interaction.reply({ content: 'Utilisateur introuvable sur le serveur.', ephemeral: true });
                        }
                    
                        try {
                            const dmEmbed = new EmbedBuilder()
                                .setTitle('Tu as été banni')
                                .setDescription(`Tu as été banni du serveur **${interaction.guild.name}**.`)
                                .addFields(
                                    { name: 'Raison', value: reason },
                                    { name: 'Durée', value: temp ? `${temp} jours` : 'Permanent' }
                                )
                                .setColor('RED')
                                .setFooter({ text: 'Respectez les règles pour éviter de nouvelles sanctions.' });
                            
                            await user.send({ embeds: [dmEmbed] });
                        } catch (err) {
                            console.error('Impossible d\'envoyer un MP à l\'utilisateur:', err);
                        }
                    
                        await interaction.guild.members.ban(user, { reason });
                    
                        if (temp) {
                            setTimeout(async () => {
                                try {
                                    await interaction.guild.members.unban(user.id);
                                    console.log(`${user.tag} a été débanni après ${temp} jours.`);
                                } catch (err) {
                                    console.error(`Erreur lors du débannissement de ${user.tag}:`, err);
                                }
                                
                            }, temp * 24 * 60 * 60 * 1000); 
                        }
                    
                        if(!temp) var dur = 'Bannissement définitif' || temp
                        if(dur === 'Bannissement définitif') var isDay = "" || '(day)'
        
                        if (!banFile[user.id]) {
                            banFile[user.id] = {
                                "count": 1,
                                "ban_01": {
                                    "date": new Date().toISOString(),
                                    "reason": reason,
                                    "author": interaction.member.user.id,
                                    "temp": `${dur} ${isDay}`
                                }
                            };
                            saveBan()
                        } else {
                            const count = banFile[user]["count"];
                            const newCount = count + 1;
                            const banTitle = `ban_${newCount}`;
                        
                            banFile[user.id]['count'] = newCount;
                            banFile[user.id][banTitle] = {
                                "date": new Date().toISOString(),
                                "reason": reason,
                                "author": interaction.member.user.id,
                                "temp": `${dur} ${isDay}`
                            };
                            saveBan()
                        }
                    
                        return interaction.reply({ content: `${user.tag} a été banni ${temp ? `pour ${temp} jours` : 'définitivement'}.`, ephemeral: false });
                    
                    } catch (err) {
                        return interaction.reply({ content: `Erreur lors du bannissement de ${user.tag}: ${err.message}`, ephemeral: true });
                    }
                }
        
                if (interaction.commandName === 'send') { // DONE
                    const user = interaction.options.getUser('user');
                    const obj = interaction.options.getString('obj');
                    const msg = interaction.options.getString('msg');
                    const auth = interaction.options.getBoolean('auth') ?? false;
                    
                    const signature = auth ? `
            
            ✉️ **Envoyé par**: ${interaction.user.displayName}` : "";
                    const confirmEmbedDM = new EmbedBuilder()
                        .setTitle("📩 Nouveau message")
                        .setDescription(`**Objet:** ${obj}\n\n${msg}${signature}`)
                        .setColor("#0099ff");
            
                    try {
                        await user.send({ embeds: [confirmEmbedDM] });
                        interaction.reply({ content: "✅ Message envoyé avec succès !", ephemeral: true });
                    } catch (err) {
                        console.error("Impossible d'envoyer ce message à ce membre.", err);
                        interaction.reply({ content: "❌ Impossible d'envoyer le message à cet utilisateur.", ephemeral: true });
                    }
                }
        
                if (interaction.commandName === 'kick') { // DONE
                    const user = interaction.options.getUser('user');
                    const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
                    
                    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
                        return interaction.reply({ content: 'Tu n\'as pas la permission de kicker des membres.', ephemeral: true });
                    }
        
                    try {
                       
        
                        // Envoi du message privé au membre kické
                        try {
                            await user.send(new EmbedBuilder()
                                .setTitle('Tu as été kické')
                                .setDescription(`Tu as été kické du serveur ${interaction.guild.name} pour la raison suivante : ${reason}`)
                                .setColor('DarkRed')
                                .setFooter('Règles du serveur : Respectez-les pour éviter de nouvelles sanctions.'));
                        } catch (err) {
                            console.error('Impossible d\'envoyer un message privé à l\'utilisateur :', err);
                        }
                        await interaction.guild.members.kick(user, { reason: reason });
        
                        if (!kickFile[user.id]) {
                            kickFile[user.id] = {
                                "count": 1,
                                "kick_01": {
                                    "date": new Date().toISOString(),
                                    "reason": reason,
                                    "author": interaction.member.user.id
                                }
                            };
                            saveKick()
                        } else {
                            const count = kickFile[user]["count"];
                            const newCount = count + 1;
                            const kickTitle = `kick_0${newCount}`;
                
                            muteFile[user.id]['count'] = newCount;
                            kickFile[user.id][kickTitle] = {
                                "date": new Date().toISOString(),
                                "reason": reason,
                                "author": interaction.member.user.id
                            };
                            saveKick()
                        }
        
                        return interaction.reply({ content: `${user.tag} a été kické avec succès.`, ephemeral: true });
                    } catch (err) {
                        return interaction.reply({ content: `Erreur lors du kick de ${user.tag}: ${err.message}`, ephemeral: true });
                    }
                }
    
                if (interaction.commandName === 'recruit') { // DONE
    
                    const user = interaction.options.getMember('user');
                    const indicatif = interaction.options.getInteger('indicatif');
                    const nickname = interaction.options.getString('nickname')
    
                    if(!user) {
                        return interaction.reply({ content: "Utilisateur introuvable.", ephemeral: true });
                    }
    
                    const alreadyTaken = indicatifFile.indicatif.includes(indicatif.toString());
    
                    if (alreadyTaken) {
                        return interaction.reply({ content: `L'indicatif ${indicatif} est déjà pris.`, ephemeral: true });
                    }
                    
                    indicatifFile.indicatif.push(indicatif.toString());
                    fs.writeFileSync('./config/indicatif.json', JSON.stringify(indicatifFile, null, 4), 'utf8');
    
                    const newNickname = `11P-${indicatif} | ${RANKS.DEPUTY_TRAINEE.abbr}. ${nickname}`;
                    const DepRole = interaction.guild.roles.cache.get(RANKS.DEPUTY_TRAINEE.id);
                    const ExeBod = interaction.guild.roles.cache.get(CORPS.EXECUTIVE_BODY.id);
                    const LSSDRole = config.role.lssd
    
                    await user.roles.add(DepRole)
                    await user.roles.add(LSSDRole)
                    await user.roles.add(ExeBod)
                    
                    await user.setNickname(newNickname).catch((err) => {console.error(err)});
    
                    console.log(chalk.blueBright(`${user.nickname} a été recruté au sein du LSCSO avec les rôles ${user.roles}`))
                    await interaction.reply({content: `${user.nickname} a correctement été recruté.`, ephemeral: true})
                }
        
                if (interaction.commandName === 'promote') { //DONE
        
                    const member = interaction.options.getMember('user');
                    const rank = interaction.options.getString('grade').toUpperCase();
            
                    if (!member) {
                        return interaction.reply({ content: "Utilisateur introuvable.", ephemeral: true });
                    }
            
                    if (!RANKS[rank]) {
                        return interaction.reply({ content: "Grade invalide.", ephemeral: true });
                    }
            
                    const newRole = interaction.guild.roles.cache.get(RANKS[rank].id);
                    if (!newRole) {
                        return interaction.reply({ content: "Rôle introuvable.", ephemeral: true });
                    }
            
                    // Supprimer les anciens rôles
                    for (const key in RANKS) {
                        const oldRole = interaction.guild.roles.cache.get(RANKS[key].id);
                        if (oldRole && member.roles.cache.has(oldRole.id)) {
                            await member.roles.remove(oldRole);
                        }
                    }
    
                    if(rank === 'SERGEANT') {
                        member.roles.remove(CORPS.EXECUTIVE_BODY.id)
                        member.roles.remove(CORPS.COMMANDEMENT_BODY.id)
                        member.roles.remove(CORPS.DIRECTION_BODY.id)
                        member.roles.add(CORPS.SUPERVISION_BODY.id)
                    }
    
                    if(rank === 'LIEUTENANT') {
                        member.roles.remove(CORPS.EXECUTIVE_BODY.id)
                        member.roles.remove(CORPS.SUPERVISION_BODY.id)
                        member.roles.remove(CORPS.DIRECTION_BODY.id)
                        member.roles.add(CORPS.COMMANDEMENT_BODY.id)
                    }
    
                    if(rank === 'MAJOR') {
                        member.roles.remove(CORPS.EXECUTIVE_BODY.id)
                        member.roles.remove(CORPS.SUPERVISION_BODY.id)
                        member.roles.remove(CORPS.COMMANDEMENT_BODY.id)
                        member.roles.add(CORPS.DIRECTION_BODY.id)
                    }
    
                    await member.roles.add(newRole);
                    
                    // Mettre à jour le pseudo
                    const nickname = member.nickname || member.user.username;
                    const nameParts = nickname.split(" | ");

                    if (nameParts.length === 2) {
                        const identifier = nameParts[0];
                        const afterBar = nameParts[1];

                        // Cherche le grade existant parmi les abbr
                        const abbrList = Object.values(RANKS).map(r => r.abbr);
                        const match = abbrList.find(abbr => afterBar.startsWith(abbr));

                        let nameOnly = afterBar;
                        if (match) {
                            nameOnly = afterBar.slice(match.length).trim(); // supprime l'ancien grade
                        }

                        const newNickname = `${identifier} | ${RANKS[rank].abbr} ${nameOnly}`;
                        await member.setNickname(newNickname).catch(() => {});
                    }

        
                    interaction.reply(`✅ <@${member.id}> a été promu au grade de **${rank}** et son pseudo a été mis à jour !`);
                }
        
                if (interaction.commandName === 'rename') { // DONE
                    const newName = interaction.options.getString('str');
                    try {
                        await interaction.channel.setName(newName);
                        interaction.reply({ content: `✅ Salon renommé en **${newName}** !`, ephemeral: true });
                    } catch (err) {
                        console.error("Erreur lors du renommage du salon.", err);
                        interaction.reply({ content: "❌ Impossible de renommer le salon.", ephemeral: true });
                    }
                }
        
                if (interaction.commandName === 'clear') { // DONE
                    const amount = interaction.options.getInteger('amount');
                
                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
                    }
            
                    if (amount < 1 || amount > 100) {
                        return interaction.reply({ content: "⚠️ Veuillez spécifier un nombre entre 1 et 100.", ephemeral: true });
                    }
            
                    try {
                        await interaction.channel.bulkDelete(amount, true);
                        interaction.reply({ content: `✅ Vous avez supprimé **${amount}** messages.`, ephemeral: true });
                    } catch (err) {
                        console.error("Erreur lors de la suppression des messages.", err);
                        interaction.reply({ content: "❌ Impossible de supprimer les messages. Vérifiez que je dispose des permissions nécessaires.", ephemeral: true });
                    }
                }

                if (interaction.commandName === 'warn') {
                    const author = interaction.user.id;
                    const user = interaction.options.getUser('user'); // 👈 Garde l'objet User
                    const userId = user.id; // Si tu veux toujours stocker l'ID séparément
                    const mark = interaction.options.getString('mark');

                    console.debug(`Avertissement: ${author}, ${userId}, ${mark}`);

                    if (!warnFile[userId]) {
                        warnFile[userId] = {
                            "count": 1,
                            "warn_01": {
                                "date": new Date().toISOString(),
                                "mark": mark,
                                "author": author
                            }
                        };
                    } else {
                        const count = warnFile[userId]["count"] + 1;
                        const warnTitle = `warn_0${count}`;

                        warnFile[userId]['count'] = count;
                        warnFile[userId][warnTitle] = {
                            "date": new Date().toISOString(),
                            "mark": mark,
                            "author": author
                        };
                    }

                    saveWarn();

                    const confirmEmbed = new EmbedBuilder()
                        .setTitle("⚠️ Avertissement")
                        .setDescription(`L'utilisateur a été averti.
                            **Nombre total d'avertissements**: ${warnFile[userId]["count"]}
                            **Raison**: ${mark}`)
                        .setColor("#ffcc00");

                    interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                    console.debug("Member averti")

                    try {
                        await user.send({ // 👈 user est bien un objet User ici
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("🔰 Vous avez été averti.")
                                    .setDescription(`
                    **Nombre total d'avertissement** : ${warnFile[userId]["count"]}
                    **Raison**: ${mark}
                    `).setColor("#ffcc00")
                            ]
                        });
                    } catch (error) {
                        console.error("Impossible d’envoyer le MP :", error);
                    }
                }

                if (interaction.commandName === 'mute') { // DONE
                    const executor = interaction.member; // L'utilisateur qui exécute la commande
                    const user = interaction.options.getUser('user');
                    const reason = interaction.options.getString('reason');
                    const duration = interaction.options.getString('temps');
                    const memberToMute = await interaction.guild.members.fetch(user.id);
            
                    // Vérifications
                    if (!memberToMute) {
                        return interaction.reply({ content: "L'utilisateur n'est pas sur le serveur.", ephemeral: true });
                    }
                    if (memberToMute.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        return interaction.reply({ content: "Vous ne pouvez pas mute un administrateur.", ephemeral: true });
                    }
                    if (executor.roles.highest.position <= memberToMute.roles.highest.position) {
                        return interaction.reply({ content: "Vous ne pouvez pas mute un membre de rang égal ou supérieur au vôtre.", ephemeral: true });
                    }
            
                    // Convertir la durée en millisecondes
                    const timeRegex = /^(\d+)([smhd])$/;
                    const match = duration.match(timeRegex);
                    if (!match) {
                        return interaction.reply({ content: "Format de durée invalide ! Utilisez `10m`, `1h`, `1d`.", ephemeral: true });
                    }
            
                    const timeValue = parseInt(match[1]);
                    const timeUnit = match[2];
                    let timeoutDuration;
            
                    switch (timeUnit) {
                        case 's': timeoutDuration = timeValue * 1000; break;
                        case 'm': timeoutDuration = timeValue * 60 * 1000; break;
                        case 'h': timeoutDuration = timeValue * 60 * 60 * 1000; break;
                        case 'd': timeoutDuration = timeValue * 24 * 60 * 60 * 1000; break;
                        default: return interaction.reply({ content: "Unité de temps invalide.", ephemeral: true });
                    }
            
                    // Appliquer le mute (timeout)
                    try {
                        await memberToMute.timeout(timeoutDuration, reason);
                        await interaction.reply({ content: `✅ ${user} a été mute pour ${duration}. Raison : ${reason}`, ephemeral: false });
        
                        if (!muteFile[user.id]) {
                            muteFile[user.id] = {
                                "count": 1,
                                "mute_01": {
                                    "date": new Date().toISOString(),
                                    "reason": reason,
                                    "author": interaction.member.user.id,
                                    "duration": duration
                                }
                            };
                            saveMute()
                        } else {
                            const count = warnFile[user]["count"];
                            const newCount = count + 1;
                            const muteTitle = `warn_0${newCount}`;
                
                            muteFile[user.id]['count'] = newCount;
                            muteFile[user.id][muteTitle] = {
                                "date": new Date().toISOString(),
                                "reason": reason,
                                "author": interaction.member.user.id,
                                "duration": duration
                            };
                            saveMute()
                        }
        
                    } catch (error) {
                        console.error(error);
                        interaction.reply({ content: "Une erreur est survenue lors du mute.", ephemeral: true });
                    }
                }
        
                if (interaction.commandName === 'shutdown') { // DONE
                    if (!interaction.member.permissions.has('Administrator')) {
                        interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande !", ephemeral: true });
                        return;
                    }
            
                    await interaction.reply({ content: 'Arrêt du bot...', ephemeral: true });
                    console.log("Le bot s'arrête sur commande d'un administrateur.")
                    await process.exit(0); // Arrête le processus du bot
                }
    
                if (interaction.commandName === 'ticket') { // DONE
                    if(config.plugin.ticket_plugin.avaible === true) {
                        if(interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2 || interaction.channel.parentId === config.category.archive) {
        
                            if(interaction.options.getSubcommand() === 'init') {
                                console.log('🎫 Ouverture de ticket demandée !');
        
                                if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                                  const ticketInitEmbed = new EmbedBuilder()
                                    .setTitle("🎟️ Ouvrir un Ticket")
                                    .setDescription("Veuillez choisir le type de ticket à ouvrir. ⚠️ Toute utilisation abusive sera sanctionnée.")
                                    .setColor("Yellow");
                                
                                  const ticketInitButton = new ActionRowBuilder()
                                    .addComponents(
                                      new ButtonBuilder()
                                        .setCustomId('cmd')
                                        .setLabel('👨‍💼 Ticket Commandement')
                                        .setStyle(ButtonStyle.Primary)
                                    )
                                    .addComponents(
                                      new ButtonBuilder()
                                        .setCustomId('dir')
                                        .setLabel('🏢 Ticket Direction')
                                        .setStyle(ButtonStyle.Primary)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                          .setCustomId('recruit')
                                          .setLabel('⛪ Ticket Recrutement')
                                          .setStyle(ButtonStyle.Primary)
                                      )
                                      .addComponents(
                                          new ButtonBuilder()
                                              .setCustomId('plainte')
                                              .setLabel('🔨 Ticket Plainte')
                                              .setStyle(ButtonStyle.Danger)
                                      )
                                
                                  interaction.channel.send({
                                    embeds: [ticketInitEmbed],
                                    components: [ticketInitButton]
                                  });
                                
                                  interaction.reply({
                                    content: "✅ Ticket initialisé !", 
                                    ephemeral: true
                                  });
                                
                                  console.log(`COMMANDE Un /ticket (init) a été exécuté par ${interaction.user.displayName} 🎫`);
                                } else return interaction.reply({
                                    content: ":x: Manque de permission",
                                    flags: MessageFlags.Ephemeral
                                })
                            
                            }
                            if(interaction.options.getSubcommand() === 'close') {
                                console.log('🛑 Fermeture de ticket demandée !');
        
                                const warnClosing = new EmbedBuilder()
                                  .setTitle("🚨 Fermeture de Ticket")
                                  .setDescription("Êtes-vous sûr de vouloir fermer ce ticket ? 🤔")
                                  .setColor('DarkRed');
                                
                                const warnClosingB = new ActionRowBuilder()
                                  .addComponents(
                                    new ButtonBuilder()
                                      .setCustomId('close_but')
                                      .setLabel("🔒 Fermer le ticket")
                                      .setStyle(ButtonStyle.Danger)
                                  );
                                
                                interaction.channel.send({
                                  embeds: [warnClosing], 
                                  components: [warnClosingB]
                                });
                                
                                interaction.reply({
                                  content: "✅ Action effectuée !", 
                                  ephemeral: true
                                });
                                
                                delete ticketFile[interaction.channel.id];
                                saveTicket();
                    
                            }
                            if (interaction.options.getSubcommand() === 'add') {
                                if (interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2) {
                                    const user = interaction.options.getUser('user');
                            
                                    if (user) {
                                        try {            
                                            console.debug("ticket.json avant modification:", ticketFile);
                        
                                            if (!ticketFile[interaction.channel.id]) {
                                                console.debug("Ticket non trouvé, création...");
                                                ticketFile[interaction.channel.id] = { users: [], type: "unknown" };
                                            }
                        
                                            const userids = ticketFile[interaction.channel.id].users;
                        
                                            if (!userids.includes(user.id)) {
                                                console.debug(`Ajout de l'utilisateur ${user.id}...`);
                                                userids.push(user.id);
                                                saveTicket();
                                            } else {
                                                console.debug(`L'utilisateur ${user.id} est déjà dans le ticket.`);
                                            }
                        
                                            console.debug("ticket.json après modification:", ticketFile);
                        
                                            let permissionsArray = userids.map(uid => ({
                                                id: uid,
                                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                                            }));
                        
                                            permissionsArray.push({
                                                id: interaction.guild.roles.everyone,
                                                deny: [PermissionsBitField.Flags.ViewChannel]
                                            });
                        
                                            interaction.channel.permissionOverwrites.set(permissionsArray);
                                            const ticketChannel = interaction.guild.channels.cache.get(config.channel.ticket);
                                            ticketChannel.send({
                                                content: `<@${user.id}>, vous avez été ajouté au channel <#${interaction.channel.id}>`,
                                                flags: MessageFlags.Ephemeral
                                            });

                                            interaction.reply({ content: `Utilisateur ${user.tag} ajouté au ticket.`, ephemeral: true });

                        
                                        } catch (err) {
                                            console.error("Erreur lors de la mise à jour du fichier ticket.json :", err);
                                            interaction.reply({ content: "Erreur lors de la mise à jour du ticket. Vérifiez les logs.", ephemeral: true });
                                        }
                                    }
                                } else {
                                    interaction.reply({ content: "⚠️ Veuillez effectuer la commande dans un ticket.", ephemeral: true });
                                }
                            }      
                            if (interaction.options.getSubcommand() === 'remove') {
                                if (interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2) {
                                    const user = interaction.options.getUser('user');
                            
                                    if (user) {
                                        try {
                                            console.debug("ticket.json avant modification:", ticketFile);
                        
                                            if (!ticketFile[interaction.channel.id]) {
                                                console.debug("Ticket non trouvé, création...");
                                                ticketFile[interaction.channel.id] = { users: [], type: "unknown" };
                                            }
                        
                                            const userids = ticketFile[interaction.channel.id].users;
                        
                                            if (userids.includes(user.id)) {
                                                console.debug(`Suppression de l'utilisateur ${user.id}...`);
                                                ticketFile[interaction.channel.id].users = userids.filter(id => id !== user.id);
                                                saveTicket();
                                            } else {
                                                console.debug(`L'utilisateur ${user.id} n'est pas dans le ticket.`);
                                            }
                        
                                            console.debug("ticket.json après modification:", ticketFile);
                        
                                            let permissionsArray = ticketFile[interaction.channel.id].users.map(uid => ({
                                                id: uid,
                                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                                            }));
                        
                                            permissionsArray.push({
                                                id: interaction.guild.roles.everyone,
                                                deny: [PermissionsBitField.Flags.ViewChannel]
                                            });
                        
                                            interaction.channel.permissionOverwrites.set(permissionsArray);
                        
                                            interaction.reply({ content: `Utilisateur ${user.tag} retiré du ticket.`, ephemeral: true });
                        
                                        } catch (err) {
                                            console.error("Erreur lors de la mise à jour du fichier ticket.json :", err);
                                            interaction.reply({ content: "Erreur lors de la mise à jour du ticket. Vérifiez les logs.", ephemeral: true });
                                        }
                                    }
                                } else {
                                    interaction.reply({ content: "⚠️ Veuillez effectuer la commande dans un ticket.", ephemeral: true });
                                }
                            }
                            if (interaction.options.getSubcommand() === 'lock') {
                                const ticketChannelId = interaction.channel.id;
                                if (!ticketFile[ticketChannelId]) {
                                    return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
                                }
                    
                                const userids = ticketFile[ticketChannelId]['users'];
                                let permissionOverwrites = [
                                    {
                                        id: interaction.guild.roles.everyone.id,
                                        deny: [PermissionsBitField.Flags.ViewChannel]
                                    },
                                    ...userids.map(id => ({
                                        id: id,
                                        allow: [PermissionsBitField.Flags.ViewChannel],
                                        deny: [PermissionsBitField.Flags.SendMessages]
                                    }))
                                ];
                                
                                interaction.channel.permissionOverwrites.set(permissionOverwrites);
                                ticketFile[ticketChannelId]['islock'] = true;
                                saveTicket();
                    
                                const lockedEmbedTicket = new EmbedBuilder()
                                    .setTitle('🔒 Ticket verrouillé !')
                                    .setColor('Red');
                                
                                const unlockButton = new ActionRowBuilder()
                                    .addComponents(new ButtonBuilder()
                                        .setCustomId('unlock')
                                        .setLabel('Déverrouiller le ticket')
                                        .setStyle(ButtonStyle.Success));
                    
                                interaction.channel.send({ embeds: [lockedEmbedTicket], components: [unlockButton] });
                                console.log(`[TICKET] Ticket ID ${interaction.channel.id} verrouillé.`);
                    
                                return interaction.reply({ content: '✅ Le ticket a été verrouillé avec succès !', ephemeral: true });
                            }
                            if (interaction.options.getSubcommand() === 'unlock') {
                                const ticketChannelId = interaction.channel.id;
                                if (!ticketFile[ticketChannelId]) {
                                    return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
                                }
                    
                                const userids = ticketFile[ticketChannelId]['users'];
                                let permissionOverwrites = [
                                    {
                                        id: interaction.guild.roles.everyone.id,
                                        deny: [PermissionsBitField.Flags.ViewChannel]
                                    },
                                    ...userids.map(id => ({
                                        id: id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                                    }))
                                ];
                                
                                interaction.channel.permissionOverwrites.set(permissionOverwrites);
                                ticketFile[ticketChannelId]['islock'] = false;
                                saveTicket();
                    
                                const unlockedEmbedTicket = new EmbedBuilder()
                                    .setTitle('🔓 Ticket déverrouillé !')
                                    .setColor('Yellow');
                    
                                interaction.channel.send({ embeds: [unlockedEmbedTicket] });
                                console.log(`[TICKET] Ticket ID ${interaction.channel.id} déverrouillé.`);
                    
                                return interaction.reply({ content: '✅ Le ticket a été déverrouillé avec succès !', ephemeral: true });                                
                            }
                            if (interaction.options.getSubcommand() === 'info') {
                                const ticketChannelId = interaction.channel.id;
                                if (!ticketFile[ticketChannelId]) {
                                    return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
                                }
                    
                                const ticketData = ticketFile[ticketChannelId];
                                const userMentions = ticketData.users.map(id => `<@${id}>`).join(', ') || "Aucun utilisateur";
                                const ticketAuthTb = interaction.channel.name.split('-');
                    
                                const embed = new EmbedBuilder()
                                    .setTitle(`📌 Information sur le Ticket n°${ticketData.nb}`)
                                    .setDescription(
                                        `👥 **Utilisateurs présents :** ${userMentions}` +
                                        `\n🆔 **Numéro du ticket :** ${ticketData.nb}` +
                                        `\n👤 **Auteur du ticket :** ${ticketData.auth}` +
                                        `\n📌 **Nom du ticket :** ${ticketData.ticketname}` +
                                        `\n📂 **Type du ticket :** ${ticketData.type}` +
                                        `\n🔒 **Verrouillé :** ${ticketData.islock ? "Oui" : "Non"}`
                                    )
                                    .setColor("#00AE86");
                                interaction.reply({ embeds: [embed] });
                            }
                            if (interaction.options.getSubcommand() === 'archive') {
                                interaction.channel.permissionOverwrites.set([
                                    {
                                        id: interaction.guild.roles.everyone, // Bloque tout le monde
                                        deny: [PermissionsBitField.Flags.ViewChannel]
                                    },
                                    ...interaction.channel.permissionOverwrites.cache.map(overwrite => ({
                                        id: overwrite.id,
                                        deny: [PermissionsBitField.Flags.ViewChannel]
                                    }))
                                ]);
                        
                                interaction.channel.setParent(config.category.archive);
                                interaction.reply({ content: "Ticket archivé !", ephemeral: true });
                                ticketFile[interaction.channel.id]['isarchived'] = true;
                                saveTicket();
                                console.log(`Ticket ID ${interaction.channel.id} a été archivé dans la console.`);
                            }
                            if (interaction.options.getSubcommand() === 'rename') {
                                const newName = interaction.options.getString('str');
                                try {
                                    await interaction.channel.setName(newName);
                                    ticketFile[interaction.channel.id]['ticketname'] = newName;
                                    interaction.reply({ content: `✅ Salon renommé en **${newName}** !`, ephemeral: true });
                                } catch (err) {
                                    console.error("Erreur lors du renommage du salon.", err);
                                    interaction.reply({ content: "❌ Impossible de renommer le salon.", ephemeral: true });
                                }
                            }
                        } else {
                            interaction.reply({content: 'Mauvais salon', ephemeral: true})
                            console.error('Mauvais salon')
                        }
                    } else {
                        console.err("Plugin désactivé")
                        interaction.reply({content:"Plugin désactivé", ephemeral: true})
                    }
                }
    
                if (interaction.commandName === 'infoshift') { //DONE
                    const targetUser = interaction.options.getUser('utilisateur');
                    const targetId = targetUser.id;
                    
                    if (!shiftFile[targetId] || Object.keys(shiftFile[targetId]).length === 0) {
                        return interaction.reply({ content: `❌ <@${targetId}> n'a aucun shift enregistré.`, ephemeral: true });
                    }
                    
                    let historyText = Object.entries(shiftFile[targetId])
                        .map(([date, durations]) => `**${date}** : ${durations.join(', ')}`)
                        .join('\n');
                    
                    const embed = new EmbedBuilder()
                        .setTitle(`📊 Historique des shifts de ${targetUser.username}`)
                        .setDescription(historyText)
                        .setColor("Blue");
                    
                    interaction.reply({ embeds: [embed] });
                    
                }
    
                if (interaction.commandName === 'openservice') { // DONE
                    if (interaction.isChatInputCommand()) {
                        const embed = new EmbedBuilder()
                            .setTitle('Qui sera présent ce soir ?')
                            .setDescription('Veuillez indiquer votre présence en appuyant sur un bouton ci-dessous.')
                            .setColor(0x00AE86)
                            .addFields(
                                { name: '✅ Oui', value: 'Aucun', inline: true },
                                { name: '❌ Non', value: 'Aucun', inline: true },
                                { name: '🤔 Peut-être', value: 'Aucun', inline: true }
                            );
                
                        const buttons = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('yes')
                                    .setLabel('✔️ Oui')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('no')
                                    .setLabel('✖️ Non')
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId('maybe')
                                    .setLabel('🤷‍♂️ Peut-être')
                                    .setStyle(ButtonStyle.Secondary)
                            );
                
                        const message = await interaction.reply({ 
                            embeds: [embed], 
                            components: [buttons], 
                            fetchReply: true, // ✅ Permet de récupérer l'ID du message
                            content: "@everyone, qui sera présent ce soir ?" 
                        });
                
                        // Initialisation des données pour ce serveur
                        globalThis.clientData[interaction.guildId] = { 
                            messageId: message.id, 
                            participants: { yes: [], no: [], maybe: [] }
                        };
                
                        console.log("✅ Données stockées :", globalThis.clientData[interaction.guildId]);
                
                        // Récupération des participants correctement
                        const participants = globalThis.clientData[interaction.guildId].participants;
                
                        // Mise à jour du fichier config.json
                        config.openservice_participants = { 
                            yes: participants.yes, 
                            no: participants.no, 
                            maybe: participants.maybe 
                        };
                        
                        config.openservice_last_id = message.id;
                
                        fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4), 'utf8');
                
                        console.log("✅ Données écrites dans config.json :", JSON.stringify(globalThis.clientData[interaction.guildId], null, 4));
                    }
                }
    
                if (interaction.commandName === 'help') { // DONE
                    const commandRequested = interaction.options.getString('commandes');
                    console.log("Commande demandée:", commandRequested);
                
                    const normalizedCmd = commandRequested?.trim().toLowerCase();
                    console.log("Commande normalisée:", normalizedCmd);
                    
                    console.log("Clés disponibles:", Object.keys(DESC_COMMAND).toString());
                
                    if (normalizedCmd && DESC_COMMAND[normalizedCmd]) {
                        const commandEmbed = new EmbedBuilder()
                            .setTitle(`📜 Aide pour la commande /${normalizedCmd}`)
                            .setDescription(` ${DESC_COMMAND[normalizedCmd]} \nPermission requise : **${PEX[normalizedCmd]}**`)
                            .setColor("Blue")
                            .setFooter({ text: "Utilisez chaque commande avec '/' suivi du nom de la commande." });
                
                        return interaction.reply({ embeds: [commandEmbed], ephemeral: true }); // Ajout du return
                    } 

                    if(commandRequested === 'false') {
                        const helpEmbed = new EmbedBuilder()
                        .setTitle("📜 Liste des commandes disponibles")
                        .setDescription("Voici la liste des commandes que vous pouvez utiliser sur ce serveur :")
                        .setColor("Blue")
                        .addFields(Object.entries(DESC_COMMAND).map(([name, desc]) => ({ name: `/${name}`, value: desc })))
                        .setFooter({ text: "Utilisez chaque commande avec '/' suivi du nom de la commande." });
                
                        return interaction.reply({ embeds: [helpEmbed], ephemeral: true }); // Ajout du return
                    }
                
                    const helpEmbed = new EmbedBuilder()
                        .setTitle("📜 Liste des commandes disponibles")
                        .setDescription("Voici la liste des commandes que vous pouvez utiliser sur ce serveur :")
                        .setColor("Blue")
                        .addFields(Object.entries(DESC_COMMAND).map(([name, desc]) => ({ name: `/${name}`, value: desc })))
                        .setFooter({ text: "Utilisez chaque commande avec '/' suivi du nom de la commande." });
                
                    return interaction.reply({ embeds: [helpEmbed], ephemeral: true }); // Ajout du return
                }
                
                if (interaction.commandName === 'shift') {//DONE
                    
                    const userId = interaction.user.id;
                    const now = Date.now();
        
                    const dateKey = `service du ${new Date().toISOString().split('T')[0]}`;
                    
                    if (!shiftFile[userId]) {
                        shiftFile[userId] = {};
                    }
                    
                    if (shiftFile[userId].start) {

                        await interaction.deferReply({content: 'Thinking :)', flags: MessageFlags.Ephemeral})

                        const startTime = shiftFile[userId].start;
                        const durationMs = now - startTime;
                        const durationSec = Math.floor(durationMs / 1000);
                        const hours = Math.floor(durationSec / 3600);
                        const minutes = Math.floor((durationSec % 3600) / 60);
                        const seconds = durationSec % 60;
                        
                        // const durationMsg = ;
                        
                        const durationMsg = new EmbedBuilder()
                            .setTitle("🚨 Fin de service")
                            .setDescription(`⏳ <@${userId}> a terminé son shift après **${hours}h ${minutes}m ${seconds}s** !`)
                            .setColor('Red').setTimestamp()
    
                        if (!shiftFile[userId][dateKey]) {
                            shiftFile[userId][dateKey] = [];
                        }
                        shiftFile[userId][dateKey].push(`${hours}h ${minutes}m ${seconds}s`);
                        
                        delete shiftFile[userId].start;
    
                        saveShift()

                        await interaction.channel.send({embeds: [durationMsg]})
                        await interaction.editReply({content: "Good ! ", flags: MessageFlags.Ephemeral});
                    } else {
                        shiftFile[userId].start = now;
                        saveShift()                    
                    
                        const embed = new EmbedBuilder()
                            .setTitle("🚨 Début de service")
                            .setDescription(`✅ <@${userId}> a commencé son service !`)
                            .setColor("Green");
                        await interaction.channel.send({ embeds: [embed] });
                        await interaction.reply({content: "Good ! ", flags: MessageFlags.Ephemeral})
                    }
                }
            }
        }
    }
    console.log("L'interaction ", chalk.green('commands.js'), chalk.reset(" ont correctement été exporté."))
} catch (err) {
    console.error("[FATAL_ERROR] Les commandes n'ont pas été exporté correctement. Le processus va s'arrêter., ", err)
    process.exit(0);
};