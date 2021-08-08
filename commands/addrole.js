const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addrole",
  aliases: ["buff"],
  description: "Menambahkan peran kepada anggota dengan bot.",
  async execute(message, args) {
    if (!message.guild.member(message.client.user).hasPermission("MANAGE_ROLES")) return message.reply("Saya tidak memiliki izin **Manage Roles**!");
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Anda tidak memiliki izin **Manage Roles**!");
    if (message.mentions.users.size === 0) return message.reply("Sebutkan pengguna yang akan diberi peran.\nContoh: `s!addrole @user Members`");
    let member = message.guild.member(message.mentions.users.first());
    if (!member) return message.reply("Pengguna itu sepertinya tidak valid.");
    let rname = message.content.split(" ").splice(2).join(" ");
    let role = message.guild.roles.cache.find(val => val.name === rname);
    if (!role) return message.reply(`${rname} bukan role di server ini atau role tersebut tidak ada! pastikan nama role tersebut benar!`);
    let botRolePosition = message.guild.member(message.client.user).roles.highest.position;
    let rolePosition = role.position;
    let userRolePossition = message.member.roles.highest.position;
    if (userRolePossition <= rolePosition) return message.channel.send("Gagal menambahkan peran ke pengguna karena peran Anda lebih rendah dari peran yang ditentukan.")
    if (botRolePosition <= rolePosition) return message.channel.send("Gagal menambahkan peran ke pengguna karena peran tertinggi saya lebih rendah dari peran yang ditentukan.");
    member.roles.add(role).catch(e => {
      return message.channel.send(`${e}`);
    });
    message.channel.send(`**${message.author.username}**, saya telah menambahkan peran **${rname}** ke **${message.mentions.users.first().username}**.`);
  }
};