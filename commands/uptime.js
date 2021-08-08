const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "uptime",
  description: 'Menampilkan berapa lama bot telah online.',
  execute(message) {
    var milliseconds = parseInt((message.client.uptime % 1000) / 100),
        seconds = parseInt((message.client.uptime / 1000) % 60),
        minutes = parseInt((message.client.uptime / (1000 * 60)) % 60),
        hours = parseInt((message.client.uptime / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    let embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setDescription(`:chart_with_upwards_trend: Saya telah online selama **${hours}** jam, **${minutes}** menit dan **${seconds}.${milliseconds}** detik`);
    
    message.channel.send(embed);
  }
};