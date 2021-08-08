const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "ping",
  description: "Ping/pong command",
  execute(message) {
    message.channel.send('Ping?').then(m => {
      let now = Date.now();
      let embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle("Pong 🏓")
        .addField("API", `${m.createdTimestamp - message.createdTimestamp}ms`)
        .addField("Web Socket", `${Math.round(message.client.ws.ping)}ms`)
        .addField("Message Latency", `${ms(Date.now() - now)}`)
      m.edit(embed);
    });
  }
};