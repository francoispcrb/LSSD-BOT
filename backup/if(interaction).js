// Client.on('ready', async () => { //DONE
//     const isVSCode = process.env.TERM_PROGRAM === "vscode";

//     const activity = isVSCode 
//     ? { name: "la version de développement", type: ActivityType.Watching } 
//     : { name: "Blaine County Shériff Office", type: ActivityType.Playing };

//     console.log(chalk.blue("\n=============================="));
//     console.log(chalk.green("🚀 Démarrage du bot..."));
//     console.log(chalk.yellow("🔗 Connexion à Discord API..."));
//     console.log(chalk.cyan(`✅ Bot RP en ligne ! Connecté en tant que ${Client.user.tag}`));
//     console.log(chalk.blue("==============================\n"));

//     Client.user.setPresence({
//         activities: [activity], 
//         status: "dnd",
//     });

//     const guild = Client.guilds.cache.get(GUILD_ID);
//     if (!guild) {
//         console.error(`Guild ID ${GUILD_ID} introuvable.`);
//         return;
//     }
//     try {
//         await Promise.all(commands.map(cmd => guild.commands.create(cmd)));
//         console.log("Commandes enregistrées avec succès !");
//     } catch (error) {
//         console.error("Erreur lors de l'enregistrement des commandes :", error);
//     }

// });

// Client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const embed = new EmbedBuilder()
//     .setTitle("📜 Commande exécutée")
//     .setColor("Blue")
//     .addFields(
//       { name: "Utilisateur", value: `<@${interaction.user.id}>`, inline: true },
//       { name: "Commande", value: `\`${interaction.commandName}\``, inline: true },
//       { name: "Salon", value: `<#${interaction.channel.id}>`, inline: true }
//     )
//     .setTimestamp();

//   sendLog(embed);
// });

// // Événement quand un message est supprimé
// Client.on("messageDelete", (message) => { //DONE
//   if (message.author.bot) return;

// 	    var contentValue = message.content

//     if (contentValue.length > 1024) {
//         contentValue = contentValue.substring(0, 1021) + '...'
//     }

//   const embed = new EmbedBuilder()
//     .setTitle("🗑 Message supprimé")
//     .setColor("Red")
//     .addFields(
//       { name: "Auteur", value: `<@${message.author.id}>`, inline: true },
//       { name: "Salon", value: `<#${message.channel.id}>`, inline: true },
//       { name: "Message", value: contentValue || "*Aucun contenu*" }
//     )
//     .setTimestamp();

//   sendLog(embed);
// });

// Client.on("messageCreate", (message) => {
//     if (message.author.bot) return;
    
//     var contentValue = message.content

//     if (contentValue.length > 1024) {
//         contentValue = contentValue.substring(0, 1021) + '...'
//     }

//     const embed = new EmbedBuilder()
//       .setTitle("📝 Nouveau message")
//       .setColor("Green")
//       .addFields(
//         { name: "Auteur", value: `<@${message.author.id}>`, inline: true },
//         { name: "Salon", value: `<#${message.channel.id}>`, inline: true },
//         { name: "Contenu", value: contentValue || "*Aucun contenu*" }
//       )
//     .setTimestamp();
//     sendLog(embed);
// });

// // Événement quand un message est modifié
// Client.on("messageUpdate", (oldMessage, newMessage) => {
//   if (oldMessage.author.bot || oldMessage.content === newMessage.content) return;

//   if(oldMessage.content > 1024) {
//     var contentOfOldMessage = oldMessage.content.substring(0, 1021) + '...' 
//   }
//   if(newMessage.content > 1024) {
//     var contentOfNewMessage = newMessage.content.substring(0, 1021) + '...'
//   }

//   const embed = new EmbedBuilder()
//     .setTitle("✏ Message modifié")
//     .setColor("Yellow")
//     .addFields(
//       { name: "Auteur", value: `<@${oldMessage.author.id}>`, inline: true },
//       { name: "Salon", value: `<#${oldMessage.channel.id}>`, inline: true },
//       { name: "Avant", value: contentOfOldMessage || "*Aucun contenu*" },
//       { name: "Après", value: contentOfNewMessage || "*Aucun contenu*" }
//     )
//     .setTimestamp();

//   sendLog(embed);
// });

// // Événement quand un membre rejoint
// Client.on("guildMemberAdd", (member) => {

//   const embed = new EmbedBuilder()
//     .setTitle("✅ Nouveau membre")
//     .setColor("Green")
//     .setDescription(`**${member.user.tag}** a rejoint le serveur.`)
//     .setThumbnail(member.user.displayAvatarURL())
//     .setTimestamp();

//   sendLog(embed);
// });

// // Événement quand un membre quitte ou est kické
// Client.on("guildMemberRemove", (member) => {

//   const embed = new EmbedBuilder()
//     .setTitle("❌ Membre parti")
//     .setColor("Red")
//     .setDescription(`**${member.user.tag}** a quitté ou a été expulsé du serveur.`)
//     .setThumbnail(member.user.displayAvatarURL())
//     .setTimestamp();

//   sendLog(embed);
// });

// // Événement quand un membre est banni
// Client.on("guildBanAdd", (ban) => {

//   const embed = new EmbedBuilder()
//     .setTitle("🚨 Membre banni")
//     .setColor("DarkRed")
//     .setDescription(`**${ban.user.tag}** a été banni du serveur.`)
//     .setThumbnail(ban.user.displayAvatarURL())
//     .setTimestamp();

//   sendLog(embed);
// });

// // Événement quand un membre est débanni
// Client.on("guildBanRemove", (ban) => {

//   const embed = new EmbedBuilder()
//     .setTitle("🛑 Membre débanni")
//     .setColor("DarkGreen")
//     .setDescription(`**${ban.user.tag}** a été débanni du serveur.`)
//     .setThumbnail(ban.user.displayAvatarURL())
//     .setTimestamp();

//   sendLog(embed);
// });

// Client.on('interactionCreate', async (interaction) => {

//     if(interaction.isCommand){

//         if(interaction.member.roles.cache.has('1342563289338744872') || interaction.member.roles.cache.has("1342565895188254740")) {
//             if (interaction.commandName === 'userinfo') { // DONE
//                 const user = interaction.options.getUser('user');
//                 const userId = user.id;
//                 let response = `📋 **Historique de ${user.username}**\n\n`;
                
//                 // Vérification des kicks
//                 if (kickFile[userId]) {
//                     response += `🚫 **Kicks (${kickFile[userId].count})**\n`;
//                     for (let i = 1; i <= kickFile[userId].count; i++) {
//                         const kick = kickFile[userId][`kick_0${i}`];
//                         response += `- ${kick.date} | **Raison:** ${kick.reason} | **Auteur:** <@${kick.author}>\n`;
//                     }
//                 }
                
//                 // Vérification des mutes
//                 if (muteFile[userId]) {
//                     response += `🔇 **Mutes (${muteFile[userId].count})**\n`;
//                     for (let i = 1; i <= muteFile[userId].count; i++) {
//                         const mute = muteFile[userId][`mute_0${i}`];
//                         response += `- ${mute.date} | **Raison:** ${mute.reason} | **Durée:** ${mute.duration} | **Auteur:** <@${mute.author}>\n`;
//                     }
//                 }
                
//                 // Vérification des bans
//                 if (banFile[userId]) {
//                     response += `❌ **Bans (${banFile[userId].count})**\n`;
//                     for (let i = 1; i <= banFile[userId].count; i++) {
//                         const ban = banFile[userId][`ban_0${i}`];
                        
//                         response += `- ${ban.date} | **Raison:** ${ban.reason} | **Auteur:** <@${ban.author}> | **Durée:** ${ban.duration}\n`;
//                     }
//                 }
                
//                 // Vérification des warns
//                 if (warnFile[userId]) {
//                     response += `⚠️ **Avertissements (${warnFile[userId].count})**\n`;
//                     for (let i = 1; i <= warnFile[userId].count; i++) {
//                         const warn = warnFile[userId][`warn_0${i}`];
//                         response += `- ${warn.date} | **Raison:** ${warn.mark} | **Auteur:** <@${warn.author}>\n`;
//                     }
//                 }
                
