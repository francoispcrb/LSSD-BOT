const { EmbedBuilder } = require('@discordjs/builders');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, './logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const writeLog = (message) => {
    try {
        const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
        const logMessage = `${message}\n`;
        fs.appendFileSync(logFile, logMessage);
    } catch (error) {
        process.stderr.write(`[LOG ERROR] ${error.message}\n`);
    }
};

const date = new Date().toISOString();

console.log = (...args) => {
    const message = args.join(' ');
    const coloredMessage = chalk.bgBlueBright(`${date} [CLIENT DISCORD] `) + chalk.reset(message);
    writeLog(coloredMessage);
    process.stdout.write(coloredMessage + '\n'); 
};

console.error = (...args) => {
    const message = `${date} [ERROR] ` + args.join(' ');
    const coloredMessage = chalk.bgRed(message);
    writeLog(coloredMessage);
    process.stderr.write(coloredMessage + '\n');
};

console.warn = (...args) => {
    const message = `${date} [WARN] ` + args.join(' ');
    const coloredMessage = chalk.bgYellow(message);
    writeLog(coloredMessage);
    process.stdout.write(coloredMessage + '\n'); 
};

console.debug = (...args) => {
    const message = `${date} [DEBUG] ` + args.join(' ');
    const coloredMessage = chalk.bgMagenta(message);
    writeLog(coloredMessage);
    process.stdout.write(coloredMessage + '\n');
};

console.notify = (type, ...args) => {
    let prefix = '';
    let coloredMessage = '';
    
    if (!type) type = 'soft'

    if (args.length === 0) {
        args = [type];
        type = 'soft';
    }
    switch (type) {
        case 'soft':
            prefix = '[🟢 SOFT NOTIFY] '
            coloredMessage = chalk.bgGreen.black(`🔔${new Date().toISOString()} ${prefix} ${args.join(' ')}`)
            break;
        case 'warm':
            prefix = '[🟡 WARM NOTIFY] '
            coloredMessage = chalk.bgYellow.black(`🔔${new Date().toISOString()} ${prefix} ${args.join(' ')}`)
            break;
        case 'hot':
            prefix = '[🔴 CRITICAL NOTIFY] '
            coloredMessage = chalk.bgRed.black(`🔔${new Date().toISOString()} ${prefix} ${args.join(' ')}`)
            break;
        default:
            prefix = '';
            return console.log(`🔔${new Date().toISOString()} ${prefix} ${args.join(' ')}`)
    }; 


    writeLog(coloredMessage);
    process.stdout.write(coloredMessage + "\n")  
};

try {
    module.exports = { writeLog, date };
    console.log("Les modules ", chalk.green('loggers'), chalk.reset(" ont correctement été exporté."));
} catch(err) {
    console.error("[FATAL_ERROR] Les utils n'ont pas été exporté correctement. Le processus va s'arrêter., ", err);
    console.notify('hot', 'Stopping process...')
    process.exit(0); 
};