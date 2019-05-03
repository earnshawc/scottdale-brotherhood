const Discord = require('discord.js');
const bot = new Discord.Client();
const tbot = new Discord.Client();
const user = new Discord.Client();
const spec_bot = new Discord.Client();
const bbc_user = new Discord.Client();
const fs = require("fs");
const md5 = require('./my_modules/md5');
const download = require('./my_modules/download-to-file'); // download('url, './dir/file.txt', function (err, filepath) {})
const file_length = fs.readFileSync('./index.js').length;

const version = '1.1.3-hide';
// Первая цифра означает глобальное обновление. (global_systems)
// Вторая цифра обозначет обновление одной из подсистем. (команда к примеру)
// Третяя цифра обозначает количество мелких фиксов. (например опечатка)

const update_information = "Проверка файла."

const GoogleSpreadsheet = require('./google_module/google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.skey);
const creds_json = {
    client_email: process.env.google_client_email,
    private_key: `-----BEGIN PRIVATE KEY-----\n${process.env.google_private_key}\n${process.env.google_key_two}\n${process.env.google_key_three}\nKPAu6SL9OraGwtioCgWyBwlTHuN3yn2o9mpnAzNmzqTh6WbRPD5PrB2jq8Pk1MiV\nbz/I+0DRPhcA/37t23q6UUo16gSofFFLaD0npMaoOY2aK+os0NdnmGai8Y8XzVoN\nbbgXKgDvpIy7TLpS4z79mpAsrSl109+evVhOSp4SP4NIWUb0Mu+OkYcNWmIhfFUF\nkLMDgWqJAgMBAAECggEAKmTuCmLFEIUDFeRBd5i+Xex/B9BJDoexCzX9LwacqN8D\n79FCoZmL/0aqt6VNBbA4d1q017j6WgUxw/HI2H40CQY9xqy+F/e9xP7NuWHmhmqZ\nTnjVrc4azpGfiQxWkD/waStbC5XuVdBMo9xWKaBW8ySKEIYOgUSZteDK4uIB+rmn\nbT6993l0elYZClt7hQuZtEqi/o/YOdYj6FMx0ONlkqqh4TmHG4s0rBNjzFuXfOwF\nVdrx2saEpORATA/UPOMf31ox2gqs2jays/HYnjxt6Q5sD750fMdY/4/vEkfpWeV2\nUDJg6tvIVWIUKN5ofQZfmGRqHkRxoC2U+beljvq2SQKBgQDpsP8xsaJaUt2guBhr\nHnSGS57PgrJ/NLPSmkgcG3hhhZ38VL7hPaT48CUZ1kGOOncjkUngl14tfmvPzkxp\n5XaO/VMNdrhk8Cg5/orQ1HjuxR5DzYWHDuTwFtlFtBZILA6cpN758zjYsAEHgMCD\nOoegeZPPf9BZ9Mkf5H4n5xG6rQKBgQDBwaU2RtiGbGIxMUN+1LuZFgexw86Q0v+I\nLE196ZQCUxgdJv58YFQZQbvfaivd+ugoZE17DS99lyQvbfwIN0L/ngEcHuRZYIEN\nqi3FNO+ylcC3LLmD5h4jw9Lfgsy2992GOP/uIaCxGXzqkSGg2dmET7/akFdbwmys\nCOLFzWZmzQKBgFxcdh//4vjr82hIGm6L1OYXESdWspGQFNpR29owCT4R/0TxgZeo\nM4Gn+CHkCnjaJqhKDfbUHIbChn3VPWJFLLyK5r5Vg79xI5T4Q4kR0NId2j5WBkZA\n3r79aNYhvQS9VPEYQIBtXrRVq7J5cpzrDxufsYm7LG/BTZRrTGkc7GbpAoGAL+f9\nPWpO5w2tSZRwp89ZgwRbaqyLSmuhGr45esRiACEjeTHHAmGe6Y/DL/5EUmJTPIlw\nTth3wYm5PLDo++8N9b3PcHCC7UZbIlHNd1EbYwB74c6BIAeptBYa8YCZtTOb5i/5\nt5tA7AjtReIUenzit0Awo43Ey79Kt06LI3UhuJECgYATKkzkljEePsdYjWT6HyWj\n4GcG9OArgGHjvDuGjgav30qtfYSntDeRQBsnyTIHZ7V7vFDPK7qO2tyWsMW6YFi2\noTSqjNqNln1CdeS2zWLLtKoQY+5Y090ThJHLo16Neb+NNX15+TeCFdTs7QAEubJd\n+vOOQNHRvfnm63KuSIKlmw==\n-----END PRIVATE KEY-----\n`,
}
doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) console.log(err);
});

async function get_profile(gameserver, author_id){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.idпользователя == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false); // Если аккаунт не существует, вывести false;
            let account_info = [
                db_account.idпользователя, // Вывод ID пользователя.
                db_account.статусразработчика, // Вывод статуса разработчика.
            ];
            resolve(account_info);
        });
    });
}

async function add_profile(gameserver, author_id){
    return new Promise(async function(resolve, reject) {
        doc.addRow(gameserver, {
            idпользователя: `${author_id}`,
            статусразработчика: '0',
            exp: '0',
            money: '0'
        }, async function(err){
            if (err){
                console.error(`[DB] Ошибка добавления профиля на лист!`);
                return reject(new Error(`При использовании 'addRow' произошла ошибка.`));
            }
            resolve(true);
        });
    });
}

async function change_profile(gameserver, author_id, table, value){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.idпользователя == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false);
            if (table == 'idпользователя') db_account.idпользователя = `${value}`;
            else if (table == 'статусразработчика') db_account.статусразработчика = `${value}`;
            else return reject(new Error("Значение table указано не верно!"));
            db_account.save();
            resolve(true);
        });
    });
}

async function delete_profile(gameserver, author_id){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.idпользователя == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false);
            db_account.del();
            resolve(true);
        });
    });
}

