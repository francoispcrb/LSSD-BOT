const { SlashCommandBuilder } = require('discord.js');
const chalk = require("chalk"); const pex = require('./config/pex.json');
const fs = require('fs')
const path = require('path');
let vehdb = JSON.parse(fs.readFileSync('./config/database/veh.json', 'utf8'));
let peddb = JSON.parse(fs.readFileSync('./config/database/ped.json', 'utf8'));

const vehChoices = Object.keys(vehdb).map(immat => ({ name: immat.replace(/-/g, ' '), value: immat }));
const pedChoices = Object.keys(peddb).map(name => ({ name: name, value: name }));

const logsDir = path.join(__dirname, '.', 'logs');
let fileChoices = [];


const configDir = path.join(__dirname, '.', 'config');
let configFChoice = [];

try {
    const configFiles = fs.readdirSync(configDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const fullPath = path.join(configDir, file);
            const stats = fs.statSync(fullPath);
            return { file, mtime: stats.mtime };
        })
        .sort((a, b) => b.mtime - a.mtime) // Facultatif : les plus récents en premier
        .slice(0, 25) // Facultatif : limiter à 25 comme pour Discord
        .map(f => ({
            name: f.file,
            value: f.file
        }));

    configFChoice = configFiles;
} catch (err) {
    console.error(err);
}


try {
    const files = fs.readdirSync(logsDir)
        .filter(file => file.endsWith('.log')) // Optionnel : ne garder que les .log
        .map(file => {
            const fullPath = path.join(logsDir, file);
            const stats = fs.statSync(fullPath);
            return { file, mtime: stats.mtime };
        })
        .sort((a, b) => b.mtime - a.mtime) // Trier du plus récent au plus ancien
        .slice(0, 25) // Ne garder que les 25 plus récents
        .map(f => ({
            name: f.file,
            value: f.file
        }));

    fileChoices = files;
} catch (error) {
    console.error("Erreur lors de la lecture du dossier 'log':", error);
}

const CORPS = {
    "EXECUTIVE_BODY": { id: "1342563267910045749" },
    "SUPERVISION_BODY": { id: "1342563302043025408" },
    "COMMANDEMENT_BODY": { id: "1342563289338744872" },
    "DIRECTION_BODY": { id:"1342565895188254740" }
};

const RANKS = {
    "DEPUTY_TRAINEE": { id :"1362847237381820856", abbr: 'Trainee', emote: '', name: "Deputy Sheriff Trainee"},
    "DEPUTY_I": { id: "1271893900344299692", abbr: "Dpt.", emote: '', name: "Deputy Sheriff I" },
    "DEPUTY_II": { id: "1252231983497744507", abbr: "Dpt.", emote: 'dii', name: "Deputy Sheriff II" },
    "DEPUTY_III": { id: "1343603998745432084", abbr: "Dpt.", emote: 'diii', name: "Deputy Sheriff III" },
    "SERGEANT": { id: "1252231826680975500", abbr: "Sgt.", emote: 'sgt', name: "Sergeant" },
    "LIEUTENANT": { id: "1252232160916668437", abbr: "Lt.",  emote: 'lt' , name: "Lieutenant" },
    "CAPTAIN": { id: "1252232015948808244", abbr: "Cpt.", emote: 'cpt', name: "Captain" },
    "ARE_COMMANDER": { id: "1343281897731657799", abbr: "Adc.", emote: 'mjr', name: "Area Commander" }
};

const PEX = {
    "openservice": "MANAGE_OPENSERVICE",
    "infoshift": "MANAGE_SHIFT",
    "promote": "MANAGE_PROMOTE",
    "recruit": "MANAGE_RECRUIT",
    "mute": "MODERAT_MUTE",
    "warn": "MODERAT_WARN",
    "ban": "MODERAT_BAN",
    "kick": "MODERAT_KICK",
    "userinfo": "MODERAT_USERINFO",
    "ticket": "MANAGE_TICKET",
    "rename": "MANAGE_RENAME",
    "send": "MANAGE_SEND",
    "shutdown": "*_SHUTDOWN",
    "help": "USE_HELP",
    "shift": "USE_SHIFT",
    "pex": "MANAGE_PEX",
    "info": "USE_INFO",
    "clear": "MANAGE_CLEAR",
    "music": "USE_MUSIC",
    "bypass": "BYPASS",
    "requestroleinit": "ROLE_INIT",
    "register": "USE_REGISTER",
    "checklog": "MANAGE_LOG",
    "cleardata": "MANAGE_DATA",
    "viewdata": "VIEW_DATA"
};