//                 // Si aucun historique
//                 if (!kickFile[userId] && !muteFile[userId] && !banFile[userId] && !warnFile[userId]) {
//                     response += "✅ Aucun historique trouvé pour cet utilisateur.";
//                 }
                
//                 await interaction.reply({ content: response, ephemeral: true });
    
//             }
    
//             if (interaction.commandName === 'ban') { // DONE
//                 const user = interaction.options.getUser('user');
//                 const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
//                 const temp = interaction.options.getInteger('temp'); // Durée en jours (facultatif)
                
//                 if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
//                     return interaction.reply({ content: 'Tu n\'as pas la permission de bannir des membres.', ephemeral: true });
//                 }
            
//                 try {
//                     // Vérification si le membre est dans le serveur
//                     const member = await interaction.guild.members.fetch(user.id).catch(() => null);
                    
//                     if (!member) {
//                         return interaction.reply({ content: 'Utilisateur introuvable sur le serveur.', ephemeral: true });
//                     }
                
//                     // Message privé avant le ban
//                     try {
//                         const dmEmbed = new EmbedBuilder()
//                             .setTitle('Tu as été banni')
//                             .setDescription(`Tu as été banni du serveur **${interaction.guild.name}**.`)
//                             .addFields(
//                                 { name: 'Raison', value: reason },
//                                 { name: 'Durée', value: temp ? `${temp} jours` : 'Permanent' }
//                             )
//                             .setColor('RED')
//                             .setFooter({ text: 'Respectez les règles pour éviter de nouvelles sanctions.' });
                        
//                         await user.send({ embeds: [dmEmbed] });
//                     } catch (err) {
//                         console.error('Impossible d\'envoyer un MP à l\'utilisateur:', err);
//                     }
                
//                     // Bannissement
//                     await interaction.guild.members.ban(user, { reason });
                
//                     // Si un temps de ban est spécifié, programmer le débannissement
//                     if (temp) {
//                         setTimeout(async () => {
//                             try {
//                                 await interaction.guild.members.unban(user.id);
//                                 console.log(`${user.tag} a été débanni après ${temp} jours.`);
//                             } catch (err) {
//                                 console.error(`Erreur lors du débannissement de ${user.tag}:`, err);
//                             }
                            
//                         }, temp * 24 * 60 * 60 * 1000); // Conversion jours -> ms
//                     }
                
//                     if(!temp) var dur = 'Bannissement définitif' || temp
//                     if(dur === 'Bannissement définitif') var isDay = "" || '(day)'
    
//                     if (!banFile[user.id]) {
//                         banFile[user.id] = {
//                             "count": 1,
//                             "ban_01": {
//                                 "date": new Date().toISOString(),
//                                 "reason": reason,
//                                 "author": interaction.member.user.id,
//                                 "temp": `${dur} ${isDay}`
//                             }
//                         };
//                         saveBan()
//                     } else {
//                         const count = banFile[user]["count"];
//                         const newCount = count + 1;
//                         const banTitle = `ban_${newCount}`;
                    
//                         banFile[user.id]['count'] = newCount;
//                         banFile[user.id][banTitle] = {
//                             "date": new Date().toISOString(),
//                             "reason": reason,
//                             "author": interaction.member.user.id,
//                             "temp": `${dur} ${isDay}`
//                         };
//                         saveBan()
//                     }
                
//                     return interaction.reply({ content: `${user.tag} a été banni ${temp ? `pour ${temp} jours` : 'définitivement'}.`, ephemeral: false });
                
//                 } catch (err) {
//                     return interaction.reply({ content: `Erreur lors du bannissement de ${user.tag}: ${err.message}`, ephemeral: true });
//                 }
//             }
    
//             if (interaction.commandName === 'send') { // DONE
//                 const user = interaction.options.getUser('user');
//                 const obj = interaction.options.getString('obj');
//                 const msg = interaction.options.getString('msg');
//                 const auth = interaction.options.getBoolean('auth') ?? false;
                
//                 const signature = auth ? `
        
//         ✉️ **Envoyé par**: ${interaction.user.displayName}` : "";
//                 const confirmEmbedDM = new EmbedBuilder()
//                     .setTitle("📩 Nouveau message")
//                     .setDescription(`**Objet:** ${obj}\n\n${msg}${signature}`)
//                     .setColor("#0099ff");
        
//                 try {
//                     await user.send({ embeds: [confirmEmbedDM] });
//                     interaction.reply({ content: "✅ Message envoyé avec succès !", ephemeral: true });
//                 } catch (err) {
//                     console.error("Impossible d'envoyer ce message à ce membre.", err);
//                     interaction.reply({ content: "❌ Impossible d'envoyer le message à cet utilisateur.", ephemeral: true });
//                 }
//             }
    
//             if (interaction.commandName === 'kick') { // DONE
//                 const user = interaction.options.getUser('user');
//                 const reason = interaction.options.getString('reason') || 'Aucune raison fournie';
                
//                 if (!interaction.member.permissions.has('KICK_MEMBERS')) {
//                     return interaction.reply({ content: 'Tu n\'as pas la permission de kicker des membres.', ephemeral: true });
//                 }
    
//                 try {
                   
    
//                     // Envoi du message privé au membre kické
//                     try {
//                         await user.send(new EmbedBuilder()
//                             .setTitle('Tu as été kické')
//                             .setDescription(`Tu as été kické du serveur ${interaction.guild.name} pour la raison suivante : ${reason}`)
//                             .setColor('DarkRed')
//                             .setFooter('Règles du serveur : Respectez-les pour éviter de nouvelles sanctions.'));
//                     } catch (err) {
//                         console.error('Impossible d\'envoyer un message privé à l\'utilisateur :', err);
//                     }
//                     await interaction.guild.members.kick(user, { reason: reason });
    
//                     if (!kickFile[user.id]) {
//                         kickFile[user.id] = {
//                             "count": 1,
//                             "kick_01": {
//                                 "date": new Date().toISOString(),
//                                 "reason": reason,
//                                 "author": interaction.member.user.id
//                             }
//                         };
//                         saveKick()
//                     } else {
//                         const count = kickFile[user]["count"];
//                         const newCount = count + 1;
//                         const kickTitle = `kick_0${newCount}`;
            
//                         muteFile[user.id]['count'] = newCount;
//                         kickFile[user.id][kickTitle] = {
//                             "date": new Date().toISOString(),
//                             "reason": reason,
//                             "author": interaction.member.user.id
//                         };
//                         saveKick()
//                     }
    
//                     return interaction.reply({ content: `${user.tag} a été kické avec succès.`, ephemeral: true });
//                 } catch (err) {
//                     return interaction.reply({ content: `Erreur lors du kick de ${user.tag}: ${err.message}`, ephemeral: true });
//                 }
//             }

//             if (interaction.commandName === 'recruit') { // DONE

//                 const user = interaction.options.getMember('user');
//                 const indicatif = interaction.options.getInteger('indicatif');
//                 const nickname = interaction.options.getString('nickname')

//                 if(!user) {
//                     return interaction.reply({ content: "Utilisateur introuvable.", ephemeral: true });
//                 }

//                 const alreadyTaken = indicatifFile.indicatif.includes(indicatif.toString());

//                 if (alreadyTaken) {
//                     return interaction.reply({ content: `L'indicatif ${indicatif} est déjà pris.`, ephemeral: true });
//                 }
                
//                 indicatifFile.indicatif.push(indicatif.toString());
//                 fs.writeFileSync('./config/indicatif.json', JSON.stringify(indicatifFile, null, 4), 'utf8');

//                 const newNickname = `${indicatif} | Dpt. ${nickname}`;
//                 const DepRole = interaction.guild.roles.cache.get(RANKS["DEPUTY"].id);
//                 const CadRole = interaction.guild.roles.cache.get(RANKS['CADET'].id);
//                 const ExeBod = interaction.guild.roles.cache.get(CORPS['EXECUTIVE_BODY'].id);
//                 const BCSORole = config.role.bcso

//                 await user.roles.add(DepRole)
//                 await user.roles.add(CadRole)
//                 await user.roles.add(BCSORole)
//                 await user.roles.add(ExeBod)
                
//                 await user.setNickname(newNickname).catch((err) => {console.error(err)});

