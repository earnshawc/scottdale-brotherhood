const Discord = require('discord.js');

const express = require('./oauth2/express');
const btoa = require('./oauth2/btoa');
const fetch = require('./oauth2/node-fetch');
const generator = require('./oauth2/generate-password');

const app = express();
const md5 = require('./my_modules/md5');

let access_tokens = [];
let dspanel = new Set();

const bot = new Discord.Client();
bot.login(process.env.token);

bot.on('message', async (message) => {
    if (message.channel.type == 'dm') return
    if (message.guild.id != '355656045600964609') return
  
    if (message.content == '/dspanel'){
      if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
      const password = md5(generator.generate({ length: 10, numbers: true, symbols: true }));
      access_tokens.push(`${password}<=+=>${message.author.id}<=+=>${message.guild.id}<=+=>${message.channel.id}`);
      const embed = new Discord.RichEmbed();
      embed.setDescription(`**${message.member}, для авторизации нажмите на [выделенный текст](https://discordapp.com/oauth2/authorize?response_type=code&client_id=488717818829996034&redirect_uri=${process.env.redirect_url}&scope=identify+guilds+email&state=${password}).**`);
      message.member.send(embed).catch(err => {
        message.reply(`**\`ошибка при отпрвке в личные сообщения! [${err.name} - ${err.message}]\`**`, embed);
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
    if (!access_tokens.some(value => value.split('<=+=>')[0] == req.query.state)) return res.status(200).redirect('https://discordapp.com/oauth2/authorize');
    const creds = btoa(`488717818829996034:${process.env.app_token}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.redirect_url}`, { method: 'POST', headers: { Authorization: `Basic ${creds}` } });
    const json = await response.json();
    const fetchDiscordUserInfo = await fetch('http://discordapp.com/api/users/@me', { headers: { Authorization: `Bearer ${json.access_token}` } });
    const userInfo = await fetchDiscordUserInfo.json();
    const elem_found = access_tokens.find(value => value.split('<=+=>')[0] == req.query.state);
    if (elem_found.split('<=+=>')[1] != userInfo.id){
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
    access_tokens = access_tokens.filter((value) => {
      if (value == elem_found) return false;
    });
    if (!dspanel.has(userInfo.id)) dspanel.add(userInfo.id);
    let server = bot.guilds.get(elem_found.split('<=+=>')[2]);
    if (!server){
      console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
      return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    let channel = server.channels.get(elem_found.split('<=+=>')[3]);
    if (!channel){
      console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
      return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
    }
    console.log(`${userInfo.username} [${userInfo.id}] авторизовался в панели.`);
    channel.send(`<@${userInfo.id}>, **\`успешно авторизован!\`**`).then(msg => msg.delete(15000));
    return res.status(200).redirect('https://discordapp.com/oauth2/authorized');
});