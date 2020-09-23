const Discord = require('discord.js');
const fsLibrary = require('fs');
const { cpuUsage } = require('process');
const jsonConverter = require('./json-converter');
const client = new Discord.Client();
const scores = {};
var bots = jsonConverter.loadJSON("bots.json");
var authors = jsonConverter.loadJSON("authors.json");

client.login(bots[0]);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  readData();
});

client.on('message', msg => {
    processRequest(msg);
});

function processRequest(msg)
{
    if(msg.content.charAt(0) === "h")
    {
        console.log(msg.author.id);
        console.log(authors);
        console.log(authors.includes(msg.author.id));
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
                addScore(playerKey, playerValue);
                saveData();
                msg.reply("Score added");
            }
            else if(command === "-")
            {
                addScore(playerKey, -playerValue);
                saveData();
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
    console.log(playerKey);
    var lowercasePlayerKey = playerKey.toLowerCase();
    return [lowercasePlayerKey.charAt(0).toUpperCase() + lowercasePlayerKey.slice(1), Number(msgWithoutCommand[0])];
}

function addScore(playerKey, playerValue) {    
    if (playerKey in scores) {
        scores[playerKey] += Number(playerValue);
    }
    else {
        scores[playerKey] =  Number(playerValue);
    }
}

function showLeaderboard(msg) {
    var result = "\n";
    for (const [key, value] of Object.entries(scores)) {
        result += `${key}: ${value}\n`;
    }
    msg.reply(result);
}

function saveData() {
    var data = "";
    for (const [key, value] of Object.entries(scores)) {
        data += `${key}: ${value}µ`;
    }
    fsLibrary.writeFileSync('HendrikScores.txt', data);
}

function readData() {
    try {
        if (fsLibrary.existsSync("HendrikScores.txt")) {
            var data = fsLibrary.readFileSync("HendrikScores.txt", 'utf8');
            if (data)
            {
                var values = data.split("µ");
                for(i = 0; i < values.length - 1; i++) {
                    var temp = values[i].split(": ")
                    var playerKey = temp[0];
                    var playerValue = temp[1];
                    scores[playerKey] = Number(playerValue);
                }
            }
        }
    }
    catch(err) {
        console.error(err);
    }
}