//                 console.log(chalk.blueBright(`${user.nickname} a été recruté au sein du BCSO avec les rôles ${user.roles}`))
//                 await interaction.reply({content: `${user.nickname} a correctement été recruté.`, ephemeral: true})
//             }
    
//             if (interaction.commandName === 'promote') { //DONE
    
//                 const member = interaction.options.getMember('user');
//                 const rank = interaction.options.getString('grade').toUpperCase();
        
//                 if (!member) {
//                     return interaction.reply({ content: "Utilisateur introuvable.", ephemeral: true });
//                 }
        
//                 if (!RANKS[rank]) {
//                     return interaction.reply({ content: "Grade invalide.", ephemeral: true });
//                 }
        
//                 const newRole = interaction.guild.roles.cache.get(RANKS[rank].id);
//                 if (!newRole) {
//                     return interaction.reply({ content: "Rôle introuvable.", ephemeral: true });
//                 }
        
//                 // Supprimer les anciens rôles
//                 for (const key in RANKS) {
//                     const oldRole = interaction.guild.roles.cache.get(RANKS[key].id);
//                     if (oldRole && member.roles.cache.has(oldRole.id)) {
//                         await member.roles.remove(oldRole);
//                     }
//                 }

//                 if(rank === 'SERGEANT') {
//                     member.roles.remove(CORPS.EXECUTIVE_BODY.id)
//                     member.roles.remove(CORPS.COMMANDEMENT_BODY.id)
//                     member.roles.remove(CORPS.DIRECTION_BODY.id)
//                     member.roles.add(CORPS.SUPERVISION_BODY.id)
//                 }

//                 if(rank === 'LIEUTENANT') {
//                     member.roles.remove(CORPS.EXECUTIVE_BODY.id)
//                     member.roles.remove(CORPS.SUPERVISION_BODY.id)
//                     member.roles.remove(CORPS.DIRECTION_BODY.id)
//                     member.roles.add(CORPS.COMMANDEMENT_BODY.id)
//                 }

//                 if(rank === 'MAJOR') {
//                     member.roles.remove(CORPS.EXECUTIVE_BODY.id)
//                     member.roles.remove(CORPS.SUPERVISION_BODY.id)
//                     member.roles.remove(CORPS.COMMANDEMENT_BODY.id)
//                     member.roles.add(CORPS.DIRECTION_BODY.id)
//                 }

//                 await member.roles.add(newRole);
                
//                 // Mettre à jour le pseudo
//                 const nickname = member.nickname || member.user.username;
//                 const nameParts = nickname.split(" | ");
//                 const newNickname = nameParts.length > 1 ? nameParts[0] + " | " + RANKS[rank].abbr + " " + nameParts[1].split(" ").slice(1).join(" ") : nickname;
//                 await member.setNickname(newNickname).catch(() => {});
                  
    
//                 interaction.reply(`✅ <@${member.id}> a été promu au grade de **${rank}** et son pseudo a été mis à jour !`);
//             }
    
//             if (interaction.commandName === 'rename') { // DONE
//                 const newName = interaction.options.getString('str');
//                 try {
//                     await interaction.channel.setName(newName);
//                     interaction.reply({ content: `✅ Salon renommé en **${newName}** !`, ephemeral: true });
//                 } catch (err) {
//                     console.error("Erreur lors du renommage du salon.", err);
//                     interaction.reply({ content: "❌ Impossible de renommer le salon.", ephemeral: true });
//                 }
//             }
    
//             if (interaction.commandName === 'clear') { // DONE
//                 const amount = interaction.options.getInteger('amount');
            
//                 if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                     return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
//                 }
        
//                 if (amount < 1 || amount > 100) {
//                     return interaction.reply({ content: "⚠️ Veuillez spécifier un nombre entre 1 et 100.", ephemeral: true });
//                 }
        
//                 try {
//                     await interaction.channel.bulkDelete(amount, true);
//                     interaction.reply({ content: `✅ Vous avez supprimé **${amount}** messages.`, ephemeral: true });
//                 } catch (err) {
//                     console.error("Erreur lors de la suppression des messages.", err);
//                     interaction.reply({ content: "❌ Impossible de supprimer les messages. Vérifiez que je dispose des permissions nécessaires.", ephemeral: true });
//                 }
//             }
    
//             if (interaction.commandName === 'warn') { // DONE
//                 const author = interaction.user.id;
//                 const user = interaction.options.getUser('user').id;
//                 const mark = interaction.options.getString('mark');
                
//                 console.log(`[DEBUG] Avertissement: ${author}, ${user}, ${mark}`);
                
//                 if (!warnFile[user]) {
//                     warnFile[user] = {
//                         "count": 1,
//                         "warn_01": {
//                             "date": new Date().toISOString(),
//                             "mark": mark,
//                             "author": author
//                         }
//                     };
//                 } else {
//                     const count = warnFile[user]["count"] + 1;
//                     const warnTitle = `warn_0${count}`;
                    
//                     warnFile[user]['count'] = count;
//                     warnFile[user][warnTitle] = {
//                         "date": new Date().toISOString(),
//                         "mark": mark,
//                         "author": author
//                     };
//                 }
                
//                 saveWarn();
                
//                 const confirmEmbed = new EmbedBuilder()
//                     .setTitle("⚠️ Avertissement")
//                     .setDescription(`L'utilisateur a été averti.
//                     **Nombre total d'avertissements**: ${warnFile[user]["count"]}
//                     **Raison**: ${mark}`)
//                     .setColor("#ffcc00");
                
//                 interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
//                 console.log("[DEBUG] Membre averti");
//             }
    
//             if (interaction.commandName === 'mute') { // DONE
//                 const executor = interaction.member; // L'utilisateur qui exécute la commande
//                 const user = interaction.options.getUser('user');
//                 const reason = interaction.options.getString('reason');
//                 const duration = interaction.options.getString('temps');
//                 const memberToMute = await interaction.guild.members.fetch(user.id);
        
//                 // Vérifications
//                 if (!memberToMute) {
//                     return interaction.reply({ content: "L'utilisateur n'est pas sur le serveur.", ephemeral: true });
//                 }
//                 if (memberToMute.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                     return interaction.reply({ content: "Vous ne pouvez pas mute un administrateur.", ephemeral: true });
//                 }
//                 if (executor.roles.highest.position <= memberToMute.roles.highest.position) {
//                     return interaction.reply({ content: "Vous ne pouvez pas mute un membre de rang égal ou supérieur au vôtre.", ephemeral: true });
//                 }
        
//                 // Convertir la durée en millisecondes
//                 const timeRegex = /^(\d+)([smhd])$/;
//                 const match = duration.match(timeRegex);
//                 if (!match) {
//                     return interaction.reply({ content: "Format de durée invalide ! Utilisez `10m`, `1h`, `1d`.", ephemeral: true });
//                 }
        
//                 const timeValue = parseInt(match[1]);
//                 const timeUnit = match[2];
//                 let timeoutDuration;
        
//                 switch (timeUnit) {
//                     case 's': timeoutDuration = timeValue * 1000; break;
//                     case 'm': timeoutDuration = timeValue * 60 * 1000; break;
//                     case 'h': timeoutDuration = timeValue * 60 * 60 * 1000; break;
//                     case 'd': timeoutDuration = timeValue * 24 * 60 * 60 * 1000; break;
//                     default: return interaction.reply({ content: "Unité de temps invalide.", ephemeral: true });
//                 }
        
//                 // Appliquer le mute (timeout)
//                 try {
//                     await memberToMute.timeout(timeoutDuration, reason);
//                     await interaction.reply({ content: `✅ ${user} a été mute pour ${duration}. Raison : ${reason}`, ephemeral: false });
    
//                     if (!muteFile[user.id]) {
//                         muteFile[user.id] = {
//                             "count": 1,
//                             "mute_01": {
//                                 "date": new Date().toISOString(),
//                                 "reason": reason,
//                                 "author": interaction.member.user.id,
//                                 "duration": duration
//                             }
//                         };
//                         saveMute()
//                     } else {
//                         const count = warnFile[user]["count"];
//                         const newCount = count + 1;
//                         const muteTitle = `warn_0${newCount}`;
            
