const { MessageEmbed } = require('discord.js');
const fs = require("fs");

module.exports = {
  name: "check-warns",
  description: 'Tampilkan berapa banyak peringatan yang dimiliki pengguna.',
  async execute(message, args) {
    let warns = JSON.parse(fs.readFileSync("./data/warnings.json", "utf8"));
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Anda tidak memiliki izin **Kick Members**!");
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebut seseorang untuk memeriksa peringatan nya.').catch(console.error);
    if (!user) return message.reply("Saya tidak dapat menemukan pengguna itu...");

    if (!warns[`${user.id}, ${message.guild.id}`]) {
      warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
      };
    };

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('Action', 'Warn Check')
      .addField('User', `${user.username}#${user.discriminator}`)
      .addField('Number of warnings', warns[`${user.id}, ${message.guild.id}`].warns)
      .setFooter(message.client.user.username)
      .setTimestamp();
    message.channel.send(embed);
  }
};