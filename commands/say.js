const Discord = require("discord.js");

module.exports = {
  name: "say",
  description: "Membuat bot mengulangi pesan Anda.",
  execute(message) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Anda tidak memiliki izin **Manage Messages**!");
    let args = message.content.split(" ").slice(1);
    message.delete();
    if (message.content.includes("@everyone") || message.content.includes("@here")) return message.reply("Anda tidak bisa membuat saya melakukan ping kepada semua orang!");
    message.channel.send(args.join(" ")).cleanContent;
  }
};