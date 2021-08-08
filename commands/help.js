const { MessageEmbed } = require("discord.js");
const help = require("../data/helpMsgs.json");
const fs = require("fs");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Menampilkan semua perintah",
  execute(message, args) {
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle("●▬▬▬● HELP COMMANDS ●▬▬▬●")
        .addField('⪼ **__Administrator__** ⪻', help.admin)
        .addField('⪼ **__General__** ⪻ ', help.general)
        .addField('⪼ **__#Note__** ⪻', 'Gunakan \`s!help <command>\` untuk informasi lebih lanjut')
        .setFooter(message.client.user.username)
        .setTimestamp()
        .setThumbnail(message.client.user.displayAvatarURL());

      message.channel.send(embed).catch(console.error);

    } else {
      let command = args[0];
      if (message.client.commands.has(command.toLowerCase())) {
        command = message.client.commands.get(command.toLowerCase());
        const embed1 = new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setTimestamp()
          .setThumbnail(message.client.user.displayAvatarURL())
          .setAuthor(`Help ${command.name} Commands`, message.client.user.displayAvatarURL())
          .addField("Description", `${command.description ? command.description : "None"}`)
          .addField("Aliases", `${command.aliases ? command.aliases : "None"}`)
          .setFooter(message.client.user.username);
        return message.channel.send(embed1).catch(console.error);

      } else if (message.client.aliases.has(command.toLowerCase())) {
        command = message.client.commands.get(message.client.aliases.get(command.toLowerCase()));
        const embed2 = new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setTimestamp()
          .setThumbnail(message.client.user.displayAvatarURL())
          .setAuthor(`Help ${command.name} Commands`, message.client.user.displayAvatarURL())
          .addField("Description", `${command.description ? command.description : "None"}`)
          .addField("Aliases", `${command.aliases ? command.aliases : "None"}`)
          .setFooter(message.client.user.username);
        return message.channel.send(embed2).catch(console.error);

      } else {
        return message.reply(`Perintah ${command} tidak ada, silahkan ketik \`s!help <command>\` untuk mengetahui perintah apa saja yang tersedia!`);
      }
    }
  }
};