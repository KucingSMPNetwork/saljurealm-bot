const { MessageEmbed } = require('discord.js');

function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " hari" : " hari") + " lalu";
};

module.exports = {
  name: "serverinfo",
  aliases: ["si"],
  description: 'Menampilkan informasi tentang server',
  async execute(message) {
    let verifLevels = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
    let region = {
        "brazil": "Brazil",
        "eu-central": "Central Europe",
        "singapore": "Singapore",
        "us-central": "U.S. Central",
        "sydney": "Sydney",
        "us-east": "U.S. East",
        "us-south": "U.S. South",
        "us-west": "U.S. West",
        "eu-west": "Western Europe",
        "vip-us-east": "VIP U.S. East",
        "london": "London",
        "amsterdam": "Amsterdam",
        "hongkong": "Hong Kong"
    };
    
    var emojis;
    if (message.guild.emojis.cache.size === 0) {
        emojis = 'Tidak Ada';
    } else {
        emojis = message.guild.emojis.cache.size;
    }

    const embed = new MessageEmbed()
      .setAuthor("Info Server", message.guild.iconURL() ? message.guild.iconURL() : message.client.user.displayAvatarURL())
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .addField("📁 Informasi Umum",
`\`\`\`・》Nama Guild: ${message.guild.name}
・》ID Guild: ${message.guild.id}
・》Pemilik: ${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}
・》Wilayah: ${region[message.guild.region]}
・》Dibuat: ${message.guild.createdAt.toString().substr(0, 15)},\n(${checkDays(message.guild.createdAt)})
・》Batas Waktu AFK: ${message.guild.afkTimeout / 60} minutes
・》Tingkat Verifikasi: ${message.guild.verificationLevel}\`\`\``
                , true)
      .addField("📌 Penghitung",
`\`\`\`・》Jumlah Seluruh Anggota: ${message.guild.memberCount}
・》Jumlah Anggota: ${message.guild.members.cache.filter(m => !m.user.bot).size}
・》Jumlah Bot: ${message.guild.members.cache.filter(m => m.user.bot).size}
・》Jumlah Peran: ${message.guild.roles.cache.size}
・》Jumlah Saluran: ${message.guild.channels.cache.size}
・》Jumlah Emoji: ${emojis}/100\`\`\``
                , true)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(message.client.user.username);
   message.channel.send({embed});
  }
};