//                         muteFile[user.id]['count'] = newCount;
//                         muteFile[user.id][muteTitle] = {
//                             "date": new Date().toISOString(),
//                             "reason": reason,
//                             "author": interaction.member.user.id,
//                             "duration": duration
//                         };
//                         saveMute()
//                     }
    
//                 } catch (error) {
//                     console.error(error);
//                     interaction.reply({ content: "Une erreur est survenue lors du mute.", ephemeral: true });
//                 }
//             }
    
//             if (interaction.commandName === 'shutdown') { // DONE
//                 if (!interaction.member.permissions.has('Administrator')) {
//                     interaction.reply({ content: "Vous n'avez pas la permission d'exécuter cette commande !", ephemeral: true });
//                     return;
//                 }
        
//                 interaction.reply({ content: 'Arrêt du bot...', ephemeral: true });
//                 console.log("Le bot s'arrête sur commande d'un administrateur.")
//                 process.exit(0); // Arrête le processus du bot
//             }

//             if (interaction.commandName === 'ticket') { // DONE
//                 if(config.plugin.ticket_plugin.avaible === true) {
//                     if(interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2) {
    
//                         if(interaction.options.getSubcommand() === 'init') {
//                             console.log('🎫 Ouverture de ticket demandée !');
    
//                             if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                               const ticketInitEmbed = new EmbedBuilder()
//                                 .setTitle("🎟️ Ouvrir un Ticket")
//                                 .setDescription("Veuillez choisir le type de ticket à ouvrir. ⚠️ Toute utilisation abusive sera sanctionnée.")
//                                 .setColor("Yellow");
                            
//                               const ticketInitButton = new ActionRowBuilder()
//                                 .addComponents(
//                                   new ButtonBuilder()
//                                     .setCustomId('cmd')
//                                     .setLabel('👨‍💼 Ticket Commandement')
//                                     .setStyle(ButtonStyle.Primary)
//                                 )
//                                 .addComponents(
//                                   new ButtonBuilder()
//                                     .setCustomId('dir')
//                                     .setLabel('🏢 Ticket Direction')
//                                     .setStyle(ButtonStyle.Primary)
//                                 )
//                                 .addComponents(
//                                     new ButtonBuilder()
//                                       .setCustomId('recruit')
//                                       .setLabel('⛪ Ticket Recrutement')
//                                       .setStyle(ButtonStyle.Primary)
//                                   );
                            
//                               interaction.channel.send({
//                                 embeds: [ticketInitEmbed],
//                                 components: [ticketInitButton]
//                               });
                            
//                               interaction.reply({
//                                 content: "✅ Ticket initialisé !", 
//                                 ephemeral: true
//                               });
                            
//                               console.log(`COMMANDE Un /ticket (init) a été exécuté par ${interaction.user.displayName} 🎫`);
//                             }
                        
//                         }
//                         if(interaction.options.getSubcommand() === 'close') {
//                             console.log('🛑 Fermeture de ticket demandée !');
    
//                             const warnClosing = new EmbedBuilder()
//                               .setTitle("🚨 Fermeture de Ticket")
//                               .setDescription("Êtes-vous sûr de vouloir fermer ce ticket ? 🤔")
//                               .setColor('DarkRed');
                            
//                             const warnClosingB = new ActionRowBuilder()
//                               .addComponents(
//                                 new ButtonBuilder()
//                                   .setCustomId('close_but')
//                                   .setLabel("🔒 Fermer le ticket")
//                                   .setStyle(ButtonStyle.Danger)
//                               );
                            
//                             interaction.channel.send({
//                               embeds: [warnClosing], 
//                               components: [warnClosingB]
//                             });
                            
//                             interaction.reply({
//                               content: "✅ Action effectuée !", 
//                               ephemeral: true
//                             });
                            
//                             delete ticketFile[interaction.channel.id];
//                             saveTicket();
                
//                         }
//                         if (interaction.options.getSubcommand() === 'add') {
//                             console.log('ADD!!!');
                
//                             if (interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2) {
//                                 if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                                     const user = interaction.options.getUser('user');
                        
//                                     if (user) {
//                                         try {            
//                                             console.log("[DEBUG] ticket.json avant modification:", ticketFile);
                        
//                                             if (!ticketFile[interaction.channel.id]) {
//                                                 console.log("[DEBUG] Ticket non trouvé, création...");
//                                                 ticketFile[interaction.channel.id] = { users: [], type: "unknown" };
//                                             }
                        
//                                             const userids = ticketFile[interaction.channel.id].users;
                        
//                                             if (!userids.includes(user.id)) {
//                                                 console.log(`[DEBUG] Ajout de l'utilisateur ${user.id}...`);
//                                                 userids.push(user.id);
//                                                 saveTicket();
//                                             } else {
//                                                 console.log(`[DEBUG] L'utilisateur ${user.id} est déjà dans le ticket.`);
//                                             }
                        
//                                             console.log("[DEBUG] ticket.json après modification:", ticketFile);
                        
//                                             let permissionsArray = userids.map(uid => ({
//                                                 id: uid,
//                                                 allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
//                                             }));
                        
//                                             permissionsArray.push({
//                                                 id: interaction.guild.roles.everyone,
//                                                 deny: [PermissionsBitField.Flags.ViewChannel]
//                                             });
                        
//                                             interaction.channel.permissionOverwrites.set(permissionsArray);
                        
//                                             interaction.reply({ content: `Utilisateur ${user.tag} ajouté au ticket.`, ephemeral: true });
                        
//                                         } catch (err) {
//                                             console.error("Erreur lors de la mise à jour du fichier ticket.json :", err);
//                                             interaction.reply({ content: "Erreur lors de la mise à jour du ticket. Vérifiez les logs.", ephemeral: true });
//                                         }
//                                     }
//                                 } else {
//                                     interaction.reply({ content: "❌ Vous n'avez pas la permission !", ephemeral: true });
//                                 }
//                             } else {
//                                 interaction.reply({ content: "⚠️ Veuillez effectuer la commande dans un ticket.", ephemeral: true });
//                             }
//                         }      
//                         if (interaction.options.getSubcommand() === 'remove') {
//                             console.log('REMOVE!!!');
                
//                             if (interaction.channel.parentId === config.category.ticket || interaction.channel.parentId === config.category.ticket2) {
//                                 if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                                     const user = interaction.options.getUser('user');
                        
//                                     if (user) {
//                                         try {
//                                             console.log("[DEBUG] ticket.json avant modification:", ticketFile);
                        
//                                             if (!ticketFile[interaction.channel.id]) {
//                                                 console.log("[DEBUG] Ticket non trouvé, création...");
//                                                 ticketFile[interaction.channel.id] = { users: [], type: "unknown" };
//                                             }
                        
//                                             const userids = ticketFile[interaction.channel.id].users;
                        
//                                             if (userids.includes(user.id)) {
//                                                 console.log(`[DEBUG] Suppression de l'utilisateur ${user.id}...`);
//                                                 ticketFile[interaction.channel.id].users = userids.filter(id => id !== user.id);
//                                                 saveTicket();
//                                             } else {
//                                                 console.log(`[DEBUG] L'utilisateur ${user.id} n'est pas dans le ticket.`);
//                                             }
                        
//                                             console.log("[DEBUG] ticket.json après modification:", ticketFile);
                        
//                                             let permissionsArray = ticketFile[interaction.channel.id].users.map(uid => ({
//                                                 id: uid,
//                                                 allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
//                                             }));
                        
//                                             permissionsArray.push({
//                                                 id: interaction.guild.roles.everyone,
//                                                 deny: [PermissionsBitField.Flags.ViewChannel]
//                                             });
                        
//                                             interaction.channel.permissionOverwrites.set(permissionsArray);
                        
//                                             interaction.reply({ content: `Utilisateur ${user.tag} retiré du ticket.`, ephemeral: true });
                        
//                                         } catch (err) {
//                                             console.error("Erreur lors de la mise à jour du fichier ticket.json :", err);
//                                             interaction.reply({ content: "Erreur lors de la mise à jour du ticket. Vérifiez les logs.", ephemeral: true });
//                                         }
//                                     }
//                                 } else {
//                                     interaction.reply({ content: "❌ Vous n'avez pas la permission !", ephemeral: true });
//                                 }
//                             } else {
//                                 interaction.reply({ content: "⚠️ Veuillez effectuer la commande dans un ticket.", ephemeral: true });
//                             }
//                         }
//                         if (interaction.options.getSubcommand() === 'lock') {
//                             if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                                 return interaction.reply({ content: "❌ Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
//                             }
                
