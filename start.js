const { spawn } = require("child_process");
const axios = require("axios");
const config = require('./config/config.json');
const chalk = require("chalk");

const WEBHOOK_URL = config.server.test.webhook_moderator_only

async function sendDiscordMessage(content) {
    try {
        await axios.post(WEBHOOK_URL, { content });
    } catch (error) {
        console.error("Erreur en envoyant le message Discord :", error);
    }
}

async function startBot() {
    await sendDiscordMessage("🔄 **Le bot redémarre...**");

    const bot = spawn("node", ["index.js"], { stdio: "inherit" });

    bot.on("exit", async (code) => {
        console.log(`Le bot s'est arrêté avec le code ${code}. Redémarrage...`);
        await sendDiscordMessage(`⚠️ **Le bot a crashé (code ${code}) et redémarre...**`);
		setTimeout(startBot, 5000)
    });

    bot.on("error", async (err) => {
        console.error("Erreur lors du lancement du bot :", err);
        await sendDiscordMessage("❌ **Erreur critique lors du lancement du bot ! Tentative de redémarrage dans 5s...**");
        setTimeout(startBot, 5000);
    });
}

console.log(chalk.green("Lancement du bot via start.js"))
startBot();