const low = require('./lib/main');
const FileSync = require('./lib/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)

let levelhigh = 0;
let lasttestid = 'net';

const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const support_cooldown = new Set(); // Запросы от игроков.
const snyatie = new Set(); // Уже отправленные запросы на снятие роли быдут записаны в snyatie
const has_removed = new Set();

let antislivsp1 = new Set();
let antislivsp2 = new Set();

let setembed_general = ["не указано", "не указано", "не указано", "не указано", "не указано", "не указано", "не указано"];
let setembed_fields = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];
let setembed_addline = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];

let serverid = '355656045600964609';
let databaseid = '493459379878625320';

let tags = require('./plugins/tags').get('tags');
let manytags = require('./plugins/tags').get('manytags');
let rolesgg = require('./plugins/tags').get('rolesgg');
let canremoverole = require('./plugins/tags').get('canremoverole');

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

async function special_discord_update(){
    setInterval(async () => {
        let special_server = spec_bot.guilds.get('543799835652915241');
        if (!special_server) return console.log('Сервер спец.администрации не найден!');
        let admin_role = special_server.roles.find(r => r.name == 'Администратор [3-4]');
        let helper_role = special_server.roles.find(r => r.name == 'Хелпер [1-2]');
        if (!admin_role || !helper_role) return console.log('Роли хелпера или админа не найдены на спец админском');
        let all_chat = special_server.channels.find(c => c.name == 'основной');
        if (!all_chat) return console.log('Чат "основной" не был найден!');
        let phoenix = user.guilds.get('544446632226324481');
        let tucson = user.guilds.get('438803520288981004');
        let scottdale = user.guilds.get('355656045600964609');
        let chandler = user.guilds.get('555334013255155712');
        let brainburg = user.guilds.get('282282840840732672');
        let saintrose = user.guilds.get('347728316557426688');
        let mesa = user.guilds.get('399241867914379265');
        let redrock = user.guilds.get('470981734863994881');
        let yuma = user.guilds.get('528635749206196232');

        let central = user.guilds.get('325607843547840522');
        let eastern = user.guilds.get('465086262383083520');
        let north = user.guilds.get('477547500232769536');
        let vostok = user.guilds.get('530848070284607499');
        if (!phoenix || !tucson || !scottdale || !chandler || !brainburg || !saintrose || !mesa || !redrock || !yuma || !central || !eastern || !north || !vostok) return console.log('Один из серверов не найден!');
        
        special_server.members.forEach(async (member) => {
            
            let server_were_admin = [];
            let server_were_helper = [];

            if (phoenix.members.get(member.id)){
                let g_member = phoenix.members.get(member.id);
                if (g_member.roles.some(r => ['Администрация 4 уровня', 'Администрация 3 уровня'].includes(r.name))){
                    server_were_admin.push('Phoenix');
                }else if (g_member.roles.some(r => ['Администрация 1-2 уровня'].includes(r.name))){
                    server_were_helper.push('Phoenix');
                }
            }
            
            if (tucson.members.get(member.id)){
                let g_member = tucson.members.get(member.id);
                if (g_member.roles.some(r => ['Администратор 4 уровня', 'Администратор 3 уровня'].includes(r.name))){
                    server_were_admin.push('Tucson');
                }else if (g_member.roles.some(r => ['Администратор 2 уровня', 'Администратор 1 уровня'].includes(r.name))){
                    server_were_helper.push('Tucson');
                }
            }
            
            if (scottdale.members.get(member.id)){
                let g_member = scottdale.members.get(member.id);
                if (g_member.roles.some(r => ['✔ Administrator ✔', '✔Jr.Administrator✔'].includes(r.name))){
                    server_were_admin.push('Scottdale');
                }else if (g_member.roles.some(r => ['✔ Helper ✔'].includes(r.name))){
                    server_were_helper.push('Scottdale');
                }
            }
            
            if (chandler.members.get(member.id)){
                let g_member = chandler.members.get(member.id);
                if (g_member.roles.some(r => ['Администратор 4 уровня', 'Администратор 3 уровня'].includes(r.name))){
                    server_were_admin.push('Chandler');
                }else if (g_member.roles.some(r => ['Хелпер'].includes(r.name))){
                    server_were_helper.push('Chandler');
                }
            }
            
            if (brainburg.members.get(member.id)){
                let g_member = brainburg.members.get(member.id);
                if (g_member.roles.some(r => ['⚃ Администратор 4 ур. ⚃', '⚂ Администратор 3 ур. ⚂'].includes(r.name))){
                    server_were_admin.push('Brainburg');
                }else if (g_member.roles.some(r => ['⚁ Администратор 2 ур. ⚁', '⚀ Администратор 1 ур. ⚀'].includes(r.name))){
                    server_were_helper.push('Brainburg');
                }
            }
            
            if (saintrose.members.get(member.id)){
                let g_member = saintrose.members.get(member.id);
                if (g_member.roles.some(r => ['◉ Ст. Администратор [4 LVL]', '◉ Мл. Администратор [3 LVL]'].includes(r.name))){
                    server_were_admin.push('Saint Rose');
                }else if (g_member.roles.some(r => ['◉ Хелпер [1-2 LVL]'].includes(r.name))){
                    server_were_helper.push('Saint Rose');
                }
            }
            
            if (mesa.members.get(member.id)){
                let g_member = mesa.members.get(member.id);
                if (g_member.roles.some(r => ['✔Administration✔', '✔Jr.Administration✔'].includes(r.name))){
                    server_were_admin.push('Mesa');
                }else if (g_member.roles.some(r => ['✔Moderator✔'].includes(r.name))){
                    server_were_helper.push('Mesa');
                }
            }
            
            if (redrock.members.get(member.id)){
                let g_member = redrock.members.get(member.id);
                if (g_member.roles.some(r => ['IV ⚡ Администратор', 'III ⚡ Старший модератор'].includes(r.name))){
                    server_were_admin.push('Red-Rock');
                }else if (g_member.roles.some(r => ['II ⚡ Модератор', 'I ⚡ Младший модератор'].includes(r.name))){
                    server_were_helper.push('Red-Rock');
                }
            }
            
            if (yuma.members.get(member.id)){
                let g_member = yuma.members.get(member.id);
                if (g_member.roles.some(r => ['✔ Administrator ✔', '✔Jr.Administrator✔'].includes(r.name))){
                    server_were_admin.push('Yuma');
                }else if (g_member.roles.some(r => ['✔ Helper ✔'].includes(r.name))){
                    server_were_helper.push('Yuma');
                }
            }


            if (central.members.get(member.id)){
                let g_member = central.members.get(member.id);
                if (g_member.roles.some(r => ['✦ Администратор ✦', '✦ Младший администратор ✦'].includes(r.name))){
                    server_were_admin.push('Центральный Округ');
                }else if (g_member.roles.some(r => ['✦ Модератор ✦', '✦ Хелпер ✦'].includes(r.name))){
                    server_were_helper.push('Центральный Округ');
                }
            }

            if (eastern.members.get(member.id)){
                let g_member = eastern.members.get(member.id);
                if (g_member.roles.some(r => ['☆ Администратор ☆', '☆ Старший Модератор ☆'].includes(r.name))){
                    server_were_admin.push('Южный округ');
                }else if (g_member.roles.some(r => ['☆ Модератор ☆', '☆  Младший Модератор  ☆'].includes(r.name))){
                    server_were_helper.push('Южный округ');
                }
            }

            if (north.members.get(member.id)){
                let g_member = north.members.get(member.id);
                if (g_member.roles.some(r => ['✔ Administrator ✔', '✔ Jr.Administrator ✔'].includes(r.name))){
                    server_were_admin.push('Северный округ');
                }else if (g_member.roles.some(r => ['✔ Moderator ✔', '✔ Helper ✔'].includes(r.name))){
                    server_were_helper.push('Северный округ');
                }
            }

            if (vostok.members.get(member.id)){
                let g_member = vostok.members.get(member.id);
                if (g_member.roles.some(r => ['★ Администратор ★', '★ Старший Модератор ★'].includes(r.name))){
                    server_were_admin.push('Восточный округ');
                }else if (g_member.roles.some(r => ['★ Модератор ★', '★ Младший Модератор ★'].includes(r.name))){
                    server_were_helper.push('Восточный округ');
                }
            }

            if (server_were_admin.length > 0){
                if (!member.roles.some(r => admin_role.id == r.id)){
                    await member.addRole(admin_role);
                    await all_chat.send(`**${member}, \`вам была выдана роль ${admin_role.name}. Администратор на: ${server_were_admin.join(', ')}\`**`);
                    if (member.roles.some(r => helper_role.id == r.id)){
                        await member.removeRole(helper_role);
                    }
                }
            }else if (server_were_helper.length > 0){
                if (!member.roles.some(r => helper_role.id == r.id)){
                    await member.addRole(helper_role);
                    await all_chat.send(`**${member}, \`вам была выдана роль ${helper_role.name}. Хелпер на: ${server_were_helper.join(', ')}\`**`);
                    if (member.roles.some(r => admin_role.id == r.id)){
                        await member.removeRole(admin_role);
                    }
                }
            }

            if (server_were_admin.length == 0){
                if (member.roles.some(r => admin_role.id == r.id)){
                    await member.removeRole(admin_role);
                    await all_chat.send(`**${member}, \`вам была снята роль ${admin_role.name}. Не является администратором на одном из серверов.\`**`);
                }
            }

            if (server_were_helper.length == 0){
                if (member.roles.some(r => helper_role.id == r.id)){
                    await member.removeRole(helper_role);
                    await all_chat.send(`**${member}, \`вам была снята роль ${helper_role.name}. Не является хелпером на одном из серверов.\`**`);
                }
            }
        });
    }, 40000);
}