//                             const ticketChannelId = interaction.channel.id;
//                             if (!ticketFile[ticketChannelId]) {
//                                 return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
//                             }
                
//                             const userids = ticketFile[ticketChannelId]['users'];
//                             let permissionOverwrites = [
//                                 {
//                                     id: interaction.guild.roles.everyone.id,
//                                     deny: [PermissionsBitField.Flags.ViewChannel]
//                                 },
//                                 ...userids.map(id => ({
//                                     id: id,
//                                     allow: [PermissionsBitField.Flags.ViewChannel],
//                                     deny: [PermissionsBitField.Flags.SendMessages]
//                                 }))
//                             ];
                            
//                             interaction.channel.permissionOverwrites.set(permissionOverwrites);
//                             ticketFile[ticketChannelId]['islock'] = true;
//                             saveTicket();
                
//                             const lockedEmbedTicket = new EmbedBuilder()
//                                 .setTitle('🔒 Ticket verrouillé !')
//                                 .setColor('Red');
                            
//                             const unlockButton = new ActionRowBuilder()
//                                 .addComponents(new ButtonBuilder()
//                                     .setCustomId('unlock')
//                                     .setLabel('Déverrouiller le ticket')
//                                     .setStyle(ButtonStyle.Success));
                
//                             interaction.channel.send({ embeds: [lockedEmbedTicket], components: [unlockButton] });
//                             console.log(`[TICKET] Ticket ID ${interaction.channel.id} verrouillé.`);
                
//                             return interaction.reply({ content: '✅ Le ticket a été verrouillé avec succès !', ephemeral: true });
//                         }
//                         if (interaction.options.getSubcommand() === 'unlock') {
//                             if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                                 return interaction.reply({ content: "❌ Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
//                             } else {
//                                 const ticketChannelId = interaction.channel.id;
//                             if (!ticketFile[ticketChannelId]) {
//                                 return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
//                             }
                
//                             const userids = ticketFile[ticketChannelId]['users'];
//                             let permissionOverwrites = [
//                                 {
//                                     id: interaction.guild.roles.everyone.id,
//                                     deny: [PermissionsBitField.Flags.ViewChannel]
//                                 },
//                                 ...userids.map(id => ({
//                                     id: id,
//                                     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
//                                 }))
//                             ];
                            
//                             interaction.channel.permissionOverwrites.set(permissionOverwrites);
//                             ticketFile[ticketChannelId]['islock'] = false;
//                             saveTicket();
                
//                             const unlockedEmbedTicket = new EmbedBuilder()
//                                 .setTitle('🔓 Ticket déverrouillé !')
//                                 .setColor('Yellow');
                
//                             interaction.channel.send({ embeds: [unlockedEmbedTicket] });
//                             console.log(`[TICKET] Ticket ID ${interaction.channel.id} déverrouillé.`);
                
//                             return interaction.reply({ content: '✅ Le ticket a été déverrouillé avec succès !', ephemeral: true });
//                             }
                
                            
//                         }
//                         if (interaction.options.getSubcommand() === 'info') {
//                             if (interaction.options.getSubcommand() === 'info') {
//                                 if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                                     return interaction.reply({ content: "❌ Vous n'avez pas la permission d'exécuter cette commande.", ephemeral: true });
//                                 } else {
//                                     const ticketChannelId = interaction.channel.id;
//                                     if (!ticketFile[ticketChannelId]) {
//                                         return interaction.reply({ content: "⚠️ Aucune information trouvée pour ce ticket.", ephemeral: true });
//                                     }
                        
//                                     const ticketData = ticketFile[ticketChannelId];
//                                     const userMentions = ticketData.users.map(id => `<@${id}>`).join(', ') || "Aucun utilisateur";
//                                     const ticketAuthTb = interaction.channel.name.split('-');
                        
//                                     const embed = new EmbedBuilder()
//                                         .setTitle(`📌 Information sur le Ticket n°${ticketData.nb}`)
//                                         .setDescription(
//                                             `👥 **Utilisateurs présents :** ${userMentions}` +
//                                             `\n🆔 **Numéro du ticket :** ${ticketData.nb}` +
//                                             `\n👤 **Auteur du ticket :** ${ticketAuthTb[1] || "Inconnu"}` +
//                                             `\n📌 **Nom du ticket :** ${ticketData.ticketname}` +
//                                             `\n📂 **Type du ticket :** ${ticketData.type}` +
//                                             `\n🔒 **Verrouillé :** ${ticketData.islock ? "Oui" : "Non"}`
//                                         )
//                                         .setColor("#00AE86");
                        
//                                     interaction.reply({ embeds: [embed] });
//                                 }
                    
    
//                             }
//                         }
//                     } else {
//                         interaction.reply({content: 'Mauvais salon', ephemeral: true})
//                         console.error('Mauvais salon')
//                     }
//                 } else {
//                     console.err("Plugin désactivé")
//                     interaction.reply({content:"Plugin désactivé", ephemeral: true})
//                 }
//             }

//             if (interaction.commandName === 'infoshift') { //DONE
//                 const targetUser = interaction.options.getUser('utilisateur');
//                 const targetId = targetUser.id;
                
//                 if (!shiftFile[targetId] || Object.keys(shiftFile[targetId]).length === 0) {
//                     return interaction.reply({ content: `❌ <@${targetId}> n'a aucun shift enregistré.`, ephemeral: true });
//                 }
                
//                 let historyText = Object.entries(shiftFile[targetId])
//                     .map(([date, durations]) => `**${date}** : ${durations.join(', ')}`)
//                     .join('\n');
                
//                 const embed = new EmbedBuilder()
//                     .setTitle(`📊 Historique des shifts de ${targetUser.username}`)
//                     .setDescription(historyText)
//                     .setColor("Blue");
                
//                 interaction.reply({ embeds: [embed] });
                
//             }

//             if (interaction.commandName === 'openservice') { //DONE
//                 if (interaction.isChatInputCommand() && interaction.commandName === 'openservice') {
//                     const embed = new EmbedBuilder()
//                         .setTitle('Qui sera présent ce soir ?')
//                         .setDescription('Veuillez indiquer votre présence en appuyant sur un bouton ci-dessous.')
//                         .setColor(0x00AE86)
//                         .addFields(
//                             { name: '✅ Oui', value: 'Aucun', inline: true },
//                             { name: '❌ Non', value: 'Aucun', inline: true },
//                             { name: '🤔 Peut-être', value: 'Aucun', inline: true }
//                         );
            
//                     const buttons = new ActionRowBuilder()
//                         .addComponents(
//                             new ButtonBuilder()
//                                 .setCustomId('yes')
//                                 .setLabel('Oui')
//                                 .setStyle(ButtonStyle.Success),
//                             new ButtonBuilder()
//                                 .setCustomId('no')
//                                 .setLabel('Non')
//                                 .setStyle(ButtonStyle.Danger),
//                             new ButtonBuilder()
//                                 .setCustomId('maybe')
//                                 .setLabel('Peut-être')
//                                 .setStyle(ButtonStyle.Secondary)
//                         );
            
//                         const message = await interaction.reply({ 
//                             embeds: [embed], 
//                             components: [buttons], 
//                             fetchReply: true, // ✅ Assurez-vous de récupérer l'ID
//                             content: "@everyone, qui sera présent ce soir ?" 
//                         });
//                         globalThis.clientData[interaction.guildId] = { 
//                             messageId: message.id, 
//                             participants: { yes: [], no: [], maybe: [] 
//                             }
//                         };
//                         config.openservice_last_id = message.id
//                         config.openservice_participants = [
//                             yes= [],
//                             no= [],
//                             maybe= []
//                         ]
//                         fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4), 'utf8');

