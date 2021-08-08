const ms = require('ms');

module.exports = {
  name: 'delete',
  cooldown: 5,
  description: 'Hapus giveaways menggunakan id pesan',
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send(':x: Anda harus memiliki izin **manage messages** untuk menghapus giveaways!');
    }

    let messageID = args[0];
    if (!messageID) {
      return message.channel.send(':x: Anda harus menentukan ID pesan yang valid!');
    }

    message.client.giveawaysManager.delete(messageID).then(() => {
      return message.channel.send("Hadiah berhasil dihapus");
    }).catch(() => {
      return message.channel.send("Tidak ditemukan giveaway dengan ID pesan " + `\`${messageID}\``)
    });
  }
};