const DESC_COMMAND = {
    "ban": "Bannit un membre du serveur. Arguments : `user` (utilisateur à bannir), `reason` (raison), `temp` (durée en jours, optionnel).",
    "kick": "Expulse un membre du serveur. Arguments : `user` (utilisateur à expulser), `reason` (raison).",
    "warn": "Ajoute un avertissement à un membre. Arguments : `user` (utilisateur), `mark` (motif). Sous-commandes : `info` (obtenir le nombre d'avertissements), `warn` (ajouter un avertissement).",
    "mute": "Rend un membre muet temporairement. Arguments : `user` (utilisateur), `reason` (raison), `temps` (durée).",
    "ticket": "Gère les tickets de support. Sous-commandes : `init`, `add` (ajouter un membre, avec `user`), `remove` (retirer un membre, avec `user`), `archive`, `close`, `lock`, `unlock`, `info`.",
    "shutdown": "Arrête le bot.",
    "userinfo": "Affiche des informations sur un utilisateur. Arguments : `user` (utilisateur).",
    "send": "Envoie un message privé à un utilisateur. Arguments : `auth` (autorisation), `user` (utilisateur), `obj` (objet), `msg` (message).",
    "clear": "Supprime des messages dans un salon.",
    "ping": "Vérifie la latence du bot.",
    "rename": "Renomme un salon. Arguments : `str` (nouveau nom).",
    "shift": "Démarre ou arrête un service.",
    "infoshift": "Obtenir les informations de l'intégralité des services de l'utilisateur. Arguments : `user`.",
    "promote": "Promouvoir un utilisateur à un grade supérieur. Arguments : `user` (utilisateur), `grade` (grade à attribuer, choisir parmi les grades disponibles).",
    "recruit": "Recruter un utilisateur. Arguments : `user` (utilisateur), `indicatif` (indicatif à attribuer au membre), `prénom & nom` (prénom et nom du membre).",
    "pex": "Permet d'ajouter des permissions à un membre. Arguments : `user` (utilisateur dont on veut ajouter des permissions), `add|remove|check` (ajouter, retirer ou vérifier les permissions du membre en question), `permission` (permission à ajouter ou retirer).",
    "openservice": "Permet d'envoyer un message demandant aux membres s'ils seront présent le soir.",
    "info": "Donne les informations primaire du Client du bot.",
    "music": "Permet de jouer de la musique.",
    "register": "Permet d'enregistrer quelques chose aux fichiers.",
    "bypass": "Permet de bypass une commande (Ex. /bypass shift `user`)"
};

const ROLE_MAP = {
    "LSSD": "1259234502866108456",
    "LSPD": "1252274500968513687",
    "LSMC": "1354482500214456431",
    "DOJ": "1354881043349635193",
    "GOUV": "1260947297307463783",
    "WAZEL": "1360585391622586438",
    "CITIZEN": "1252266446050951378",
    "FED": "1261311031490248766",
    "CDT":"1342563289338744872"
}

const DIV_MAP = {
    "PATROL": "1344727520309805118",
    "GANG": "1344727484951822346",
    "DETEC": "1272252982750347414",
    "K9":"1254743492392124417",
    "SWAT":"1254743617692635196",
    "ASU":"1284909028568334336",
    "IIU":"1272253157577064478",
    "FTO":"1361756141431820348"
}

