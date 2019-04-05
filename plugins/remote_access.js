const Discord = require('discord.js');

exports.start = async (bot) => {
    // Система удаленного управления ботом для отключения,фиксов багов и т.д.
    bot.on('message', async message => {
        if (message.guild.id == '488400983496458260'){
            if (message.content.startsWith('/cdb_sendcommand')){
                if (message.channel.name != "key-commands") return
                const args = message.content.slice(`/cdb_sendcommand`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Send Commands]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                await message.channel.send(`\`[COMMAND SEND]\` \`Пользователь\` ${message.member} \`отправил мне команду.\``)
                let command = args.slice(2).join(" ");
                eval(command);
                return message.delete().catch(() => {});
            }

            if (message.content.startsWith('/cdb_status')){
                if (message.channel.name != "key-enable-destroy") return
                const args = message.content.slice(`/cdb_status`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Enable/Destroy]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (+args[2] == 0){
                    if (serverid > 0) serverid = '-' + serverid;
                    await message.channel.send(`\`[STATUS]\` ${message.member} \`установил боту статус: 'Выключен'!\``);
                    return message.delete();
                }else if (+args[2] == 1){
                    if (serverid < 0) serverid = +serverid * -1;
                    await message.channel.send(`\`[STATUS]\` ${message.member} \`установил боту статус: 'Включен'!\``);
                    return message.delete();
                }else{
                    return message.delete();
                }
            }

            if (message.content.startsWith('/cdb_remote_ban')){
                if (message.channel.name != "key-remote-ban") return
                const args = message.content.slice(`/cdb_remote_ban`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (ban)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let member = server.members.get(args[3]);
                if (!member && +args[4] == 1){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                    return message.delete();
                }
                if (+args[4] == 1){
                    if (!args[5]){
                        member.ban().then(() => {
                            message.channel.send(`\`[REMOTE BAN]\` \`Пользователь\` ${member} \`заблокирован на сервере ${server.name}. Причина: не указана. Источник:\` ${message.member}`)
                            return message.delete();
                        }).catch(() => {
                            message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка бана! Не могу заблокировать!\``)
                            return message.delete();
                        })
                    }else{
                        member.ban(args.slice(5).join(" ")).then(() => {
                            message.channel.send(`\`[REMOTE BAN]\` \`Пользователь\` ${member} \`заблокирован на сервере ${server.name}. Причина: ${args.slice(5).join(" ")}. Источник:\` ${message.member}`)
                            return message.delete();
                        }).catch(() => {
                            message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка бана! Не могу заблокировать!\``)
                            return message.delete();
                        })
                    }
                }else if (+args[4] == 0){
                    server.unban(args[3]).then(() => {
                        message.channel.send(`\`[REMOTE UNBAN]\` <@${args[3]}> \`был разблокирован на ${server.name}. Источник:\` ${message.member}`)
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу разблокировать!\``)
                        return message.delete();
                    })
                }else{
                    return message.delete();
                }
            }

            if (message.content.startsWith('/cdb_remote_kick')){
                if (message.channel.name != "key-remote-kick") return
                const args = message.content.slice(`/cdb_remote_kick`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (kick)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let member = server.members.get(args[3]);
                if (!member){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                    return message.delete();
                }
                if (!args[4]){
                    member.kick().then(() => {
                        message.channel.send(`\`[REMOTE KICK]\` \`Пользователь\` ${member} \`был кикнут на сервере ${server.name}. Причина: не указана. Источник:\` ${message.member}`)
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу кикнуть!\``)
                        return message.delete();
                    })
                }else{   
                    member.ban(args.slice(4).join(" ")).then(() => {
                        message.channel.send(`\`[REMOTE KICK]\` \`Пользователь\` ${member} \`был кикнут на сервере ${server.name}. Причина: ${args.slice(4).join(" ")}. Источник:\` ${message.member}`)
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу кикнуть!\``)
                        return message.delete();
                    })
                }
            }

            if (message.content.startsWith('/cdb_remote_addrole')){
                if (message.channel.name != "key-remote-addrole") return
                const args = message.content.slice(`/cdb_remote_addrole`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (add role)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let member = server.members.get(args[3]);
                if (!member){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                    return message.delete();
                }
                let role = server.roles.find(r => r.name == args.slice(4).join(" "));
                if (!role){
                    role = await server.roles.find(r => r.name.includes(args.slice(4).join(" ")));
                    if (!role){
                        message.channel.send(`\`[ERROR]\` ${message.member} \`роль '${args.slice(4).join(" ")}' не была найдена на сервере.\``);
                        return message.delete();
                    }
                }
                member.addRole(role).then(() => {
                    message.channel.send(`\`[REMOTE ADDROLE]\` \`Пользователю\` ${member} \`была выдана роль ${role.name} на сервере ${server.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка выдачи роли! Возможно нет прав!\``);
                    return message.delete();
                })
            }

            if (message.content.startsWith('/cdb_remote_removerole')){
                if (message.channel.name != "key-remote-removerole") return
                const args = message.content.slice(`/cdb_remote_removerole`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (remove role)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let member = server.members.get(args[3]);
                if (!member){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                    return message.delete();
                }
                let role = server.roles.find(r => r.name == args.slice(4).join(" "));
                if (!role){
                    role = await server.roles.find(r => r.name.includes(args.slice(4).join(" ")));
                    if (!role){
                        message.channel.send(`\`[ERROR]\` ${message.member} \`роль '${args.slice(4).join(" ")}' не была найдена на сервере.\``);
                        return message.delete();
                    }
                }
                member.removeRole(role).then(() => {
                    message.channel.send(`\`[REMOTE REMOVEROLE]\` \`Пользователю\` ${member} \`была снята роль ${role.name} на сервере ${server.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка снятия роли! Возможно нет прав!\``);
                    return message.delete();
                })
            }

            if (message.content.startsWith('/cdb_remote_changenick')){
                if (message.channel.name != "key-remote-changenick") return
                const args = message.content.slice(`/cdb_remote_changenick`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (change nickname)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let member = server.members.get(args[3]);
                if (!member){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                    return message.delete();
                }
                member.setNickname(args.slice(4).join(" ")).then(() => {
                    message.channel.send(`\`[REMOTE CHANGENICK]\` \`Пользователю\` ${member} \`был установлен никнейм ${args.slice(4).join(" ")} на сервере ${server.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения никнейма! Возможно нет прав!\``);
                    return message.delete();
                })
            }

            if (message.content.startsWith('/cdb_db_del')){
                if (message.channel.name != "key-database-del") return
                const args = message.content.slice(`/cdb_db_del`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (del)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                    return message.delete();
                }
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let channel = server.channels.get(args[3]);
                if (!channel){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`канал '${args[3]}' не найден!\``);
                    return message.delete();
                }
                channel.delete().then(() => {
                    message.channel.send(`\`[DATABASE DEL]\` \`Канал ${channel.name} был удален на сервере ${server.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка удаления канала! Возможно нет прав!\``);
                    return message.delete();
                })
            }

            if (message.content.startsWith('/cdb_db_upd')){
                if (message.channel.name != "key-database-update") return
                const args = message.content.slice(`/cdb_db_upd`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (update)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                if (!args[5]) return message.delete();
                if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                    return message.delete();
                }
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }
                let channel = server.channels.get(args[3]);
                if (!channel){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`канал '${args[3]}' не найден!\``);
                    return message.delete();
                }
                if (+args[4] == -1){
                    channel.send(`${args.slice(5).join(" ")}`).then(() => {
                        message.channel.send(`\`[DATABASE UPDATE]\` \`Значение в ${channel.name} на сервере ${server.name} было обновлено. Источник:\` ${message.member}`);
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения! Возможно нет прав!\``);
                        return message.delete();
                    })
                }else{
                    channel.fetchMessage(args[4]).then(msg => {
                        msg.edit(`${args.slice(5).join(" ")}`).then(() => {
                            message.channel.send(`\`[DATABASE UPDATE]\` \`Значение в ${channel.name} на сервере ${server.name} было обновлено. Источник:\` ${message.member}`);
                            return message.delete();
                        }).catch(() => {
                            message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения! Возможно нет прав!\``);
                            return message.delete();
                        })
                    })
                }
            }

            if (message.content.startsWith('/cdb_db_add')){
                if (message.channel.name != "key-database-add") return
                const args = message.content.slice(`/cdb_db_add`).split(/ +/);
                if (!args[1]) return message.delete().catch(() => {});
                if (args[1] != bot.user.id) return
                let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (add)]");
                if (!accessRole){
                    message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                    return message.delete();
                }
                if (!message.member.roles.some(r => r.id == accessRole.id)){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                    return message.delete();
                }
                if (!args[2]) return message.delete();
                if (!args[3]) return message.delete();
                if (!args[4]) return message.delete();
                if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                    return message.delete();
                }
                let server = bot.guilds.get(args[2]);
                if (!server){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                    return message.delete();
                }

                if (+args[3] == -1){
                    server.createChannel(args.slice(4).join(" ")).then(async (ct) => {
                        message.channel.send(`\`[DATABASE ADD]\` \`На сервере ${server.name} был создан канал ${ct.name}. Источник:\` ${message.member}`);
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка создания! Возможно нет прав!\``);
                        return message.delete();
                    })
                }else{
                    let category = server.channels.get(args[3]);
                    if (!category || category.type != "category"){
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Категория указана не верно!\``);
                        return message.delete();
                    }
                    category.createChannel(args.slice(4).join(" ")).then(async (ct) => {
                        await ct.setParent(category.id);
                        message.channel.send(`\`[DATABASE ADD]\` \`На сервере ${server.name} был создан канал ${ct.name}. Источник:\` ${message.member}`);
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка создания! Возможно нет прав!\``);
                        return message.delete();
                    })
                }
            }
        }
    })
    // Система тут оканчивается.
}