const Discord = require('discord.js');
const fs = require("fs");

exports.run = async (bot, message, ds_cooldown, connection, mysql_cooldown) => {

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

    if (message.content.startsWith("/give_points")){

    }
}