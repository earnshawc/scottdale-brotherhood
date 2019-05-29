const Discord = require('discord.js');
const fs = require("fs");

function isInteger(n) {
    return n === +n && n === (n|0);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function error_mysql(message){
    message.reply(`**\`произошла критическая ошибка. Подробности отправлены в личные сообщения.\`**`).then(msg => msg.delete(20000));
    const embed = new Discord.RichEmbed();
    embed.setDescription(`**${message.member}, для устранения ошибки пожалуйста составьте жалобу в нашем [техническом разделе](https://robo-hamster.ru/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.5/). Код ошибки: #752**`);
    message.member.send(embed);
    return message.delete();
}

function mysql_load(message, mysql_cooldown){
    if (mysql_cooldown.has(message.author.id)){
        message.reply(`**\`повторите попытку через 4 секунды.\`**`).then(msg => msg.delete(3000));
        message.delete();
        return true;
    }
    mysql_cooldown.add(message.author.id);
    setTimeout(() => {
        if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
    }, 4000);
    return false;
}

function uses(message, command, uses_args, settings_args){
    const args = message.content.slice(`${command}`).split(/ +/);
    if (+args.length - 1 != uses_args.length){
        message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\`**`).then(msg => msg.delete(12000));
        message.delete();
        return true;
    }
    for (let i = 0; i <= settings_args.length; i++){
        if (settings_args[i] == 'number'){
            if (!isNumeric(args[+i + 1])){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' не является числом.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }else if (settings_args[i] == 'integer'){
            if (!isNumeric(args[+i + 1])){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' не является числом.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
            if (!isInteger(+args[+i + 1])){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' не целое.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }else if (settings_args[i] == 'mention'){
            let user = message.guild.member(message.mentions.users.first());
            if (!user){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: '${uses_args[i]}' не является упоминанием пользователя.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }else if (settings_args[i] == 'mention_user'){
            let user = message.guild.member(message.mentions.users.first());
            if (!user){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: '${uses_args[i]}' не является упоминанием пользователя.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }else if (user.id == message.author.id){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: на себя нельзя!\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }else if (settings_args[i] == 'plus_number'){
            if (!isNumeric(args[+i + 1])){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' не является числом.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
            if (args[+i + 1] <= 0){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' должно быть положительным.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }else if (settings_args[i] == 'status'){
            if (!isNumeric(args[+i + 1])){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' не является числом.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
            if (args[+i + 1] != 0 && args[+i + 1] != 1){
                message.reply(`**\`использование: ${command} [${uses_args.join('] [')}]\nError: значение '${uses_args[i]}' должно быть или '0', или '1'.\`**`).then(msg => msg.delete(12000));
                message.delete();
                return true;
            }
        }
    }
    return false;
}

exports.run = async (bot, message, ds_cooldown, connection, mysql_cooldown, send_action) => {
    if (!message.member.roles) return
    if (!message.member.roles.some(r => r.name == 'Проверенный 🔐')) return

    if (!ds_cooldown.has(message.author.id)){
        ds_cooldown.add(message.author.id);
        setTimeout(() => {
            if (ds_cooldown.has(message.author.id)) ds_cooldown.delete(message.author.id);
        }, 180000);
        connection.query(`SELECT \`id\`, \`server\` \`user\`, \`money\` FROM \`profiles\` WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`, async (error, result, packets) => {
            if (error) return console.error(error);
            if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
            if (result.length == 0){
                connection.query(`INSERT INTO \`profiles\` (\`server\`, \`user\`, \`money\`) VALUES ('${message.guild.id}', '${message.author.id}', '0.5')`);
            }else{
                connection.query(`UPDATE \`profiles\` SET money = money + 0.5 WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`);
            }
        });
    }

    if (message.content.startsWith('/setstat')){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/setstat', ['serverid', 'userid', 'money'], ['number', 'number', 'number'])) return
        const args = message.content.slice(`/setstat`).split(/ +/);
        connection.query(`SELECT \`id\`, \`server\` \`user\`, \`money\` FROM \`profiles\` WHERE \`user\` = '${args[2]}' AND \`server\` = '${args[1]}'`, async (error, result, packets) => {
            if (error) return console.error(error);
            if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
            if (result.length == 0){
                connection.query(`INSERT INTO \`profiles\` (\`server\`, \`user\`, \`money\`) VALUES ('${args[1]}', '${args[2]}', '${args[3]}')`);
                send_action(message.guild.id, `<@${message.author.id}> добавил пользователю ${args[2]} ${args[3]} dp. (MONEY: ${args[3]})`);
            }else{
                connection.query(`UPDATE \`profiles\` SET money = money + ${args[3]} WHERE \`user\` = '${args[2]}' AND \`server\` = '${args[1]}'`);
                send_action(message.guild.id, `<@${message.author.id}> добавил пользователю ${args[2]} ${args[3]} dp. (MONEY: ${+result[0].money + +args[3]})`);
            }
            await message.reply(`**добавил пользователю <@${args[2]}> ${args[3]} ₯**`);
            return message.delete();
        });
    }

    if (message.content.startsWith('/pay')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/pay', ['user', 'сумма'], ['mention_user', 'plus_number'])) return
        const args = message.content.slice(`/pay`).split(/ +/);
        let user = message.guild.member(message.mentions.users.first());
        if (args[2] < 0.01){
            await message.reply(`\`нельзя переводить менее 0.01 dp! Использование: /pay [user] [сумма]\``).then(msg => msg.delete(12000));
            return message.delete();
        }
        connection.query(`SELECT * FROM \`profiles\` WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`, async (error, result, packets) => {
            if (error) return console.error(error);
            if (result.length > 1){
                await message.reply(`**\`произошла ошибка при использовании команды. Информация была отправлена в личные сообщения.\`**`);
                const embed = new Discord.RichEmbed();
                embed.setDescription(`**${message.member}, для устранения ошибки пожалуйста составьте жалобу в нашем [техническом разделе](https://robo-hamster.ru/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.5/). Код ошибки: #1**`);
                message.member.send(embed);
                return message.delete();
            }else if (result.length < 1){
                await message.reply(`**\`у вас недостаточно средств для соверешения передачи.\`**`);
                return message.delete();
            }
            if (result[0].money - args[2] < 0){
                await message.reply(`**\`у вас недостаточно средств для соверешения передачи.\`**`);
                return message.delete();
            }
            connection.query(`SELECT * FROM \`profiles\` WHERE \`user\` = '${user.id}' AND \`server\` = '${message.guild.id}'`, async (error, answer, packets) => {
                if (error) return console.error(error);
                if (answer.length > 1){
                    await message.reply(`**\`произошла ошибка при использовании команды. Информация была отправлена в личные сообщения.\`**`);
                    const embed = new Discord.RichEmbed();
                    embed.setDescription(`**${message.member}, для устранения ошибки пожалуйста составьте жалобу в нашем [техническом разделе](https://robo-hamster.ru/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.5/). Код ошибки: #2**`);
                    message.member.send(embed);
                    return message.delete();
                }
                if (answer.length != 1){
                    connection.query(`UPDATE \`profiles\` SET money = money - ${+args[2]} WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`);
                    connection.query(`INSERT INTO \`profiles\` (\`server\`, \`user\`, \`money\`) VALUES ('${message.guild.id}', '${user.id}', '${+args[2]}')`);
                    send_action(message.guild.id, `<@${message.author.id}> перевел ${+args[2]} dp пользователю <@${user.id}> (${+result[0].money - +args[2]}-${+args[2]})`);
                    send_action(message.guild.id, `<@${user.id}> получил от <@${message.author.id}> | ${+args[2]} dp (0-${+answer[0].money + +args[2]})`);
                    await message.reply(`**\`вы успешно передали ${args[2]} dp пользователю\` ${user}**`);
                    return message.delete();
                }else{
                    connection.query(`UPDATE \`profiles\` SET money = money - ${+args[2]} WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`);
                    connection.query(`UPDATE \`profiles\` SET money = money + ${+args[2]} WHERE \`user\` = '${user.id}' AND \`server\` = '${message.guild.id}'`);
                    send_action(message.guild.id, `<@${message.author.id}> перевел ${+args[2]} dp пользователю <@${user.id}> (${+result[0].money - +args[2]}-${+answer[0].money + +args[2]})`);
                    send_action(message.guild.id, `<@${user.id}> получил от <@${message.author.id}> | ${+args[2]} dp (${+answer[0].money}-${+answer[0].money + +args[2]})`);
                    await message.reply(`**\`вы успешно передали ${args[2]} dp пользователю\` ${user}**`);
                    return message.delete();
                }
            });
        });
    }

    if (message.content.startsWith('/balance')){
        if (mysql_load(message, mysql_cooldown)) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            connection.query(`SELECT * FROM \`profiles\` WHERE \`user\` = '${message.author.id}' AND \`server\` = '${message.guild.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1){
                    await message.reply(`**\`произошла ошибка при использовании команды. Информация была отправлена в личные сообщения.\`**`);
                    const embed = new Discord.RichEmbed();
                    embed.setDescription(`**${message.member}, для устранения ошибки пожалуйста составьте жалобу в нашем [техническом разделе](https://robo-hamster.ru/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.5/). Код ошибки: #3**`);
                    await message.member.send(embed);
                    return message.delete();
                }
                if (result.length == 0){
                    send_action(message.guild.id, `<@${message.author.id}> просмотрел свой баланс (MONEY: 0)`);
                    await message.reply(`**ваш баланс составляет 0 ₯**`);
                    return message.delete();
                }else{
                    send_action(message.guild.id, `<@${message.author.id}> просмотрел свой баланс (MONEY: ${result[0].money})`);
                    await message.reply(`**ваш баланс составляет ${result[0].money} ₯**`);
                    return message.delete();
                }
            });
        }else{
            if (!message.member.hasPermission("MANAGE_ROLES")){
                await message.reply(`**\`недостаточно прав доступа для выполнения данного действия.\`**`).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT * FROM \`profiles\` WHERE \`user\` = '${user.id}' AND \`server\` = '${message.guild.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1){
                    await message.reply(`**\`произошла ошибка при использовании команды. Информация была отправлена в личные сообщения.\`**`);
                    const embed = new Discord.RichEmbed();
                    embed.setDescription(`**${message.member}, для устранения ошибки пожалуйста составьте жалобу в нашем [техническом разделе](https://robo-hamster.ru/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.5/). Код ошибки: #4**`);
                    await message.member.send(embed);
                    return message.delete();
                }
                if (result.length == 0){
                    send_action(message.guild.id, `<@${message.author.id}> просмотрел баланс пользователя <@${user.id}> (MONEY: 0)`);
                    await message.reply(`**баланс пользователя ${user} составляет 0 ₯**`);
                    return message.delete();
                }else{
                    send_action(message.guild.id, `<@${message.author.id}> просмотрел баланс пользователя <@${user.id}> (MONEY: ${result[0].money})`);
                    await message.reply(`**баланс пользователя ${user} составляет ${result[0].money} ₯**`);
                    return message.delete();
                }
            });
        }
    }

    // Работа с предприятиями
    if (message.content.startsWith('/storage_description')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/storage_description', ['описание'], ['none'])) return
        const args = message.content.slice(`/storage_description`).split(/ +/);
        connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id}'`, async (error, storage) => {
            if (error) return error_mysql(message);
            if (storage.length == 0){
                message.reply(`**\`вы не являетесь владельцем одного из предприятий на данном сервере!\`**`).then(msg => msg.delete(18000));
                return message.delete();
            }else if (storage.length == 1){
                if (storage[0].status == false){
                    message.reply(`**\`нельзя редактировать предприятие, которое закрыто.\`**`).then(msg => msg.delete(10000));
                    return message.delete();
                }
                const description = args.slice(1).join(' ');
                connection.query(`UPDATE \`storage\` SET description = '${description}' WHERE \`id\` = '${storage[0].id}'`);
                message.reply(`**\`описание предприятия было успешно изменено!\`**`).then(msg => msg.delete(10000));
                send_action(message.guild.id, `<@${message.author.id}> изменил описание предприятию ${storge[0].name}`);
                return message.delete();
            }else{
                if (!isNumeric(args[1])){
                    message.reply(`**\`укажите номер вашего предприятия: /storage_description [предприятие] [описание]\`**`).then(msg => msg.delete(10000));
                    return message.delete();
                }
                connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id} AND \`id\` = '${args[1]}'`, async (error, storage) => {
                    if (error) return error_mysql(message);
                    if (storage.length == 0){
                        message.reply(`**\`вы не являетесь владельцем данного предприятия!\`**`).then(msg => msg.delete(18000));
                        return message.delete();
                    }else if (storage.length == 1){
                        if (storage[0].status == false){
                            message.reply(`**\`нельзя редактировать предприятие, которое закрыто.\`**`).then(msg => msg.delete(10000));
                            return message.delete();
                        }
                        const description = args.slice(2).join(' ');
                        connection.query(`UPDATE \`storage\` SET description = '${description}' WHERE \`id\` = '${storage[0].id}'`);
                        message.reply(`**\`описание предприятия было успешно изменено!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> изменил описание предприятию ${storge[0].name}`);
                        return message.delete();
                    }else{
                        return error_mysql(message);
                    }
                });
            }
        });
    }

    if (message.content.startsWith('/storage_status')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/storage_status', ['состояние (1/0)'], ['none'])) return
        const args = message.content.slice(`/storage_status`).split(/ +/);
        connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id}'`, async (error, storage) => {
            if (error) return error_mysql(message);
            if (storage.length == 0){
                message.reply(`**\`вы не являетесь владельцем одного из предприятий на данном сервере!\`**`).then(msg => msg.delete(18000));
                return message.delete();
            }else if (storage.length == 1){
                if (uses(message, '/storage_status', ['состояние (1/0)'], ['status'])) return
                if (storage[0].money < storage[0].nalog){
                    message.reply(`**\`нельзя изменить состояние предприятия, недостаточно средств!\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
                connection.query(`UPDATE \`storage\` SET status = '${args[1]}' WHERE \`id\` = '${storage[0].id}'`);
                message.reply(`**\`состояние предприятия было изменено!\`**`).then(msg => msg.delete(10000));
                send_action(message.guild.id, `<@${message.author.id}> изменил состояние предприятию ${storge[0].name}`);
                return message.delete();
            }else{
                if (uses(message, '/storage_status', ['предприятие', 'состояние (1/0)'], ['number', 'status'])) return
                connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id} AND \`id\` = '${args[1]}'`, async (error, storage) => {
                    if (error) return error_mysql(message);
                    if (storage.length == 0){
                        message.reply(`**\`вы не являетесь владельцем данного предприятия!\`**`).then(msg => msg.delete(18000));
                        return message.delete();
                    }else if (storage.length == 1){
                        if (storage[0].money < storage[0].nalog){
                            message.reply(`**\`нельзя изменить состояние предприятия, недостаточно средств!\`**`).then(msg => msg.delete(12000));
                            return message.delete();
                        }
                        connection.query(`UPDATE \`storage\` SET status = '${args[2]}' WHERE \`id\` = '${storage[0].id}'`);
                        message.reply(`**\`состояние предприятия было изменено!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> изменил состояние предприятию ${storge[0].name}`);
                        return message.delete();
                    }else{
                        return error_mysql(message);
                    }
                });
            }
        });
    }

    if (message.content.startsWith('/storage_cost')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/storage_cost', ['сумма'], ['none'])) return
        const args = message.content.slice(`/storage_cost`).split(/ +/);
        connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id}'`, async (error, storage) => {
            if (error) return error_mysql(message);
            if (storage.length == 0){
                message.reply(`**\`вы не являетесь владельцем одного из предприятий на данном сервере!\`**`).then(msg => msg.delete(18000));
                return message.delete();
            }else if (storage.length == 1){
                if (uses(message, '/storage_cost', ['сумма'], ['plus_number'])) return
                if (storage[0].money < storage[0].nalog){
                    message.reply(`**\`нельзя изменить состояние предприятия, недостаточно средств!\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
                if (storage[0].cost < storage[0].min_cost){
                    message.reply(`**\`разрешено устанавливать сумму от ${storage[0].min_cost} discord points!\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
                connection.query(`UPDATE \`storage\` SET cost = '${args[1]}' WHERE \`id\` = '${storage[0].id}'`);
                message.reply(`**\`стоимость продажи товара была изменена!\`**`).then(msg => msg.delete(10000));
                send_action(message.guild.id, `<@${message.author.id}> изменил стоимость продажи c ${storage[0].cost} на ${args[1]} — предприятию ${storge[0].name}`);
                return message.delete();
            }else{
                if (uses(message, '/storage_cost', ['предприятие', 'сумма'], ['number', 'plus_number'])) return
                connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id} AND \`id\` = '${args[1]}'`, async (error, storage) => {
                    if (error) return error_mysql(message);
                    if (storage.length == 0){
                        message.reply(`**\`вы не являетесь владельцем данного предприятия!\`**`).then(msg => msg.delete(18000));
                        return message.delete();
                    }else if (storage.length == 1){
                        if (storage[0].money < storage[0].nalog){
                            message.reply(`**\`нельзя изменить сумму предприятия, недостаточно средств!\`**`).then(msg => msg.delete(12000));
                            return message.delete();
                        }
                        if (storage[0].cost < storage[0].min_cost){
                            message.reply(`**\`разрешено устанавливать сумму от ${storage[0].min_cost} discord points!\`**`).then(msg => msg.delete(12000));
                            return message.delete();    
                        }
                        connection.query(`UPDATE \`storage\` SET cost = '${args[2]}' WHERE \`id\` = '${storage[0].id}'`);
                        message.reply(`**\`стоимость продажи товара была изменена!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> изменил стоимость продажи c ${storage[0].cost} на ${args[2]} — предприятию ${storge[0].name}`);
                        return message.delete();
                    }else{
                        return error_mysql(message);
                    }
                });
            }
        });
    }

    if (message.content.startsWith('/storage_add')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/storage_add', ['сумма'], ['none'])) return
        const args = message.content.slice(`/storage_add`).split(/ +/);
        connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id}'`, async (error, storage) => {
            if (error) return error_mysql(message);
            if (storage.length == 0){
                message.reply(`**\`вы не являетесь владельцем одного из предприятий на данном сервере!\`**`).then(msg => msg.delete(18000));
                return message.delete();
            }else if (storage.length == 1){
                if (uses(message, '/storage_add', ['сумма'], ['plus_number'])) return
                connection.query(`SELECT * FROM \`profiles\` WHERE \`server\` = '${message.guild.id}' AND \`user\` = '${message.author.id}'`, async (error, profile) => {
                    if (error) return error_mysql(message);
                    if (profile > 1) return error_mysql(message);
                    if (profile == 1){
                        if (+profile[0].money < +args[1]){
                            message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                            return message.delete();
                        }
                        connection.query(`UPDATE \`storage\` SET money = money + ${args[1]} WHERE \`id\` = '${storage[0].id}'`);
                        connection.query(`UPDATE \`profiles\` SET money = money - ${args[1]} WHERE \`id\` = '${profile[0].id}'`);
                        message.reply(`**\`вы успешно положили на склад предприятия ${args[1]} discord points!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> пополнил баланс на ${args[1]} — предприятию ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money + +args[1]}) (MONEY PR: ${profile[0].money} - ${profile[0].money - +args[1]})`);
                        return message.delete();
                    }else{
                        message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                        return message.delete();
                    }
                });
            }else{
                if (uses(message, '/storage_add', ['предприятие', 'сумма'], ['number', 'plus_number'])) return
                connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id} AND \`id\` = '${args[1]}'`, async (error, storage) => {
                    if (error) return error_mysql(message);
                    if (storage.length == 0){
                        message.reply(`**\`вы не являетесь владельцем данного предприятия!\`**`).then(msg => msg.delete(18000));
                        return message.delete();
                    }else if (storage.length == 1){
                        connection.query(`SELECT * FROM \`profiles\` WHERE \`server\` = '${message.guild.id}' AND \`user\` = '${message.author.id}'`, async (error, profile) => {
                            if (error) return error_mysql(message);
                            if (profile > 1) return error_mysql(message);
                            if (profile == 1){
                                if (+profile[0].money < +args[2]){
                                    message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                                    return message.delete();
                                }
                                connection.query(`UPDATE \`storage\` SET money = money + ${args[2]} WHERE \`id\` = '${storage[0].id}'`);
                                connection.query(`UPDATE \`profiles\` SET money = money - ${args[2]} WHERE \`id\` = '${profile[0].id}'`);
                                message.reply(`**\`вы успешно положили на склад предприятия ${args[2]} discord points!\`**`).then(msg => msg.delete(10000));
                                send_action(message.guild.id, `<@${message.author.id}> пополнил баланс на ${args[2]} — предприятию ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money + +args[2]}) (MONEY PR: ${profile[0].money} - ${profile[0].money - +args[2]})`);
                                return message.delete();
                            }else{
                                message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                                return message.delete();
                            }
                        });
                    }else{
                        return error_mysql(message);
                    }
                });
            }
        });
    }

    if (message.content.startsWith('/storage_get')){
        if (mysql_load(message, mysql_cooldown)) return
        if (uses(message, '/storage_get', ['сумма'], ['none'])) return
        const args = message.content.slice(`/storage_get`).split(/ +/);
        connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id}'`, async (error, storage) => {
            if (error) return error_mysql(message);
            if (storage.length == 0){
                message.reply(`**\`вы не являетесь владельцем одного из предприятий на данном сервере!\`**`).then(msg => msg.delete(18000));
                return message.delete();
            }else if (storage.length == 1){
                if (uses(message, '/storage_get', ['сумма'], ['plus_number'])) return
                if (storage[0].money < args[1]){
                    message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                    return message.delete();
                }
                connection.query(`SELECT * FROM \`profiles\` WHERE \`server\` = '${message.guild.id}' AND \`user\` = '${message.author.id}'`, async (error, profile) => {
                    if (error) return error_mysql(message);
                    if (profile > 1) return error_mysql(message);
                    if (profile == 1){
                        connection.query(`UPDATE \`storage\` SET money = money - ${args[1]} WHERE \`id\` = '${storage[0].id}'`);
                        connection.query(`UPDATE \`profiles\` SET money = money + ${args[1]} WHERE \`id\` = '${profile[0].id}'`);
                        message.reply(`**\`вы успешно сняли со склада предприятия ${args[1]} discord points!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> снял со счета ${args[1]} — предприятия ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money - +args[1]}) (MONEY PR: ${profile[0].money} - ${profile[0].money + +args[1]})`);
                        return message.delete();
                    }else{
                        connection.query(`UPDATE \`storage\` SET money = money - ${args[1]} WHERE \`id\` = '${storage[0].id}'`);
                        connection.query(`INSERT INTO \`profiles\` (\`server\`, \`user\`, \`money\`) VALUES ('${message.guild.id}', '${message.author.id}', '${args[1]}')`);
                        message.reply(`**\`вы успешно сняли со склада предприятия ${args[1]} discord points!\`**`).then(msg => msg.delete(10000));
                        send_action(message.guild.id, `<@${message.author.id}> снял со счета ${args[1]} — предприятия ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money - +args[1]}) (MONEY PR: ${profile[0].money} - ${profile[0].money + +args[1]})`);
                        return message.delete();
                    }
                });
            }else{
                if (uses(message, '/storage_get', ['предприятие', 'сумма'], ['number', 'plus_number'])) return
                connection.query(`SELECT * FROM \`storage\` WHERE \`server\` = '${message.guild.id}' AND \`owner\` = '${message.author.id} AND \`id\` = '${args[1]}'`, async (error, storage) => {
                    if (error) return error_mysql(message);
                    if (storage.length == 0){
                        message.reply(`**\`вы не являетесь владельцем данного предприятия!\`**`).then(msg => msg.delete(18000));
                        return message.delete();
                    }else if (storage.length == 1){
                        if (storage[0].money < args[2]){
                            message.reply(`**\`недостаточно средств!\`**`).then(msg => msg.delete(10000));
                            return message.delete();
                        }
                        connection.query(`SELECT * FROM \`profiles\` WHERE \`server\` = '${message.guild.id}' AND \`user\` = '${message.author.id}'`, async (error, profile) => {
                            if (error) return error_mysql(message);
                            if (profile > 1) return error_mysql(message);
                            if (profile == 1){
                                connection.query(`UPDATE \`storage\` SET money = money - ${args[2]} WHERE \`id\` = '${storage[0].id}'`);
                                connection.query(`UPDATE \`profiles\` SET money = money + ${args[2]} WHERE \`id\` = '${profile[0].id}'`);
                                message.reply(`**\`вы успешно сняли со склада предприятия ${args[2]} discord points!\`**`).then(msg => msg.delete(10000));
                                send_action(message.guild.id, `<@${message.author.id}> снял со счета ${args[2]} — предприятия ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money - +args[2]}) (MONEY PR: ${profile[0].money} - ${profile[0].money + +args[2]})`);
                                return message.delete();
                            }else{
                                connection.query(`UPDATE \`storage\` SET money = money - ${args[2]} WHERE \`id\` = '${storage[0].id}'`);
                                connection.query(`INSERT INTO \`profiles\` (\`server\`, \`user\`, \`money\`) VALUES ('${message.guild.id}', '${message.author.id}', '${args[2]}')`);
                                message.reply(`**\`вы успешно сняли со склада предприятия ${args[2]} discord points!\`**`).then(msg => msg.delete(10000));
                                send_action(message.guild.id, `<@${message.author.id}> снял со счета ${args[2]} — предприятия ${storge[0].name} (MONEY ST: ${storage[0].money} - ${storage[0].money - +args[2]}) (MONEY PR: ${profile[0].money} - ${profile[0].money + +args[2]})`);
                                return message.delete();
                            }
                        });
                    }else{
                        return error_mysql(message);
                    }
                });
            }
        });
    }

    if (message.content.startsWith('/bizinfo')){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/bizinfo`).split(/ +/);
        if (!args[1]){
            connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}'`, async (err, result, fields) => {
                if (result.length > 1){
                    message.reply(`\`использование: /bizinfo [название товара]\``);
                    return message.delete();
                }
                if (result.length < 1){
                    message.reply(`\`заведение, которое вы пытаетесь найти не найдено или не ваше!\``).then(msg => msg.delete(12000));
                    return message.delete();
                }
                const embed = new Discord.RichEmbed();
                embed.setTitle(`Информация о ${result[0].name} [ID: ${result[0].id}]`);
                embed.setColor('#FF0000');
                embed.addField(`Информация о владельце заведения`, `**Владелец: <@${result[0].owner}>\nОписание: ${result[0].description}**`);
                embed.addField(`Основная информация о магазине`, `**Статус заведения: ${result[0].status}\nПродаваемый товар: ${result[0].name}\nЦена за 1 штуку: ${result[0].cost} ₯\nКоличество товара: ${result[0].amount}\nДенег в магазине: ${result[0].money} ₯**`);
                embed.addField(`Основная информация о складе`, `**Предметов на складе: ${result[0].storage}\nЦена за 1 штуку: ${result[0].storage_cost} ₯**`);
                embed.setFooter(`© Сopyright 2019`);
                message.reply(embed);
                return message.delete();
            });
        }else{
            let name = args.slice(1).join(' ');
            connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
                if (result.length < 1 || result.length > 1){
                    message.reply(`\`заведение, которое вы пытаетесь найти не найдено или не ваше!\``).then(msg => msg.delete(12000));
                    return message.delete();
                }
                const embed = new Discord.RichEmbed();
                embed.setTitle(`Информация о ${result[0].name} [ID: ${result[0].id}]`);
                embed.setColor('#FF0000');
                embed.addField(`Информация о владельце заведения`, `**Владелец: <@${result[0].owner}>\nОписание: ${result[0].description}**`);
                embed.addField(`Основная информация о магазине`, `**Статус заведения: ${result[0].status}\nПродаваемый товар: ${result[0].name}\nЦена за 1 штуку: ${result[0].cost} ₯\nКоличество товара: ${result[0].amount}\nДенег в магазине: ${result[0].money} ₯**`);
                embed.addField(`Основная информация о складе`, `**Предметов на складе: ${result[0].storage}\nЦена за 1 штуку: ${result[0].storage_cost} ₯**`);
                embed.setFooter(`© Сopyright 2019`);
                message.reply(embed);
                return message.delete();
            });
        }
    }

    if (message.content.startsWith("/change_status")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/change_status`).split(/ +/);
        if (!args[1] || !args[2]){
            message.reply(`\`использование: /change_status [номер заведения] [открыто/закрыто]\``);
            return message.delete();
        }
        if (!['открыто', 'закрыто'].includes(args[2])){
            message.reply(`\`использование: /change_status [номер заведения] [открыто/закрыто]\``);
            return message.delete();
        }
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result[0].status == args[2]){
                message.reply(`\`магазин и так имеет статус: ${args[2]}!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET status = '${args[2]}' WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
            message.reply(`\`вы успешно сменили магазину статус!\``).then(msg => msg.delete(12000));
            return message.delete();
        });
    }

    if (message.content.startsWith("/change_cost")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/change_cost`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /change_cost [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /change_cost [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (typeof (+args[2]) != "number" || +args[2] <= 0){
            message.reply(`\`использование: /change_cost [номер заведения] [сумма]\``);
            return message.delete();
        }
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`заведение, которое вы указали не найдено или не ваше!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET cost = ${args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
            message.reply(`**изменения сохранены. Теперь товар стоит ${args[2]} ₯**`);
            return message.delete();
        });
    }

    if (message.content.startsWith("/get_money")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/get_money`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /get_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /get_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (typeof (+args[2]) != "number" || +args[2] <= 0){
            message.reply(`\`использование: /get_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`заведение, которое вы указали не найдено или не ваше!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result[0].status != 'закрыто'){
                message.reply(`\`магазин должен быть закрыт!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[2] > result[0].money){
                message.reply(`\`в магазине нет такого количества средств для снятия!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT \`id\`, \`userid\`, \`points\` FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
                if (result.length == 0){
                    connection.query(`INSERT INTO \`accounts\` (\`userid\`, \`points\`) VALUES ('${message.author.id}', '${args[2]}')`);
                    connection.query(`UPDATE \`buy_dashboard\` SET money = money - ${+args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
                    message.reply(`**вы успешно сняли с магазина ${args[2]} ₯**`);
                    return message.delete();
                }else{
                    connection.query(`UPDATE \`accounts\` SET points = points + ${+args[2]} WHERE \`userid\` = '${message.author.id}'`);
                    connection.query(`UPDATE \`buy_dashboard\` SET money = money - ${+args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
                    message.reply(`**вы успешно забрали с магазина ${args[2]} ₯**`);
                    return message.delete();
                }
            });
        });
    }

    if (message.content.startsWith("/add_money")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/add_money`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /add_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /add_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        if (typeof (+args[2]) != "number" || +args[2] <= 0){
            message.reply(`\`использование: /add_money [номер заведения] [сумма]\``);
            return message.delete();
        }
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`заведение, которое вы указали не найдено или не ваше!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result[0].status != 'закрыто'){
                message.reply(`\`магазин должен быть закрыт!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT * FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
                if (result.length == 0){
                    message.reply(`\`вы не можете добавить сумму, более чем у вас на аккаунте!\``).then(msg => msg.delete(12000));
                    return message.delete();
                }else if (result[0].points < args[2]){
                    message.reply(`\`вы не можете добавить сумму, более чем у вас на аккаунте!\``).then(msg => msg.delete(12000));
                    return message.delete();
                }
                connection.query(`UPDATE \`accounts\` SET points = points - ${+args[2]} WHERE \`userid\` = '${message.author.id}'`);
                connection.query(`UPDATE \`buy_dashboard\` SET money = money + ${+args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
                message.reply(`**вы успешно положили в магазин ${args[2]} ₯**`);
                return message.delete();
            });
        });
    }

    if (message.content.startsWith("/buy_amount")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/buy_amount`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /buy_amount [номер заведения] [кол-во]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /buy_amount [номер заведения] [кол-во]\``);
            return message.delete();
        }
        if (!isInteger(+args[2]) || +args[2] <= 0){
            message.reply(`\`использование: /buy_amount [номер заведения] [кол-во]\``);
            return message.delete();
        }
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`заведение, которое вы указали не найдено или не ваше!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[2] > result[0].storage){
                message.reply(`\`на складе недостаточно товаров для пополнения! [storage: ${result[0].storage}]\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            let cost = args[2] * result[0].storage_cost;
            if (cost > result[0].money){
                message.reply(`\`у вас недостаточно средств для покупки товаров! [money: ${result[0].money}]\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET money = money - ${+cost} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
            connection.query(`UPDATE \`buy_dashboard\` SET storage = storage - ${+args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
            connection.query(`UPDATE \`buy_dashboard\` SET amount = amount + ${+args[2]} WHERE \`owner\` = '${message.author.id}' AND \`id\` = '${args[1]}'`);
            message.reply(`\`вы успешно пополнили количество товара!\``).then(msg => msg.delete(12000));
            return message.delete();
        });
    }

    if (message.content.startsWith("/get_market")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/get_market`).split(/ +/);
        if (!args[1]){
            message.reply(`**\`использование: /get_market [название товара]\`**`);
            return message.delete();
        }
        const name = args.slice(1).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`name\` = '${name}'`, async (err_mag, result_mag, fields_mag) => {
            if (result_mag.length < 1 || result_mag.length > 1){
                message.reply(`\`товар не найден!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result_mag[0].status == 'закрыто'){
                message.reply(`\`магазин временно закрыт владельцем!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            message.reply(`**\`название товара: ${result_mag[0].name}, описание: ${result_mag[0].description}, стоимость 1 штуки: ${result_mag[0].cost}, в наличии: ${result_mag[0].amount}\`**`);
            return message.delete();
        });
    }

    if (message.content.startsWith("/buy_market")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попробуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/buy_market`).split(/ +/);
        if (!args[1]){
            message.reply(`**\`использование: /buy_market [название товара]\`**`);
            return message.delete();
        }
        const name = args.slice(1).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`name\` = '${name}'`, async (err_mag, result_mag, fields_mag) => {
            if (result_mag.length < 1 || result_mag.length > 1){
                message.reply(`\`товар не найден!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result_mag[0].status == 'закрыто'){
                message.reply(`\`магазин временно закрыт владельцем!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (result_mag[0].amount <= 0){
                message.reply(`\`товар закончился! Вы не можете его приобрести!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT * FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
                if (result.length == 0){
                    message.reply(`**\`у вас недостаточно средств.\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
                if (result[0].points < result_mag[0].cost){
                    message.reply(`**\`у вас недостаточно средств.\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
                var answer = eval('(function() {\n' + result_mag[0].code + '\n}())');
                if (answer == '1'){
                    connection.query(`UPDATE \`accounts\` SET points = points - ${+result_mag[0].cost} WHERE \`userid\` = '${message.author.id}'`);
                    connection.query(`UPDATE \`buy_dashboard\` SET money = money + ${+result_mag[0].cost} WHERE \`name\` = '${name}'`);
                    connection.query(`UPDATE \`buy_dashboard\` SET amount = amount - 1 WHERE \`name\` = '${name}'`);
                    message.reply(`**\`вы успешно получили товар! [${name}]\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }else{
                    message.reply(`**\`ошибка при получении! [${name}]\`**`).then(msg => msg.delete(12000));
                    return message.delete();
                }
            });
        });
    }
}
