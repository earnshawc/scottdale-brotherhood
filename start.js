const Discord = require('discord.js');

const express = require('./oauth2/express');
const btoa = require('./oauth2/btoa');
const fetch = require('./oauth2/node-fetch');
const generator = require('./oauth2/generate-password');

const GoogleSpreadsheet = require('./google_module/google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.skey);
const creds_json = {
    client_email: process.env.google_client_email,
    private_key: `-----BEGIN PRIVATE KEY-----\n${process.env.google_private_key}\n${process.env.google_key_two}\n${process.env.google_key_three}\nKPAu6SL9OraGwtioCgWyBwlTHuN3yn2o9mpnAzNmzqTh6WbRPD5PrB2jq8Pk1MiV\nbz/I+0DRPhcA/37t23q6UUo16gSofFFLaD0npMaoOY2aK+os0NdnmGai8Y8XzVoN\nbbgXKgDvpIy7TLpS4z79mpAsrSl109+evVhOSp4SP4NIWUb0Mu+OkYcNWmIhfFUF\nkLMDgWqJAgMBAAECggEAKmTuCmLFEIUDFeRBd5i+Xex/B9BJDoexCzX9LwacqN8D\n79FCoZmL/0aqt6VNBbA4d1q017j6WgUxw/HI2H40CQY9xqy+F/e9xP7NuWHmhmqZ\nTnjVrc4azpGfiQxWkD/waStbC5XuVdBMo9xWKaBW8ySKEIYOgUSZteDK4uIB+rmn\nbT6993l0elYZClt7hQuZtEqi/o/YOdYj6FMx0ONlkqqh4TmHG4s0rBNjzFuXfOwF\nVdrx2saEpORATA/UPOMf31ox2gqs2jays/HYnjxt6Q5sD750fMdY/4/vEkfpWeV2\nUDJg6tvIVWIUKN5ofQZfmGRqHkRxoC2U+beljvq2SQKBgQDpsP8xsaJaUt2guBhr\nHnSGS57PgrJ/NLPSmkgcG3hhhZ38VL7hPaT48CUZ1kGOOncjkUngl14tfmvPzkxp\n5XaO/VMNdrhk8Cg5/orQ1HjuxR5DzYWHDuTwFtlFtBZILA6cpN758zjYsAEHgMCD\nOoegeZPPf9BZ9Mkf5H4n5xG6rQKBgQDBwaU2RtiGbGIxMUN+1LuZFgexw86Q0v+I\nLE196ZQCUxgdJv58YFQZQbvfaivd+ugoZE17DS99lyQvbfwIN0L/ngEcHuRZYIEN\nqi3FNO+ylcC3LLmD5h4jw9Lfgsy2992GOP/uIaCxGXzqkSGg2dmET7/akFdbwmys\nCOLFzWZmzQKBgFxcdh//4vjr82hIGm6L1OYXESdWspGQFNpR29owCT4R/0TxgZeo\nM4Gn+CHkCnjaJqhKDfbUHIbChn3VPWJFLLyK5r5Vg79xI5T4Q4kR0NId2j5WBkZA\n3r79aNYhvQS9VPEYQIBtXrRVq7J5cpzrDxufsYm7LG/BTZRrTGkc7GbpAoGAL+f9\nPWpO5w2tSZRwp89ZgwRbaqyLSmuhGr45esRiACEjeTHHAmGe6Y/DL/5EUmJTPIlw\nTth3wYm5PLDo++8N9b3PcHCC7UZbIlHNd1EbYwB74c6BIAeptBYa8YCZtTOb5i/5\nt5tA7AjtReIUenzit0Awo43Ey79Kt06LI3UhuJECgYATKkzkljEePsdYjWT6HyWj\n4GcG9OArgGHjvDuGjgav30qtfYSntDeRQBsnyTIHZ7V7vFDPK7qO2tyWsMW6YFi2\noTSqjNqNln1CdeS2zWLLtKoQY+5Y090ThJHLo16Neb+NNX15+TeCFdTs7QAEubJd\n+vOOQNHRvfnm63KuSIKlmw==\n-----END PRIVATE KEY-----\n`,
}
doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) console.log(err);
});

const app = express();
const md5 = require('./my_modules/md5');

let access_tokens = [];
let dspanel = new Set();

const bot = new Discord.Client();
bot.login(process.env.token);

