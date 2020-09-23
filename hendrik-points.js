const Discord = require('discord.js');
const fsLibrary = require('fs');
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
        if(msg.content === "hleaderboard")
        {
            showLeaderboard(msg);
        }
        else if(msg.author.id in authors) {
            if(msg.content.charAt(1) === "+")
            {
                addScore(msg);
                saveData();
            }
            else if(msg.content.charAt(1) === "-")
            {
                subtractScore(msg);
                saveData();
            }
        }
    }
}

function addScore(msg) {
    var temp = msg.content.slice(2,msg.content.length);
    var temp2 = temp.split(" ");
    var lower = temp2[0].toLowerCase();
    var playerKey = lower.charAt(0).toUpperCase() + lower.slice(1);
    var playerValue = temp2[1];
    if (playerKey in scores) {
        scores[playerKey] += Number(playerValue);
    }

    else {
        scores[playerKey] =  Number(playerValue);
    }
    msg.reply('Score changed');
}

function subtractScore(msg) {
    var temp = msg.content.slice(2,msg.content.length);
    var temp2 = temp.split(" ");
    var playerKey = temp2[0].toLowerCase().charAt(0).toUpperCase() + temp2[0].slice(1);
    var playerValue = temp2[1];
    if (playerKey in scores) {
        scores[playerKey] -= Number(playerValue);
    }

    else {
        scores[playerKey] = -Number(playerValue);
    }
    msg.reply('Score subtracted');

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