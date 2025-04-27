const chalk = require("chalk");
const Discord = require('discord.js')
if (!globalThis.clientData) {
    globalThis.clientData = {};
}
const config = require('../config/config.json');
const utils = require('../utils');
const path = require('path');
const { processArgs } = require("../functions");
const readline = require('readline')
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ready',
    async execute(Client) {
        console.log(chalk.blue("=============================="));
        console.log(chalk.green("🚀 Démarrage du bot..."));
        console.log(chalk.yellow("🔗 Connexion à Discord API..."));
        console.log(chalk.cyan(`✅ Bot RP en ligne ! Connect111é en tant que ${Client.user.tag}`));
        console.log(chalk.blue("==============================\n"));

        console.log(`🤖 Connecté en tant que ${Client.user.tag}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        rl.prompt();

        rl.on('line', async (input) => {
            if (!input.startsWith('>send')) {
                rl.prompt();
                return;
            }

            try {
                // Extrait la commande
                const args = input.slice(5).trim(); // retire ">send"
                const parts = args.split(' ');

                const type = parts[0];
                const channelId = parts[1];
                const contentParts = parts.slice(2).join(' ').split('|');
                const message = contentParts[0].trim();
                const title = contentParts[1] ? contentParts[1].trim() : null;

                if (!['embed', 'text'].includes(type)) {
                    console.log('❌ Type invalide. Utilise "embed" ou "text".');
                    rl.prompt();
                    return;
                }

                const channel = await Client.channels.fetch(channelId).catch(() => null);
                if (!channel || !channel.isTextBased()) {
                    console.log('❌ Salon introuvable ou non textuel.');
                    rl.prompt();
                    return;
                }

                if (type === 'embed') {
                    const embed = new EmbedBuilder()
                        .setDescription(message)
                        .setColor('Random');

                    if (title) embed.setTitle(title);

                    await channel.send({ embeds: [embed] });
                    console.log('✅ Embed envoyé !');
                } else {
                    await channel.send(message);
                    console.log('✅ Message texte envoyé !');
                }
            } catch (err) {
                console.error('Erreur lors de l\'envoi du message :', err);
            }

            rl.prompt();
        });

        const GUILD_ID = config.server.test.id;

        try {
            const guild = await Client.guilds.fetch(GUILD_ID);
            console.log("Guild récupéré : ", guild.name);

            const existingCommands = await guild.commands.fetch();
            const botCommands = existingCommands.filter(cmd => cmd.applicationId === Client.user.id);

            console.log("Commandes existantes : ", Array.from(botCommands.values()).map(command => command.name).join(", "));

            if (botCommands.size === 0) {
                console.log("Aucune commande trouvée. Enregistrement des commandes...");

                console.log("Liste des commandes chargées : ", Object.keys(utils.commands).join(', '));
                if (Array.isArray(utils.commands) && utils.commands.length > 0) {
                    await guild.commands.set(utils.commands);
                    console.notify('soft', "✅ Commandes enregistrées pour le serveur !");
                } else {
                    console.error("❌ Les commandes ne sont pas correctement formatées ou sont vides !");
                }
            } else {
                console.warn("⚠️ Commandes déjà enregistrées pour ce serveur.");
            }
            console.notify(`Arguments passés : ${process.argv.slice(2).join(", ") || chalk.yellow('Aucun')}`);
            const argsNode = [
                "clearcommand", "debug"
            ]
            const args = process.argv.slice(2).find(arg => argsNode.includes(arg));
            if(args) {
                if(args === 'clearcommand') {
                    console.notify("Le mode 'clearcommand' est activé.");

                    return guild.commands.set([])
                        .then(() => console.log(`Toutes les commandes du serveur ${guild.name} ont été supprimées.`))
                        .catch(console.error);
                } else return console.notify("Aucun mode de lancement reconnue.");
            }
            if(!args) return console.notify('Aucun mode de lancement spécifié.')

            var activityName = 'gérer le LSSD'

            const activity = {
                name: activityName,
                type: Discord.ActivityType.Playing
            };
            Client.user.setPresence({
                activities: [activity],
                status: "dnd",
            });

        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement des commandes :", error);
            if (error.code === 10003) {
                console.error("Le serveur avec l'ID fourni est introuvable. Vérifiez l'ID du serveur dans le fichier de configuration.");
            }
        }
    }
};