async function check_updates(r_msg){
    setTimeout(async () => {
        let channel = bot.guilds.get('493459379878625320').channels.find(c => c.name == 'bot-updates');
        if (!channel) return console.error(`Канал обновлений не найден!`);
        get_profile(10, serverid).then(async value => {
            channel.fetchMessages({limit: 1}).then(async messages => {
                let msg = messages.first();
                if (msg.content != version){
                    let server = bot.guilds.get('355656045600964609');
                    let sp_channel = server.channels.find(c => c.name == 'spectator-chat');
                    if (!server) return console.error('ошибка загрузки обновления, сервер не найден');
                    if (!sp_channel) return console.error('ошибка загрузки обновления, sp-chat не найден');
                    const embed = new Discord.RichEmbed();
                    embed.addField(`**Обновление. Версия: \`${version}\`**`, `**${update_information}**`);
                    await r_msg.edit(r_msg.content.replace('[Проверка наличия обновлений...]', `[Обновление завершено. (v.${msg.content}) (v.${version})]`)).then(async () => {
                        if (version.includes('-hide')){
                            await channel.send(version);
                            if (value[1] != file_length) change_profile(10, serverid, 'статусразработчика', file_length);
                        }else{
                            await sp_channel.send(embed).then(async () => {
                                await channel.send(version);
                                if (value[1] != file_length) change_profile(10, serverid, 'статусразработчика', file_length);
                            });
                        }
                    });
                }else{
                    if (value[1] != file_length){
                        let server = bot.guilds.get('355656045600964609');
                        let sp_channel = server.channels.find(c => c.name == 'spectator-chat');
                        await r_msg.edit(r_msg.content.replace('[Проверка наличия обновлений...]', `[Ошибка проверки версии.]`));
                        await sp_channel.send(`\`[ERROR]\` \`Версия не обновлена. Автоматическое отключение. [до: ${value[1]}, после: ${file_length}]\``);
                        return process.exit();
                    }
                    r_msg.edit(r_msg.content.replace('[Проверка наличия обновлений...]', `[Версии совпадают. (v.${msg.content}) (v.${version})]`));
                }
            });
        });
    }, 10000);
};

