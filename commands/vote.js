const { MessageEmbed } = require('discord.js');

const agree = "✅";
const disagree = "❎";

module.exports = {
  name: "vote",
  description: "Beri suara untuk pesan Anda",
  async execute(message, args) {
    if (!args || args[0] === 'help') return message.reply("Penggunaan: s!vote <pertanyaan>");
    let question = message.content.split(" ").splice(1).join(" ");
    if (question.length < 1) {
      let msg = await message.channel.send(`Yes = ✅\nNo = ❎\nPilih sekarang!(Vote time: 2 menit)\n#Note: Jangan mainkan reaksi emoji untuk menghindari bug!`);
      await msg.react(agree);
      await msg.react(disagree);

      const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, { time: 120000 });
      msg.delete();

      var NO_Count = reactions.get(disagree).count;
      var YES_Count = reactions.get(agree);

      if (YES_Count == undefined) {
        var YES_Count = 1;
      } else {
        var YES_Count = reactions.get(agree).count;
      }

      var sumsum = new MessageEmbed()
        .addField("Voting Selesai",
          "----------------------------------------\n" +
          "Total suara (Yes): " + `${YES_Count-1}\n` +
          "Total suara (NO): " + `${NO_Count-1}\n` +
          "----------------------------------------", true)
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`${message.client.user.username}`)
        .setTimestamp();
      await message.channel.send({ embed: sumsum });
    } else if (question.length > 1) {
      let msg = await message.channel.send(`Pertanyaan: ${question}\nYes = ✅\nNo = ❎\nPilih sekarang!(Vote time: 2 menit)\n#Note: Jangan mainkan reaksi emoji untuk menghindari bug!`);
      await msg.react(agree);
      await msg.react(disagree);

      const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, { time: 120000 });
      msg.delete();

      var NO_Count = reactions.get(disagree).count;
      var YES_Count = reactions.get(agree);

      if (YES_Count == undefined) {
        var YES_Count = 1;
      } else {
        var YES_Count = reactions.get(agree).count;
      }

      var sumsum = new MessageEmbed()
        .addField("Voting Selesai",
          "----------------------------------------\n" +
          "Pertanyaan: " + question + "\n" +
          "Total suara (Yes): " + `${YES_Count-1}\n` +
          "Total suara (NO): " + `${NO_Count-1}\n` +
          "----------------------------------------", true)
        .setColor(message.guild.me.displayHexColor)
        .setFooter(`${message.client.user.username}`)
        .setTimestamp();
      await message.channel.send({ embed: sumsum });
    }
  }
};