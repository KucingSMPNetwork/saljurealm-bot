const { MessageEmbed } = require('discord.js');
const moment = require('moment');

function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  return days + (days == 1 ? " hari" : " hari") + " lalu";
};

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  description: 'Menampilkan informasi tentang pengguna',
  async execute(message, args) {
    let user = message.mentions.users.first();
    let muser = message.guild.member(message.mentions.users.first());
    if(!message.mentions.users.first() && args.lenth > 0){
        user = message.guild.member(args[0]).user
        muser = message.guild.member(args[0]);
    }
    if(!muser) muser = message.member;
    if(!user) user = message.author;

    let status = "";    
    if (!muser.presence.activities.length) {
      status = "Tidak Ada Game Terdeteksi";
    };
    
    muser.presence.activities.forEach((activity) => {
       if (activity.type === "CUSTOM_STATUS") {
         status = `Custom Status: ${activity.emoji || "No Emoji"}\nApp: ${activity.name}`
         
       } else if (activity.type === "PLAYING") {
         status = `Type: Playing\nApp: ${activity.name}\nDetails: ${activity.details}\nWorking On: ${activity.state}`
         
       } else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {
         let trackURL = `https://open.spotify.com/track/${activity.syncID}`;
         let trackName = activity.details;
         let trackAuthor = activity.state;
         let trackAlbum = activity.assets.largeText;
             trackAuthor = trackAuthor.replace(/;/g, ",")
         status = `Type: Listening\nApp: Spotify\nSong Name: ${trackName}\nAlbum: ${trackAlbum}\nAuthor: ${trackAuthor}`
         
       } else {
         status = `${activity.type.toLowerCase()}: ${activity.name}`
       }
    });

    const embed = new MessageEmbed()
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(user.displayAvatarURL())
          .setAuthor("Informasi Pengguna", user.displayAvatarURL())
          .addField("Mention", `${user}`, true)
          .addField("Username", `${user.username}#${user.discriminator}`, true)
          .addField("ID", `${user.id}`, true)
          .addField('Currently Status', `${muser.presence.status.toUpperCase()}`, true)
          .addField('Game', `${status}`, true)
          .addField('Joined Discord', `${moment(user.createdAt).toString().substr(0, 15)}\n(${moment(user.createdAt).fromNow()})`, true)
          .addField('Joined Server', `${moment(muser.joinedAt).toString().substr(0, 15)}\n(${moment(muser.joinedAt).fromNow()})`, true)
          .addField('Roles', `${muser.roles.cache.array()}`, true)
          .addField('Is Bot', `${user.bot.toString().toUpperCase()}`, true)
          .setFooter(message.client.user.username);
      message.channel.send({embed});
  }
};