const warn_cooldown = new Set();
const support_loop = new Set();

bot.login(process.env.token);
tbot.login(process.env.recovery_token);
bbc_user.login(process.env.bbc_token);
user.login(process.env.user_token);
spec_bot.login(process.env.spec_token);


bbc_user.on('ready', async () => {
    console.log(`Авторизован как ${bbc_user.user.tag} [${bbc_user.user.id}]`);
    bbc_user.user.setActivity('в монитор', { type: "WATCHING" });
});

user.on('ready', async () => {
    console.log(`Авторизован как ${user.user.tag} [${user.user.id}]`);
    user.user.setActivity('за серверами', { type: "WATCHING" });
});

tbot.on('ready', () => {
    console.log('TБот был успешно запущен.'); 
});

bot.on('ready', async () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'hacker' }, status: 'dnd' })
    check_unwanted_user();
    require('./plugins/remote_access').start(bot); // Подгрузка плагина удаленного доступа.
    await bot.guilds.get(serverid).channels.get('493181639011074065').send('**\`[BOT] - Запущен. [#' + new Date().valueOf() + '-' + bot.uptime + '] [Проверка наличия обновлений...]\`**').then(msg => {
        check_updates(msg);
    });
});

spec_bot.on('ready', () => {
    console.log("Спец.Бот был успешно запущен!");
    special_discord_update();
});

