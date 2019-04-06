const Discord = require('discord.js');
const fs = require("fs");

function get_rep_message(message, db_channel){
    let re = /(\d+(\.\d)*)/i;
    let rep_message;
    db_channel.fetchMessages().then(async messages => {
        let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
        if (db_msg){
            await message.channel.fetchMessages().then(async messagestwo => {
                rep_message = messagestwo.find(m => m.id == db_msg.content.match(re)[0]);
            });
        }
    });
    return rep_message;
}

exports.run = async (bot, message, support_cooldown) => {
    let re = /(\d+(\.\d)*)/i;
    if (message.channel.name == 'support'){
        if (message.author.bot) return message.delete();
        if (support_cooldown.has(message.author.id)){
            return message.delete();
        }
        support_cooldown.add(message.author.id);
        setTimeout(() => {
            if (support_cooldown.has(message.author.id)) support_cooldown.delete(message.author.id);
        }, 300000);
        let db_channel = bot.guilds.find(g => g.id == "493459379878625320").channels.find(c => c.name == "config");
        let rep_message = await get_rep_message(message, db_channel);
        console.log(rep_message);
        message.reply(1).then(msg => msg.delete(12000));
    }
}