//                     console.log("✅ Données stockées :", globalThis.clientData[interaction.guildId]);

                    
//                 }
//             }
//         }
//         // if (interaction.commandName === 'help') { //DONE
//         //     const helpEmbed = new EmbedBuilder()
//         //     .setTitle("📜 Liste des commandes disponibles")
//         //     .setDescription("Voici la liste des commandes que vous pouvez utiliser sur ce serveur :")
//         //     .setColor("Blue")
//         //     .addFields(
//         //         { name: "/ban", value: "Bannit un membre du serveur. Arguments : `user` (utilisateur à bannir), `reason` (raison), `temp` (durée en jours, optionnel)" },
//         //         { name: "/kick", value: "Expulse un membre du serveur. Arguments : `user` (utilisateur à expulser), `reason` (raison)" },
//         //         { name: "/warn", value: "Ajoute un avertissement à un membre. Arguments : `user` (utilisateur), `mark` (motif). Sous-commandes : `info` (obtenir le nombre d'avertissements), `warn` (ajouter un avertissement)" },
//         //         { name: "/mute", value: "Rend un membre muet temporairement. Arguments : `user` (utilisateur), `reason` (raison), `temps` (durée)" },
//         //         { name: "/ticket", value: "Gère les tickets de support. Sous-commandes : `init`, `add` (ajouter un membre, avec `user`), `remove` (retirer un membre, avec `user`), `archive`, `close`, `lock`, `unlock`, `info`" },
//         //         { name: "/shutdown", value: "Arrête le bot." },
//         //         { name: "/userinfo", value: "Affiche des informations sur un utilisateur. Arguments : `user` (utilisateur)" },
//         //         { name: "/send", value: "Envoie un message privé à un utilisateur. Arguments : `auth` (autorisation), `user` (utilisateur), `obj` (objet), `msg` (message)" },
//         //         { name: "/clear", value: "Supprime des messages dans un salon." },
//         //         { name: "/ping", value: "Vérifie la latence du bot." },
//         //         { name: "/rename", value: "Renomme un salon. Arguments : `str` (nouveau nom)" },
//         //         { name: "/shift", value: "Démarre ou arrête un service." },
//         //         { name: "/infoshift", value: "Obtenir les informations de l'intégralité des services de l'utilsateur. Arguments : `user`" },
//         //         { name: "/promote", value: "Promouvoir un utilisateur à un grade supérieur. Arguments : `user` (utilisateur), `grade` (grade à attribuer, choisir parmi les grades disponibles)" },
//         //         { name: "/recruit", value: "Recruter un utilisateur. Arguments : `user` (utilisateur), `indicatif` (indicatif à attribuer au membre), `prénom & nom` (prénom et nom du membre"}
//         //     )
//         //     .setFooter({ text: "Utilisez chaque commande avec '/' suivi du nom de la commande." });
        

//         //     interaction.reply({embeds: [helpEmbed], ephemeral: false})
//         // }

//         if (interaction.commandName === 'shift') {//DONE
            
//             const userId = interaction.user.id;
//             const now = Date.now();

//             const dateKey = `service du ${new Date().toISOString().split('T')[0]}`;
            
//             if (!shiftFile[userId]) {
//                 shiftFile[userId] = {};
//             }
            
//             if (shiftFile[userId].start) {
//                 const startTime = shiftFile[userId].start;
//                 const durationMs = now - startTime;
//                 const durationSec = Math.floor(durationMs / 1000);
//                 const hours = Math.floor(durationSec / 3600);
//                 const minutes = Math.floor((durationSec % 3600) / 60);
//                 const seconds = durationSec % 60;
                
//                 const durationMsg = `⏳ <@${userId}> a terminé son shift après **${hours}h ${minutes}m ${seconds}s** !`;
                
//                 if (!shiftFile[userId][dateKey]) {
//                     shiftFile[userId][dateKey] = [];
//                 }
//                 shiftFile[userId][dateKey].push(`${hours}h ${minutes}m ${seconds}s`);
                
//                 delete shiftFile[userId].start;
//                 saveShift(shiftFile);
                
//                 await interaction.reply(durationMsg);
//             } else {
//                 shiftFile[userId].start = now;
//                 saveShift(shiftFile);
            
//                 const embed = new EmbedBuilder()
//                     .setDescription(`✅ <@${userId}> a commencé son service !`)
//                     .setColor("Yellow");
//                 interaction.channel.send({ embeds: [embed] });
//                 await interaction.reply({ content: "done !", ephemeral: true });
//         }
//         }
//     }

//     if (interaction.isButton()) {

//         const closeTicketEmbed = new EmbedBuilder()
//         .setTitle(`Bienvenue dans votre ticket ${interaction.user.tag} ! `)
//         .setDescription(`Ci dessous des boutons vous permettant de contrôler le ticket ! À votre service <@${interaction.user.id}> !`)
//         .setColor("DarkButNotBlack")
//         const closeTicketButton = new ActionRowBuilder()
//         .addComponents(new ButtonBuilder()
//             .setCustomId('close_but')
//             .setLabel("Fermer le ticket")
//             .setStyle(ButtonStyle.Danger))
//         .addComponents(new ButtonBuilder()
//             .setCustomId('lock')
//             .setLabel("Vérouiller le ticket.")
//             .setStyle(ButtonStyle.Secondary))
//         .addComponents(new ButtonBuilder()
//            .setCustomId('archive')
//            .setLabel("Permet d'archiver le ticket.")
//            .setStyle(ButtonStyle.Success))

//         if(interaction.customId === 'yes' || interaction.customId === 'no' || interaction.customId === 'maybe') {
//             console.log("🔵 Interaction détectée :", interaction.customId);

//             const clientData = globalThis.clientData[interaction.guildId];

//             var messageId;
//             var participants;

//             if(!clientData) {
//                 messageId = config.openservice_last_id
//                 participants = config.openservice_participants
//             }

            
//             console.log(clientData.messageId)
//             console.log(messageId, participants)

            
//             console.log("📌 ID du message enregistré :", messageId);
//             console.log("📌 ID du message de l'interaction :", interaction.message.id);


//             if (interaction.message.id !== messageId) {
//                 console.log("🔴 Le message de l'interaction ne correspond pas !");
//                 return;
//             }
            
//             console.log("🟢 Avant modification des participants :", participants);
            
//             // Mise à jour des participants
//             const username = interaction.user.username;
//             const category = interaction.customId;
            
//             const wasInYes = participants.yes.includes(username);
            
//             // Vérifier si l'utilisateur était déjà dans cette catégorie
//             if (participants[category].includes(username)) {
//                 participants[category] = participants[category].filter(user => user !== username);
//             } else {
//                 for (const key in participants) {
//                     participants[key] = participants[key].filter(user => user !== username);
//                 }
//                 participants[category].push(username);
//             }
            
//             console.log("🟢 Après modification des participants :", participants);
            
//             // Création de l'embed mis à jour
//             const updatedEmbed = new EmbedBuilder()
//                 .setTitle('Qui sera présent ce soir ?')
//                 .setDescription('Veuillez indiquer votre présence en appuyant sur un bouton ci-dessous.')
//                 .setColor(0x00AE86)
//                 .addFields(
//                     { name: '✅ Oui', value: participants.yes.length ? participants.yes.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true },
//                     { name: '❌ Non', value: participants.no.length ? participants.no.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true },
//                     { name: '🤔 Peut-être', value: participants.maybe.length ? participants.maybe.map(name => `\`${name}\``).join(', ') : 'Aucun', inline: true }
//                 );
            
//             console.log("🟢 Embed mis à jour :", updatedEmbed);
            
//             await interaction.deferUpdate();
//             await interaction.editReply({ content: "@everyone, qui sera présent ce soir ?", embeds: [updatedEmbed] });
            
//             config.openservice_participants = [
//                 participants.yes,
//                 participants.no,
//                 participants.maybe
//             ]
//             fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4), 'utf8');

            

//             // Gestion du thread
//             const threadName = `Présents - ${new Date().toLocaleDateString()}`;
//             let thread = interaction.message.channel.threads.cache.find(t => t.name === threadName);
    
//             if (category === 'yes') {
//                 if (!thread) {
//                     thread = await interaction.message.startThread({
//                         name: threadName,
//                         autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
//                     });
//                 }
//                 if (participants.yes.includes(username)) {
//                     await thread.members.add(interaction.user.id);
//                 } else {
//                     await thread.members.remove(interaction.user.id);
//                 }
//             } else if (wasInYes && thread) {
//                 // Retirer l'utilisateur du thread s'il était dans "Oui" et change de catégorie
//                 await thread.members.remove(interaction.user.id);
//             }
//         }

