const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "giveaways",
  description: "Tampilkan perintah giveaways",
  execute(message) {
    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setAuthor("Giveaways Commands", message.client.user.displayAvatarURL())
      .addField('White List', `\`s!start\` \`[Untuk Memulai GiveAway]\`\n\`s!end\` \`[Untuk Mengakhiri GiveAway]\`\n\`s!reroll\` \`[Untuk Merubah Pemenang GiveAway]\`\n\`s!delete\` \`[Untuk Menghapus giveAway]\``)
      .setFooter(message.client.user.username)
      .setTimestamp();

    message.channel.send(embed);
  }
};