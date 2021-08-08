const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "kick",
  description: "Menendang pengguna yang disebutkan",
  async execute(message, args) {
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebutkan seseorang untuk menendang nya!').catch(console.error);
    if (user.id === message.author.id) return message.reply("Aku tidak bisa membiarkanmu melakukan itu, menyakiti diri sendiri itu buruk🤐");
    if (user.id === message.client.user.id) return message.reply("Bagaimana Anda bisa menggunakan bot untuk menendang dirinya sendiri?😎");
    
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Anda tidak memiliki izin **Kick Members**!");
    
    if (message.mentions.users.first().id === message.guild.ownerID) return message.reply("Anda tidak dapat menendang tuan rumah disini😉");
    if (reason.length < 1) reason = 'Tidak ada alasan yang diberikan.';

    if (!message.guild.member(user).kickable) return message.reply('Saya tidak bisa menendang anggota itu!');

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(message.client.user.displayAvatarURL())
      .addField("Action", "Kick")
      .addField('User', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
      .addField('Reason', reason)
      .setFooter(message.client.user.username)
      .setTimestamp();
    
    message.guild.member(user).kick(reason);

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