//         if(interaction.customId === 'cmd'){
//             console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`)

//             nbTicket++;
//             console.log(nbTicket);
//             config["plugin"]['ticket_plugin']['var'] = nbTicket
//             saveConfig()
//             interaction.guild.channels.create({
//                 name: `${interaction.customId}-${interaction.user.tag}`,
//                 parent: config.category.ticket2,
//                 permissionOverwrites:[
//                     {
//                         id: interaction.user.id,
//                         allow: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     {
//                         id: config.role.cmd,
//                         allow: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     {
//                         id: interaction.guild.id,
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     }
//                 ]
//             }).then(channel => {
//                 console.log('[ACTION BUTTON] New channel create')

//                 ticketFile[channel.id] = {
//                     "users": [interaction.user.id],
//                     "type": interaction.customId,
//                     "ticketname": channel.name,
//                     "islock": false,
//                     "isarchived": false,
//                     "nb": config.plugin.ticket_plugin.var

//                 }
//                 saveTicket()

//                 channel.send({embeds: [closeTicketEmbed], components: [closeTicketButton]})
//                 interaction.reply({content: 'Done !', ephemeral:true})
//             })
//         }

//         if (interaction.customId === 'recruit') {
//             console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`);
        
//             try {
//                 const modal = new ModalBuilder()
//                     .setCustomId('recruit_modal')
//                     .setTitle('Formulaire de Recrutement');
        
//                 const nameInput = new TextInputBuilder()
//                     .setCustomId('roleplay_name')
//                     .setLabel('Nom (Rôleplay)')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true);
        
//                 const firstNameInput = new TextInputBuilder()
//                     .setCustomId('roleplay_firstname')
//                     .setLabel('Prénom (Rôleplay)')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true);
        
//                 const birthDateInput = new TextInputBuilder()
//                     .setCustomId('roleplay_birthdate')
//                     .setLabel('Date de naissance (Rôleplay)')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true);
        
//                 const nationalityInput = new TextInputBuilder()
//                     .setCustomId('roleplay_nationality')
//                     .setLabel('Nationalité (Rôleplay)')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true);

//                 const specialUnitInput = new TextInputBuilder()
//                     .setCustomId('roleplay_unit')
//                     .setLabel("Indiquez l'unité spéciale voulue.")
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true);
        
//                 modal.addComponents(
//                     new ActionRowBuilder().addComponents(nameInput),
//                     new ActionRowBuilder().addComponents(firstNameInput),
//                     new ActionRowBuilder().addComponents(birthDateInput),
//                     new ActionRowBuilder().addComponents(nationalityInput),
//                     new ActionRowBuilder().addComponents(specialUnitInput)
//                 );
        
//                 console.log("📩 Affichage du modal...");
//                 await interaction.showModal(modal);
        
//             } catch (err) {
//                 console.error("❌ Erreur lors de l'affichage du modal :", err);
//                 return interaction.reply({ content: "❌ Une erreur est survenue, veuillez réessayer.", ephemeral: true });
//             }
//         }

//         if(interaction.customId === 'dir'){
//             console.log(`[ACTION BUTTON] ${interaction.customId} of command /ticket has been used.`)

//             nbTicket++;
//             interaction.guild.channels.create({
//                 name: `${interaction.customId}-${interaction.user.tag}`,
//                 parent: config.category.ticket2,
//                 permissionOverwrites:[
//                     {
//                         id: interaction.user.id,
//                         allow: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     {
//                         id: config.role.dir,
//                         allow: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     {
//                         id: interaction.guild.id,
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     }
//                 ]
                
//             }).then(channel => {

//                 ticketFile[channel.id] = {
//                     "users": [interaction.user.id],
//                     "type": interaction.customId,
//                     "ticketname": channel.name,
//                     "islock": false,
//                     "isarchived": false,
//                     "nb": config.plugin.ticket_plugin.var
//                 }
//                 saveTicket()

//                 console.log('[ACTION BUTTON] New channel create')


//                 channel.send({embeds: [closeTicketEmbed], components: [closeTicketButton]})
//                 interaction.reply({content: 'Done !', ephemeral:true})
//             })
//         }

//         if(interaction.customId === 'close_but'){
//             if (interaction.member.permissions.has(PermissionsBitField.Flags.AddReactions)) {
//                 interaction.channel.delete();
//                 delete ticketFile[interaction.channel.id];
//                 saveTicket();
                
//                 console.error("🗑️ [ACTION BUTTON] : Ticket supprimé avec succès.");
            
//             } else {
//                 interaction.reply({
//                     content: "⛔ **Accès refusé !** Vous n'avez pas les permissions nécessaires pour supprimer ce ticket.",
//                     ephemeral: true
//                 });
//             }
            

//         }

//         if(interaction.customId === 'lock') {
//             if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 const userids = ticketFile[interaction.channel.id]['users']; // Tableau d'IDs utilisateur

