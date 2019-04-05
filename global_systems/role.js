const Discord = require('discord.js');

exports.run = async (bot, message) => {
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
    let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
    let canremoverole = ["✫Deputy Leader✫", "✵Leader✵", "✮Ministers✮", "✔ Helper ✔"];
    
    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")){
        if (!message.member.roles.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.split(/ +/)
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (snyatie.has(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос о снятии роли.`")
                .setColor("#483D8B")
                .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Причина снятия роли", `${collected.first().content}`)
                .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                snyatie.add(message.author.id + `=>` + user.id)
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    }

    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)){
        // Проверить невалидный ли ник.
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes("[" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "]") || message.member.displayName.toLowerCase().includes("(" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + ")") || message.member.displayName.toLowerCase().includes("{" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "}")){
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал requests-for-roles не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
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
                .setTimestamp();
		if (message.member.roles.some(r => r.name == '🏆 Legendary 🏆')){
		    embed.addField(`ВНИМАНИЕ!!!`, `\`\`\`diff\n- ОБРАТИТЕ ВНИМАНИЕ, ЧТО ДАННЫЙ ПОЛЬЗОВАТЕЛЬ ЯВЛЯЕТСЯ НЕЖЕЛАТЕЛЬНЫМ, ЭТО ОЗНАЧАЕТ ЧТО ОН МОЖЕТ ВАС ОБМАНУТЬ!!!\`\`\``);	
		}
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                return message.react(`📨`);
            }
        }
    }
}