user.on('message', async (message) => {
    if (message.author.id != user.user.id) return

    if (message.content.startsWith("/newsp")){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice(`/newsp`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите день! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`укажите название месяца! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[3]){
            message.reply(`\`укажите ссылку на заявку! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[1] > 31 || args[1] < 1 || args[2] > 12 || args[2] < 1){
            message.reply(`\`У нас всего 12 месяцев и 31 день. '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[2] == 1) args[2] = 'января';
        else if (args[2] == 2) args[2] = 'февраля';
        else if (args[2] == 3) args[2] = 'марта';
        else if (args[2] == 4) args[2] = 'апреля';
        else if (args[2] == 5) args[2] = 'мая';
        else if (args[2] == 6) args[2] = 'июня';
        else if (args[2] == 7) args[2] = 'июля';
        else if (args[2] == 8) args[2] = 'августа';
        else if (args[2] == 9) args[2] = 'сентября';
        else if (args[2] == 10) args[2] = 'октября';
        else if (args[2] == 11) args[2] = 'ноября';
        else if (args[2] == 12) args[2] = 'декабря';
        else {
            message.reply(`\`месяц указан не верно!\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        let textforobz = "**  ╔┓┏╦━━╦┓╔┓╔━━╗ @everyone\n  ║┗┛║┗━╣┃║┃║╯╰║ @everyone\n  ║┏┓║┏━╣┗╣┗╣╰╯║ @everyone\n  ╚┛┗╩━━╩━╩━╩━━╝ @everyone**";
        const embed = new Discord.RichEmbed()
        .setTitle("**Заявления на пост модератора группы**")
        .setColor("#FF8E01")
        .setDescription("**Мы вернулись, что бы обрадовать вас! Ведь " + args[1] + " " + args[2] + " пройдет набор на пост Spectator'a нашей группы Discord!\nВы сможете стать одним из нас, почуствовать себя в роли модератора группы, последить за игроками, а так же получить доступ к супер секретным функциям канала Scottdale Brotherhood. Все, что вам нужно будет делать, это наводить порядок в нашей группе и помогать игрокам!**")
        .setFooter("Предоставил: Kory_McGregor", "https://cdn.discordapp.com/avatars/336207279412215809/211ab8ef6f7b4dfd9d3bfbf45999eea0.png?size=128")
        .setImage("https://i.imgur.com/nFD61xf.gif")
        .setTimestamp()
        .addBlankField(false)
        .addField("**Что нужно, что бы попасть к нам?**", `**1) Вам нужно будет знать правила нашего discord-сервера! Если вы хотите стать модератором, то вы должны знать за что идут наказания.\n2) Вам нужно понимать систему модерирования. Ведь просто ходить по каналам и кричать на нарушителя "Прекрати!" будет выглядить глупо.\n3) Вам будет необходимо выбрать себе специальность. Вы уникальны. Каждый из вас понимает где-то лучше, чем остальные. Кто-то может стать обычным модератором, другой DJ-ем канала, а третий создавать ботов и управлять командой модераторов discord-сервера.\n4) Быть дружелюбным и коммуникабельным! Одна из самых главных особенностей! Мы же помогаем игрокам! Вы должны понимать, что модератор, встав на пост не сможет устраивать конфликты с игроками и общаться неподобающе в ЛС!**`)
        .addBlankField(false)
        .addField("**Требования к участникам**", "**1) Не состоять в черном списке Scottdale\n2) Быть активным участником нашей группы.\n3) У вас не должно быть грубых нарушений.\n4) Быть адекватным, коммуникабельным, ответственным.\n5) Не быть действующим лидером, министром, администратором.**")
        .addBlankField(false)
        .addField("**Дополнительные ссылки**", "**Оставить заявление вы можете нажав на [выделенный текст](" + args[3] + ").\nУзнать подробности по поводу обзвона вы сможете в <#" + message.guild.channels.find(c => c.name == 'support').id + ">**");
        message.channel.send(textforobz, {embed});
        return message.delete()
    }

    if (message.content == '/send_to_forum'){
        if (message.author.id != user.user.id) return
        const embed = new Discord.RichEmbed()
        .setTitle("**Arizona Role Play » Правила подачи жалобы на администрацию**")
        .setColor("#FF8E01")
        .addField('**Регистрация на форуме**', '**Для подачи жалобы вам необходимо пройти регистрацию на форуме. Сделать это можно нажав на [выделенный текст](http://forum.arizona-rp.com/index.php?login/login). После подтверждения эл.адреса вы сможете воспользоваться форумом по ссылке [forum.arizona-rp.com](http://forum.arizona-rp.com/index.php)**')
        .addField('**Правила подачи жалобы**', '**Справа у вас будет доступно быстрое меню, нажав на которое вас перебросит в выбранный вами раздел. После перехода в раздел жалоб, вам необходимо выбрать пункт \`« Жалобы на администрацию »\`. Внимательно ознакомьтесь с информацией в темах от администрации перед подачей жалобы! После ознакомления вам нужно нажать на кнопку \`« Создать тему »\` и составить жалобу.**')
        .addField('**Дополнительные ссылки**', '**Раздел жалоб Phoenix: [нажать](http://forum.arizona-rp.com/index.php?forums/525/)\nРаздел жалоб Tucson: [нажать](http://forum.arizona-rp.com/index.php?forums/523/)\nРаздел жалоб Scottdale: [нажать](http://forum.arizona-rp.com/index.php?forums/521/)\nРаздел жалоб Chandler: [нажать](http://forum.arizona-rp.com/index.php?forums/519/)\nРаздел жалоб Brainburg: [нажать](http://forum.arizona-rp.com/index.php?forums/540/)\nРаздел жалоб Saint Rose: [нажать](http://forum.arizona-rp.com/index.php?forums/682/)\nРаздел жалоб Mesa: [нажать](http://forum.arizona-rp.com/index.php?forums/754/)\nРаздел жалоб Red-Rock: [нажать](http://forum.arizona-rp.com/index.php?forums/838/)\nРаздел жалоб Yuma: [нажать](http://forum.arizona-rp.com/index.php?forums/956/)**')
        .setImage('https://i.imgur.com/i6c8OHq.jpg')
        .setTimestamp()
        .setFooter("Техническая поддержка » Arizona Role Play", "https://i.imgur.com/5qSrUJW.png")
        message.channel.send(embed);
        return message.delete();
    }

    if (message.content == '/my_user_card'){
        if (message.author.id != user.user.id) return
        const embed = new Discord.RichEmbed()
        .setTitle("Arizona Role Play » Карточка пользователя")
        .setDescription('**Связь со мной: [vk.com/artemka076](https://vk.com/artemka076)\nФорум: [kory-mcgregor.201454](http://forum.arizona-rp.com/index.php?members/kory-mcgregor.201454/)\nDiscord: [Artemka076#6715](https://discordapp.com/channels/@me/336207279412215809)**')
        .setColor("#FF8E01")
        .setThumbnail(user.user.avatarURL)
        .setTimestamp()
        .setFooter("Техническая поддержка » Arizona Role Play", "https://i.imgur.com/5qSrUJW.png")
        message.channel.send(embed);
        return message.delete();
    }
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return
    if (message.guild.id != serverid && message.guild.id != "493459379878625320") return
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.author.id == bot.user.id) return
    if (message.content.startsWith("-+ban")) lasttestid = message.author.id;

    const authorrisbot = new Discord.RichEmbed()
    .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")

    // Системы
    require('./global_systems/embeds').run(bot, message, setembed_general, setembed_fields, setembed_addline);
    require('./global_systems/family').run(bot, message);
    require('./global_systems/role').run(bot, message, tags, rolesgg, canremoverole, manytags, nrpnames, sened, snyatie, has_removed);
    require('./global_systems/support').run(bot, message, support_loop, support_cooldown);
    require('./global_systems/warn').run(bot, message, warn_cooldown);
    require('./global_systems/fbi_system').run(bot, message);
    
    if (message.content.startsWith(`/run`)){
        get_profile(3, message.author.id).then(value => {
            if (value[1] != '1') return message.delete();
            const args = message.content.slice(`/run`).split(/ +/);
            let cmdrun = args.slice(1).join(" ");
            if (cmdrun.includes('token') && message.author.id != '336207279412215809'){
                message.reply(`**\`вам запрещено получение токена.\`**`);
                return message.delete();
            }
            try {
                eval(cmdrun);
            } catch (err) {
                message.reply(`**\`произошла ошибка: ${err.name} - ${err.message}\`**`);
            }
        });
    }
	
    if (message.content == '/reset_ddos'){
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(`нет прав.`)
        levelhigh = 0;
        message.channel.send(`\`[SYSTEM]\` \`Уровень опасности сервера был установлен на 0. Источник: ${message.member.displayName}\``)
    }
    
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

    let dataserver = bot.guilds.find(g => g.id == "493459379878625320");
    let scottdale = bot.guilds.find(g => g.id == "355656045600964609");
    if (!dataserver){
        message.channel.send(`\`Data-Server of Scottdale не был загружен!\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        console.error(`Процесс завершен. Data-Server не найден.`)
        return bot.destroy();
    }
    if (message.content.startsWith(`/nick`)){
        const args = message.content.slice(`/nick`).split(/ +/);
        if (!args[1]){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /nick [nick]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        message.member.setNickname(args.slice(1).join(' ')).then(() => {
            message.reply(`**\`ваш никнейм был успешно изменен.\`**`).then(msg => msg.delete(12000));
            return message.delete();
        }).catch((err) => {
            message.reply(`**\`ошибка изменения никнейма. [${err.name}]\`**`).then(msg => msg.delete(12000));
            return message.delete(); 
        });
    }

    if (message.content.startsWith("/ffuser")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.slice('/ffuser').split(/ +/)
        if (!args[1]) return
        let name = args.slice(1).join(" ");
	if(name.length < 4) {
	    message.reply(`**\`вы ввели меньше 4 символов!\`**`).then(msg => msg.delete(12000));
            return message.delete(); 
	}
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
		            .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
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
		    .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
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
        if (!userfinders) return message.reply(`я никого не нашел.`, authorrisbot) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.RichEmbed()
	    .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
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
            .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
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
                .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
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
	
    if (message.content.startsWith("/dwarn")){
	if (!message.member.hasPermission("ADMINISTRATOR")){
	    message.reply(`\`недостаточно прав доступа!\``).then(msg => msg.delete(12000));
	    return message.delete();
	}
	let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`пользователь не указан! '/dwarn [user]'\``)
            return message.delete();
        }
	antislivsp1.delete(user.id);
	antislivsp2.delete(user.id);
	let spchangg = message.guild.channels.find(c => c.name == "spectator-chat");
	spchangg.send(`\`${message.member.displayName} очистил все предупреждения системой антислива пользователю\` <@${user.id}>`);
    }
});

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != "355656045600964609") return // Сервер не 03!
    if (oldMember.roles.size == newMember.roles.size) return // Сменил ник или еще чет!
    if (newMember.user.bot) return // Бот не принимается!
    if (oldMember.roles.size < newMember.roles.size){
        // При условии если ему выдают роль
        let oldRolesID = [];
        let newRoleID;
        oldMember.roles.forEach(role => oldRolesID.push(role.id));
        newMember.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        })
        let role = newMember.guild.roles.get(newRoleID);
        if (role.name != "Spectator™" && role.name != "Support Team") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("ADMINISTRATOR")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    member.removeRoles(member.roles);
                    return newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[ANTISLIV SYSTEM]\` <@${member.id}> \`подозревался в попытке слива. [3/3] Я снял с него роли. Пострадал:\` <@${newMember.id}>, \`выдали роль\` <@&${role.id}>`);
                }else{
                    newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
                    return antislivsp2.add(member.id);
                }
            }
            newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Выдача роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "spectator-chat");
        let question = await spec_chat.send(`<@${member.id}>, \`вы выдали роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>\n\`Укажите причину выдачи роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_ADD]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_ADD]\` \`${member.displayName} выдал роль\` <@&${role.id}> \`пользователю\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }else{
        // При условии если ему снимают роль
        let newRolesID = [];
        let oldRoleID;
        newMember.roles.forEach(role => newRolesID.push(role.id));
        oldMember.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = newMember.guild.roles.get(oldRoleID);
        if (role.name != "Spectator™" && role.name != "Support Team") return
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first())
        let member = await newMember.guild.members.get(entry.executor.id);
        if (member.user.bot) return // Бот не принимается!
        if (!member.hasPermission("ADMINISTRATOR")){
            if (antislivsp1.has(member.id)){
                if (antislivsp2.has(member.id)){
                    member.removeRoles(member.roles);
                    return newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[ANTISLIV SYSTEM]\` <@${member.id}> \`подозревался в попытке слива. [3/3] Я снял с него роли. Пострадал:\` <@${newMember.id}>, \`сняли роль\` <@&${role.id}>`);
                }else{
                    newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [2/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
                    return antislivsp2.add(member.id);
                }
            }
            newMember.guild.channels.find(c => c.name == "spectator-chat").send(`\`[WARNING]\` <@${member.id}> \`подозревается в попытке слива!!! [1/3] Снятие роли\` <@&${role.id}> \`пользователю\` <@${newMember.id}>`)
            return antislivsp1.add(member.id);
        }
        let spec_chat = await newMember.guild.channels.find(c => c.name == "spectator-chat");
        let question = await spec_chat.send(`<@${member.id}>, \`вы сняли роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>\n\`Укажите причину снятия роли в новом сообщении!\``);
        spec_chat.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_DEL]\` \`${member.displayName} снял роль\` <@&${role.id}> \`модератору\` <@${newMember.id}>. \`Причина: ${answer.first().content}\``);
            answer.first().delete().catch(() => {});
        }).catch(async () => {
            question.delete().catch(() => {});
            spec_chat.send(`\`[MODERATOR_DEL]\` \`${member.displayName} снял роль\` <@&${role.id}> \`модератора\` <@${newMember.id}>. \`Причина: не указана.\``);
        })
    }
})

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    const authorrisbot = new Discord.RichEmbed()
    .setAuthor(`© 2018 Risbot Company™`, `https://pp.userapi.com/c849132/v849132806/b35ca/2RD_7K2ysns.jpg?ava=1`, "https://vk.com/risbot")
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id // ID discord сервера
        let event_channelid = event.d.channel_id // ID канала
        let event_userid = event.d.user_id // ID того кто поставил смайлик
        let event_messageid = event.d.message_id // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name // Название смайлика

        if (event_userid == bot.user.id) return // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return // Если сервер будет другой то выход

        let server = bot.guilds.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.fetchMessage(event_messageid); // Получить сообщение из канала
        let member = server.members.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `requests-for-roles`) return // Если название канала не будет 'requests-for-roles', то выйти

        if (event_emoji_name == "🇩"){
            if (!message.embeds[0]){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                return message.delete();
            }else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`"){
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_user || !field_nickname || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: \`||${field_user.id}||`);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_author || !field_user || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: \`||${field_author.id}||`);
                }
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: \`||${field_user.id}||`);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция] Имя_Фамилия [Ранг]\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: \`||${field_author.id}||`);
                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let rolesremoved = false;
                let rolesremovedcount = 0;
                if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                    for (var i in rolesgg){
                        let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                        if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                            rolesremoved = true;
                            rolesremovedcount = rolesremovedcount+1;
                            await field_user.removeRole(rolerem); // Забрать фракционные роли
                        }
                    }
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: \`||${field_user.id}||`);
                if (rolesremoved){
                    if (rolesremovedcount == 1){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                    }else if (rolesremovedcount < 5){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                    }else{
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                    }
                }else{
                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                field_user.removeRole(field_role);
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли (${field_role.name}) от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: \`||${field_user.id}||`);
                field_channel.send(`**<@${field_user.id}>, с вас сняли роль**  <@&${field_role.id}>  **по запросу от <@${field_author.id}>.**`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                if (!has_removed.has(field_user.id)) has_removed.add(field_user.id);
                return message.delete()
            }
        }
    }
});