bot.on('message', async (message) => {
    if (message.channel.type == 'dm') return
    if (message.guild.id != '355656045600964609') return
  
    if (message.content == '/authme'){
      if (message.member.roles.some(r => r.name == 'Проверенный 🔐')){
        message.reply(`**\`вы уже авторизовывались ранее.\`**`);
        return message.delete();
      }
      if (access_tokens.some(value => value.split('<=+=>')[1] == message.author.id)){
        message.reply(`**\`запрашивать код авторизации можно раз в 3 минуты.\`**`);
        return message.delete();
      }
      const password = md5(generator.generate({ length: 10, numbers: true, symbols: true }));
      access_tokens.push(`${password}<=+=>${message.author.id}<=+=>${message.guild.id}<=+=>${message.channel.id}`);
      const embed = new Discord.RichEmbed();
      embed.setDescription(`**${message.member}, для авторизации нажмите на [выделенный текст](https://discordapp.com/oauth2/authorize?response_type=code&client_id=488717818829996034&redirect_uri=${process.env.redirect_url}&scope=identify+guilds+email&state=${password}).**`);
      message.member.send(embed).catch(err => {
        message.reply(`**\`ошибка при отправке в личные сообщения, оставлю код тут!\`**`, embed);
      });
      setTimeout(() => {
        if (access_tokens.some(value => value == `${password}<=+=>${message.author.id}<=+=>${message.guild.id}<=+=>${message.channel.id}`)){
          access_tokens = access_tokens.filter((value) => {
            if (value == `${password}<=+=>${message.author.id}<=+=>${message.guild.id}<=+=>${message.channel.id}`) return false;
          });
        }
      }, 180000);
      return message.delete();
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Проверяю авторизации по порту ${process.env.PORT}`);
});

app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!access_tokens.some(value => value.split('<=+=>')[0] == req.query.state)){
        doc.addRow(12, {
            server: `Scottdale`,
            ip: `${ip}`,
            пользователь: `не известен`,
            email: `не известен`,
            действие: `отправка кода`,
            code: `невалидный`,
            codeuserid: `не получен`,
            codeguildid: `не получен`,
            codechannelid: `не получен`,
            статус: `отказ от запроса`
        });
        return res.status(200).redirect('https://discordapp.com/oauth2/authorize');
    }
    const creds = btoa(`488717818829996034:${process.env.app_token}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.redirect_url}`, { method: 'POST', headers: { Authorization: `Basic ${creds}` } });
    const json = await response.json();
    const fetchDiscordUserInfo = await fetch('http://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${json.access_token}` } });
    const userInfo = await fetchDiscordUserInfo.json();
    const elem_found = access_tokens.find(value => value.split('<=+=>')[0] == req.query.state);
    if (elem_found.split('<=+=>')[1] != userInfo.id){
      doc.addRow(12, {
          server: `Scottdale`,
          ip: `${ip}`,
          пользователь: `${userInfo.id}`,
          email: `${userInfo.mail}`,
          действие: `отправка кода`,
          code: `${elem_found.split('<=+=>')[0]}`,
          codeuserid: `${elem_found.split('<=+=>')[1]}`,
          codeguildid: `${elem_found.split('<=+=>')[2]}`,
          codechannelid: `${elem_found.split('<=+=>')[3]}`,
          статус: `ввод чужого кода`
      });
      let server = bot.guilds.get(elem_found.split('<=+=>')[2]);
      if (!server){
        console.log(`${userInfo.username} [${userInfo.id}] попытался авторизоваться под другого.`);
        return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
      }
      let channel = server.channels.get(elem_found.split('<=+=>')[3]);
      if (!channel){
        console.log(`${userInfo.username} [${userInfo.id}] попытался авторизоваться под другого.`);
        return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
      }
      let member = server.members.get(elem_found.split('<=+=>')[1]);
      if (!member){
        console.log(`${userInfo.username} [${userInfo.id}] попытался авторизоваться под другого.`);
        return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
      }
      channel.send(`<@${userInfo.id}>, **\`вы не можете авторизоваться под чужим кодом!\`**`).then(msg => msg.delete(30000));
      console.log(`${userInfo.username} [${userInfo.id}] попытался авторизоваться под другого.`);
      return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    doc.addRow(12, {
        server: `Scottdale`,
        ip: `${ip}`,
        пользователь: `${userInfo.id}`,
        email: `${userInfo.mail}`,
        действие: `отправка кода`,
        code: `${elem_found.split('<=+=>')[0]}`,
        codeuserid: `${elem_found.split('<=+=>')[1]}`,
        codeguildid: `${elem_found.split('<=+=>')[2]}`,
        codechannelid: `${elem_found.split('<=+=>')[3]}`,
        статус: `авторизован`
    });
    access_tokens = access_tokens.filter((value) => {
      if (value == elem_found) return false;
    });
    if (!dspanel.has(userInfo.id)) dspanel.add(userInfo.id);
    let server = bot.guilds.get(elem_found.split('<=+=>')[2]);
    if (!server){
      console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
      return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    let member = server.members.get(userInfo.id);
    if (!member){
        console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
        return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    let role = server.roles.find(r => r.name == 'Проверенный 🔐');
    if (!role){
        console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
        return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    await member.addRole(role);
    let channel = server.channels.get(elem_found.split('<=+=>')[3]);
    if (!channel){
      console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
      return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
    channel.send(`<@${userInfo.id}>, **\`вы авторизовались и получили роль Проверенный!\`**`).then(msg => msg.delete(15000));
    return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
});