//                 let permissionOverwrites = [
//                     {
//                         id: interaction.guild.roles.everyone.id, // Bloque @everyone
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     ...userids.map(id => ({
//                         id: id,
//                         allow: [PermissionsBitField.Flags.ViewChannel], // Seuls les utilisateurs listés peuvent voir le channel
//                         deny: [PermissionsBitField.Flags.SendMessages] // Mais ne peuvent pas envoyer de messages
//                     }))
//                 ];

//                 interaction.channel.permissionOverwrites.set(permissionOverwrites);

//                 ticketFile[interaction.channel.id]['islock'] = true
//                 saveTicket()
//                 console.log(`Ticket ID ${interaction.channel.id} a été vérouillé dans la console.`)

//                 const lockedEmbedTicket = new EmbedBuilder()
//         .setTitle("🔒 Ticket verrouillé !")
//         .setDescription("Ce ticket a été verrouillé. Seul le personnel autorisé peut désormais y accéder.")
//         .setColor("Yellow");

//         const unlockedButtonTicket = new ActionRowBuilder()
//         .addComponents(
//             new ButtonBuilder()
//                 .setCustomId("unlock")
//                 .setLabel("🔓 Déverrouiller le ticket")
//                 .setStyle(ButtonStyle.Success)
//         );

//                 interaction.channel.send({embeds: [lockedEmbedTicket], components:[unlockedButtonTicket]})
//                 console.log("[TICKET] Ticket Vérouillé")
//                 // channelLog.send({embeds: [lockedEmbedTicket]})

//                 interaction.reply({content: 'Done !', ephemeral:true}) 
//             } else {
//                     interaction.reply({content:"Vous n'avez pas la permission !", ephemeral:true})

//             }
//         }

//         if(interaction.customId === 'unlock'){
//             if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 const userids = ticketFile[interaction.channel.id]['users']; // Tableau d'IDs utilisateur

//                 let permissionOverwrites = [
//                     {
//                         id: interaction.guild.roles.everyone.id, // Bloque @everyone
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     ...userids.map(id => ({
//                         id: id,
//                         allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Seuls les utilisateurs listés peuvent voir le channel
//                     }))
//                 ];
        
//                 interaction.channel.permissionOverwrites.set(permissionOverwrites);
        
//                 ticketFile[interaction.channel.id]['islock'] = false
//                 saveTicket()
//                 console.log(`Ticket ID ${interaction.channel.id} a été dévérouillé dans la console.`)


//                 const unlockedEmbedTicket = new EmbedBuilder()
//                 .setTitle("🔓 Ticket déverrouillé !")
//                 .setDescription("Ce ticket est à nouveau accessible. Vous pouvez continuer la conversation.")
//                 .setColor("Yellow");
            
//                 interaction.channel.send({embeds: [unlockedEmbedTicket]})
//                 //channelLog.send({embeds: [unlockedEmbedTicket]})
//                 console.log("[TICKET] Ticket dévérouillé")

//                 interaction.reply({content: 'Done !', ephemeral:true}) 
//             } else {
//                 interaction.reply({content:"Vous n'avez pas la permission !", ephemeral:true})

//             }
//         }

//         if (interaction.customId === 'archive') {
//             if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
//                 interaction.channel.permissionOverwrites.set([
//                     {
//                         id: interaction.guild.roles.everyone, // Bloque tout le monde
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     },
//                     ...interaction.channel.permissionOverwrites.cache.map(overwrite => ({
//                         id: overwrite.id,
//                         deny: [PermissionsBitField.Flags.ViewChannel]
//                     }))
//                 ]);
        
//                 interaction.channel.setParent(config.category.archive);
//                 interaction.reply({ content: "Ticket archivé !", ephemeral: true });
        
//                 ticketFile[interaction.channel.id]['isarchived'] = true;
//                 saveTicket();
//                 console.log(`Ticket ID ${interaction.channel.id} a été archivé dans la console.`);
//             } else {
//                 interaction.reply({ content: "Vous n'avez pas la permission !", ephemeral: true });
//             }
//         }  
//     }

//     if (interaction.isModalSubmit() && interaction.customId === 'recruit_modal') {
//         console.log("📩 Formulaire soumis par :", interaction.user.tag);
    
//         try {
//             // 🔹 Récupérer les valeurs du formulaire
//             const name = interaction.fields.getTextInputValue('roleplay_name');
//             const firstName = interaction.fields.getTextInputValue('roleplay_firstname');
//             const birthDate = interaction.fields.getTextInputValue('roleplay_birthdate');
//             const nationality = interaction.fields.getTextInputValue('roleplay_nationality');
//             const speicalUnit = interaction.fields.getTextInputValue('roleplay_unit')
    
//             console.log("✅ Données reçues :", { name, firstName, birthDate, nationality });
    
//             // 🔹 Vérifier que la catégorie des tickets est bien définie
//             console.log("🛠️ Catégorie de ticket :", config.category.ticket2);
//             if (!config.category.ticket2) {
//                 console.error("❌ La catégorie des tickets n'est pas définie !");
//                 return interaction.reply({ content: "❌ Erreur interne : catégorie de ticket manquante.", ephemeral: true });
//             }
    
//             // 🔹 Création du ticket (salon)
//             nbTicket++;
//             config["plugin"]['ticket_plugin']['var'] = nbTicket;
//             saveConfig();
    
//             console.log("📂 Création du salon en cours...");
    
//             const channel = await interaction.guild.channels.create({
//                 name: `recruit-${interaction.user.username}`,
//                 type: ChannelType.GuildText,
//                 parent: config.category.ticket2,
//                 permissionOverwrites: [
//                     { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
//                     { id: config.role.spv, allow: [PermissionsBitField.Flags.ViewChannel] },
//                     { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] }
//                 ]
//             });
    
//             console.log(`✅ Salon créé : ${channel.name} (${channel.id})`);
    
//             // 🔹 Stocker les infos du ticket
//             ticketFile[channel.id] = {
//                 users: [interaction.user.id],
//                 type: interaction.customId,
//                 ticketname: channel.name,
//                 islock: false,
//                 isarchived: false,
//                 nb: config.plugin.ticket_plugin.var
//             };
//             saveTicket();
    
//             // 🔹 Création de l'embed contenant les infos du candidat
//             const embed = new EmbedBuilder()
//                 .setTitle("Nouvelle Candidature 📩")
//                 .setColor("Blue")
//                 .addFields(
//                     { name: "👤 Nom", value: name, inline: true },
//                     { name: "📝 Prénom", value: firstName, inline: true },
//                     { name: "📅 Date de naissance", value: birthDate, inline: false },
//                     { name: "🌍 Nationalité", value: nationality, inline: false },
//                     { name: "📌 Candidat", value: `<@${interaction.user.id}>`, inline: false },
//                     { name: "📚 Unité spéciale désiré", value: speicalUnit, inline: false}
//                 )
//                 .setTimestamp()
//                 .setFooter({ text: "Système de recrutement", iconURL: interaction.user.displayAvatarURL() });
    
//             const closeTicketEmbed = new EmbedBuilder()
//                 .setTitle(`Bienvenue dans votre ticket ${interaction.user.tag} ! `)
//                 .setDescription(`Ci dessous des boutons vous permettant de contrôler le ticket ! À votre service <@${interaction.user.id}> !`)
//                 .setColor("Red")
//             const closeTicketButton = new ActionRowBuilder()
//                 .addComponents(new ButtonBuilder()
//                     .setCustomId('close_but')
//                     .setLabel("Fermer le ticket")
//                     .setStyle(ButtonStyle.Danger))
//                 .addComponents(new ButtonBuilder()
//                     .setCustomId('lock')
//                     .setLabel("Vérouiller le ticket.")
//                     .setStyle(ButtonStyle.Secondary))
//                 .addComponents(new ButtonBuilder()
//                    .setCustomId('archive')
//                    .setLabel("Permet d'archiver le ticket.")
//                    .setStyle(ButtonStyle.Success))

//             const warnUnitEmbed = new EmbedBuilder()
//                 .setTitle(`⚠️ Attention ${interaction.user.tag}`)
//                 .setDescription("Si vous avez ci-joint **renseigné une unitée spéciale**, il faudra vous soumettre à d'autre **conditions** au recrutement. "
//                     +"\nEn effet, **votre admission dans l'unité** dépend de la **décision ultime du Commander** de l'unité dont vous désirez l'intégration."
//                     +"\nVous devrez vous soumettre à une **enquête interne** opérée par les *affaires l'internes*, par le *corps de direction* et le *corps de commandement*."
//                     +"\nCela signifie que vous devez être **apte juridiquement** et par conséquent appartenir au BCSO depuis un **certain temps**."
//                     +"\n"
//                     +"\nSi vous venez d'intégrer le BCSO ou même que ce ticket et voué à votre recrutement au sein du BCSO, votre réponse dans la catégorie **'Unité Spéciale'** est **caduque** et est **voué à un refus**."
//                 )
//                 .setColor('Yellow')

//             // 🔹 Envoyer l'embed dans le salon
//             await channel.send({ embeds: [embed, closeTicketEmbed, warnUnitEmbed], components: [closeTicketButton] });
    
//             // 🔹 Informer l'utilisateur
//             await interaction.reply({ content: `✅ Votre candidature a été envoyée avec succès ! Un ticket a été ouvert ici : <#${channel.id}>`, ephemeral: true });
    
//         } catch (err) {
//             console.error("❌ Erreur lors du traitement du formulaire :", err);
//             await interaction.reply({ content: "❌ Une erreur est survenue lors de la création du ticket.", ephemeral: true });
//         }
//     }

// })


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
 

module.exports = {
    name: 'interactionCreate',
    async executeCommands(interaction) {
        if(interaction.isCommand){    
            if (interaction.commandName === 'shift') {//DONE
                
                const userId = interaction.user.id;
                const now = Date.now();
    
                const dateKey = `service du ${new Date().toISOString().split('T')[0]}`;
                
                if (!shiftFile[userId]) {
                    shiftFile[userId] = {};
                }
                
                if (shiftFile[userId].start) {
                    const startTime = shiftFile[userId].start;
                    const durationMs = now - startTime;
                    const durationSec = Math.floor(durationMs / 1000);
                    const hours = Math.floor(durationSec / 3600);
                    const minutes = Math.floor((durationSec % 3600) / 60);
                    const seconds = durationSec % 60;
                    
                    const durationMsg = `⏳ <@${userId}> a terminé son shift après **${hours}h ${minutes}m ${seconds}s** !`;
                    
                    if (!shiftFile[userId][dateKey]) {
                        shiftFile[userId][dateKey] = [];
                    }
                    shiftFile[userId][dateKey].push(`${hours}h ${minutes}m ${seconds}s`);
                    
                    delete shiftFile[userId].start;
                    saveShift(shiftFile);
                    
                    await interaction.reply(durationMsg);
                } else {
                    shiftFile[userId].start = now;
                    saveShift(shiftFile);
                
                    const embed = new EmbedBuilder()
                        .setDescription(`✅ <@${userId}> a commencé son service !`)
                        .setColor("Yellow");
                    interaction.channel.send({ embeds: [embed] });
                    await interaction.reply({ content: "done !", ephemeral: true });
            }
            }
        }
    }
}