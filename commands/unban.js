const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "unban",
  description: "Batalkan pemblokiran pengguna",
  async execute(message, args) {
    message.client.unbanAuth = message.author;
    let user = args[0];
    let reason = args.slice(1).join(' ');
    if (reason.length < 1) reason = 'Tidak ada alasan yang diberikan.';
    if (!user) return message.reply('Anda harus menyediakan User Resolvable, seperti user id!').catch(console.error);
    message.guild.members.unban(user, reason).catch(err => {
      if (err) {
        return message.reply(`${message.client.users.cache.get(`${args[0]}`).username} sedang tidak dilarang dari server ini!`);
      }
    }).then(() => {
      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .addField('Action', 'Unban')
        .addField('User', `${message.client.users.cache.get(`${args[0]}`).username}#${message.client.users.cache.get(`${args[0]}`).discriminator} (${user})`)
        .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
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
    })
  }
};