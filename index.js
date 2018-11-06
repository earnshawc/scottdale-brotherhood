﻿const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const Logger = require('./objects/logger');

let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));

let version = "8.0";
let hideobnova = true;

const nrpnames = new Set();
const cooldowncommand = new Set();
const report_cooldown = new Set();
const dspanel = new Set();

punishment_rep = ({
    "mute": "Вы были замучены в текстовых каналах.",
    "kick": "Вы были отключены от Discord-сервера.",
})

tags = ({
    "ПРА-ВО": "⋆ The Board of State ⋆",
    "ГЦЛ": "⋆ The Board of State ⋆",
    "АШ": "⋆ The Board of State ⋆",
    "ЦБ": "⋆ The Board of State ⋆",

    "FBI": "⋆ Department of Justice ⋆",
    "ФБР": "⋆ Department of Justice ⋆",
    "LSPD": "⋆ Department of Justice ⋆",
    "ЛСПД": "⋆ Department of Justice ⋆",
    "SFPD": "⋆ Department of Justice ⋆",
    "СФПД": "⋆ Department of Justice ⋆",
    "LVPD": "⋆ Department of Justice ⋆",
    "ЛВПД": "⋆ Department of Justice ⋆",
    "SWAT": "⋆ Department of Justice ⋆",
    "СВАТ": "⋆ Department of Justice ⋆",
    "RCPD": "⋆ Department of Justice ⋆",
    "РКПД": "⋆ Department of Justice ⋆",

    "LSA": "⋆ Department of Defence ⋆",
    "ЛСА": "⋆ Department of Defence ⋆",
    "SFA": "⋆ Department of Defence ⋆",
    "СФА": "⋆ Department of Defence ⋆",
    "LS-A": "⋆ Department of Defence ⋆",
    "ЛС-А": "⋆ Department of Defence ⋆",
    "SF-A": "⋆ Department of Defence ⋆",
    "СФ-А": "⋆ Department of Defence ⋆",
    "ТСР": "⋆ Department of Defence ⋆",
    "ТЮРЬМА": "⋆ Department of Defence ⋆",

    "LSMC": "⋆ Department of Health ⋆",
    "ЛСМЦ": "⋆ Department of Health ⋆",
    "SFMC": "⋆ Department of Health ⋆",
    "СФМЦ": "⋆ Department of Health ⋆",
    "LVMC": "⋆ Department of Health ⋆",
    "ЛВМЦ": "⋆ Department of Health ⋆",

    "R-LS": "⋆ Mass Media ⋆",
    "RLS": "⋆ Mass Media ⋆",
    "Р-ЛС": "⋆ Mass Media ⋆",
    "РЛС": "⋆ Mass Media ⋆",
    "R-SF": "⋆ Mass Media ⋆",
    "RSF": "⋆ Mass Media ⋆",
    "Р-СФ": "⋆ Mass Media ⋆",
    "РСФ": "⋆ Mass Media ⋆",
    "R-LV": "⋆ Mass Media ⋆",
    "RLV": "⋆ Mass Media ⋆",
    "Р-ЛВ": "⋆ Mass Media ⋆",
    "РЛВ": "⋆ Mass Media ⋆",

    "WMC": "⋆ Warlock MC ⋆",
    "W-MC": "⋆ Warlock MC ⋆",
    "RM": "⋆ Russian Mafia ⋆",
    "РМ": "⋆ Russian Mafia ⋆",
    "LCN": "⋆ La Cosa Nostra ⋆",
    "ЛКН": "⋆ La Cosa Nostra ⋆",
    "YAKUZA": "⋆ Yakuza ⋆",
    "ЯКУДЗА": "⋆ Yakuza ⋆",

    "GROVE": "⋆ Grove Street Gang ⋆",
    "ГРУВ": "⋆ Grove Street Gang ⋆",
    "BALLAS": "⋆ East Side Ballas Gang ⋆",
    "БАЛЛАС": "⋆ East Side Ballas Gang ⋆",
    "VAGOS": "⋆ Vagos Gang ⋆",
    "ВАГОС": "⋆ Vagos Gang ⋆",
    "NW": "⋆ Night Wolfs ⋆",
    "НВ": "⋆ Night Wolfs ⋆",
    "RIFA": "⋆ Rifa Gang ⋆",
    "РИФА": "⋆ Rifa Gang ⋆",
    "AZTEC": "⋆ Aztecas Gang ⋆",  
    "АЦТЕК": "⋆ Aztecas Gang ⋆",  
});

let manytags = [
"ПРА-ВО",
"ГЦЛ",
"АШ",
"ЦБ",

"FBI",
"ФБР",
"LSPD",
"ЛСПД",
"SFPD",
"СФПД",
"LVPD",
"ЛВПД",
"SWAT",
"СВАТ",
"RCPD",
"РКПД",

"LSA",
"ЛСА",
"SFA",
"СФА",
"LS-A",
"ЛС-А",
"SF-A",
"СФ-А",
"ТСР",
"ТЮРЬМА",

"LSMC",
"ЛСМЦ",
"SFMC",
"СФМЦ",
"LVMC",
"ЛВМЦ",

"R-LS",
"RLS",
"Р-ЛС",
"РЛС",
"R-SF",
"RSF",
"Р-СФ",
"РСФ",
"R-LV",
"RLV",
"Р-ЛВ",
"РЛВ",

"WMC",
"W-MC",
"RM",
"РМ",
"LCN",
"ЛКН",
"YAKUZA",
"ЯКУДЗА",

"GROVE",
"ГРУВ",
"BALLAS",
"БАЛЛАС",
"VAGOS",
"ВАГОС",
"AZTEC",  
"АЦТЕК",
"RIFA",
"РИФА",
"NW",
"НВ",
];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

