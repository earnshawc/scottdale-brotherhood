const Discord = require('discord.js');

exports.run = async (bot, message) => {
    if (message.content.startsWith("/fbi_access")){
        const args = message.content.slice(`/fbi_access`).split(/ +/);
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "493459379878625320");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1){
            message.reply(`**\`недостаточно прав доступа для использования данной команды!\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`**\`/fbi_access [user] [add/remove/moderate] [(0)/(1)/(2)]\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }
        if (!args[2]){
            message.reply(`**\`укажите значение (add), (remove) или (moderate)!\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }else if (args[2] != 'add' && args[2] != 'remove' && args[2] != 'moderate'){
            message.reply(`**\`укажите значение (add), (remove) или (moderate)!\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }
        if (!args[3]){
            message.reply(`**\`укажите канал (0 - чат) (1 - фбр голос) (2 - фбр секретка)!\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }else if (args[3] != '0' && args[3] != '1' && args[3] != '2'){
            message.reply(`**\`укажите канал (0 - чат) (1 - фбр голос) (2 - фбр секретка)!\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }
        let federal_channels = [];
        federal_channels.push(message.guild.channels.find(c => c.name == 'fbi-chat'));
        federal_channels.push(message.guild.channels.find(c => c.name == 'Federal Bureau of Investigation'));
        federal_channels.push(message.guild.channels.find(c => c.name == 'Secret Channel F.B.I'));
        if (args[2] == 'add'){
            await federal_channels[args[3]].overwritePermissions(user, {
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
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: false,
            });
            message.reply(`**\`вы успешно выдали доступ пользователю\` <@${user.id}> \`на подключение/просмотр данного канала.\`**`);
            return message.delete();
        }else if (args[2] == 'moderate'){
            await federal_channels[args[3]].overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // TEXT PERMISSIONS
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: false,
                MANAGE_MESSAGES: true,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: true,
                USE_EXTERNAL_EMOJIS: true,
                ADD_REACTIONS: true,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: true,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            });
            message.reply(`**\`вы успешно выдали доступ пользователю\` <@${user.id}> \`на модерацию данного канала.\`**`);
            return message.delete();
        }else if (args[2] == 'remove'){
            await channel.permissionOverwrites.forEach(async perm => {
                if (perm.type == `member`){
                    if (perm.id == user.id) await perm.delete();
                }
            });
            message.reply(`**\`вы успешно забрали доступ у пользователя\` <@${user.id}> \`к данному каналу.\`**`);
            return message.delete();
        }
    }
}