const Discord = require('discord.js');
const client = new Discord.Client();
const { PREFIX } = require('../config.json');
const fs = require('fs');
const version = require("../package.json");

module.exports = async (client) => {
  console.log(`${client.user.username} is ready and working in ${client.guilds.cache.size} servers with ${client.users.cache.size} users!`);
  const status = [
    {
      "name": `Ketikkan ${PREFIX}help Untuk Informasi Command!`,
      "type": 0
        },
    {
      "name": `🤖 SaljuRealm Network Bot!`,
      "type": 2
        },
    {
      "name": `🌏 Play.saljurealm.ID`,
      "type": 3
        },
    {
      "name": `👥 Dengan ${client.users.cache.size} Pengguna`,
      "type": 1
        }
        ];

  let i = 0
  setInterval(function() {
    client.user.setPresence({
      status: "idle",
      activity: {
        name: status[parseInt(i, 10)].name,
        type: status[parseInt(i, 10)].type,
        url: "https://www.twitch.tv/twitch"
      }
    });
    if (status[parseInt(i + 1, 10)]) i++;
    else i = 0;
  }, 20000);
};