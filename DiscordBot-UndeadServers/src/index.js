// Includes
const fs = require('fs');
const Discord = require('discord.js'); 
const client = new Discord.Client();

client.commands = new Discord.Collection();
const Sequelize = require('sequelize');

// For the website scrape
const request = require("request-promise");
const cheerio = require("cheerio");

var prefix = '.'; //prefix to use commands

const commands = [
    "\nList of Commands",
    ".help - I'll display the list of commands",
    ".players - I'll display the total players online",
    ".who - I'll display the names of the players online",
    ".map - I'll send what map the server is on",
    ".join - I'll send out a join link to the main server",
    ".status - I'll display if the server is offline or online",
    "\nPS: PM @color#6812 for any commands you'd like to see."
]

// parses commands
function commandinput(str, msg){
    return msg.content.toLowerCase().startsWith(prefix + str);
}

// Lets me know its up
client.once('ready', () => {
    console.log('bot ready');
});

// Antispam
//let lastCmdSentTime = {};
//let waitTimeForUser =  60000 * 3; // Users can only run a command once every 5 minutes
//let botLastSent = false;
//let timeBetweenEachCmd = 60000 * 3;   // Bot will only respond once a minute.

// eventually make this a switch
client.on('message', message => {
    // For the antispam
    //if(botLastSent !== false ? message.createdTimestamp - botLastSent < timeBetweenEachCmd : false) return; //don't let the bot run a cmd every [timeBetweenEachCmd]
    //let userLastSent = lastCmdSentTime[message.author.id] || false;
    //if(userLastSent !== false ? message.createdTimestamp - userLastSent < waitTimeForUser : false) return; //don't let the user run a cmd every [waitTimeForUser]
    //lastCmdSentTime[message.author.id] = message.createdTimestamp;
    //botLastSent = message.createdTimestamp;

    // Ignoring all chat messages that arnt commands or are from bot
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    // Sends a list of commands
    if (commandinput("help", message)){
        message.reply(commands);
    }
    // Amount of people on the server
    else if (commandinput("players", message)){
        async function main() { // the web scrape
            const result = await request.get("https://gmod-servers.com/server/169636/");
            const $ = cheerio.load(result);
            $("body > div.content > div > div:nth-child(5) > div > div:nth-child(4) > div.col-12.col-md-7 > table > tbody > tr:nth-child(4) > td:nth-child(2) > strong").each((index, element) => {
                message.channel.send("There are: ");
                message.channel.send($(element).text());
            });                
            
        }
    
        main();
    }
    // Names of people on the server 
    else if (commandinput("who", message)){
      async function main() {
            const result = await request.get("https://gmod-servers.com/server/169636/");
            const $ = cheerio.load(result);
            $("body > div.content > div > div:nth-child(5) > div > div:nth-child(6) > div > div").each((index, element) => {
                message.channel.send("These are the currently active players: ");
                message.channel.send($(element).text());
            });
      }
      main();

    }
    else if (commandinput("map", message)){
        async function main() { // webscrape
            const result = await request.get("https://gmod-servers.com/server/169636/");
            const $ = cheerio.load(result);
            $("body > div.content > div > div:nth-child(5) > div > div:nth-child(4) > div.col-12.col-md-7 > table > tbody > tr:nth-child(8) > td:nth-child(2) > strong").each((index, element) => {
                message.channel.send("The server is currently on: ");
                message.channel.send($(element).text());
            });
        }
    
        main();
    }
    else if (commandinput("join", message)){
        message.channel.send("Here is a join link: steam://connect/144.217.11.179:27031");
    }
    else if (commandinput("status", message)){
        async function main() { // webscrape
            const result = await request.get("https://gmod-servers.com/server/169636/");
            const $ = cheerio.load(result);
            $("body > div.content > div > div:nth-child(5) > div > div:nth-child(4) > div.col-12.col-md-7 > table > tbody > tr:nth-child(3) > td:nth-child(2) > button").each((index, element) => {
                message.channel.send("The server's status is: ");
                message.channel.send($(element).text());
            });
        }
    
        main();
    } 
  
    // BS commands people requested
    else if (commandinput("greedo", message)){
      message.channel.send("Where is <@213314105082249216>");
    }
    else if (commandinput("grats", message)){
      message.channel.send("Congrats Lunar on getting Executive!");
    }
  
    
}); // end of func


client.login(process.env.TOKEN); // discord token (keep private)
