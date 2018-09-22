const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const Logger = require('./objects/logger');
let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));
let version = "2.1";

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
"NW",
"НВ",
"RIFA",
"РИФА",
"AZTEC",  
"АЦТЕК",
];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.login('NDg4NzE3ODE4ODI5OTk2MDM0.DoQa4w.8BQsXaGbrkP7ql7SGjlevNR0VlM');

bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    if (bot.guilds.find(g => g.id == "488400983496458260").channels.find(c => c.name == "updates-bot-user")) bot.guilds.find(g => g.id == "488400983496458260").channels.find(c => c.name == "updates-bot-user").send(`\`\`\`diff
Вышло обновление версии ${version}:
- Исправил ошибку с удалением запроса на снятие роли.
+ Ваш разработчик Kory_McGregor.\`\`\``).then(msgdone => {
        msgdone.react(`👍`).then(() => {
            msgdone.react(`👎`)
        })
    })
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != "355656045600964609" && message.guild.id != "488400983496458260") return
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "test ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)

    if (message.content.toLowerCase().startsWith("/remove")){
        if (message.guild.id == 355656045600964609) return message.reply(`\`работает только на тестовом сервере!\``, {embed: {
            color: 3447003,
            fields: [{
                name: "`Scottdale Brotherhood - Сервер разработчиков`",
                value: "**[Подключение к каналу тестеров](https://discord.gg/VTE9cWk)**"
            }]}})
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.delete();
            return message.reply(`\`Вы не указали пользователя! /remove [@упоминание]\``);
        }
        let countroles = 0;
        let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
        for (i in rolesgg){
            if(user.roles.some(r=>rolesgg[i].includes(r.name)) ) countroles = countroles + 1;
        }
        if (countroles > 1){
            for (var i in rolesgg){
                let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                if (user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                    await user.removeRole(rolerem);
                }
            }
            bot.guilds.find(g => g.id == message.guild.id).channels.find(c => c.name == "general").send(`<@${user.id}> \`у вас забрали фракционные роли, так как их количество привышало допустимое значение.\``)
        }else{
            let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`);
            let rolerem = user.roles.find(r=>rolesgg.includes(r.name))
            const embed = new Discord.RichEmbed()
            .setTitle("`Discord » Снятие ролей участнику`")
            .setColor("#FF0000")
            .setFooter("© Support Team | by Kory_McGregor")
            .setTimestamp()
            .addField("Информация", 
            `\`Пользователь:\` <@${user.id}>\n` +
            `\`Модератор:\` <@${message.author.id}>\n` +
            `\`Роль для снятия:\` <@&${rolerem.id}>\n` +
            `\`[D] - УДАЛИТЬ/ОТКЛОНИТЬ\``)
            reqchat.send(embed).then(async msgsen => {
                await msgsen.react('✔')
                await msgsen.react('🇩')
                reqrem[msgsen.id] = {
                    "status": "wait",
                    "userrem": user.id,
                    "whorem": message.author.id,
                    "rolerem": rolerem.name,
                };
                fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                    return console.error(`Произошла ошибка. ${err}`)
                });
                await msgsen.pin();
                message.reply(`\`ваш запрос на снятие роли фракции был отправлен модераторам!\``)
            })
        }
        return message.reply(`У пользователя ${countroles} фракционных ролей.`);
    }

    if (message.content.toLowerCase().startsWith("/itester")){
        if (message.member.roles.some(r => r.name == "Tester's Team ✔")){
            return message.reply("`вы уже являетесь тестером.`")
        }
        if (message.guild.id == "355656045600964609") return message.reply("`команда работает только на тестовом сервере Scottdale Brotherhood.`", {embed: {
        color: 3447003,
        fields: [{
            name: "`Scottdale Brotherhood - Сервер разработчиков`",
            value: "**[Подключение к каналу тестеров](https://discord.gg/VTE9cWk)**"
        }]}})
        message.member.addRole(bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == "Tester's Team ✔"));
        return message.reply(`\`теперь вы тестер.\``)
    }

    if (message.content.toLowerCase().includes("роль")){
        if (blacklist[message.member.displayName]){
            let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem);
                    }
                }
            }
            return message.reply(`\`Модератор\` <@${blacklist[message.member.displayName].moderatorid}> \`отметил данный ник как невалидный!\nСоставьте никнейм по форме: [Фракция] Имя_Фамилия [Ранг]\``);
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
                if (message.member.roles.some(r => [rolename].includes(r.name))) return
                let nickname = message.member.displayName
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#FF0000")
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                .addField("Информация", 
                `\`Пользователь:\` <@${message.author.id}>\n` +
                `\`Ник:\`  \`${nickname}\`\n` +
                `\`Роль для выдачи:\` <@&${role.id}>\n` +
                `\`Сообщение:\`  \`${message.content}\`\n` +
                `\`[D] - УДАЛИТЬ ЕСЛИ ЗАБАГАЛОСЬ\``)
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    requests[msgsen.id] = {
                        "status": "wait",
                        "supernickname": nickname,
                        "whogetrole": message.author.id,
                        "superrole": role.name,
                        "channel": message.channel.id,
                        "suptag": manytags[i],
                    };
                    fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                        return console.error(`Произошла ошибка. ${err}`)
                    });
                    await msgsen.pin();
                    message.reply(`\`ваш запрос на выдачу роли фракции был отправлен модераторам!\``)
                })
                return
            }
        }
    }
});

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_userid = event.d.user_id
        let event_messageid = event.d.message_id
        let event_emoji_name = event.d.emoji.name
        let event_channelid = event.d.channel_id
        let event_guildid = event.d.guild_id
        if (event_guildid != "355656045600964609" && event_guildid != "488400983496458260") return
        if (event_userid == bot.user.id) return
        let requser = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == event_userid);
        let reqchannel = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == event_channelid);
        if (reqchannel.name != "requests-for-roles") return

        bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == event_channelid).fetchMessage(event_messageid).then(msg => {
            if (!msg) return
        })

        if (event_emoji_name == "🇩"){
            if (requser.roles.some(r=>["✫Deputy Leader✫", "✵Leader✵", "✮Ministers✮"].includes(r.name)) && !requser.roles.some(r => ["Spectator™", "✔ Helper ✔", "✔Jr.Administrator✔", "✔ Administrator ✔"].includes(r.name))){
                return reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`ошибка доступа! Функция доступна Spectator'ам и выше.\``).then(mesg => mesg.delete(7000))
            }

            if (reqrem[event_messageid]){
                if (reqrem[event_messageid].userrem == undefined){
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
                    reqrem[event_messageid] = {
                        "status": "deleted",
                    };
                    fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                        return console.error(`Произошла ошибка: ${err}`)
                    });
                    return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                }else{
                    let usernick = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == reqrem[event_messageid].userrem).displayName
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил запрос от: ${usernick}, с ID: ${requests[event_messageid].userrem}\``)
                    reqrem[event_messageid] = {
                        "status": "deleted",
                    };
                    fs.writeFileSync("./database/requests remove.json", JSON.stringify(reqrem), (err) => {
                        return console.error(`Произошла ошибка: ${err}`)
                    });
                    return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
                }
            }

            if (!requests[event_messageid]){
                reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
            }else{
                if (requests[event_messageid].supernickname == undefined){
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил багнутый запрос.\``)
                }else{
                    reqchannel.send(`\`[DELETED]\` <@${requser.id}> \`удалил запрос от: ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``)
                }
            }
            requests[event_messageid] = {
                "status": "deleted",
            };
            fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                return console.error(`Произошла ошибка: ${err}`)
            });
            return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
        }

        if (event_emoji_name == "❌"){
            if (!requests[event_messageid]){
                reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`пользователь не отправлял запрос или сообщение не загрузилось!\``);
                return
            }
            reqchannel.send(`\`[DENY]\` <@${requser.id}> \`отклонил запрос от ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``);
            let userto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == requests[event_messageid].whogetrole);
            let channelto = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == requests[event_messageid].channel);
            channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${requests[event_messageid].supernickname}\nВалидный ник: [${requests[event_messageid].suptag}] Имя_Фамилия [Ранг]\``)
            requests[event_messageid] = {
                "status": "deny",
            };
            fs.writeFileSync("./database/requests.json", JSON.stringify(requests), (err) => {
                return console.error(`Произошла ошибка: ${err}`)
            });
            blacklist[userto.displayName] = {
                "moderatorid": requser.id,
            };
            fs.writeFileSync("./database/blacklist names.json", JSON.stringify(blacklist), (err) => {
                return console.error(`Произошла ошибка ${err}`);
            });
            return reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
        }

        if (event_emoji_name == "✔"){
            if (!requests[event_messageid]){
                reqchannel.send(`\`[ERROR]\` <@${requser.id}> \`пользователь не отправлял запрос или сообщение не загрузилось!\``);
                return
            }
            let userto = bot.guilds.find(g => g.id == event_guildid).members.find(m => m.id == requests[event_messageid].whogetrole);
            let channelto = bot.guilds.find(g => g.id == event_guildid).channels.find(c => c.id == requests[event_messageid].channel);
            let roleto = bot.guilds.find(g => g.id == event_guildid).roles.find(r => r.name == requests[event_messageid].superrole);
            let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
            reqchannel.fetchMessage(event_messageid).then(msg => msg.delete());
            if (userto.roles.some(r => roleto.name.includes(r.name))) return
            reqchannel.send(`\`Начинаю забирать роли. Этот процесс может занять некоторое время.\``).then(msg => msg.delete(12000))
            let rolesremoved = false;
            let rolesremovedcount = 0;
            if(userto.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == event_guildid).roles.find(r => r.name == rolesgg[i]);
                    if (userto.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        rolesremoved = true;
                        rolesremovedcount = rolesremovedcount+1;
                        await userto.removeRole(rolerem);
                    }
                }
            }
            await userto.addRole(roleto);
            reqchannel.send(`\`[ACCEPT]\` <@${requser.id}> \`одобрил запрос от ${requests[event_messageid].supernickname}, с ID: ${requests[event_messageid].whogetrole}\``);
            if (rolesremoved){
                if (rolesremovedcount == 1){
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! ${rolesremovedcount} роль была убрана.\``)
                }else if (rolesremovedcount < 5){
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! Остальные ${rolesremovedcount} роли были убраны.\``)
                }else{
                    channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей были убраны.\``)
                }
            }else{
                channelto.send(`<@${userto.id}>**,** \`модератор\` <@${requser.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${roleto.id}>  \`была выдана!\``)
            }
            return
        }

    }
});