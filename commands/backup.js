const { MessageEmbed } = require("discord.js");
const backup = require("discord-backup");

module.exports = {
  name: "backup",
  cooldown: 3,
  description: "Kelola cadangan server Anda dengan cara yang efisien.",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      return message.reply("Anda tidak memiliki izin **Manage Guild**!");
    };

    const status = args[0];
    if (!status) {
      return message.reply("Pilih tindakan antara: `create`, `load` and `info`!");
    };

    if (status === "create") {
      const m = await message.channel.send("Harap tunggu beberapa detik...");
      backup.create(message.guild).then((backups) => {
        m.delete();
        message.reply("Cadangan berhasil dibuat! ID cadangan telah dikirimkan kepada Anda dalam pesan pribadi!");
        const backupID = backups.id
        message.author.send(`Ini ID cadangan Anda: \`${backupID}\`, gunakan untuk memuat cadangan Anda di server lain!`)
          .catch(() => {
            backup.remove(backupID);
            message.reply("Saya tidak punya izin untuk mengirimi Anda pesan pribadi... Perbarui setelan privasi Anda!");
          });
      }).catch((err) => {
        console.log(err.message);
        return message.channel.send("Ada yang tidak beres ... Harap coba lagi nanti!");
      });
    } else if (status === "load") {
      const backupID = args[1];
      if (!backupID) {
        return message.reply("Silakan masukkan ID cadangan!");
      };

      backup.fetch(backupID).then(async () => {
        message.channel.send(":warning: | **Memuat cadangan akan menggantikan server sebenarnya dengan yang disimpan.**\n\n:arrow_right_hook: **Jawab dengan mengirim `-confirm` untuk mengonfirmasi tindakan ini!**");
        await message.channel.awaitMessages(m => (m.author.id === message.author.id) && (m.content === "-confirm"), {
          max: 1,
          time: 20000,
          errors: ["time"]
        }).catch(() => {
          return message.reply("Waktu habis! Pemuatan cadangan dibatalkan!");
        });
        message.author.send("Pemuatan cadangan dimulai!");
        backup.load(backupID, message.guild).then(() => {
          backup.remove(backupID);
          message.author.send("Cadangan berhasil dimuat!");
        }).catch((err) => {
          console.log(err.message);
          return message.channel.send("Ada yang tidak beres... Harap coba lagi nanti!");
        });
      }).catch(() => {
        return message.reply(`Tidak ada id cadangan untuk \`${backupID}\``);
      });
    } else if (status === "info") {
      const backupID = args[1];
      if (!backupID) {
        return message.reply("Silakan masukkan ID cadangan!");
      };

      backup.fetch(backupID).then(async (backupInfos) => {
        const date = new Date(backupInfos.data.createdTimestamp);
        const yyyy = date.getFullYear().toString(),
          mm = (date.getMonth() + 1).toString(),
          dd = date.getDate().toString();
        const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
        const embed = new MessageEmbed()
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setAuthor("Informasi Cadangan", message.client.user.displayAvatarURL({ dynamic: true }))
          .addField("Backup Id", backupInfos.id, true)
          .addField("Server Id", backupInfos.data.guildID, true)
          .addField("Size", backupInfos.size + " mb", true)
          .addField("Created At", formatedDate, true)
          .setColor(message.guild.me.displayHexColor)
          .setFooter(message.client.user.username);
        message.channel.send(embed);
      }).catch(() => {
        return message.reply(`Tidak ada id cadangan untuk \`${backupID}\``);
      });
    } else {
      return message.reply("Pilih tindakan antara: `create`, `load` and `info`!");
    }
  }
};