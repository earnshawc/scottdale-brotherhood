const Discord = require('discord.js');

exports.run = async (bot, message, support_loop, support_cooldown) => {
    const authorrisbot = new Discord.RichEmbed()
    .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
    
    if (message.content == '/hold'){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic == 'Жалоба на рассмотрении.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "493459379878625320");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
        const imageemb = new Discord.RichEmbed()
        .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
        `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
        `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
        `**Количество вопросов за все время: ${info_rep[0]}**\n` +
        `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
        `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
        `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
        message.channel.setTopic('Жалоба на рассмотрении.')
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        }
        message.delete();
    }

    if (!support_loop.has(message.guild.id) && message.channel.name != "support"){
        support_loop.add(message.guild.id)
        setTimeout(() => {
            if (support_loop.has(message.guild.id)) support_loop.delete(message.guild.id);
        }, 600000);
        message.guild.channels.forEach(async channel => {
            if (channel.name.startsWith('ticket-')){
                if (message.guild.channels.find(c => c.id == channel.parentID).name == 'Корзина'){
                    let log_channel = message.guild.channels.find(c => c.name == "reports-log");
                    channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async msg => {
                                let s_now = new Date().valueOf() - 86400000;
                                if (msg.createdAt.valueOf() < s_now){
                                    let archive_messages = [];
                                    await channel.fetchMessages({limit: 100}).then(async messagestwo => {
                                        messagestwo.forEach(async msgcopy => {
                                            let date = new Date(+msgcopy.createdAt.valueOf() + 10800000);
                                            let formate_date = `[${date.getFullYear()}-` + 
                                            `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                                            `${date.getDate().toString().padStart(2, '0')} ` + 
                                            `${date.getHours().toString().padStart(2, '0')}-` + 
                                            `${date.getMinutes().toString().padStart(2, '0')}-` + 
                                            `${date.getSeconds().toString().padStart(2, '0')}]`;
                                            if (!msgcopy.embeds[0]){
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }else{
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[1].value}`);
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[0].value}`);
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }
                                        });
                                    });
                                    let i = archive_messages.length - 1;
                                    while (i>=0){
                                        await fs.appendFileSync(`./${channel.name}.txt`, `${archive_messages[i]}\n`);
                                        i--
                                    }
                                    await log_channel.send(`\`[SYSTEM]\` \`Канал ${channel.name} был удален. [24 часа в статусе 'Закрыт']\``, { files: [ `./${channel.name}.txt` ] });
                                    channel.delete();
                                    fs.unlinkSync(`./${channel.name}.txt`);
                                }
                            });
                        }
                    });
                }else if(message.guild.channels.find(c => c.id == channel.parentID).name == 'Активные жалобы'){
                    let log_channel = message.guild.channels.find(c => c.name == "spectator-chat");
                    channel.fetchMessages({limit: 1}).then(messages => {
                        if (messages.size == 1){
                            messages.forEach(msg => {
                                let s_now = new Date().valueOf() - 18000000;
                                if (msg.createdAt.valueOf() < s_now){
                                    log_channel.send(`\`[SYSTEM]\` \`Жалоба\` <#${channel.id}> \`уже более 5-ти часов ожидает проверки!\``);
                                    channel.send(`\`[SYSTEM]\` \`Привет! Я напомнил модераторам про твое обращение!\``)
                                }
                            });
                        }
                    });
                }
            }
        });
        // UNWARN SYSTEM
        let dataserver = bot.guilds.find(g => g.id == "493459379878625320");
        dataserver.channels.forEach(async channel => {
            if (channel.type=="text"){
                if (channel.name != 'administration' && channel.name != 'accounts' && channel.name != 'bad-words' && channel.name != 'err-code' && channel.name != 'config'){
                    await channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async sacc => {
                                let str = sacc.content;
                                let moderation_level = str.split('\n')[0].match(re)[0];
                                let moderation_warns = str.split('\n')[1].match(re)[0];
                                let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
                                let moderation_reason = [];
                                let user_reason = [];
                                let moderation_time = [];
                                let user_time = [];
                                let moderation_give = [];
                                let user_give = [];
            
                                let circle = 0;
                                while (+moderation_warns > circle){
                                    moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
                                    moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
                                    moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
                                    circle++;
                                }
                
                                circle = 0;
				let rem = 0;
                                while (+user_warns > circle){
                                    let myDate = new Date().valueOf();
                                    if (+str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1] > myDate){
                                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                                    }else{
					rem++
                                        let genchannel = message.guild.channels.find(c => c.name == "general");
                                        genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 3 дня]\``, authorrisbot);
                                    }
                                    circle++;
                                }
				user_warns = +user_warns - +rem;
                                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                                `Предупреждения модератора: ${moderation_warns}`;
                                for (var i = 0; i < moderation_reason.length; i++){
                                    text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                                }
                                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                                for (var i = 0; i < user_reason.length; i++){
                                    text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                                }
                                if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
                                    channel.delete();
                                }else{
                                    sacc.edit(text_end);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    
    if (message.channel.name == "support"){
        if (message.member.bot) return message.delete();
        if (support_cooldown.has(message.author.id)) {
            return message.delete();
        }
        support_cooldown.add(message.author.id);
        setTimeout(() => {
            if (support_cooldown.has(message.author.id)) support_cooldown.delete(message.author.id);
        }, 300000);
        let id_mm;
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "493459379878625320");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                await message.channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message){
            await message.channel.send(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
            `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
            `**Количество вопросов за все время: 0**\n` +
            `**Необработанных модераторами: 0**\n` +
            `**Вопросы на рассмотрении: 0**\n` +
            `**Закрытых: 0**`).then(async msg => {
                db_channel.send(`MESSAGEID: ${msg.id}`)
                rep_message = await message.channel.fetchMessage(msg.id);
            });
        }
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	const imageemb = new Discord.RichEmbed()
	.setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
            `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${+info_rep[0] + 1}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.guild.createChannel(`ticket-${+info_rep[0] + 1}`).then(async channel => {
            message.delete();    
            await channel.setParent(s_category.id);
            await channel.setTopic('Жалоба в обработке.')
            let moderator_role = await message.guild.roles.find(r => r.name == 'Support Team');
            await channel.overwritePermissions(moderator_role, {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.member, {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.guild.roles.find(r => r.name == "@everyone"), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            channel.send(`<@${message.author.id}> \`для команды поддержки\` <@&${moderator_role.id}>`, {embed: {
            color: 3447003,
            title: "Обращение к поддержке Discord",
            fields: [{
                name: "Отправитель",
                value: `**Пользователь:** <@${message.author.id}>`,
            },{
                name: "Суть обращения",
                value: `${message.content}`,
            }]
            }});
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
            await sp_chat_get.send(`\`[CREATE]\` <@${message.author.id}> \`создал обращение к поддержке:\` <#${channel.id}>`);
            message.channel.send(`<@${message.author.id}>, \`обращение составлено. Нажмите на\` <#${channel.id}>`).then(msg => msg.delete(15000));
        });
    }

    if (message.content == '/toadmin'){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == 'Support Team'), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })  

        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '✔ Administrator ✔'), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        }) 

        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '✔Jr.Administrator✔'), {
            // GENERAL PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })  
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
        if (memberid != 'не найден'){        
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`ваше обращение было передано администрации. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данное обращение было передано администрации. Источник: ${message.member.displayName}\``);
        }
        sp_chat_get.send(`\`[ADMIN]\` \`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации.\``);
        message.delete();
    }

    if (message.content == '/close'){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        let full_support = false;
        let s_category = message.guild.channels.find(c => c.name == "Корзина");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id).catch(err => {
            full_support = true;
        });
        if (full_support){
            message.reply(`\`корзина заполнена! Повторите попытку чуть позже!\``).then(msg => msg.delete(12000));
            return message.delete();  
        }
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
            memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "493459379878625320");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	let imageemb = new Discord.RichEmbed()
	.setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
        .setImage("https://imgur.com/LKDbJeM.gif");
        if (message.channel.topic == 'Жалоба на рассмотрении.'){
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
            `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${info_rep[1]}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`, imageemb)
        }else{
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
            `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`, imageemb)
        }
        if (memberid != 'не найден'){
            await message.channel.overwritePermissions(message.guild.members.find(m => m.id == memberid), {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // TEXT PERMISSIONS
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            }) 
        }
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
        message.channel.setTopic('Жалоба закрыта.');
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
        }
        sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
        message.delete();
    }

    if (message.content == '/active'){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic != 'Жалоба на рассмотрении.') return message.delete();
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "493459379878625320");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
	const imageemb = new Discord.RichEmbed()
	.setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
        .setImage("https://imgur.com/LKDbJeM.gif")
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
            `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${info_rep[3]}**`, imageemb)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
        message.channel.setTopic('Жалоба в обработке.');
        if (memberid != 'не найден'){
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
        }else{
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
        }
        sp_chat_get.send(`\`[UNWAIT]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        message.delete();
    }
}