const commands = {

    createreport: new SlashCommandBuilder()
        .setName('createreport')
        .setDescription('Crée un rapport')
        .addStringOption(option => option.setName('name').setDescription('nom du ticket').setRequired(true)),

    div: new SlashCommandBuilder()
        .setName('div')
        .setDescription('Gère les divisions des utilisateurs')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur ciblé')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action à effectuer')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                )
        )
        .addStringOption(option => {
            let divOption = option
                .setName('div')
                .setDescription('Division à attribuer')
                .setRequired(true); // Rendu obligatoire pour garantir que l'action est bien ciblée

            for (const permission in DIV_MAP) {
                divOption = divOption.addChoices({ name: permission, value: permission });
            }

            return divOption;
        }),

    role: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Gère les rôles des utilisateurs')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur ciblé')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action à effectuer')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                )
        )
        .addStringOption(option => {
            let roleOption = option
                .setName('role')
                .setDescription('Rôle à attribuer')
                .setRequired(true); // obligatoire pour le bon fonctionnement

            for (const permission in ROLE_MAP) {
                roleOption = roleOption.addChoices({ name: permission, value: permission });
            }

            return roleOption;
        }),


    checklog: new SlashCommandBuilder()
        .setName('checklog')
        .setDescription('Récupère un fichier de log.')
        .addStringOption(option => {
            let opt = option
                .setName('log')
                .setDescription('Choisissez un fichier log à récupérer')
                .setRequired(true);

            // Ajouter les choix
            for (const choice of fileChoices) {
                opt = opt.addChoices({ name: choice.name, value: choice.value });
            }

            return opt;
        }),

    viewdata: new SlashCommandBuilder()
        .setName('viewdata')
        .setDescription('Voir les datas des fichiers de config.')
        .addStringOption(option => {
            let opt = option
                .setName('config')
                .setDescription('Fichier à voir')
                .setRequired(true);

            for (const choice of configFChoice) {
                opt = opt.addChoices({ name: choice.name, value: choice.value });
            }

            return opt;
        }),

    cleardata: new SlashCommandBuilder()
        .setName('cleardata')
        .setDescription('Clear les datas des fichiers de config.')
        .addStringOption(option => {
            let opt = option
                .setName('config')
                .setDescription('Fichier à vider')
                .setRequired(true);

            for (const choice of configFChoice) {
                opt = opt.addChoices({ name: choice.name, value: choice.value });
            }

            return opt;
        }),

    requestroleinit: new SlashCommandBuilder()
        .setName('requestroleinit')
        .setDescription("Init de message Request Role"),

    bypass: new SlashCommandBuilder()
        .setName('bypass')
        .setDescription("Permet de bypass une commande")
        .addSubcommand(shift => shift.setName('shift').setDescription("Permet de bypass la commande shift.")
            .addUserOption(user => user.setName("user").setDescription('User'))),

    register: new SlashCommandBuilder()
        .setName('register')
        .setDescription("Permet d'enregrister une information importante dans les fichiers.")

        .addSubcommand(abs => abs.setName('veh').setDescription("Permet d'enregistrer un véhicule")
            .addStringOption(opt => opt.setName('marque').setDescription("Marque du véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('modele').setDescription("Modèle du véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('proprio').setDescription("Propiétaire du véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('remarque').setDescription("Remarque sur le véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('immat').setDescription("Immatriculation du véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('couleur').setDescription("Couleur du véhcule").setRequired(true)))
        .addSubcommand(abs => abs.setName('individu').setDescription("Permet d'enregistrer un individus")
            .addStringOption(opt => opt.setName('name').setDescription('name').setRequired(true))
            .addStringOption(opt => opt.setName('desc_physique').setDescription("Description physique").setRequired(true))
            .addStringOption(opt => opt.setName('age').setDescription("Age de l'individus").setRequired(true))
            .addStringOption(opt => opt.setName('remarque').setDescription("Remarque sur le véhicule").setRequired(true))
            .addStringOption(opt => opt.setName('tel').setDescription("Téléphone de l'individu").setRequired(true))
            .addStringOption(opt => opt.setName('residencer').setDescription("Lieu de résidence").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('addvehmark')
                .setDescription('Marquer un véhicule')
                .addStringOption(option =>
                    option.setName('immat')
                        .setDescription("Sélectionnez un véhicule")
                        .setRequired(true)
                        .addChoices(...vehChoices)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('addpedmark')
                .setDescription('Marquer un individu')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription("Sélectionnez un individu")
                        .setRequired(true)
                        .addChoices(...pedChoices)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('viewvehmark')
                .setDescription('Voir les informations d’un véhicule marqué')
                .addStringOption(option =>
                    option.setName('immat')
                        .setDescription("Sélectionnez un véhicule")
                        .setRequired(true)
                        .addChoices(...vehChoices)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('viewpedmark')
                .setDescription('Voir les informations d’un individu marqué')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription("Sélectionnez un individu")
                        .setRequired(true)
                        .addChoices(...pedChoices)
                )
        ),


    music: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Permet de jouer de la musique.')
        .addStringOption(option => option.setName('music').setDescription('musique')),

    info: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Vous donne quelques informations sur le bot.'),

    pex: new SlashCommandBuilder()
        .setName('pex')
        .setDescription('Gère les permissions des utilisateurs')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur ciblé')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action à effectuer')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' },
                    { name: 'check', value: 'check' }
                )
        )
        .addStringOption(opt => {
            let permOption = opt.setName('permission').setDescription("Permission à attribuer").setRequired(false);
            for (const permission in pex) {
                permOption = permOption.addChoices({ name: permission, value: permission });
            }; return permOption;
        }),
    openserivce: new SlashCommandBuilder()
        .setName('openservice')
        .setDescription('Crée un message pour savoir qui sera présent ce soir'),

    infoshift: new SlashCommandBuilder()
        .setName('infoshift')
        .setDescription("Affiche l'historique des shifts d'un utilisateur.")
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription("L'utilisateur dont vous voulez voir les shifts")
                .setRequired(true)
        ),

    recruit: new SlashCommandBuilder()
        .setName('recruit')
        .setDescription('Permet de recruter un membre au sein du LSSD')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur à recruter').setRequired(true))
        .addIntegerOption(opt => opt.setName('indicatif').setDescription('Indicatif du membre').setRequired(true))
        .addStringOption(opt => opt.setName('nickname').setDescription('Prénom et Nom du membre').setRequired(true)),

    help: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles')
        .addStringOption(opt => {
            let commandOptn = opt.setName('commandes').setDescription("Aide pour une commande spécifique").setRequired(false);
            for (const commands in PEX) {
                commandOptn = commandOptn.addChoices({ name: commands, value: commands });
            }; return commandOptn;
        }),

    ban: new SlashCommandBuilder()
        .setName('ban').setDescription('Bannit un membre du serveur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur à bannir').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison du bannissement'))
        .addIntegerOption(opt => opt.setName('temp').setDescription('Durée en jours (laisser vide pour un ban définitif)')),

    ticket: new SlashCommandBuilder()
        .setName('ticket').setDescription('Plugin ticket')
        .addSubcommand(sub => sub.setName('init').setDescription('Ticket Init'))
        .addSubcommand(sub => sub.setName('add').setDescription('Ajouter un membre').addUserOption(opt => opt.setName('user').setDescription('Utilisateur à ajouter')))
        .addSubcommand(sub => sub.setName('remove').setDescription('Retirer un membre').addUserOption(opt => opt.setName('user').setDescription('Utilisateur à retirer')))
        .addSubcommand(sub => sub.setName('archive').setDescription('Archiver un ticket'))
        .addSubcommand(sub => sub.setName('close').setDescription('Supprimer un ticket'))
        .addSubcommand(sub => sub.setName('lock').setDescription('Verrouiller un ticket'))
        .addSubcommand(sub => sub.setName('unlock').setDescription('Déverrouiller un ticket'))
        .addSubcommand(sub => sub.setName('info').setDescription('Informations sur le ticket'))
        .addSubcommand(sub => sub.setName("rename").setDescription('Change le nom du ticket').addStringOption(opt => opt.setName('str').setDescription('Nouveau nom'))),

    shutdown: new SlashCommandBuilder().setName('shutdown').setDescription('Arrête le bot.'),

    userinfo: new SlashCommandBuilder()
        .setName('userinfo').setDescription('Obtenir des informations sur un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur')),

    send: new SlashCommandBuilder()
        .setName('send').setDescription('Envoyer un message')
        .addBooleanOption(opt => opt.setName('auth').setDescription('Autorisation').setRequired(true))
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur'))
        .addStringOption(opt => opt.setName('obj').setDescription('Objet'))
        .addStringOption(opt => opt.setName('msg').setDescription('Message')),

    clear: new SlashCommandBuilder().setName('clear').setDescription('Effacer des messages.')
        .addIntegerOption(opt => opt.setName('amount').setDescription('Nombre de message à supprimer.').setRequired(true)),

    kick: new SlashCommandBuilder()
        .setName('kick').setDescription('Expulser un membre.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur à expulser').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison du kick')),

    warn: new SlashCommandBuilder()
        .setName('warn').setDescription("Gérer les avertissements")
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('mark').setDescription('Motif').setRequired(true)),


    mute: new SlashCommandBuilder()
        .setName('mute').setDescription('Rendre muet un membre')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Raison').setRequired(true))
        .addStringOption(opt => opt.setName('temps').setDescription('Durée')),

    rename: new SlashCommandBuilder()
        .setName('rename').setDescription('Renommer un salon')
        .addStringOption(opt => opt.setName('str').setDescription('Nouveau nom')),

    shift: new SlashCommandBuilder().setName('shift').setDescription("Démarrer ou arrêter votre service."),

    promote: new SlashCommandBuilder()
        .setName('promote').setDescription("Promouvoir un utilisateur à un grade supérieur.")
        .addUserOption(opt => opt.setName('user').setDescription("Utilisateur à promouvoir").setRequired(true))
        .addStringOption(opt => {
            let gradeOption = opt.setName('grade').setDescription("Grade à attribuer").setRequired(true);
            for (const key in RANKS) gradeOption = gradeOption.addChoices({ name: key, value: key });
            return gradeOption;
        })
};

try {
    module.exports = { CORPS, RANKS, PEX, commands: Object.values(commands), DESC_COMMAND, ROLE_MAP, DIV_MAP}
    console.log("Les modules ", chalk.green('utils.js'), chalk.reset(" ont correctement été exporté."))
} catch(err) {
    console.error("[FATAL_ERROR] Les utils n'ont pas été exporté correctement. Le processus va s'arrêter., ", err)
    process.exit(0);
}