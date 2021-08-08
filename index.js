/**
 * Module Imports
 **/
const { get } = require("node-superfetch");
const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  console.log('Pinging!');
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.zyiang1928.repl.co`);
}, 280000);

const { Client, Collection } = require("discord.js");
const { join } = require("path");
const { readdirSync } = require("fs");
const { BOT_TOKEN, PREFIX } = require('./config.json');

const client = new Client({
  fetchAllMembers: true,
  partials: ["MESSAGE", "USER", "REACTION"]
});

require("./util/eventLoader.js")(client);

client.login(BOT_TOKEN);
client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Collection();
client.snipeMap = new Map();
client.prefix = PREFIX;
const queue = new Map();
/**
 * Client Events
 **/
client.on("warn", info => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 **/
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
};



/**
 * Giveaways
 **/
const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./data/giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColor: "RANDOM",
    embedColorEnd: "RANDOM",
    reaction: "🎉"
  }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});