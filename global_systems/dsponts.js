const Discord = require('discord.js');
const fs = require("fs");

function isFloat(n){
    if (!isInteger(n)){
        return false;
    }else{
        return Number(n) === n && n % 1 !== 0;
    }
}

function isInteger(n) {
    return n === +n && n === (n|0);
}

exports.run = async (bot, message, ds_cooldown, connection, mysql_cooldown) => {

    if (!message.member.roles) return
    if (!message.member.roles.some(r => r.name == 'Проверенный 🔐')) return

    if (!ds_cooldown.has(message.author.id)){
        ds_cooldown.add(message.author.id);
        setTimeout(() => {
            if (ds_cooldown.has(message.author.id)) ds_cooldown.delete(message.author.id);
        }, 180000);
        connection.query(`SELECT \`id\`, \`userid\`, \`points\` FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
            if (error) return console.error(error);
            if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
            if (result.length == 0){
                connection.query(`INSERT INTO \`accounts\` (\`userid\`, \`points\`) VALUES ('${message.author.id}', '0.5')`);
            }else{
                connection.query(`UPDATE \`accounts\` SET points = points + 0.5 WHERE \`userid\` = '${message.author.id}'`);
            }
        });
    }

    if (message.content == '/balance'){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        connection.query(`SELECT \`id\`, \`userid\`, \`points\` FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
            if (error) return console.error(error);
            if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#352]`);
            if (result.length == 0){
                message.reply(`**ваш баланс составляет 0 ₯**`);
                return message.delete();
            }else{
                message.reply(`**ваш баланс составляет ${result[0].points} ₯**`);
                return message.delete();
            }
        });
    }

    if (message.content.startsWith("/change_cost")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/change_cost`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /change_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!isFloat(+args[1]) || +args[1] <= 0){
            message.reply(`\`использование: /change_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /change_cost [сумма] [название товара]\``);
            return message.delete();
        }
        const name = args.slice(2).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET cost = ${args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
            message.reply(`**\`обновлено! Изменения вступят в силу после обновления таблицы.\`**`);
            return message.delete();
        });
    }

    if (message.content.startsWith("/get_cost")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/get_cost`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /get_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!isFloat(+args[1]) || +args[1] <= 0){
            message.reply(`\`использование: /get_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /get_cost [сумма] [название товара]\``);
            return message.delete();
        }
        const name = args.slice(2).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[1] > result[0].cost_storage){
                message.reply(`\`вы не сможете снять сумму более, чем есть в магазине!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT \`id\`, \`userid\`, \`points\` FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
                if (result.length == 0){
                    connection.query(`INSERT INTO \`accounts\` (\`userid\`, \`points\`) VALUES ('${message.author.id}', '${args[1]}')`);
                    connection.query(`UPDATE \`buy_dashboard\` SET cost_storage = cost_storage - ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
                    message.reply(`**\`вы успешно забрали с магазина ${args[1]}\` ₯**`);
                    return message.delete();
                }else{
                    connection.query(`UPDATE \`accounts\` SET points = points + ${+args[1]} WHERE \`userid\` = '${message.author.id}'`);
                    connection.query(`UPDATE \`buy_dashboard\` SET cost_storage = cost_storage - ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
                    message.reply(`**\`вы успешно забрали с магазина ${args[1]}\` ₯**`);
                    return message.delete();
                }
            });
        });
    }

    if (message.content.startsWith("/add_cost")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/get_cost`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /add_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!isFloat(+args[1]) || +args[1] <= 0){
            message.reply(`\`использование: /add_cost [сумма] [название товара]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /add_cost [сумма] [название товара]\``);
            return message.delete();
        }
        const name = args.slice(2).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[1] < result[0].cost_storage){
                message.reply(`\`вы не можете добавить сумму, более чем у вас на аккаунте!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`SELECT \`id\`, \`userid\`, \`points\` FROM \`accounts\` WHERE \`userid\` = '${message.author.id}'`, async (error, result, packets) => {
                if (error) return console.error(error);
                if (result.length > 1) return console.error(`Ошибка при выполнении, результатов много, error code: [#351]`);
                if (result.length == 0){
                    message.reply(`\`вы не можете добавить сумму, более чем у вас на аккаунте!\``).then(msg => msg.delete(12000));
                    return message.delete();
                }
                connection.query(`UPDATE \`accounts\` SET points = points - ${+args[1]} WHERE \`userid\` = '${message.author.id}'`);
                connection.query(`UPDATE \`buy_dashboard\` SET cost_storage = cost_storage + ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
                message.reply(`**\`вы успешно положили в магазин ${args[1]}\` ₯**`);
                return message.delete();
            });
        });
    }

    if (message.content.startsWith("/add_amount")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/add_amount`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /add_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        if (!isInteger(+args[1]) || +args[1] <= 0){
            message.reply(`\`использование: /add_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /add_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        const name = args.slice(2).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[1] < result[0].storage){
                message.reply(`\`в магазине недостаточно товаров для пополнения!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET storage = storage + ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
            connection.query(`UPDATE \`buy_dashboard\` SET amount = amount - ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
            message.reply(`\`вы успешно пополнили количество товара! Изменения вступят в силу после обновления таблицы.\``).then(msg => msg.delete(12000));
            return message.delete();
        });
    };

    if (message.content.startsWith("/get_amount")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
            return message.delete();
        }
        mysql_cooldown.add(message.author.id);
        setTimeout(() => {
            if (mysql_cooldown.has(message.author.id)) mysql_cooldown.delete(message.author.id)
        }, 8000);
        const args = message.content.slice(`/get_amount`).split(/ +/);
        if (!args[1]){
            message.reply(`\`использование: /get_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        if (!isInteger(+args[1]) || +args[1] <= 0){
            message.reply(`\`использование: /get_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`использование: /get_amount [кол-во] [название товара]\``);
            return message.delete();
        }
        const name = args.slice(2).join(' ');
        connection.query(`SELECT * FROM \`buy_dashboard\` WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`, async (err, result, fields) => {
            if (result.length < 1 || result.length > 1){
                message.reply(`\`товар, который вы указали не найден или не ваш!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            if (args[1] > result[0].storage){
                message.reply(`\`на складе недостаточно товаров для пополнения!\``).then(msg => msg.delete(12000));
                return message.delete();
            }
            connection.query(`UPDATE \`buy_dashboard\` SET storage = storage - ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
            connection.query(`UPDATE \`buy_dashboard\` SET amount = amount + ${+args[1]} WHERE \`created\` = '${message.author.id}' AND \`name\` = '${name}'`);
            message.reply(`\`вы успешно пополнили количество товара! Изменения вступят в силу после обновления таблицы.\``).then(msg => msg.delete(12000));
            return message.delete();
        });
    };

    if (message.content.startsWith("/buy_market")){
        if (mysql_cooldown.has(message.author.id)){
            message.reply(`**\`попорбуйте через 8 секунд!\`**`).then(msg => msg.delete(7000));
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
                connection.query(`UPDATE \`accounts\` SET points = points - ${+result_mag[0].cost} WHERE \`userid\` = '${message.author.id}'`);
                connection.query(`UPDATE \`buy_dashboard\` SET cost_storage = cost_storage + ${+result_mag[0].cost} WHERE \`name\` = '${name}'`);
                connection.query(`UPDATE \`buy_dashboard\` SET amount = amount - 1 WHERE \`name\` = '${name}'`);
                eval(result_mag[0].code);
                message.reply(`**\`вы успешно пробрели товар!\`**`).then(msg => msg.delete(12000));
                return message.delete();
            });
        });
    }
}