bot.on('guildBanAdd', async (guild, user) => {
    if (guild.id != serverid) return
    setTimeout(async () => {
        const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        if (member.user.bot && lasttestid != 'net'){
            member = await guild.members.get(lasttestid);
            lasttestid = 'net';
        }
        let reason = await entry.reason;
        if (!reason) reason = 'Причина не указана';
        const embed_ban = new Discord.RichEmbed()
        .setThumbnail(user.avatarURL)
        .setColor("#FF0000")
        .addField(`**Информация о блокировке**`, `**Заблокирован: ${user}**\n**Заблокировал: ${member}**\n**Причина: \`${reason}\`**`)
        // .addField(`**Причина блокировки**`, `**\`${reason}\`**`)
        .setFooter(`Команда по безопасности Discord сервера.`, guild.iconURL)
        guild.channels.find(c => c.name == "general").send(embed_ban).catch(() => {
            guild.channels.find(c => c.name == "general").send(`**${user} был заблокирован.**`)
        })
    }, 2000);
});

tbot.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (oldMember.voiceChannelID == newMember.voiceChannelID) return
    if (newMember.hasPermission("ADMINISTRATOR")) return
    let member_oldchannel = await newMember.guild.channels.get(oldMember.voiceChannelID);
    let member_newchannel = await newMember.guild.channels.get(newMember.voiceChannelID);
    if (member_newchannel){
        if (member_newchannel.name == '✔ Обзвон ✔'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "closed-accept");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            await edit_channel.overwritePermissions(newMember, {
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
                READ_MESSAGE_HISTORY: false,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            }, 'подключение (конференция)');
            edit_channel.send(`**<@${newMember.id}> \`успешно подключился.\`**`);
            console.log(`${newMember.displayName || newMember.user.username} подключился к обзвону.`);
        }
    }
    if (member_oldchannel){
        if (member_oldchannel.name == '✔ Обзвон ✔'){
        let edit_channel = newMember.guild.channels.find(c => c.name == "closed-accept");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            edit_channel.permissionOverwrites.forEach(async (perm) => {
                if (perm.type != 'member') return
                if (perm.id != newMember.id) return
                await perm.delete('отключение (конференция)');
            });
            edit_channel.send(`**<@${newMember.id}> \`отключился.\`**`);
            console.log(`${newMember.displayName || newMember.user.username} вышел с обзвона.`);
        }
    }
});

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (oldMember.voiceChannelID == newMember.voiceChannelID) return
    if (newMember.hasPermission("ADMINISTRATOR")) return
    let member_oldchannel = newMember.guild.channels.get(oldMember.voiceChannelID);
    let member_newchannel = newMember.guild.channels.get(newMember.voiceChannelID);
    if (member_newchannel){
        if (member_newchannel.name == 'Конференция'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "конференция");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            await edit_channel.overwritePermissions(newMember, {
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
            }, 'подключение (конференция)');
            edit_channel.send(`**<@${newMember.id}> \`успешно подключился.\`**`).then(msg => msg.delete(30000));
        }else if (member_newchannel.name == '→ Обзвон ←'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "closed-accept");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            await edit_channel.overwritePermissions(newMember, {
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
                READ_MESSAGE_HISTORY: false,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            }, 'подключение (конференция)');
            edit_channel.send(`**<@${newMember.id}> \`успешно подключился.\`**`).then(msg => msg.delete(30000));
        }else if (member_newchannel.name == 'Проводится обзвон [SP]'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "проверка");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            await edit_channel.overwritePermissions(newMember, {
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
                READ_MESSAGE_HISTORY: false,
                MENTION_EVERYONE: false,
                USE_EXTERNAL_EMOJIS: false,
                ADD_REACTIONS: false,
            }, 'подключение (конференция)');
            edit_channel.send(`**<@${newMember.id}> \`успешно подключился.\`**`).then(msg => msg.delete(30000));
        }
    }
    if (member_oldchannel){
        if (member_oldchannel.name == 'Конференция'){
        let edit_channel = newMember.guild.channels.find(c => c.name == "конференция");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            edit_channel.permissionOverwrites.forEach(async (perm) => {
                if (perm.type != 'member') return
                if (perm.id != newMember.id) return
                await perm.delete('отключение (конференция)');
            });
            edit_channel.send(`**<@${newMember.id}> \`отключился.\`**`).then(msg => msg.delete(15000));
        }else if (member_oldchannel.name == '→ Обзвон ←'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "closed-accept");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            edit_channel.permissionOverwrites.forEach(async (perm) => {
                if (perm.type != 'member') return
                if (perm.id != newMember.id) return
                await perm.delete('отключение (конференция)');
            });
            edit_channel.send(`**<@${newMember.id}> \`отключился.\`**`).then(msg => msg.delete(15000));
        }else if (member_oldchannel.name == 'Проводится обзвон [SP]'){
            let edit_channel = newMember.guild.channels.find(c => c.name == "проверка");
            if (!edit_channel) return console.log('[ERROR] Не возможно найти текстовой канал конференции.');
            edit_channel.permissionOverwrites.forEach(async (perm) => {
                if (perm.type != 'member') return
                if (perm.id != newMember.id) return
                await perm.delete('отключение (конференция)');
            });
            edit_channel.send(`**<@${newMember.id}> \`отключился.\`**`).then(msg => msg.delete(15000));
        }
    }
});