function checknick (member, role, startnum, endnum, bot, message){
    if (member.roles.some(r => [role].includes(r.name))){
        let ruletagst = startnum
        let ruletagend = endnum
        let rpname = false;
        for (i in manytags){
            if (i >= ruletagst && i <= ruletagend)
            if (member.displayName.toUpperCase().includes(manytags[i])) rpname = true;
        }
        if (!rpname){
            if (!nrpnames.has(member.id)){
                let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        member.removeRole(rolerem).then(() => {	
                            setTimeout(function(){
                                if(member.roles.has(rolerem)){
                                    member.removeRole(rolerem);
                                }
                            }, 5000);
                        }).catch(console.error);
                    }
                }
                nrpnames.add(member.id)
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
}

function hook(channel, message, webhook_name, name, time, avatar) {
    if (!channel) return console.log('Канал не выбран.');
    if (!message) return console.log('Сообщение не указано.');
    if (!webhook_name) return console.log('ВебХук не найден.');
    if (!avatar) avatar = 'https://i.imgur.com/SReVrGM.png';
    channel.fetchWebhooks().then(webhook => {
        let foundHook = webhook.find(web => web.name == webhook_name)
        if (!foundHook){
            channel.createWebhook(webhook_name, avatar).then(webhook => {
                webhook.send(message, {
                    "username": name,
                    "avatarURL": avatar,
                }).then(msg => {
                    if (time) msg.delete(time)
                })
            })
        }else{
            foundHook.send(message, {
                "username": name,
                "avatarURL": avatar,
            }).then(msg => {
                if (time) msg.delete(time)
            })
        }
    })
}

bot.login(process.env.token);

bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'hacker' }, status: 'idle' })
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != "355656045600964609" && message.guild.id != "488400983496458260" && message.guild.id != "493459379878625320") return
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.type === "PINS_ADD") if (message.channel.name == "reports") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.member.id == bot.user.id) return
    
    if (message.content.toLowerCase().startsWith(`/bug`)){
        const args = message.content.slice('/bug').split(/ +/);
        if (!args[1]){
            message.reply(`\`привет! Для отправки отчета об ошибках используй: /bug [текст]\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let bugreport = args.slice(1).join(" ");
        if (bugreport.length < 5 || bugreport.length > 1300){
            message.reply(`\`нельзя отправить запрос с длинной меньше 5 или больше 1300 символов!\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let author_bot = message.guild.members.find(m => m.id == 336207279412215809);
        if (!author_bot){
            message.reply(`\`я не смог отправить сообщение.. Создателя данного бота нет на данном сервере.\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        author_bot.send(`**Привет, Kory_McGregor! Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с сервера \`${message.guild.name}\` \`(${message.guild.id})\`.**\n` +
        `**Суть обращения:** ${bugreport}`);
        message.reply(`\`хэй! Я отправил твое сообщение на рассмотрение моему боссу робохомячков!\``).then(msg => msg.delete(15000));
        return message.delete();
    }

    if (message.guild.id == 488400983496458260){
        if (message.channel.name == "ваши-предложения"){
            if (!message) return
            message.react(`✔`).then(() => {
                if (!message) return
                message.react(`❌`).then(() => {
                    if (!message) return
                    message.react(`🌿`)
                })
            })
        }
    }

    let dataserver = bot.guilds.find(g => g.id == "493459379878625320");
    let scottdale = bot.guilds.find(g => g.id == "355656045600964609");
    if (!dataserver){
        message.channel.send(`\`Data-Server of Scottdale не был загружен!\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        console.error(`Процесс завершен. Data-Server не найден.`)
        return bot.destroy();
    }
    let reportlog = scottdale.channels.find(c => c.name == "reports-log");
    if (!reportlog) return

    if (message.content == "@someone"){
        message.delete();
        let randuser = getRandomInt(0, message.guild.members.size);
        let users = message.guild.members.array();
        hook(message.channel, `@someone    **(∩ ͡° ͜ʖ ͡°)⊃━☆ﾟ. o ･ ｡ﾟ**    **${users[randuser]}**`, `SOMEONE`, `${message.member.displayName}`, false, message.author.avatarURL)
    }

    if (message.content.startsWith(`/dspanel`)){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (dspanel.has(message.author.id)){
            dspanel.delete(message.author.id);
            message.reply(`\`успешно вышел из системы.\``);
            return message.delete();
        }
        const args = message.content.slice('/dspanel').split(/ +/)
        if (!args[1]){
            message.reply(`\`введите пароль.\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let password = args.slice(1).join(" ");
        if (password != `${message.author.id[0]}${message.author.id}${message.author.id[1]} 2783652 SCOTTDALE`) return message.delete();
        message.reply(`\`успешно авторизован в системе.\``);
        dspanel.add(message.author.id);
        return message.delete();
    }

    if (message.content == `/chat`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        message.reply(`\`для выключения чата используй /chat off, для включения: /chat on\``);
        return message.delete();
    }

    if (message.content == `/chat off`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "general").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: false,
        })
        scottdale.channels.find(c => c.name == "spectator-chat").send(`\`Модератор ${message.member.displayName} отключил чат:\` <#${scottdale.channels.find(c => c.name == "general").id}>`)
        message.reply(`\`вы успешно отключили чат!\``)
        return messages.delete();
    }

    if (message.content == `/chat on`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "general").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: true,
        })
        scottdale.channels.find(c => c.name == "spectator-chat").send(`\`Модератор ${message.member.displayName} включил чат:\` <#${scottdale.channels.find(c => c.name == "general").id}>`)
        message.reply(`\`вы успешно включили чат!\``)
        return messages.delete();
    }

    if (message.content == "/questions"){

        
        let admin_level = 1;
        let db_channel = dataserver.channels.find(c => c.name == "administration");
        if (!db_channel) return
        let user_admin_level;

        await db_channel.fetchMessages().then(messages => {
            let user_admin = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``))
            if (user_admin){
                const admin_lvl = user_admin.content.slice().split('ADMIN PERMISSIONS:** ');
                user_admin_level = admin_lvl[1]
            }else{
                user_admin_level = 0;
            }
        });

        if (user_admin_level < admin_level){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }

        if (message.channel.name == "general") return message.delete();

        let en_questions = false;
        let num_questions = 0;
        let text_questions;
        let rep_channel = message.guild.channels.find(c => c.name == "reports");

        let _report_number;
        let _report_user;
        let _report_content;
        let _report_channel;
        let _report_status;

        await rep_channel.fetchMessages().then(repmessages => {
            repmessages.filter(repmessage => {
                if (repmessage.content.startsWith(`REPORT`)){
                    _report_status = repmessage.content.slice().split('=>')[9]
                    if (_report_status == "WAIT"){
                        en_questions = true;
                        _report_number = repmessage.content.slice().split('=>')[1]
                        _report_user = repmessage.content.slice().split('=>')[3]
                        _report_content = repmessage.content.slice().split('=>')[5]
                        _report_channel = repmessage.content.slice().split('=>')[7]
                        if (num_questions == 0){
                            text_questions = `[№${_report_number}] ${_report_content}`
                        }else{
                            text_questions = `[№${_report_number}] ${_report_content}\n` + text_questions
                        }
                        if (num_questions == 7){
                            message.channel.send(``, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Вопросы`,
                                    value: `${text_questions}`
                                }]
                            }});
                            num_questions = 0;
                        }
                        num_questions++
                    }
                }
            })
        })
        if (en_questions){
            if (num_questions != 0){
                message.channel.send(``, {embed: {
                    color: 3447003,
                    fields: [{
                        name: `Активные вопросы`,
                        value: `${text_questions}`
                    }]
                }});
            }
        }else{
            message.reply(`\`активных вопросов нет.\``)
        }
        message.delete();
    }
    
        if (message.content.toLowerCase() == '/famhelp'){
        message.channel.send(`**<@${message.author.id}>, вот справка по системе семей!**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Создание, удаление, информация`,
                value: `**Создать семью:** \`/createfam\`\n**Удалить семью:** \`/deletefam [название]\`\n**Информация о семье:** \`/faminfo [название]\``,
            },
            {
                name: `Управление семьей`,
                value: `**Назначить заместителя:** \`/famaddzam [user]\`\n**Снять заместителя:** \`/famdelzam [user]\``,
            },
            {
                name: `Команды для заместителей`,
                value: `**Пригласить участника:** \`/faminvite [user]\`\n**Исключить участника:** \`/famkick [user]\``,
            }]
        }}).then(msg => msg.delete(35000))
        return message.delete();
    }

    if (message.content.startsWith('/faminfo')){
        const args = message.content.slice('/faminfo').split(/ +/)
        if (!args[1]){
            message.reply(`\`использование: /faminfo [название семьи]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let familyname = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        let families_zams = [];
        await message.guild.channels.filter(async channel => {
            if (channel.name == familyname){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }else if(channel.name.includes(familyname)){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${familyname}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if (!family_leader){
            family_leader = `не в дискорде`;
        }else{
            family_leader = `<@${family_leader.id}>`;
        }
        let family_zams = `\`заместителей нет\``;
        for (var i = 0; i < families_zams.length; i++){
            if (family_zams == `\`заместителей нет\``){
                family_zams = `<@${families_zams[i]}>`;
            }else{
                family_zams = family_zams + `, <@${families_zams[i]}>`;
            }
        }
        let members = message.guild.roles.get(family_role.id).members; // members.size
        message.channel.send(`**<@${message.author.id}>, вот информация о семье: <@&${family_role.id}>**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Информация о семье: ${family_role.name}`,
                value: `**Создатель семьи: ${family_leader}\nЗаместители: ${family_zams}\nКоличество участников: ${members.size}**`
            }]
        }})
    }

    if (message.content.startsWith('/createfam')){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        let idmember = message.author.id;
        let family_name;
        let family_leader;
        await message.delete();
        await message.channel.send(`\`[FAMILY] Название семьи: [напиши название семьи в чат]\n[FAMILY] Создатель семьи [ID]: [ожидание]\``).then(async delmessage0 => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(async (collected) => {
                family_name = `${collected.first().content}`;
                await delmessage0.edit(`\`[FAMILY] Название семьи: '${collected.first().content}'\n[FAMILY] Создатель семьи [ID]: [на модерации, если надо себя, отправь минус]\``)
                collected.first().delete();
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collectedd) => {
                    if (!message.guild.members.find(m => m.id == collectedd.first().content)){
                        family_leader = `${idmember}`;
                    }else{
                        family_leader = `${collectedd.first().content}`;
                    }
                    await delmessage0.edit(`\`[FAMILY] Название семьи: '${family_name}'\n[FAMILY] Создатель семьи: ${message.guild.members.find(m => m.id == family_leader).displayName}\nСоздать семейный канал и роль [да/нет]?\``)
                    collectedd.first().delete();
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 20000,
                        errors: ['time'],
                    }).then(async (collecteds) => {
                        if (!collecteds.first().content.toLowerCase().includes('да')) return delmessage0.delete();
                        collecteds.first().delete();
                        await delmessage0.delete();

                        let family_channel = null;
                        let myfamily_role = null;
                        await message.guild.channels.filter(async channel => {
                            if (channel.name == family_name){
                                if (channel.type == "voice"){
                                    if (channel.parent.name.toString() == `Family ROOMS`){
                                        family_channel = channel;
                                        await channel.permissionOverwrites.forEach(async perm => {
                                            if (perm.type == `role`){
                                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                                if (role_fam.name == channel.name){
                                                    myfamily_role = role_fam;
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                        if (family_channel != null || myfamily_role != null){
                            message.channel.send(`\`[ERROR]\` <@${idmember}> \`ошибка! Семья: '${family_name}' уже существует!\``).then(msg => msg.delete(10000));
                            return
                        }

                        let family_role = await message.guild.createRole({
                            name: `${family_name}`,
                            position: message.guild.roles.find(r => r.name == `[-] Прочее [-]`).position + 1,
                        })
                        await message.guild.createChannel(`${family_name}`, "voice").then(async (channel) => {
                            await channel.setParent(message.guild.channels.find(c => c.name == `Family ROOMS`))
                            await channel.overwritePermissions(family_role, {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: false,
                            })

                            await channel.overwritePermissions(message.guild.members.find(m => m.id == family_leader), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: true,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: true,
                            })

                            await channel.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: false,
                                CONNECT: false,
                                SPEAK: false,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: false,
                                PRIORITY_SPEAKER: false,
                            })
                            if (message.guild.channels.find(c => c.name == `family-chat`)){
                                await message.guild.channels.find(c => c.name == `family-chat`).overwritePermissions(family_role, {
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
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                })
                            }
                            await message.guild.members.find(m => m.id == family_leader).addRole(family_role);
                            let general = message.guild.channels.find(c => c.name == `general`);
                            if (general) await general.send(`<@${family_leader}>, \`модератор\` <@${idmember}> \`назначил вас контролировать семью: ${family_name}\``)
                            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
                            if (fam_chat) await fam_chat.send(`\`[CREATE]\` \`Пользователь\` <@${family_leader}> \`стал лидером семьи '${family_name}'! Назначил:\` <@${idmember}>`);
                            return
                        })
                    }).catch(() => {
                        return delmessage0.delete();
                    })
                }).catch(() => {
                    return delmessage0.delete();
                })
            }).catch(() => {
                return delmessage0.delete();
            })
        })
    }

    if (message.content.startsWith(`/faminvite`)){
        if (message.content == `/faminvite`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /faminvite [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/faminvite').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /faminvite [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[0]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы пригласить участника, нужно выбрать в какую семью ты его будешь приглашать! Используй: /faminvite [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[args[2]]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famkick`)){
        if (message.content == `/famkick`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famkick [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famkick').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famkick [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[0]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы выгнать участника, нужно выбрать семью из которой нужно будет его кикнуть! Используй: /famkick [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[args[2]]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/deletefam`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        const args = message.content.slice('/deletefam').split(/ +/)
        if (!args[1]){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите название семьи! /deletefam [name]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let name = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        await message.guild.channels.filter(async channel => {
            if (channel.name == name){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${name}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        family_channel.delete();
        family_role.delete();
        let general = message.guild.channels.find(c => c.name == `general`);
        if (general) await general.send(`<@${family_leader.id}>, \`модератор\` <@${message.author.id}> \`удалил вашу семью: ${name}\``)
        let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
        if (fam_chat) await fam_chat.send(`\`[DELETED]\` \`Семья '${name}', главой которой был\` <@${family_leader.id}> \`была удалена модератором. Удалил:\` <@${message.author.id}>`);
        return message.delete();
    }

    if (message.content.startsWith(`/famaddzam`)){
        if (message.content == `/famaddzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famaddzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famaddzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famaddzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Если ты сделаешь себя заместителем, то у тебя не будет права управления семьей!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[0]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы назначить заместителя, нужно выбрать в какую семью ты его будешь назначить! Используй: /famaddzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            let fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[args[2]]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителем\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famdelzam`)){
        if (message.content == `/famdelzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famdelzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famdelzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famdelzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Забрав у себя доступ ты не сможешь выдавать роли своей семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[0]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы снять заместителя, нужно выбрать из какой семьи ты его будешь выгонять! Используй: /famdelzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }

            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[args[2]]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith("/report")){
        let rep_channel = message.guild.channels.find(c => c.name == "reports");
        if (!rep_channel) return message.reply(`\`[ERROR] Канал ${rep_channel.name} не был найден.\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        if (report_cooldown.has(message.author.id)) {
            message.channel.send("`Можно использовать раз в минуту!` - " + message.author).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (!message.member.hasPermission("ADMINISTRATOR")){
            report_cooldown.add(message.author.id);
            setTimeout(() => {
                report_cooldown.delete(message.author.id);
            }, 60000);
        }
        const args = message.content.slice('/report').split(/ +/)
        if (!args[1]){
            message.reply(`\`вы не указали суть вашего вопроса/жалобы. /report [текст]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let text = args.slice(1).join(" ");
        if (text.includes(`=>`)){
            message.reply(`\`ваш текст содержит запрещенный символ "=>", замените его на "->".\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let reportnum_message = false;
        let rep_number = 0;
        let report_number_message;
        await rep_channel.fetchMessages().then(repmessages => {
            repmessages.filter(repmessage => {
                if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                    rep_number = repmessage.content.slice().split('=>')[1]
                    reportnum_message = true;
                    report_number_message = repmessage;
                }
            })
        })
        if (!reportnum_message){
            await rep_channel.send(`[REPORTNUMBER]=>0`).then(msg => {
                report_number_message = msg;
            })
            rep_number = 0;
        }
        rep_number++
        await report_number_message.edit(`[REPORTNUMBER]=>${rep_number}`)
        rep_channel.send(`REPORT=>${rep_number}=>USER=>${message.author.id}=>CONTENT_REP=>${text}=>CHANNEL=>${message.channel.id}=>STATUS=>WAIT`).then(hayway => {
            hayway.pin();
        })
        message.reply(`\`ваш вопрос/жалоба была успешно отправлена! Номер вашего вопроса: №${rep_number}\``).then(msg => msg.delete(35000));
        reportlog.send(`\`[REPORT]\` <@${message.author.id}> \`отправил вопрос №${rep_number}. Суть:\` ${text}`)
        message.delete();
        return message.guild.channels.find(c => c.name == "spectator-chat").send(`\`Появился новый вопрос №${rep_number}. Используйте '/ans' что бы ответить. '/questions' - список активных вопросов.\``).then(msg => msg.delete(120000))
    }

    if (message.content.startsWith(`/ans`)){
        let admin_level = 1;
        let db_channel = dataserver.channels.find(c => c.name == "administration");
        if (!db_channel) return
        let user_admin_level;

        await db_channel.fetchMessages().then(messages => {
            let user_admin = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``))
            if (user_admin){
                const admin_lvl = user_admin.content.slice().split('ADMIN PERMISSIONS:** ');
                user_admin_level = admin_lvl[1]
            }else{
                user_admin_level = 0;
            }
        });

        if (user_admin_level < admin_level){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }

        if (message.channel.name == "general") return message.delete();

        let rep_channel = message.guild.channels.find(c => c.name == "reports");
        const args = message.content.slice('/ans').split(/ +/)
        if (!args[1]){
            let reportnum_message = false;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                        reportnum_message = true;
                    }
                })
            })
            if (!reportnum_message){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            let reportmessageid = false;
            let _report_number;
            let _report_user;
            let _report_content;
            let _report_channel;
            let _report_status;
            let del_rep_message;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`REPORT`)){
                        _report_status = repmessage.content.slice().split('=>')[9]
                        if (_report_status == "WAIT"){
                            reportmessageid = true;
                            _report_number = repmessage.content.slice().split('=>')[1]
                            _report_user = repmessage.content.slice().split('=>')[3]
                            _report_content = repmessage.content.slice().split('=>')[5]
                            _report_channel = repmessage.content.slice().split('=>')[7]
                            del_rep_message = repmessage;
                        }
                    }
                })
            })
            if (!reportmessageid){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            _report_status = "ON EDIT"
            await del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>${_report_status}`)
            message.reply(`\`Отпишите ответ на данный вопрос в чат. Жалоба/вопрос от пользователя:\` <@${_report_user}>\n\`Отклонить вопрос => "-"\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Номер вопроса/жалобы: ${_report_number}`,
                    value: `${_report_content}`
                }]}}).then(req_report_message => {
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content != "-"){
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`на ваш вопрос №${_report_number} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                            color: 3447003,
                            fields: [{
                                name: `Ваш вопрос, который вы задали.`,
                                value: `${_report_content}`
                            },
                            {
                                name: `Ответ модератора`,
                                value: `${collected.first().content}`
                            }]
                        }}).catch(() => {
                            general.send(`<@${_report_user}>, \`на ваш вопрос №${_report_number} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Ваш вопрос, который вы задали.`,
                                    value: `${_report_content}`
                                },
                                {
                                    name: `Ответ модератора`,
                                    value: `${collected.first().content}`
                                }]
                            }})
                        })
                        reportlog.send(`\`[ANSWER]\` <@${message.author.id}> \`ответил на вопрос №${_report_number} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}\n\`Ответ:\` ${collected.first().content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }else{
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${_report_number}\``).catch(() => {
                          general.send(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${_report_number}\``)  
                        })
                        reportlog.send(`\`[DELETE]\` <@${message.author.id}> \`отказался от вопроса №${_report_number} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }
                }).catch(() => {
                    del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>WAIT`)
                    message.reply('\`вы не успели ответить на данный вопрос.\`');
                    req_report_message.delete();
                    message.delete();
                });
            });
        }else{
            let reportnum_message = false;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`[REPORTNUMBER]`)){
                        reportnum_message = true;
                    }
                })
            })
            if (!reportnum_message){
                message.reply(`\`на данный момент вопросов нет.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            let reportmessageid = false;
            let _report_number;
            let _report_user;
            let _report_content;
            let _report_channel;
            let _report_status;
            let del_rep_message;
            await rep_channel.fetchMessages().then(repmessages => {
                repmessages.filter(repmessage => {
                    if (repmessage.content.startsWith(`REPORT`)){
                        _report_number = repmessage.content.slice().split('=>')[1]
                        if (args[1] == _report_number){
                            reportmessageid = true;
                            _report_user = repmessage.content.slice().split('=>')[3]
                            _report_content = repmessage.content.slice().split('=>')[5]
                            _report_channel = repmessage.content.slice().split('=>')[7]
                            _report_status = repmessage.content.slice().split('=>')[9]
                            del_rep_message = repmessage;
                        }
                    }
                })
            })
            if (!reportmessageid){
                message.reply(`\`данного вопроса не существует.\``).then(msg => msg.delete(7000));
                return message.delete();
            }
            if (_report_status != "WAIT"){
                message.reply(`\`на данный вопрос уже отвечают.\``).then(msg => msg.delete(7000))
                return message.delete();
            }
            _report_status = "ON EDIT"
            await del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>${_report_status}`)
            message.reply(`\`Отпишите ответ на данный вопрос в чат. Жалоба/вопрос от пользователя:\` <@${_report_user}>\n\`Отклонить вопрос => "-"\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Номер вопроса/жалобы: ${_report_number}`,
                    value: `${_report_content}`
                }]}}).then(req_report_message => {
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {
                    if (collected.first().content != "-"){
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`на ваш вопрос №${args[1]} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                            color: 3447003,
                            fields: [{
                                name: `Ваш вопрос, который вы задали.`,
                                value: `${_report_content}`
                            },
                            {
                                name: `Ответ модератора`,
                                value: `${collected.first().content}`
                            }]
                        }}).catch(() => {
                            general.send(`<@${_report_user}>, \`на ваш вопрос №${args[1]} поступил ответ от:\` <@${message.author.id}>`, {embed: {
                                color: 3447003,
                                fields: [{
                                    name: `Ваш вопрос, который вы задали.`,
                                    value: `${_report_content}`
                                },
                                {
                                    name: `Ответ модератора`,
                                    value: `${collected.first().content}`
                                }]
                            }})
                        })
                        reportlog.send(`\`[ANSWER]\` <@${message.author.id}> \`ответил на вопрос №${args[1]} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}\n\`Ответ:\` ${collected.first().content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }else{
                        let user = message.guild.members.find(m => m.id == _report_user);
                        let general = message.guild.channels.find(c => c.id == _report_channel);
                        user.sendMessage(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${args[1]}\``).catch(() => {
                            general.send(`<@${_report_user}>, \`модератор\` <@${message.author.id}> \`отказался отвечать на ваш вопрос №${args[1]}\``)
                        })
                        reportlog.send(`\`[DELETE]\` <@${message.author.id}> \`отказался от вопроса №${args[1]} от\` <@${_report_user}>\n\`Вопрос:\` ${_report_content}`)
                        req_report_message.delete();
                        del_rep_message.delete();
                        message.delete();
                        collected.first().delete();
                    }
                }).catch(() => {
                    del_rep_message.edit(`REPORT=>${_report_number}=>USER=>${_report_user}=>CONTENT_REP=>${_report_content}=>CHANNEL=>${_report_channel}=>STATUS=>WAIT`)
                    message.reply('\`вы не успели ответить на данный вопрос.\`');
                    req_report_message.delete();
                    message.delete();
                });
            });
        }
    }

    if (message.content.startsWith("/ffuser")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.slice('/ffuser').split(/ +/)
        if (!args[1]) return
        let name = args.slice(1).join(" ");
        let userfinders = false;
        let foundedusers_nick;
        let numberff_nick = 0;
        let foundedusers_tag;
        let numberff_tag = 0;
        message.guild.members.filter(userff => {
            if (userff.displayName.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_nick == null){
                    foundedusers_nick = `${numberff_nick + 1}) <@${userff.id}>`
                }else{
                    foundedusers_nick = foundedusers_nick + `\n${numberff_nick + 1}) <@${userff.id}>`
                }
                numberff_nick++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }else if (userff.user.tag.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_tag == null){
                    foundedusers_tag = `${numberff_tag + 1}) <@${userff.id}>`
                }else{
                    foundedusers_tag = foundedusers_tag + `\n${numberff_tag + 1}) <@${userff.id}>`
                }
                numberff_tag++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }
        })
        if (!userfinders) return message.reply(`я никого не нашел.`) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.RichEmbed()
            .addField(`BY NICKNAME`, foundedusers_nick, true)
            .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
        }
    }

    if (message.content.startsWith("/accinfo")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        let user = message.guild.member(message.mentions.users.first());
        if (user){
            let userroles;
            await user.roles.filter(role => {
                if (userroles == undefined){
                    if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                }else{
                    if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                }
            })
            let perms;
            if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                perms = "[!] Пользователь модератор [!]";
            }else{
                perms = "У пользователя нет админ прав."
            }
            if (userroles == undefined){
                userroles = `отсутствуют.`
            }
            let date = user.user.createdAt;
            let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            date = user.joinedAt
            let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            const embed = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
            .setTimestamp()
            .addField(`Дата создания аккаунта и входа на сервер`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
            .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
            message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            return message.delete();
        }else{
            const args = message.content.slice('/accinfo').split(/ +/)
            if (!args[1]) return
            let name = args.slice(1).join(" ");
            let foundmember = false;
            await message.guild.members.filter(f_member => {
                if (f_member.displayName.includes(name)){
                    foundmember = f_member
                }else if(f_member.user.tag.includes(name)){
                    foundmember = f_member
                }
            })
            if (foundmember){
                let user = foundmember
                let userroles;
                await user.roles.filter(role => {
                    if (userroles == undefined){
                        if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                    }else{
                        if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                    }
                })
                let perms;
                if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                    perms = "[!] Пользователь модератор [!]";
                }else{
                    perms = "У пользователя нет админ прав."
                }
                if (userroles == undefined){
                    userroles = `отсутствуют.`
                }
                let date = user.user.createdAt;
                let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                date = user.joinedAt
                let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                const embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                .setTimestamp()
                .addField(`Краткая информация`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
                message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            }
            return message.delete();
        }
    }

    if (message.content.startsWith("/setadmin")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`пользователь не указан. /setadmin [USER] [LVL]\``).then(msg => msg.delete(7000));
        }  
        const args = message.content.slice('/setadmin').split(/ +/)
        let db_channel = dataserver.channels.find(c => c.name == "administration");
        let find_message;
        await db_channel.fetchMessages().then(messages => {
            find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
        });
        if (find_message) return message.reply(`\`он уже является модератором.\``).then(msg => msg.delete(7000));
        if (!args[2]) return message.reply(`\`лвл модератора не указан.\``).then(msg => msg.delete(7000));
        if (args[2] > 3) return message.reply(`\`лвл модерирования не может быть больше 3-х.\``).then(msg => msg.delete(7000));
        if (args[2] < 1) return message.reply(`\`лвл модерирования не может быть меньше 1-ого.\``).then(msg => msg.delete(7000));
        db_channel.send(`**ADMINISTRATION\nUSER-ID: \`${user.id}\`\nADMIN PERMISSIONS:** ${args[2]}`)
        return message.reply(`\`вы назначили\` <@${user.id}> \`модератором ${args[2]} уровня.\``)
    }

    if (message.content.startsWith("/admininfo")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`вы не указали пользователя! /admininfo [USER]\``).then(msg => msg.delete(7000));
        }  
        let db_channel = dataserver.channels.find(c => c.name == "administration");
        db_channel.fetchMessages().then(messages => {
            let msgconst = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``))
            if (msgconst){
                const adminlvl = msgconst.content.slice().split('ADMIN PERMISSIONS:** ');
                message.reply(`\`по вашему запросу найдена следующая информация:\``, {embed: {
                color: 3447003,
                fields: [{
                    name: `Информация о ${scottdale.members.find(m => m.id == user.id).displayName}`,
                    value: `**Пользователь:** <@${user.id}>\n` +
                    `**Уровень модерирования:** \`${adminlvl[1]}\``
                }]}})
            }else{
                message.reply("`пользователь которого вы указали не является модераторомыыы.`").then(msg => msg.delete(7000));
            }
        })
    }

    if (message.content.startsWith("/deladmin")){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(5000));
            return message.delete();
        }
        const args = message.content.slice('/deladmin').split(/ +/)
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            let userfind = false;
            if (args[1]){
                userfind = message.guild.members.find(m => m.id == args[1]);
                user = message.guild.members.find(m => m.id == args[1]);
            }
            if (!userfind){
            message.delete();
            return message.reply(`\`вы не указали пользователя! /deladmin [USER]\``).then(msg => msg.delete(7000));
            }
        }
        if (user == message.member){
            let db_channel = dataserver.channels.find(c => c.name == "administration");
            await db_channel.fetchMessages().then(messages => {
                let find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
                if (!find_message){
                    return message.reply(`\`вы не являетесь модератором.\``)
                }else{
                    find_message.delete();
                    return message.reply(`\`вы назначили себя 0-ым уровнем модерирования.\``)
                }
            });
            return
        }
        let db_channel = dataserver.channels.find(c => c.name == "administration");
        await db_channel.fetchMessages().then(messages => {
            let find_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${user.id}\``));
            if (!find_message) return message.reply(`\`пользователь не модератор.\``);
            let my_message = messages.find(m => m.content.startsWith(`**ADMINISTRATION\nUSER-ID: \`${message.member.id}\``));
            if (!my_message) return message.reply(`\`вы не модератор.\``)
            const adminlvl = find_message.content.slice().split('ADMIN PERMISSIONS:** ');
            const adminlvl_my = my_message.content.slice().split('ADMIN PERMISSIONS:** ');
            if (adminlvl[1] >= adminlvl_my[1] && message.member.id != "336207279412215809") return message.reply(`\`вы не можете убрать модера выше или равному вас по уровню.\``)
            find_message.delete()
            return message.reply(`\`вы сняли модератора\` <@${user.id}> \`с mod-лвлом: ${adminlvl[1]}\``);
        });
    }

    /*
    if (message.content.toLowerCase().startsWith("привет") && message.content.toLocaleLowerCase().includes(`бот`)){
        message.reply('**привет! Как тебя зовут?**').then((nededit) => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 10000,
                errors: ['time'],
            }).then((collected) => {
                nededit.edit(`<@${message.author.id}>, **привет, ${collected.first().content}!**`).then(() => collected.first().delete());
            }).catch(() => {
                nededit.edit(`<@${message.author.id}>, **привет! А ты кто?**`)
            });
        });
    }
    */

    if (message.content.toLowerCase() == "/invalidrole"){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(`\`нет прав доступа.\``)
        if (cooldowncommand.has(message.guild.id)) {
            return message.channel.send("`Можно использовать раз в две минуты!` - " + message.author);
        }
        cooldowncommand.add(message.guild.id);
        setTimeout(() => {
            cooldowncommand.delete(message.guild.id);
        }, 120000);
        let noformnick;
        await bot.guilds.find(g => g.id == message.guild.id).members.forEach(member => {
            checknick(member, "⋆ The Board of State ⋆", 0, 3, bot, message);
            checknick(member, "⋆ Department of Justice ⋆", 4, 15, bot, message);
            checknick(member, "⋆ Department of Defence ⋆", 16, 25, bot, message);
            checknick(member, "⋆ Department of Health ⋆", 26, 31, bot, message);
            checknick(member, "⋆ Mass Media ⋆", 32, 43, bot, message);
            checknick(member, "⋆ Warlock MC ⋆", 44, 45, bot, message);
            checknick(member, "⋆ Russian Mafia ⋆", 46, 47, bot, message);
            checknick(member, "⋆ La Cosa Nostra ⋆", 48, 49, bot, message);
            checknick(member, "⋆ Yakuza ⋆", 50, 51, bot, message);
            checknick(member, "⋆ Grove Street Gang ⋆", 52, 53, bot, message);
            checknick(member, "⋆ East Side Ballas Gang ⋆", 54, 55, bot, message);
            checknick(member, "⋆ Vagos Gang ⋆", 56, 57, bot, message);
            checknick(member, "⋆ Aztecas Gang ⋆", 58, 59, bot, message);
            checknick(member, "⋆ Rifa Gang ⋆", 60, 61, bot, message);
            checknick(member, "⋆ Night Wolfs ⋆", 62, 63, bot, message);
        })
        let nrpsend;
        let nrpnamesget = 0;
        let allservernonrpnames = false;
        await bot.guilds.find(g => g.id == message.guild.id).members.forEach(newmember => {
            if (nrpnames.has(newmember.id)){
                allservernonrpnames = true;
                if (nrpnamesget == 0){
                    nrpsend = `<@${newmember.id}>`;
                }else{
                    nrpsend = nrpsend + `\n<@${newmember.id}>`;
                }
                nrpnamesget = nrpnamesget + 1;
                nrpnames.delete(newmember.id);
                if (nrpnamesget == 15){
                    bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.id == message.channel.id).send(`<@${message.author.id}> \`вот, держи невалидные ники.\`\n\n**${nrpsend}**\n\`Я автоматически забрал у них роли.\``)
                    nrpnamesget = 0;
                    nrpsend = null;
                }
            }
        })
        if (!allservernonrpnames){
            return message.reply(`Невалидных ников нет.`)
        }else{
            if (nrpsend == null) return
            bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.id == message.channel.id).send(`<@${message.author.id}> \`вот, держи невалидные ники.\`\n\n**${nrpsend}**\n\`Я автоматически забрал у них роли.\``)
            nrpnamesget = 0;
            nrpsend = null;
        }
    }

    if (message.content.toLowerCase().startsWith("/itester")){
        if (message.guild.id == "355656045600964609") return message.reply("`команда работает только на тестовом сервере Scottdale Brotherhood.`", {embed: {
            color: 3447003,
            fields: [{
                name: "`Scottdale Brotherhood - Сервер разработчиков`",
                value: "**[Подключение к каналу тестеров](https://discord.gg/VTE9cWk)**"
            }]}}).then(msg => msg.delete(12000))
        if (message.member.roles.some(r => r.name == "Tester's Team ✔")){
            return message.reply("`вы уже являетесь тестером.`")
        }
        message.member.addRole(bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == "Tester's Team ✔"));
        return message.reply(`\`теперь вы тестер.\``)
    }
    
    if (message.content.toLowerCase().includes("роль")){
        let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem);
                    }
                }
            }
            message.react(`📛`)
            return
        }
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase())){
                let rolename = tags[manytags[i].toUpperCase()]
                let role = message.guild.roles.find(r => r.name == rolename);
                let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`);
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал requests-for-roles не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`)
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`)
                let nickname = message.member.displayName;
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#483D8B")
                .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName);
                return message.react(`📨`);
            }
            
        }
    }

    let bad_words_channel = dataserver.channels.find(c => c.name == "bad-words");

    if (message.content.toLowerCase().startsWith("/addbadword")){
        if (message.guild.id != "355656045600964609") return
        if (!message.member.roles.some(r => ["Spectator™", "Support Team"].includes(r.name)) && !message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice('/addbadword').split(/ +/)
        let text = args.slice(2).join(" ");
        if (!args[1]) return message.reply(`\`вы не указали наказание. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        if (args[1] != "none" && args[1] != "mute" && args[1] != "kick") return message.reply(`\`наказания: ["none", "mute", "kick"]. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        if (!text) return message.reply(`\`укажите запрещенную фразу. /addbadword [none/mute/kick] [фраза]\nПример: /addbadword mute дурак\``)
        let checkword;
        checkword = false;
        await bad_words_channel.fetchMessages().then(badmessages => {
            badmessages.filter(badmessage => {
                const bad_word = badmessage.content.slice().split('=>')[1]
                const punish = badmessage.content.slice().split('=>')[3]
                if (text == bad_word.toLowerCase()){
                    checkword = true;
                }
            })
        })
        if (checkword){
            return message.reply(`\`данная фраза уже в списке запрещенных!\``).then(msg => msg.delete(7000))
        }else{
            bad_words_channel.send(`BAD WORD=>${text}=>PUNISHMENT=>${args[1]}=>\`Добавил: ${message.member.displayName} (${message.author.id})\``)
            message.delete();
            return message.reply(`\`вы успешно добавили фразу:\` **${text}** \`в список запрещенных.\``).then(msg => msg.delete(10000))
        }
    }

    if (!message.member.hasPermission("ADMINISTRATOR")){
        bad_words_channel.fetchMessages().then(badmessages => {
            badmessages.filter(badmessage => {
                const bad_word = badmessage.content.slice().split('=>')[1]
                const punish = badmessage.content.slice().split('=>')[3]
                if (message.content.toLowerCase().includes(bad_word.toLowerCase())){
                    scottdale.channels.find(c => c.name == "bad-words-log").send(`<@${message.member.id}> \`использовал запрещенную фразу "${bad_word}" в сообщении: "${message.content}".\nDEBUG: [PUNISHMENT=${punish}]\``)
                    message.delete();
                    if (punish == "none") return
                    message.reply(`\`ваше сообщение было удалено из-за содержания откровенного контента.\`\n\`${punishment_rep[punish]}\``).then(msg => msg.delete(12000))
                    if (punish == "mute"){
                        let muterole = scottdale.roles.find(r => r.name == "Muted");
                        return message.member.addRole(muterole); 
                    }
                    if (punish == "kick"){
                        message.member.sendMessage(`\`Вас наказала система за использование зап.слов.\``).then(() => {
                            message.member.kick(`Зап.слово [${bad_word}]`)
                        })
                    }
                }
            })
        })
    }
});

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id
        let event_channelid = event.d.channel_id
        let event_userid = event.d.user_id
        let event_messageid = event.d.message_id
        let event_emoji_name = event.d.emoji.name

        if (event_userid == bot.user.id) return
        if (event_guildid != serverid) return

        let server = bot.guilds.find(g => g.id == event_guildid);
        let channel = server.channels.find(c => c.id == event_channelid);
        let message = await channel.fetchMessage(event_messageid);
        let member = server.members.find(m => m.id == event_userid);

        if (channel.name != `requests-for-roles`) return

        if (event_emoji_name == "🇩"){
            let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
            let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
            let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
            let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
            if (!field_user || !field_nickname || !field_role || !field_channel){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.`);
            }else{
                channel.send(`\`[DELETED]\` ${member} \`удалил запрос от: ${field_nickname}, с ID: ${field_user.id}\``);
            }
            if (sened.has(field_nickname)) sened.delete(field_nickname);
            return message.delete();
        }else if(event_emoji_name == "❌"){
            if (message.reactions.size != 3){
                return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
            }
            let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
            let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
            let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
            let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
            channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
            field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция] Имя_Фамилия [Ранг]\``)
            nrpnames.add(field_nickname);
            if (sened.has(field_nickname)) sened.delete(field_nickname);
            return message.delete();
        }else if (event_emoji_name == "✔"){
            if (message.reactions.size != 3){
                return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
            }
            let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
            let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
            let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
            let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
            if (field_user.roles.some(r => field_role.id == r.id)) return message.delete();
            let rolesremoved = false;
            let rolesremovedcount = 0;
            if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                for (var i in rolesgg){
                    let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                    if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        rolesremoved = true;
                        rolesremovedcount = rolesremovedcount+1;
                        await field_user.removeRole(rolerem);
                    }
                }
            }
            await field_user.addRole(field_role);
            channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
            if (rolesremoved){
                if (rolesremovedcount == 1){
                    field_channel.send(`<@${member.id}>**,** \`модератор\` <@${field_user.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                }else if (rolesremovedcount < 5){
                    field_channel.send(`<@${member.id}>**,** \`модератор\` <@${field_user.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                }else{
                    field_channel.send(`<@${member.id}>**,** \`модератор\` <@${field_user.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                }
            }else{
                field_channel.send(`<@${member.id}>**,** \`модератор\` <@${field_user.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
            }
            if (sened.has(field_nickname)) sened.delete(field_nickname);
            return message.delete();
        }
    }
});
