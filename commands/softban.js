const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'softban',
  description: 'Melarang sementara pengguna yang disebutkan.',
  async execute(message, args) {
    let reason = args.slice(1).join(' ');
    if (!message.mentions.users.first()) return message.reply("Anda perlu menyebutkan seseorang untuk melarang sementara secara lembut!");
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(":no_entry_sign: Anda tidak memiliki izin **Ban Members**!");
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebutkan seseorang untuk melarang sementara secara lembut!').catch(console.error);
    if (message.mentions.users.first().id === message.author.id) return message.reply('Saya tidak bisa membiarkan Anda melakukan itu, menyakiti diri sendiri itu buruk:facepalm:');
    if (message.mentions.users.first().id === message.client.user.id) return message.reply("Bagaimana Anda bisa menggunakan bot untuk melarang dirinya sendiri?:wink:");
    if (reason.length < 1) reason = 'Tidak ada alasan yang diberikan.';

    if (!message.guild.member(user).bannable) {
      return message.reply(`Saya tidak bisa melarang anggota itu!`);
    } else {
      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .addField('Action', 'Soft Ban')
        .addField('User', `${user.username}#${user.discriminator} (${user.id})`)
        .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
        .addField('Reason', reason)
        .setFooter(message.client.user.username)
        .setTimestamp();

      message.mentions.users.first().send({embed});
      message.guild.members.ban(user.id, { days: 7, reason: reason });
      message.guild.members.unban(user.id, reason);

      let logchannel = message.guild.channels.cache.find(x => x.name = 'mod-logs');
      if (!logchannel) {
        message.channel.send({embed});
      } else {
        client.channels.cache.get(logchannel.id).send({embed});
        message.channel.send({embed});
      }
    }
  }
};