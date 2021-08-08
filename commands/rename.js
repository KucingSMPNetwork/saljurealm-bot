const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'rename',
  description: 'Ubah nama pengguna yang disebutkan.',
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply("Anda tidak memiliki izin **Manage Nicknames**!");
    let newname = args.slice(1).join(' ');
    let id = args.shift().toLowerCase();
    let user;
    let mention = message.mentions.users.first();
    if (!mention) {
      user = message.guild.members.cache.get(id);
      if (!user) return message.reply('Anda harus menandai seseorang atau memberi saya ID pengguna yang valid agar saya dapat mengganti namanya!').catch(console.error);
    } else {
      user = message.guild.member(mention);
    }

    if (user.id === message.client.user.id && message.author.id !== message.client.user.id) return message.reply("Anda tidak dapat menggunakan bot untuk merubah namanya sendiri:wink:");
    user.setNickname(newname).catch(e => {
      if (e) return message.channel.send(`Terjadi kesalahan: \`\`\`${e}\`\`\``);
    });
    message.channel.send(`Selesai! nama dari pengguna **${mention}** sudah diubah menjadi **${newname}**`);
  }
};