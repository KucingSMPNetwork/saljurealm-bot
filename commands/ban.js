const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "ban",
  description: "Larang pengguna yang disebutkan.",
  async execute(message, args) {
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Anda tidak memiliki izin **Ban Members**!");
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebutkan seseorang untuk melarang nya.').catch(console.error);
    if (message.mentions.users.first().id === message.author.id) return message.reply('Aku tidak bisa membiarkanmu melakukan itu, melukai diri sendiri itu buruk🤐');
    if (user.id === message.client.user.id) return message.reply("Bagaimana Anda bisa menggunakan bot untuk melarang dirinya sendiri?🤐");
    if (message.mentions.users.first().id === message.guild.ownerID) return message.reply("Anda tidak dapat melarang tuan rumah disini😉");
    if (reason.length < 1) reason = 'Tidak ada alasan yang diberikan.';
    let botRolePossition = message.guild.member(message.client.user).roles.highest.position;
    let rolePosition = message.guild.member(user).roles.highest.position;
    let userRolePossition = message.member.roles.highest.position;
    if (userRolePossition <= rolePosition) return message.reply("Tidak dapat melarang anggota itu karena dia memiliki peran yang lebih tinggi atau sama dengan Anda.")
    if (botRolePossition <= rolePosition) return message.reply("Tidak dapat melarang anggota itu karena dia memiliki peran yang lebih tinggi atau sama dengan saya.")
    if (!message.guild.member(user).bannable) {
      message.reply(`Saya tidak bisa melarang anggota itu. Peran saya mungkin tidak cukup tinggi atau ini adalah kesalahan internal.`);
      return;
    } else {
      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .addField('Action', 'Ban')
        .addField('User', `${user.username}#${user.discriminator} (${user.id})`)
        .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
        .addField('Reason', reason)
        .setFooter(message.client.user.username)
        .setTimestamp();

      message.guild.members.ban(user.id, { days: 0, reason: reason });

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
  }
};