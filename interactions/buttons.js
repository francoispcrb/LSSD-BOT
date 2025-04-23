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
const { ButtonBuilder, ButtonStyle, MessageFlags, Message } = require('discord.js')
const { PermissionsBitField } = require('discord.js')
const { ThreadAutoArchiveDuration } = require('discord.js')
const { ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js')
const { ActivityType } = require('discord.js')

const { saveBan, saveConfig, saveKick, saveMute, saveShift, saveTicket, saveWarn } = require('../functions')
const { RANKS, CORPS, commands } = require('../utils')
const { sendLog } = require('..');

var nbTicket = config.plugin.ticket_plugin.var

try {
    module.exports = {
        name: 'interactionCreate',
        async executeButtons(interaction) {
            
            if (interaction.isButton()) {
                const closeTicketEmbed = new EmbedBuilder()
                .setTitle(`Bienvenue dans votre ticket ${interaction.user.tag} ! `)
                .setDescription(`Bonjour, bienvenue dans votre espace. Nous vous prions de bien vouloir patienter le temps que nos équipes prennent en compte votre demande. À votre service <@${interaction.user.id}> !`)
                .setColor("DarkButNotBlack")
                const closeTicketButton = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setCustomId('close_but')
                    .setLabel("Fermer le ticket")
                    .setStyle(ButtonStyle.Danger))
                .addComponents(new ButtonBuilder()
                    .setCustomId('lock')
                    .setLabel("Vérouiller le ticket.")
                    .setStyle(ButtonStyle.Secondary))
                .addComponents(new ButtonBuilder()
                .setCustomId('archive')
                .setLabel("Permet d'archiver le ticket.")
                .setStyle(ButtonStyle.Success))
        
                if (interaction.customId === 'yes' || interaction.customId === 'no' || interaction.customId === 'maybe') {
                    console.log("🔵 Interaction détectée :", interaction.customId);
                
                    const clientData = globalThis.clientData[interaction.guildId];
                
                    let messageId;
                    let participants;
                
                    if (!clientData) {
                        console.log("🔴 Pas de clientData trouvé, utilisation de config !");
                        messageId = config.openservice_last_id;
                        participants = config.openservice_participants;
                    } else {
                        console.log("🟢 clientData trouvé :", clientData);
                        messageId = clientData.messageId;
                        participants = clientData.participants;
                    }
                
                    console.log("📌 ID du message enregistré :", messageId);
                    console.log("📌 ID du message de l'interaction :", interaction.message.id);
                
                    if (interaction.message.id !== messageId) {
                        console.log("🔴 Le message de l'interaction ne correspond pas !");
                        return;
                    }
                
                    console.log("🟢 Avant modification des participants :", participants);
                
                    // Mise à jour des participants
                    const username = interaction.user.tag;
                    const category = interaction.customId;
                
                    const wasInCategory = participants[category].includes(username);
                
                    if (wasInCategory) {
                        // Si l'utilisateur était déjà dans cette catégorie, on le retire (annulation du choix)
                        participants[category] = participants[category].filter(user => user !== username);
                    } else {
                        // Sinon, on le retire des autres catégories et on l'ajoute à celle-ci
                        for (const key in participants) {
                            participants[key] = participants[key].filter(user => user !== username);
                        }
                        participants[category].push(username);
                    }
                
                    console.log("🟢 Après modification des participants :", participants);
                
                    // Création de l'embed mis à jour
                    const updatedEmbed = new EmbedBuilder()
                        .setTitle('Qui sera présent ce soir ?')
                        .setDescription('Veuillez indiquer votre présence en appuyant sur un bouton ci-dessous.')
                        .setColor(0x00AE86)
                        .addFields(
                            { name: '✅ Oui', value: participants.yes.length ? participants.yes.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true },
                            { name: '❌ Non', value: participants.no.length ? participants.no.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true },
                            { name: '🤔 Peut-être', value: participants.maybe.length ? participants.maybe.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true }
                        );
                
                    console.log("🟢 Embed mis à jour :", updatedEmbed);
                
                    await interaction.deferUpdate();
                    await interaction.editReply({ content: "@everyone, qui sera présent ce soir ?", embeds: [updatedEmbed] });
                
                    // Mise à jour du fichier config.json
                    config.openservice_participants = {
                        yes: participants.yes,
                        no: participants.no,
                        maybe: participants.maybe
                    };
                    config.openservice_last_id = messageId;
                
                    fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4), 'utf8');
                
                    // Gestion du thread
                    const threadName = `Présents - ${new Date().toLocaleDateString()}`;
                    let thread = interaction.message.channel.threads.cache.find(t => t.name === threadName);
                
                    if (category === 'yes') {
                        if (!thread) {
                            thread = await interaction.message.startThread({
                                name: threadName,
                                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                            });
                        }
                        if (participants.yes.includes(username)) {
                            try {
                                await thread.members.add(interaction.user.id);
                            } catch (error) {
                                console.error("⚠️ Impossible d'ajouter l'utilisateur au thread :", error);
                            }
                        } else {
                            try {
                                await thread.members.remove(interaction.user.id);
                            } catch (error) {
                                console.error("⚠️ Impossible de retirer l'utilisateur du thread :", error);
                            }
                        }
                    } else if (wasInCategory && thread) {
                        // Retirer l'utilisateur du thread s'il était dans "Oui" et change de catégorie
                        try {
                            await thread.members.remove(interaction.user.id);
                        } catch (error) {
                            console.error("⚠️ Impossible de retirer l'utilisateur du thread :", error);
                        }
                    }
                }

                const roleMap = {
                    'role_gov': config.role.gov,
                    'role_lspd': config.role.lspd,
                    'role_lsmc': config.role.lsmc,
                    'role_doj': config.role.doj,
                    'wazel_news': config.role.wazel
                };

                if (roleMap[interaction.customId]) {
                    const roleId = roleMap[interaction.customId];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return interaction.reply({
                            content: "Le rôle spécifié est introuvable.",
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    const member = interaction.member;

                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(role);
                        return interaction.reply({
                            content: "Votre rôle vous a été retiré.",
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        await member.roles.add(role);
                        return interaction.reply({
                            content: "Votre rôle vous a été ajouté.",
                            flags: MessageFlags.Ephemeral
                        });
                    }
                }

                if(interaction.customId === 'cmd'){
                    console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`)
        
                    nbTicket++;
                    console.log(nbTicket);
                    config["plugin"]['ticket_plugin']['var'] = nbTicket
                    saveConfig()
                    interaction.guild.channels.create({
                        name: `${interaction.customId}-${interaction.user.tag}`,
                        parent: config.category.ticket2,
                        permissionOverwrites:[
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: config.role.cmd,
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            }
                        ]
                    }).then(channel => {
                        console.log('[ACTION BUTTON] New channel create')
        
                        ticketFile[channel.id] = {
                            "users": [interaction.user.id],
                            "auth": interaction.user.displayName,
                            "type": interaction.customId,
                            "ticketname": channel.name,
                            "islock": false,
                            "isarchived": false,
                            "nb": config.plugin.ticket_plugin.var
        
                        }
                        saveTicket()
        
                        channel.send({embeds: [closeTicketEmbed], components: [closeTicketButton]})
                        interaction.reply({content: `Done ! Vous pouvez acceder à votre espace ici : <#${channel.id}>`, ephemeral:true})
                    })
                }
        
                if (interaction.customId === 'recruit') {
                    console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`);
                
                    try {
                        const modal = new ModalBuilder()
                            .setCustomId('recruit_modal')
                            .setTitle('Formulaire de Recrutement');
                
                        const nameInput = new TextInputBuilder()
                            .setCustomId('roleplay_name')
                            .setLabel('Nom (Rôleplay)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);
                
                        const firstNameInput = new TextInputBuilder()
                            .setCustomId('roleplay_firstname')
                            .setLabel('Prénom (Rôleplay)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);
                
                        const birthDateInput = new TextInputBuilder()
                            .setCustomId('roleplay_birthdate')
                            .setLabel('Date de naissance (Rôleplay)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);
                
                        const nationalityInput = new TextInputBuilder()
                            .setCustomId('roleplay_nationality')
                            .setLabel('Nationalité (Rôleplay)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);
        
                        const specialUnitInput = new TextInputBuilder()
                            .setCustomId('roleplay_unit')
                            .setLabel("Indiquez l'unité spéciale voulue.")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false);
                
                        modal.addComponents(
                            new ActionRowBuilder().addComponents(nameInput),
                            new ActionRowBuilder().addComponents(firstNameInput),
                            new ActionRowBuilder().addComponents(birthDateInput),
                            new ActionRowBuilder().addComponents(nationalityInput),
                            new ActionRowBuilder().addComponents(specialUnitInput)
                        );
                
                        console.log("📩 Affichage du modal...");
                        await interaction.showModal(modal);
                
                    } catch (err) {
                        console.error("❌ Erreur lors de l'affichage du modal :", err);
                        return interaction.reply({ content: "❌ Une erreur est survenue, veuillez réessayer.", ephemeral: true });
                    }
                }

                if (interaction.customId === 'plainte') {
                    console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`);

                    try {
                        const modal = new ModalBuilder()
                            .setCustomId('complaint_modal')
                            .setTitle('Formulaire de plainte');

                        const nameInput = new TextInputBuilder()
                            .setCustomId('complain_name')
                            .setLabel('Nom (Plaignant)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);

                        const firstNameInput = new TextInputBuilder()
                            .setCustomId('complain_firstname')
                            .setLabel('Prénom (Plaignant)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);

                        const emailInput = new TextInputBuilder()
                            .setCustomId('complain_email')
                            .setLabel('Mail (Votre Discord)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);

                        const dateInput = new TextInputBuilder()
                            .setCustomId('complain_date')
                            .setLabel('Date de plainte')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);

                        const motifInput = new TextInputBuilder()
                            .setCustomId('complain_motif')
                            .setLabel("Indiquez un motif.")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true);

                        modal.addComponents(
                            new ActionRowBuilder().addComponents(nameInput),
                            new ActionRowBuilder().addComponents(firstNameInput),
                            new ActionRowBuilder().addComponents(emailInput),
                            new ActionRowBuilder().addComponents(dateInput),
                            new ActionRowBuilder().addComponents(motifInput)
                        );

                        console.log("📩 Affichage du modal...");
                        await interaction.showModal(modal);

                    } catch (err) {
                        console.error("❌ Erreur lors de l'affichage du modal :", err);
                        return interaction.reply({ content: "❌ Une erreur est survenue, veuillez réessayer.", ephemeral: true });
                    }
                }
        
                if(interaction.customId === 'dir'){
                    console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`)
        
                    nbTicket++;
                    interaction.guild.channels.create({
                        name: `${interaction.customId}-${interaction.user.tag}`,
                        parent: config.category.ticket2,
                        permissionOverwrites:[
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: config.role.dir,
                                allow: [PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            }
                        ]
                        
                    }).then(channel => {
        
                        ticketFile[channel.id] = {
                            "users": [interaction.user.id],
                            "auth": interaction.user.displayName,
                            "type": interaction.customId,
                            "ticketname": channel.name,
                            "islock": false,
                            "isarchived": false,
                            "nb": config.plugin.ticket_plugin.var
                        }
                        saveTicket()
        
                        console.log('[ACTION BUTTON] New channel create')
        
        
                        channel.send({embeds: [closeTicketEmbed], components: [closeTicketButton]})
                        interaction.reply({content: `Done ! Vous pouvez acceder à votre espace ici : <#${channel.id}>`, ephemeral:true})
                    })
                }

                if(interaction.customId === 'close_but'){
                    if (interaction.member.permissions.has(PermissionsBitField.Flags.AddReactions)) {
                        interaction.channel.delete();
                        delete ticketFile[interaction.channel.id];
                        saveTicket();
                        
                        console.notify("soft", "🗑️ [ACTION BUTTON] : Ticket supprimé avec succès.");
                    
                    } else {
                        interaction.reply({
                            content: "⛔ **Accès refusé !** Vous n'avez pas les permissions nécessaires pour supprimer ce ticket.",
                            ephemeral: true
                        });
                    }
                    
        
                }
        
                if(interaction.customId === 'lock') {
                    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        const userids = ticketFile[interaction.channel.id]['users']; // Tableau d'IDs utilisateur
        
                        let permissionOverwrites = [
                            {
                                id: interaction.guild.roles.everyone.id, // Bloque @everyone
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            ...userids.map(id => ({
                                id: id,
                                allow: [PermissionsBitField.Flags.ViewChannel], // Seuls les utilisateurs listés peuvent voir le channel
                                deny: [PermissionsBitField.Flags.SendMessages] // Mais ne peuvent pas envoyer de messages
                            }))
                        ];
        
                        interaction.channel.permissionOverwrites.set(permissionOverwrites);
        
                        ticketFile[interaction.channel.id]['islock'] = true
                        saveTicket()
                        console.log(`Ticket ID ${interaction.channel.id} a été vérouillé dans la console.`)
        
                        const lockedEmbedTicket = new EmbedBuilder()
                .setTitle("🔒 Ticket verrouillé !")
                .setDescription("Ce ticket a été verrouillé. Seul le personnel autorisé peut désormais y accéder.")
                .setColor("Yellow");
        
                const unlockedButtonTicket = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("unlock")
                        .setLabel("🔓 Déverrouiller le ticket")
                        .setStyle(ButtonStyle.Success)
                );
        
                        interaction.channel.send({embeds: [lockedEmbedTicket], components:[unlockedButtonTicket]})
                        console.log("[TICKET] Ticket Vérouillé")
                        // channelLog.send({embeds: [lockedEmbedTicket]})
        
                        interaction.reply({content: 'Done !', ephemeral:true}) 
                    } else {
                            interaction.reply({content:"Vous n'avez pas la permission !", ephemeral:true})
        
                    }
                }
        
                if(interaction.customId === 'unlock'){
                    if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        const userids = ticketFile[interaction.channel.id]['users']; // Tableau d'IDs utilisateur
        
                        let permissionOverwrites = [
                            {
                                id: interaction.guild.roles.everyone.id, // Bloque @everyone
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            ...userids.map(id => ({
                                id: id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Seuls les utilisateurs listés peuvent voir le channel
                            }))
                        ];
                
                        interaction.channel.permissionOverwrites.set(permissionOverwrites);
                
                        ticketFile[interaction.channel.id]['islock'] = false
                        saveTicket()
                        console.log(`Ticket ID ${interaction.channel.id} a été dévérouillé dans la console.`)
        
        
                        const unlockedEmbedTicket = new EmbedBuilder()
                        .setTitle("🔓 Ticket déverrouillé !")
                        .setDescription("Ce ticket est à nouveau accessible. Vous pouvez continuer la conversation.")
                        .setColor("Yellow");
                    
                        interaction.channel.send({embeds: [unlockedEmbedTicket]})
                        //channelLog.send({embeds: [unlockedEmbedTicket]})
                        console.log("[TICKET] Ticket dévérouillé")
        
                        interaction.reply({content: 'Done !', ephemeral:true}) 
                    } else {
                        interaction.reply({content:"Vous n'avez pas la permission !", ephemeral:true})
        
                    }
                }
        
                if (interaction.customId === 'archive') {
                    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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
                    } else {
                        interaction.reply({ content: "Vous n'avez pas la permission !", ephemeral: true });
                    }
                }  
            }
        }
    }
    console.log("L'interaction ", chalk.green('buttons.js'), chalk.reset(" ont correctement été exporté."))

} catch (err) {
    console.error("[FATAL_ERROR] Les boutons n'ont pas été exporté correctement. Le processus va s'arrêter., ", err)
    process.exit(0); // Arrête le processus du bot
};