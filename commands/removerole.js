const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "removerole",
  aliases: ["nerf"],
  description: "Menghapus peran dari anggota dengan bot.",
  async execute(message, args) {
    if (!message.guild.member(message.client.user).hasPermission("MANAGE_ROLES")) return message.reply("Saya tidak memiliki izin **Manage Roles**!");
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Anda tidak memiliki izin **Manage Roles**!");
    if (message.mentions.users.size === 0) return message.reply("Sebutkan pengguna yang akan dihapus perannya.\nContoh: `removerole @user Members`");
    let member = message.guild.member(message.mentions.users.first());
    if (!member) return message.reply("Pengguna itu sepertinya tidak valid.");
    let rname = message.content.split(" ").splice(2).join(" ");
    let role = message.guild.roles.cache.find(val => val.name === rname);
    if (!role) return message.reply(`${rname} bukan role di server ini atau role tersebut tidak ada! pastikan nama role tersebut benar!`);
    let botRolePosition = message.guild.member(message.client.user).roles.highest.position;
    let rolePosition = role.position;
    let userRolePossition = message.member.roles.highest.position;
    if (userRolePossition <= rolePosition) return message.channel.send("Gagal menghapus peran ke pengguna karena peran Anda lebih rendah dari peran yang ditentukan!")
    if (botRolePosition <= rolePosition) return message.channel.send("Gagal menghapus peran ke pengguna karena peran tertinggi saya lebih rendah dari peran yang ditentukan!");
    member.roles.remove(role).catch(e => {
      console.log(e);
      return message.channel.send(":no_entry_sign: Terjadi kesalahan! Kemungkinan besar peran yang Anda coba hapus lebih tinggi daripada peran yang saya miliki!");
    });
    message.channel.send(`**${message.author.username}**, saya telah menghapus peran **${role.name}** dari **${message.mentions.users.first().username}**.`);
  }
};