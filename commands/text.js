const { MessageEmbed, MessageCollector } = require("discord.js");

module.exports = {
  name: "text",
  description: "Membuat pesan pengumuman Anda.",
  async execute(message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Anda tidak memiliki izin **Manage Messages**!");

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Harap sebutkan salurannya, lalu masukkan kalimat / kata / teks!");

    const text = args.slice(1).join(" ");
    if (!text) {
      return message.reply("Anda harus memasukkan teks pengumuman!");
    }

    if (text.length > 1030) {
      return message.reply("Harap masukkan teks yang lebih pendek dari 1030 karakter!");
    }

    message.delete().catch(O_o => {});

    let mention = "";

    const msg = await message.channel.send("Apakah Anda ingin menambahkan sebutan ke pesan Anda? Jawab \`ya\` atau \`tidak\`");
    const collector = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 240000 });

    collector.on("collect", async (tmsg) => {

      if (tmsg.content.toLowerCase() === "tidak") {
        tmsg.delete();
        msg.delete();
        collector.stop(true);
      }

      if (tmsg.content.toLowerCase() === "ya") {
        tmsg.delete();

        const tmsg1 = await msg.edit("Ketikkan salah satu jawaban berikut: `every` (untuk mengatakan @ everyone) atau `here` (untuk mengatakan @ here)!");
        const c = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 60000 });

        c.on("collect", (m) => {
          if (m.content.toLowerCase() === "here") {
            mention = "@here";
            tmsg1.delete();
            m.delete();
            collector.stop(true);
            c.stop(true);
          } else if (m.content.toLowerCase() === "every") {
            mention = "@everyone";
            tmsg1.delete();
            m.delete();
            collector.stop(true);
            c.stop(true);
          }
        });
        c.on("end", (collected, reason) => {
          if (reason === "time") {
            return message.reply("Waktu habis! Silakan kirim perintah lagi!");
          }
        });
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        return message.reply("Waktu habis! Silakan kirim perintah lagi!");
      }

      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .setAuthor("📢 Announcement")
        .setDescription(text)
        .setFooter(message.client.user.username)
        .setTimestamp();

      message.channel.send(`Pesan Anda telah dikirim ke saluran ${channel}`).then(x => x.delete({ timeout: 2500 }));
      message.client.channels.cache.get(channel.id).send(mention, embed);
    });
  }
};