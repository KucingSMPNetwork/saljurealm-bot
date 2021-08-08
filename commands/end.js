const ms = require('ms');

module.exports = {
  name: 'end',
  cooldown: 5,
  description: 'Akhiri giveaways menggunakan id pesan',
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send(':x: Anda harus memiliki izin **manage messages** untuk mengakhiri giveaways!');
    }

    let messageID = args[0];
    if (!messageID) {
      return message.channel.send(':x: Anda harus menentukan ID pesan yang valid!');
    }

    try {
      message.client.giveawaysManager.edit(messageID, {
        setEndTimestamp: Date.now()
      });
      message.channel.send('Giveaway akan berakhir dalam waktu kurang dari ' + (message.client.giveawaysManager.options.updateCountdownEvery / 1000) + ' detik...');
    } catch (error) {
      if (error.startsWith(`No giveaway found with ID ${messageID}.`)) {
        message.channel.send('Tidak dapat menemukan giveaway apa pun untuk ID pesan: ' + messageID);
      }
      if (error.startsWith(`Giveaway with message ID ${messageID} is already ended.`)) {
        message.channel.send('Giveaway ini sudah berakhir!');
      }
    }
  }
};