bot.on('guildMemberAdd', async member => {
    if (member.guild.id != serverid) return
    levelhigh++;
    if (levelhigh >= 5){
        if (!member.hasPermission("MANAGE_ROLES")){
            member.ban(`SYSTEM: DDOS ATTACK`);
            console.log(`${member.id} - заблокирован за ДДОС.`)
        }
        setTimeout(() => {
            if (levelhigh > 0){
                levelhigh--;
            }
        }, 60000*levelhigh);
    }else{
        setTimeout(() => {
            if (levelhigh > 0){
                levelhigh--;
            }
        }, 60000*levelhigh);
    }
})

// Syoer System
async function check_unwanted_user(){
    setInterval(async () => {
        let re = /(\d+(\.\d)*)/i;
        let gserver = bot.guilds.get('355656045600964609');
        let spchat = gserver.channels.find(c => c.name == 'spectator-chat');
        await spchat.fetchPinnedMessages().then(messages => {
            messages.forEach(async message => {
                if (!message.content.includes('Нежелательный пользователь')) return
                if (!message.member.user.bot) return
                let user = gserver.members.get(message.content.split('<')[1].split('>')[0].split('@!')[1]);
                if (!user) return
                gserver.members.forEach(async (member) => {
                    if (member.id == user.id){
                        await member.addRole(message.guild.roles.find(r => r.name == '🏆 Legendary 🏆'));
                        await message.unpin();
                        await spchat.send(`**${member} \`был установлен как нежелательный пользователь.\`**`);
                    }
                });
            });
        });

        gserver.channels.forEach(async channel => {
            if (channel.name.startsWith('ticket-')){
                if (gserver.channels.find(c => c.id == channel.parentID).name == 'Корзина'){
                    let log_channel = gserver.channels.find(c => c.name == "reports-log");
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
                }else if(gserver.channels.find(c => c.id == channel.parentID).name == 'Активные жалобы'){
                    let log_channel = gserver.channels.find(c => c.name == "spectator-chat");
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
                if (!['administration', 'accounts', 'bad-words', 'err-code', 'config', 'bot-updates'].includes(channel.name)){
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
                                        let genchannel = gserver.channels.find(c => c.name == "general");
                                        genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 7 дней]\``);
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
    }, 25000);
}

bot.on('guildMemberUpdate', async (old_member, new_member) => {
    if (new_member.guild.id != '355656045600964609') return
    if (old_member.roles.size == new_member.roles.size) return
    if (new_member.user.bot) return
    if (old_member.roles.size < new_member.roles.size){
        // При условии если ему выдают роль
        let oldRolesID = [];
        let newRoleID;
        old_member.roles.forEach(role => oldRolesID.push(role.id));
        new_member.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        });
        let role = new_member.guild.roles.get(newRoleID);
        if (role.name != '🏆 Legendary 🏆') return
        const entry = await new_member.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await new_member.guild.members.get(entry.executor.id);
        if (!member.user.bot && !member.hasPermission("ADMINISTRATOR")){
            if (new_member.hasPermission("MANAGE_ROLES") || new_member.roles.some(r => ['✵Хранитель✵', '⋆ YouTube ⋆', '⋆ Stream Team 🎥 ⋆'].includes(r.name))){
                await new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`**${member}, \`над данным пользователем такое действие совершать нельзя!\`**`);
            	return await new_member.removeRole(role);
	    }
        }
        await new_member.roles.forEach(trole => {
            if (!trole.hasPermission("ADMINISTRATOR") && trole.name != '🏆 Legendary 🏆'){
                if (trole.hasPermission('MANAGE_ROLES')){
                    new_member.removeRole(trole);
                }
            }
        });
        if (!member.user.bot){
            await new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`${member} **\`отметил пользователя\` ${new_member} \`как нежелательного.\`**`).catch(() => {
                new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`${member} **\`отметил пользователя\` ${new_member} \`как нежелательного.\`**`);
            });
        }
    }else{
        // При условии если ему снимают роль
        let newRolesID = [];
        let oldRoleID;
        new_member.roles.forEach(role => newRolesID.push(role.id));
        old_member.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = new_member.guild.roles.get(oldRoleID);
        if (role.name != '🏆 Legendary 🏆') return
        const entry = await new_member.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first())
        let member = await new_member.guild.members.get(entry.executor.id);
        if (member.user.bot) return
        if (member.hasPermission("ADMINISTRATOR")){
            await new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`${member} **\`снял пользователю\` ${new_member} \`отметку нежелательного.\`**`).catch(() => {
                new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`${member} **\`снял пользователю\` ${new_member} \`отметку нежелательного.\`**`);
            });
        }else{
            await new_member.guild.channels.find(c => c.name == 'spectator-chat').send(`**${member}, \`вам запрещено снимать данную отметку!\`**`);
            await new_member.addRole(role);
        }
    }
});

