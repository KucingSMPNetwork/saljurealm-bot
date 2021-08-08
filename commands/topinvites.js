const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "topinvites",
  aliases: ["ti"],
  description: "Menampilkan undangan teratas di server.",
  async execute(message) {
    try {
      const invites = await message.guild.fetchInvites();
      const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);

      if (topTen.size <= 0) {
        return message.channel.send("Tidak ada undangan atau tidak ada satupun yang pernah digunakan!");
      }

      let embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setAuthor(`🏅 Top Invites in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
        .setDescription(topTen.map((inv, i) => `\`#${i+1}\` **${inv.inviter.username}#${inv.inviter.discriminator}** Kode Undangan • \`${inv.code}\` memiliki • \`${inv.uses.toLocaleString()}\` Penggunaan.`).join("\n"))
        .setFooter(message.client.user.username)
        .setTimestamp();

      message.channel.send(embed).catch(err => console.log(err));
    } catch (err) {
      console.log(err.message);
      return message.channel.send(err.message);
    }
  }
};