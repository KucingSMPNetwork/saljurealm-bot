const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "tempmute",
  aliases: ["tempm"],
  description: "Membisukan sementara pengguna yang disebutkan.",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Anda tidak memiliki izin **Manage Roles**!");
    let tomute = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (!tomute) return message.reply("Tidak dapat menemukan pengguna itu.");
    if (tomute.id === message.author.id) return message.reply("Anda tidak dapat membisukan diri Anda sendiri:facepalm:");
    if (tomute.id === message.client.user.id) return message.reply("Bagaimana Anda bisa menggunakan bot untuk membisukan dirinya sendiri?:facepalm:");
    let muteRole = message.guild.roles.cache.find(val => val.name === "Muted");
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
    let mutetime = args[1];
    if (!mutetime) return message.reply("Anda tidak menentukan waktu untuk membisukan sementara.");

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(message.client.user.displayAvatarURL())
      .addField('Action', 'Temp Mute')
      .addField('User', `${tomute.username}#${tomute.discriminator} (${tomute.id})`)
      .addField('Moderator', `${message.author.username}#${message.author.discriminator}`)
      .addField('Duration', ms(ms(mutetime)))
      .setFooter(message.client.user.username)
      .setTimestamp();
    message.channel.send(embed);

    message.guild.member(tomute).roles.add(muteRole);

    setTimeout(function() {
      message.guild.member(tomute).roles.remove(muteRole);
      message.channel.send(`<@${tomute.id}> telah di unmuted`);
    }, ms(mutetime));
  }
};