bot.on('guildMemberRemove', async (member) => {
    if (member.guild.id != '355656045600964609') return
    if (member.roles.some(r => r.name == '🏆 Legendary 🏆')){
        await member.guild.channels.find(c => c.name == 'spectator-chat').send(`**\`Нежелательный пользователь\` ${member} \`вышел с сервера.\`**`).then(async (tmsg) => {
            await tmsg.pin();
        });
    }
});

bot.on('guildMemberAdd', async (member) => {
    if (member.guild.id != '355656045600964609') return
    let spyktor_chat = member.guild.channels.find(c => c.name == 'spectator-chat');
    if (!spyktor_chat) return
    spyktor_chat.fetchPinnedMessages().then(messages => {
        messages.forEach(async message => {
            if (!message.content.includes('Нежелательный пользователь')) return
            if (!message.member.user.bot) return
            let user = member.guild.members.get(message.content.split('<')[1].split('>')[0].split('@!')[1]);
            if (!user) return
            if (member.id == user.id){
                setTimeout(async () => {
                    await member.addRole(message.guild.roles.find(r => r.name == '🏆 Legendary 🏆'));
                }, 3000)
                await message.unpin();
                await spyktor_chat.send(`**\`Нежелательный пользователь\` ${member} \`вошел на сервер.\`**`)
            }
        });
    });
});

bot.on('message', async (message) => {if (message.type === "PINS_ADD") if (message.channel.name == "spectator-chat") message.delete();});