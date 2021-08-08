const config = require("../config.json");
const ms = require('ms');

module.exports = {
  name: 'start',
  cooldown: 5,
  description: 'Mulai giveaways untuk semua orang',
  async execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send(':x: Anda harus memiliki izin manage messages untuk memulai giveaways!');
    }
    
    const prefix = message.client.prefix;

    const currentGiveaways = message.client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
    if (currentGiveaways > 3) {
      return message.channel.send(":x: Anda hanya dapat membuat maksimal 3 giveaways tunggulah sampai semua giveaways selesai!");
    }

    let giveawayChannel = message.mentions.channels.first();
    if (!giveawayChannel) {
      return message.channel.send(':x: Anda harus menyebutkan saluran yang valid!');
    }

    let giveawayDuration = args[1];
    if (!giveawayDuration) {
      return message.channel.send(`:x: Anda harus memasukkan informasi seperti ini: \n\n\`${prefix}start [#mention channel] [waktu] [jumlah pemenang] [hadiah]\` tanpa tanda kurung \`[]\``);
    }

    if (isNaN(ms(giveawayDuration))) {
      return message.channel.send(":x: Anda harus memasukkan waktu yang valid! Satuan yang tersedia: `s`, `m`, `h` or `d`");
    }

    if (ms(giveawayDuration) > ms("1d")) {
      return message.channel.send(":x: Durasi maksimum giveaway adalah 1 hari!");
    }

    let giveawayNumberWinners = args[2];
    if (!giveawayNumberWinners) {
      return message.channel.send(`:x: Anda harus memasukkan informasi seperti ini: \n\n\`${prefix}start [#mention channel] [waktu] [jumlah pemenang] [hadiah]\` tanpa tanda kurung \`[]\``);
    }

    if (isNaN(giveawayNumberWinners) || giveawayNumberWinners > 10 || giveawayNumberWinners < 1) {
      return message.channel.send(":x: Tentukan nomor yang valid antara **1** sampai **10**!")
    }

    let giveawayPrize = args.slice(3).join(' ');
    if (!giveawayPrize) {
      return message.channel.send(`:x: Anda harus memasukkan informasi seperti ini: \n\n\`${prefix}start [#mention channel] [waktu] [jumlah pemenang] [hadiah]\` tanpa tanda kurung \`[]\``);
    }

    message.client.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayNumberWinners, 10),
      hostedBy: config.hostedBy ? message.author : null,
      messages: {
        giveaway: (config.everyoneMention ? "@everyone\n\n" : "") + `🎉🎉 **GIVEAWAY** 🎉🎉`,
        giveawayEnded: (config.everyoneMention ? "@everyone\n\n" : "") + `🎉🎉 **GIVEAWAY ENDED** 🎉🎉`,
        timeRemaining: "Sisa waktu: **{duration}**!",
        inviteToParticipate: "React atau klik 🎉 untuk berpartisipasi!",
        winMessage: "Selamat, {winners}! Anda telah memenangkan hadiah **{prize}**!",
        embedColor: "RANDOM",
        embedColorEnd: "RANDOM",
        embedFooter: "Giveaways",
        noWinner: "Giveaway dibatalkan, tidak ada partisipasi yang valid!",
        hostedBy: "Dibuat oleh: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false
        }
      }
    });

    message.channel.send(`Giveaway telah dimulai disaluran ${giveawayChannel}!`);
  }
};