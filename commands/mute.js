const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "mute",
  aliases: ["unmute"],
  description: "mute atau unmute pengguna yang disebutkan",
  async execute(message, args) {
    let reason = args.slice(1).join(' ');
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Anda tidak memiliki izin **Manage Roles**!");
    if (!message.mentions.users.first()) return message.reply("Sebutkan seseorang untuk membungkam nya!");
    let user = message.mentions.users.first();
    let muteRole = client.guilds.cache.get(message.guild.id).roles.cache.find(val => val.name === 'Muted');
    let prefix = message.client.prefix;
    if (tomute.id === message.author.id) return message.reply("Anda tidak dapat membungkam diri Anda sendiri:facepalm:");
    if (tomute.id === message.client.user.id) return message.reply("Anda tidak dapat membungkam bot ini:facepalm:");
    if (!muteRole) {
      try {
        muteRole = await message.guild.roles.create({
          data: {
            name: "Muted",
            color: "#606060",
            permissions: []
          }
        });

        message.guild.channels.cache.forEach(async (channel, id) => {
          await channel.createOverwrite(muteRole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            READ_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    if (reason.length < 1) reason = 'Tidak ada alasan diberikan';
    if (message.mentions.users.size < 1) return message.reply('Anda harus menyebut seseorang untuk membungkam nya.').catch(console.error);

    if (!message.guild.member(message.client.user).hasPermission('MANAGE_ROLES')) return message.reply(':x: Saya tidak memiliki izin yang benar.').catch(console.error);
    if (message.guild.member(user).roles.cache.has(muteRole.id)) {
      if (message.content.includes(`${prefix}mute`)) return message.reply("pengguna itu telah dibungkam!");
      message.guild.member(user).roles.remove(muteRole).then(() => {
        const embed = new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.client.user.displayAvatarURL())
          .addField('Action', 'Unmute')
          .addField('User', `${user.username}#${user.discriminator} (${user.id})`)
          .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
          .addField('Reason', reason)
          .setFooter(message.client.user.username)
          .setTimestamp();
        let logchannel = message.guild.channels.cache.find(x => x.name = 'mod-logs');
        if (!logchannel) {
          message.channel.send({embed});
        } else {
          client.channels.cache.get(logchannel.id).send({embed});
          message.channel.send({embed});
        }
        if (user.bot) return;
        message.mentions.users.first().send({embed}).catch(e => {
          if (e) return;
        });
      });
    } else {
      if (message.content.includes(`${prefix}unmute`)) return message.reply("pengguna itu belum dibungkam!");
      message.guild.member(user).roles.add(muteRole).then(() => {
        const embed = new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.client.user.displayAvatarURL())
          .addField('Action', 'Mute')
          .addField('User', `${user.username}#${user.discriminator} (${user.id})`)
          .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
          .addField('Reason', reason)
          .setFooter(message.client.user.username)
          .setTimestamp();
        let logchannel = message.guild.channels.cache.find(x => x.name = 'mod-logs');
        if (!logchannel) {
          message.channel.send({embed});
        } else {
          client.channels.cache.get(logchannel.id).send({embed});
          message.channel.send({embed});
        }
        if (user.bot) return;
        message.mentions.users.first().send({embed}).catch(e => {
          if (e) return;
        });
      });
    }
  }
};