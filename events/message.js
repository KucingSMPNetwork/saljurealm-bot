const Discord = require('discord.js');
const fs = require('fs');
const { PREFIX } = require('../config.json');

module.exports = async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.channel.type === "dm") return;

  let msg = message.content.toLowerCase();
  let client = message.client;
  let cooldowns = new Discord.Collection();
  let sender = message.author;

  if (msg.includes(`<@${client.user.id}>`) || msg.includes(`<@!${client.user.id}>`)) {
    return message.reply(`Awalan Saya Saat Ini Adalah \`${PREFIX}\` Silakan Ketik \`${PREFIX}help\` Untuk Menemukan Semua Daftar Perintah Saya.`);
  }

  if (sender.bot) return;
  if (msg.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Silahkan tunggu ${timeLeft.toFixed(1)} detik / second(s) sebelum menggunakan perintah \`${command.name}\`.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => {
      timestamps.delete(message.author.id, cooldownAmount);
    });

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error.message);
      return message.reply("Terjadi kesalahan saat menjalankan perintah itu!").catch(console.error);
    } finally {
      console.log(`Commands: ${PREFIX}${command.name} - Guild: ${message.guild.name} - Id: ${message.guild.id}`);
    }
  }
};