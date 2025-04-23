const Discord = require('discord.js');
const chalk = require("chalk");
const fs = require('fs');

const intents = new Discord.IntentsBitField(53608447);
const Client = new Discord.Client({ intents });

if (!globalThis.clientData) {
    globalThis.clientData = {}; // Initialise un objet global
}

// Importation des fichiers de configuration
const pex = require('../config/pex.json');
const shiftFile = require('../config/shift.json')
const {saveFile} = require('../functions')
// Importation des modules Discord.js
const { 
    EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

// Importation des fonctions et utilitaires
const { PEX } = require('../utils');
const { sendLog } = require('..');
const { executeCommands } = require('../interactions/commands');
const { executeButtons } = require('../interactions/buttons');
const { executeModal } = require('../interactions/modals');
const config = require("../config/config.json");
const register = require("../config/register.json");


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            await executeButtons(interaction);
            await executeModal(interaction);
        } catch (err) {
            interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de l'intéraction. Erreur : ${err}`,
                ephemeral: true
            });
        }

        if (interaction.isCommand()) {
            const embed = new EmbedBuilder()
                .setTitle("📜 Commande exécutée")
                .setColor("Blue")
                .addFields(
                    { name: "Utilisateur", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "Commande", value: `\`${interaction.commandName}\``, inline: true },
                    { name: "Salon", value: `<#${interaction.channel.id}>`, inline: true }
                )
                .setTimestamp();

            sendLog(embed);
            console.log(chalk.blueBright("[COMAND]"), chalk.green(interaction.user.tag), chalk.reset("a éxécuté la commande "), chalk.green(interaction.commandName || null), chalk.reset("dans"), chalk.green(interaction.channel.name))


            try {
                if (!PEX) throw new Error("❌ PEX est undefined !");
                if (!pex) throw new Error("❌ pex.json est undefined !");
                
                const commandName = interaction.commandName.toLowerCase();
                const requiredPermission = PEX[commandName];
                
                if (pex['*'][interaction.user.id] === true) {
                  console.log(chalk.bgGreen(`✅ Utilisateur ${interaction.user.id} bypass les permissions.`));
                  return await executeCommands(interaction);
                }


                const commandInPex = PEX[interaction.commandName]

                if(pex[commandInPex]===0) {
                  console.log(chalk.green(`La commande ${interaction.commandName} ne requiert pas de permission.`));
                  return await executeCommands(interaction);
                }


                if (!requiredPermission) {
                    console.error(`⚠️ Erreur : Aucune permission définie pour la commande "${commandName}".`);
                    await interaction.reply({ content: "🚫 Cette commande n'est pas configurée dans PEX.", ephemeral: true });
                } else if (!(requiredPermission in pex)) {
                    console.error(`⚠️ Erreur : La permission "${requiredPermission}" n'existe pas dans pex.json.`);
                    await interaction.reply({ content: "🚫 Cette permission n'existe pas.", ephemeral: true });
                } else {
                    const userHasPermission = pex[requiredPermission][interaction.user.id] === true;

                    if (!userHasPermission) {
                        console.log(`🚫 L'utilisateur ${interaction.user.id} n'a pas la permission "${requiredPermission}".`);
                        await interaction.reply({ content: `🚫 Tu n'as pas la permission d'utiliser cette commande. Tu dois avoir la permission ${requiredPermission}.`, ephemeral: true });
                    } else {
                        console.log(`✅ Permission accordée à ${interaction.user.id} pour la commande "${commandName}".`);
                        await executeCommands(interaction);
                    }
                }
            } catch (err) {
                await interaction.deferReply({content: err})
                console.error("❌ Erreur critique :", err);
                await interaction.editReply({ content: "🚫 Une erreur interne est survenue.", ephemeral: true });
            }
        }

        if (interaction.isButton()) {
            const embed = new EmbedBuilder()
                .setTitle("📜 Interaction Bouton")
                .setColor("Blue")
                .addFields(
                    { name: "Utilisateur", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "Commande", value: `\`${interaction.customId}\``, inline: true },
                    { name: "Salon", value: `<#${interaction.channel.id}>`, inline: true }
                )
                .setTimestamp();

            sendLog(embed);
            console.log(`[BUTTON] ${interaction.user.tag} a exécuté l'interaction bouton ${interaction.customId} dans ${interaction.channel.id}`);
        }

        if (interaction.isModalSubmit()) {
            const embed = new EmbedBuilder()
                .setTitle("📜 Interaction Modal")
                .setColor("Blue")
                .addFields(
                    { name: "Utilisateur", value: `<@${interaction.user.id}>`, inline: true },
                    { name: "Commande", value: `\`${interaction.customId}\``, inline: true },
                    { name: "Salon", value: `<#${interaction.channel.id}>`, inline: true }
                )
                .setTimestamp();

            sendLog(embed);
            console.log(`[MODAL] ${interaction.user.tag} a exécuté l'interaction modal ${interaction.customId} dans ${interaction.channel.id}`);
        }

        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isModalSubmit()) return;
    }
};