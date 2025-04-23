const chalk = require("chalk");
const Discord = require('discord.js')
if (!globalThis.clientData) {
    globalThis.clientData = {};
}
const config = require('../config/config.json');
const utils = require('../utils');
const path = require('path');
const { processArgs } = require("../functions");

module.exports = {
    name: 'ready',
    async execute(Client) {
        console.log(chalk.blue("=============================="));
        console.log(chalk.green("🚀 Démarrage du bot..."));
        console.log(chalk.yellow("🔗 Connexion à Discord API..."));
        console.log(chalk.cyan(`✅ Bot RP en ligne ! Connect111é en tant que ${Client.user.tag}`));
        console.log(chalk.blue("==============================\n"));


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