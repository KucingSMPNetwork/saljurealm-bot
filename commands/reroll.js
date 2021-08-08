const ms = require('ms');

module.exports = {
  name: 'reroll',
  cooldown: 5,
  description: 'Mengocok ulang pemenang giveaways menggunakan id pesan.',
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send(':x: Anda harus memiliki izin manage messages untuk mengocok ulang pemenang giveaways!');
    }

    let messageID = args[0];
    if (!messageID) {
      return message.channel.send(':x: Anda harus menentukan ID pesan yang valid!');
    }

    try {
      message.client.giveawaysManager.reroll(messageID);
      message.channel.send('Giveaway re-rolled!');
    } catch (error) {
      if (error.startsWith(`No giveaway found with ID ${messageID}.`)) {
        message.channel.send('Tidak dapat menemukan giveaway apa pun untuk ID pesan: ' + messageID);
      }
      if (error.startsWith(`Giveaway with message ID ${messageID} is not ended.`)) {
        message.channel.send('Giveaway ini belum berakhir!');
      }
    }
  }
};