const { MessageEmbed } = require('discord.js');
const fs = require("fs");

module.exports = {
  name: "clear-warns",
  description: 'Hapus peringatan pengguna.',
  async execute(message, args) {
    let warns = JSON.parse(fs.readFileSync("./data/warnings.json", "utf8"));
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Anda tidak memiliki izin **Kick Members**!");
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebut seseorang untuk menghapus peringatan nya.').catch(console.error);
    if (!user) return message.reply("Saya tidak dapat menemukan pengguna itu...");

    if (!warns[`${user.id}, ${message.guild.id}`]) {
      warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
      };
    };

    let reason = `${warns[`${user.id}, ${message.guild.id}`].warns} peringatan telah dihapus untuk anggota ini`;
    if (warns[`${user.id}, ${message.guild.id}`].warns > 0) {
      warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
      };
    } else {
      reason = 'Pengguna ini tidak memiliki peringatan apa pun😉'
    };

    fs.writeFile("./data/warnings.json", JSON.stringify(warns), err => {
      if (err) console.log(err);
    });

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('Action', 'Clear Warns', true)
      .addField('User', `${user.username}#${user.discriminator}`, true)
      .addField('Results', reason, true)
      .setFooter(message.client.user.username)
      .setTimestamp();
    message.channel.send(embed);
  }
};