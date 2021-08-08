const { MessageEmbed } = require('discord.js');
const fs = require("fs");
const ms = require("ms");

module.exports = {
  name: "warn",
  description: "Mengeluarkan peringatan untuk pengguna yang disebutkan.",
  async execute(message, args) {
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    let warns = JSON.parse(fs.readFileSync("./data/warnings.json", "utf8"));
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Anda tidak memiliki izin **Kick Members**!");
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebutkan seseorang untuk memperingatkan nya!').catch(console.error);
    if (user.id === message.author.id) return message.reply('Saya tidak bisa membiarkan Anda melakukan itu, menyakiti diri sendiri itu buruk🤐');
    if (user.id === message.client.user.id) return message.reply("Bagaimana Anda bisa menggunakan bot untuk memperingatkan dirinya sendiri?😎");
    if (user.id === message.guild.ownerID) return message.reply("Anda tidak dapat memperingatkan tuan rumah disini😉");
    if (reason.length < 1) reason = 'Tidak ada alasan yang diberikan.';

    if (!warns[`${user.id}, ${message.guild.id}`]) {
      warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
      }
    };

    warns[`${user.id}, ${message.guild.id}`].warns++;

    fs.writeFile("./data/warnings.json", JSON.stringify(warns), err => {
      if (err) console.log(err.message);
    });

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('Action', 'Warning')
      .addField('User', `${user.username}#${user.discriminator}`)
      .addField('Diperingatkan oleh', `${message.author.username}#${message.author.discriminator}`)
      .addField('Jumlah peringatan', warns[`${user.id}, ${message.guild.id}`].warns)
      .addField('Reason', reason)
      .setFooter(message.client.user.username)
      .setTimestamp();

    let logchannel = message.guild.channels.cache.find(x => x.name = 'mod-logs');
    if (!logchannel) {
      message.channel.send({embed});
    } else {
      logchannel.send({embed});
      message.channel.send({embed});
    }

    if (user.bot) return;
    message.mentions.users.first().send({embed}).catch(err => {
      if (err) return;
    });
  }
};