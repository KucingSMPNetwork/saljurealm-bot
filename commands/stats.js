const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const osutils = require('os-utils');
const os = require("os");
const version = require('../package.json');

module.exports = {
  name: "stats",
  aliases: ["botstats"],
  description: "Menampilkan statistik bot",
  async execute(message) {
    var milliseconds = parseInt((message.client.uptime % 1000) / 100),
      seconds = parseInt((message.client.uptime / 1000) % 60),
      minutes = parseInt((message.client.uptime / (1000 * 60)) % 60),
      hours = parseInt((message.client.uptime / (1000 * 60 * 60)) % 24),
      days = parseInt((message.client.uptime / (1000 * 60 * 60 * 24)) % 60);

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    fs.readdir('./commands/', async (err, files) => {
      if (err) console.error(err);
      let totcmds = files.length;

      osutils.cpuUsage(function(v) {
        const embed = new MessageEmbed()
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.client.user.displayAvatarURL())
          .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
          .setDescription("Statistik Bot")
          .addField("📁 **Statistik Umum**",
`\`\`\`➤ Prefix: ${message.client.prefix}
➤ Jumlah Perintah: ${totcmds} commands
➤ Jumlah Server: ${message.client.guilds.cache.size} Servers
➤ Jumlah Saluran: ${message.client.channels.cache.size} Channels
➤ Total Pengguna: ${message.client.users.cache.size} Users
➤ Versi Bot: ${version["version"]}
➤ Perpustakaan: Discord.js v12
➤ Pengembang: KucingKampung\`\`\``, true)
          .addField("⚙️ **Statistik Sistem**",
`\`\`\`➤ Platform: ${osutils.platform()}
➤ Model: ${os.cpus()[0].model + " " + os.arch()}
➤ VPS CPU Cores: ${osutils.cpuCount()} Cores
➤ Penggunaan CPU: ${(v * 100).toString().split(".")[0] + "." + (v * 100).toString().split(".")[1].split('')[0] + (v * 100).toString().split(".")[1].split('')[1]}%
➤ Total Memory: ${osutils.totalmem().toString().split(".")[0] + "." + osutils.totalmem().toString().split(".")[1].split('')[0] + osutils.totalmem().toString().split(".")[1].split('')[1]} MB
➤ Penggunaan RAM Dari VPS: ${(osutils.totalmem() - osutils.freemem()).toString().split(".")[0] + "." + ( osutils.totalmem() - osutils.freemem()).toString().split(".")[1].split('')[0] + (osutils.totalmem() - osutils.freemem()).toString().split(".")[1].split('')[1]}/${osutils.totalmem().toString().split(".")[0] + "." + osutils.totalmem().toString().split(".")[1].split('')[0] + osutils.totalmem().toString().split(".")[1].split('')[1]} MB
➤ Penggunaan RAM Dari Bot: ${(process.memoryUsage().heapUsed / 1024 / 1024 ).toFixed(2) + "MB/" + osutils.totalmem().toString().split(".")[0] + "." + osutils.totalmem().toString().split(".")[1].split('')[0] + osutils.totalmem().toString().split(".")[1].split('')[1]} MB
➤ Penggunaan RAM Dari VPS (%): ${(100 - osutils.freememPercentage() * 100).toString().split(".")[0] + "." + (100 - osutils.freememPercentage() * 100).toString().split(".")[1].split('')[0] + (100 - osutils.freememPercentage() * 100).toString().split(".")[1].split('')[1]}%
➤ Ping: ${Math.round(message.client.ws.ping)} ms
➤ Uptime: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds}.${milliseconds} detik\`\`\``, true)
          .setFooter(`${message.client.user.username}`);

        message.channel.send(embed).catch(console.error);
      })
    })
  }
};