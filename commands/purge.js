const Discord = require("discord.js");

module.exports = {
  name: 'purge',
  cooldown: 1,
  aliases: ["clear", "clean"],
  description: 'Membersihkan sejumlah pesan atau seluruh pesan dari saluran tertentu.',
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Anda tidak memiliki izin **Manage Messages**!");
    if (!args[0]) return message.reply(`Penggunaan: \`${message.client.prefix}purge all\` or \`msg <jumlah>\``);
    if (args[0] === 'all') {
      message.channel.send("Semua pesan dari saluran akan dihapus! Untuk konfirmasi ketik `Ok`");
      await message.channel.awaitMessages((m) => (m.author.id === message.author.id) && (m.content.toLowerCase() === "ok"), {
        max: 1,
        time: 20000,
        errors: ["time"]
      }).catch((err) => {
        console.log(err);
        return message.reply("Waktu habis! Silakan kirim perintah lagi!");
      });
      const position = message.channel.position;
      const newChannel = await message.channel.clone();
      await message.channel.delete();
      newChannel.setPosition(position);
      return newChannel.send("Semua pesan telah berhasil dihapus!").then(m => m.delete({ timeout: 5000 }));

    } else if (args[0] === 'msg') {
      if (!args[1]) return message.channel.send("Anda perlu menentukan jumlah!");
      if (isNaN(args[1])) return message.channel.send("Anda harus menentukan jumlah yang valid!");
      if (parseInt(args[1]) > 100) return message.channel.send("Saya hanya dapat menghapus maksimal 100 pesan sekaligus:wink:");

      let messagecount = parseInt(args[1]) + 1;
      message.channel.messages.fetch({
          limit: 100
        }).then(messages => message.channel.bulkDelete(messagecount))
        .catch(e => {
          if (e) return message.channel.send(`${e}`);
        });
    } else {
      return message.reply(`Penggunaan: \`${message.client.prefix}purge all\` or \`msg <jumlah>\``);
    }
  }
};