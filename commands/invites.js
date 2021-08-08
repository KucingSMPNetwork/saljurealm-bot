const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invites",
  aliases: ["inv"],
  description: "Menampilkan Pengguna yang Bergabung Melalui Undangan Seseorang.",
  async execute(message, args) {
    try {
      let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
      let invites = await message.guild.fetchInvites()
      let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id);
      if (memberInvites.size <= 0) {
        return message.channel.send(`**${member.user.username}#${member.user.discriminator} tidak mengundang siapa pun ke server ini!**`, (member === message.member ? null : member));
      }

      let content = memberInvites.map((inv) => `• \`${inv.code}\``).join("\n");
      let index = 0
      memberInvites.forEach((invite) => index += invite.uses);

      let embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setFooter(message.client.user.username)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setAuthor(`Pelacak Undangan untuk ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .addField("Pengguna", `**${member.user.username}#${member.user.discriminator}**`)
        .addField("Undangan Digunakan", index)
        .addField("Kode Undangan", content)
        .setTimestamp();

      message.channel.send(embed);

    } catch (e) {
      console.log(e.message);
      return message.channel.send(e.message)
    }
  }
};