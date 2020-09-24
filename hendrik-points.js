const Discord = require('discord.js');
const jsonConverter = require('./json-converter.js');
const client = new Discord.Client();
var scores = {};
const filePath = "data/hendrik-scores.txt"
var bots = jsonConverter.loadJSON("bots.json");
var authors = jsonConverter.loadJSON("authors.json");

client.login(bots[0]);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var test = jsonConverter.loadJSON(filePath);
  console.log(test);
  scores = test;
});

client.on('message', msg => {
    processRequest(msg);
});

function processRequest(msg)
{
    if(msg.content.charAt(0) === "h")
    {
        if(msg.content === "hleaderboard")
        {
            showLeaderboard(msg);
        }
        else if(authors.includes(msg.author.id)) {
            var command = extractCommand(msg);
            var playerKey = extractComponents(msg)[0];
            var playerValue = extractComponents(msg)[1];
            if(command === "+")
            {
                modifyScore(playerKey, playerValue);
                msg.reply("Score added");
            }
            else if(command === "-")
            {
                modifyScore(playerKey, -playerValue);
                msg.reply("Score subtracted");
            }
        }
    }
}

function extractCommand(msg) {
    return msg.content.charAt(1);
}

function extractComponents(msg) {
    var msgWithoutCommand = msg.content.slice(2,msg.content.length);
    var msgSplit = msgWithoutCommand.trim().split(" ");
    var playerKey = msgSplit.slice(1, msgSplit.length).join(" ");
    var lowercasePlayerKey = playerKey.toLowerCase();
    return [lowercasePlayerKey.charAt(0).toUpperCase() + lowercasePlayerKey.slice(1), Number(msgSplit[0])];
}

function modifyScore(playerKey, playerValue) {    
    if (playerKey in scores) {
        scores[playerKey] += Number(playerValue);
    }
    else {
        scores[playerKey] =  Number(playerValue);
    }
    jsonConverter.saveJSON(filePath, scores);
}

function showLeaderboard(msg) {
    var result = "\n";
    for (const [key, value] of Object.entries(scores)) {
        result += `${key}: ${value}\n`;
    }
    msg.reply(result);
}