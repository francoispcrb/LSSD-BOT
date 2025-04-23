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
const { RANKS, CORPS, commands } = require('../utils')
const { sendLog } = require('..');

var nbTicket = config.plugin.ticket_plugin.var

try {
    module.exports = {
        name: 'interactionCreate',
        async executeModal(interaction) {
            
            if (interaction.isModalSubmit()) {
                if(interaction.customId === 'recruit_modal') {
                    console.log("📩 Formulaire soumis par :", interaction.user.tag);
            
                try {
                    // 🔹 Récupérer les valeurs du formulaire
                    const name = interaction.fields.getTextInputValue('roleplay_name');
                    const firstName = interaction.fields.getTextInputValue('roleplay_firstname');
                    const birthDate = interaction.fields.getTextInputValue('roleplay_birthdate');
                    const nationality = interaction.fields.getTextInputValue('roleplay_nationality');
                    const speicalUnit = interaction.fields.getTextInputValue('roleplay_unit')
            
                    console.log("✅ Données reçues :", { name, firstName, birthDate, nationality });
            
                    // 🔹 Vérifier que la catégorie des tickets est bien définie
                    console.log("🛠️ Catégorie de ticket :", config.category.ticket2);
                    if (!config.category.ticket2) {
                        console.error("❌ La catégorie des tickets n'est pas définie !");
                        return interaction.reply({ content: "❌ Erreur interne : catégorie de ticket manquante.", ephemeral: true });
                    }
            
                    // 🔹 Création du ticket (salon)
                    nbTicket++;
                    config["plugin"]['ticket_plugin']['var'] = nbTicket;
                    saveConfig();
            
                    console.log("📂 Création du salon en cours...");
            
                    const channel = await interaction.guild.channels.create({
                        name: `recruit-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: config.category.ticket2,
                        permissionOverwrites: [
                            { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                            { id: config.role.spv, allow: [PermissionsBitField.Flags.ViewChannel] },
                            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }
                        ]
                    });
            
                    console.log(`✅ Salon créé : ${channel.name} (${channel.id})`);
            
                    // 🔹 Stocker les infos du ticket
                    ticketFile[channel.id] = {
                        users: [interaction.user.id],
                        type: interaction.customId,
                        ticketname: channel.name,
                        islock: false,
                        isarchived: false,
                        nb: config.plugin.ticket_plugin.var
                    };
                    saveTicket();
            
                    // 🔹 Création de l'embed contenant les infos du candidat
                    const embed = new EmbedBuilder()
                        .setTitle("Nouvelle Candidature 📩")
                        .setColor("Blue")
                        .addFields(
                            { name: "👤 Nom", value: name, inline: true },
                            { name: "📝 Prénom", value: firstName, inline: true },
                            { name: "📅 Date de naissance", value: birthDate, inline: false },
                            { name: "🌍 Nationalité", value: nationality, inline: false },
                            { name: "📌 Candidat", value: `<@${interaction.user.id}>`, inline: false },
                            { name: "📚 Unité spéciale désiré", value: speicalUnit || "Aucune unitée spécifiée.", inline: false}
                        )
                        .setTimestamp()
                        .setFooter({ text: "Système de recrutement", iconURL: interaction.user.displayAvatarURL() });
            
                    const closeTicketEmbed = new EmbedBuilder()
                        .setTitle(`Bienvenue dans votre ticket ${interaction.user.tag} ! `)
                        .setDescription(`Ci dessous des boutons vous permettant de contrôler le ticket ! À votre service <@${interaction.user.id}> !`)
                        .setColor("Red")
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
    
                        if(speicalUnit) {
                            const warnUnitEmbed = new EmbedBuilder()
                            .setTitle(`⚠️ Attention ${interaction.user.tag}`)
                            .setDescription("Si vous avez ci-joint **renseigné une unitée spéciale**, il faudra vous soumettre à d'autre **conditions** au recrutement. "
                                +"\nEn effet, **votre admission dans l'unité** dépend de la **décision ultime du Commander** de l'unité dont vous désirez l'intégration."
                                +"\nVous devrez vous soumettre à une **enquête interne** opérée par les *affaires l'internes*, par le *corps de direction* et le *corps de commandement*."
                                +"\nCela signifie que vous devez être **apte juridiquement** et par conséquent appartenir au LSSD depuis un **certain temps**."
                                +"\n"
                                +"\nSi vous venez d'intégrer le LSSD ou même que ce ticket est voué à votre recrutement au sein du LSSD, votre réponse dans la catégorie **'Unité Spéciale'** est **caduque** et est **voué à un refus**."
                            )
                            .setColor('Yellow')
                            await channel.send({ embeds: [embed, closeTicketEmbed, warnUnitEmbed], components: [closeTicketButton] });

                        }
    
                        await channel.send({ embeds: [embed, closeTicketEmbed], components: [closeTicketButton] });
                        await interaction.reply({ content: `✅ Votre candidature a été envoyée avec succès ! Un ticket a été ouvert ici : <#${channel.id}>`, ephemeral: true });
            
                    } catch (err) {
                        console.error("❌ Erreur lors du traitement du formulaire :", err);
                        await interaction.reply({ content: "❌ Une erreur est survenue lors de la création du ticket.", ephemeral: true });
                    }
                }

                if(interaction.customId === 'complaint_modal') {
                    console.log("📩 Formulaire de plainte soumis par :", interaction.user.tag);

                    try {
                        // 🔹 Récupérer les valeurs du formulaire
                        const name = interaction.fields.getTextInputValue('complain_name');
                        const firstName = interaction.fields.getTextInputValue('complain_firstname');
                        const email = interaction.fields.getTextInputValue('complain_email');
                        const date = interaction.fields.getTextInputValue('complain_date');
                        const motif = interaction.fields.getTextInputValue('complain_motif')

                        console.log("✅ Données reçues :", { name, firstName, email, date, motif });

                        // 🔹 Vérifier que la catégorie des tickets est bien définie
                        console.log("🛠️ Catégorie de ticket :", config.category.ticket2);
                        if (!config.category.ticket2) {
                            console.error("❌ La catégorie des tickets n'est pas définie !");
                            return interaction.reply({ content: "❌ Erreur interne : catégorie de ticket manquante.", ephemeral: true });
                        }

                        // 🔹 Création du ticket (salon)
                        nbTicket++;
                        config["plugin"]['ticket_plugin']['var'] = nbTicket;
                        saveConfig();

                        console.log("📂 Création du salon en cours...");

                        const channel = await interaction.guild.channels.create({
                            name: `plainte-${interaction.user.username}`,
                            type: ChannelType.GuildText,
                            parent: config.category.ticket2,
                            permissionOverwrites: [
                                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                                { id: config.role.spv, allow: [PermissionsBitField.Flags.ViewChannel] },
                                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }
                            ]
                        });

                        console.log(`✅ Salon créé : ${channel.name} (${channel.id})`);

                        // 🔹 Stocker les infos du ticket
                        ticketFile[channel.id] = {
                            users: [interaction.user.id],
                            type: interaction.customId,
                            ticketname: channel.name,
                            islock: false,
                            isarchived: false,
                            nb: config.plugin.ticket_plugin.var
                        };
                        saveTicket();

                        // 🔹 Création de l'embed contenant les infos du candidat
                        const embed = new EmbedBuilder()
                            .setTitle("Nouvelle plainte 📩")
                            .setColor("Blue")
                            .addFields(
                                { name: "👤 Nom", value: name, inline: true },
                                { name: "📝 Prénom", value: firstName, inline: true },
                                { name: "📅 Email du plaignant", value: email, inline: false },
                                { name: "🌍 Date", value: date, inline: false },
                                { name: "📌 Plaignant", value: `<@${interaction.user.id}>`, inline: false },
                                { name: "📚 Motif", value: motif || "Aucun motif valide.", inline: false}
                            )
                            .setTimestamp()
                            .setFooter({ text: "Système de recrutement", iconURL: interaction.user.displayAvatarURL() });

                        const closeTicketEmbed = new EmbedBuilder()
                            .setTitle(`Bienvenue dans votre ticket ${interaction.user.tag} ! `)
                            .setDescription(`Ci dessous des boutons vous permettant de contrôler le ticket ! À votre service <@${interaction.user.id}> !`)
                            .setColor("Red")
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

                        await channel.send({ embeds: [embed, closeTicketEmbed], components: [closeTicketButton] });
                        await interaction.reply({ content: `✅ Votre plainte a été envoyée avec succès ! Un ticket a été ouvert ici : <#${channel.id}>`, ephemeral: true });

                    } catch (err) {
                        console.error("❌ Erreur lors du traitement du formulaire :", err);
                        await interaction.reply({ content: "❌ Une erreur est survenue lors de la création du ticket.", ephemeral: true });
                    }
                }
            }
        }
    }
    console.log("L'interaction ", chalk.green('modals.js'), chalk.reset(" ont correctement été exporté."))

} catch (err) {
    console.error("[FATAL_ERROR] Les modals n'ont pas été exporté correctement. Le processus va s'arrêter., ", err)
    process.exit(0); // Arrête le processus du bot
}