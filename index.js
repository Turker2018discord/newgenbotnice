const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require('fs')	
let settings = JSON.parse(fs.readFileSync(__dirname+"/settings.json"));	
let prefix = settings['prefix'];	
let cooldown = settings['cooldown']	
const generated = new Set();	


bot.on("ready", () => {	
    console.log(`Logged in as ${bot.user.tag}!`);	
});	

bot.on("message", async message => {	
    prefix = settings['prefix'];	
    cooldown = settings['cooldown']	
    if (message.author.bot) return;	
    var command = message.content	
    .toLowerCase()	
    .slice(prefix.length)	
    .split(" ")[0];	

    if(command === "ping") {
        message.channel.send("Pinging...").then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;
            var botPing = Math.round(bot.pi);

            m.edit(`**Bot Ping:**\n**${ping}ms**`);
        });
    }
    
    if (command === "gen") {	
//         pune idul de la channelul de generator 
        if(message.channel.id !== "776104953432244234")  return message.channel.send("You can't generate here!")	

        if (generated.has(message.author.id)) {	
            message.channel.send("Wait before generating another account!. - " + message.author);	
        } else {	

            let messageArray = message.content.split(" ");	
            let args = messageArray.slice(1);	
            if (!args[0]) return message.reply("Please, specify the service you want!");	
            let data;	
            try{	
                data = fs.readFileSync(__dirname + "/" + args[0].toLowerCase() + ".json")	

            } catch{	
                return message.reply(args[0].toLowerCase()+' service do not exists')  	
            } 	
            let account = JSON.parse(data)	
                if (account.length <= 0) return message.reply("There isn't any account avaible for that service")	
                const embed = {	
                    title: "Account Generated!",	
                    description: "Check your dm for the account's information!",	
                    color: 1752220,	
                    timestamp: "2019-04-04T14:16:26.398Z",	
                    footer: {	
                        icon_url:	
                            "https://cdn.discordapp.com/avatars/530778425540083723/7a05e4dd16825d47b6cdfb02b92d26a5.png",	
                        text: "Bot made by $piker#0001"	
                    },	
                    thumbnail: {	
                        url:	
                            "http://www.compartosanita.it/wp-content/uploads/2019/02/right.png"	
                    },	
                    author: {	
                        name: '‎‎‎‎👍',	
                        url: "https://discordapp.com",	
                        icon_url: bot.displayAvatarURL	
                    },	
                    fields: []	
                };	

                await message.channel.send({ embed });	
                await generated.add(message.author.id);	
                await message.author.send({embed: {	
                    "title": "Account information",	
                    "color": 1752220,	
                    "fields": [	
                      {	
                        "name": "Email",	
                        "value": account[0].email	
                      },	
                      {	
                        "name": "Password",	
                        "value": account[0].password	
                      }
                    ]	
                  }	
                })	
                account.splice(0,1)	
                console.log(account)	
                fs.writeFileSync(__dirname + "/" + args[0] + ".json", JSON.stringify(account));	
                setTimeout(() => {	
                    generated.delete(message.author.id);	
                }, cooldown);	
        }	
    }	


    if (command === "change"){	
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Sorry, you can't do it, you are not an admin!");	
        let messageArray = message.content.split(" ");	
        let args = messageArray.slice(1);	
        try{	
            settings[args[0].toLowerCase()] = args[1].toLowerCase()	
            fs.writeFileSync(__dirname+"/settings.json", JSON.stringify(settings));	
            message.reply(args[0]+" changed to "+args[1])	

        } catch{	
            message.reply("An error occured")	
        }	
    }	

    if(command === "stock"){	
        let stock = []	

        fs.readdir(__dirname, function (err, files) {	
            if (err) {	
                return console.log('Unable to scan directory: ' + err);	
            } 	

            files.forEach(function (file) {	
                if (!file.includes(".json")) return	
                if (file.includes('package-lock') || file.includes('package.json') || file.includes('settings.json')) return	
                stock.push(file) 	
            });	
            console.log(stock)	

            stock.forEach(async function (data) {	
                let acc = await fs.readFileSync(__dirname + "/" + data)	
                
                    message.channel.send({embed: {	
                    "title": "Stock",	
                    "color": 1752220,	
                    "fields": [	
                      {	
                        "name": 'value',	
                        "value": +JSON.parse(acc).length+" accounts\n"
                      }
                    ]	
                  } 	
            
                })	
                  	
            
                	            


            })	

        });	
    }	


    if(command === "add") {	
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Sorry, you can't do it, you are not an admin!");	
        let messageArray = message.content.split(" ");	
        let args = messageArray.slice(1);	
        var acc = args[1].split(":");	

        fs.readFile(__dirname + "/" + args[0].toLowerCase() + ".json",function(err, data) { 	
        if(err){	
            let newnewData = 	
            [{	
                "email":acc[0],	
                "password":acc[1]	
            }]	
            try {	
                fs.writeFileSync(__dirname + "/" + args[0].toLowerCase()+".json", JSON.stringify(newnewData))	
                message.reply("Service Created and account added!")	
            } catch {	
                message.channel.send('**Error** Cannot create service and add that account!')	

            }	
        }	

        else {	
            let newData = {"email":acc[0],"password":acc[1]}	
            data = JSON.parse(data)	
            try{	
                data.push(newData)	
                fs.writeFileSync(__dirname + "/" + args[0].toLowerCase()+".json", JSON.stringify(data))	
                message.reply("Account added!")	
            } catch {	
                message.channel.send('**Error** Cannot add that account!')	
            }	
        }	
    }); 	
}	

if(command === "help") {	
        message.channel.send({embed: {	
        "title": "Commands",	
        "color": 1752220,	
        "fields": [	
          {	
            "name": prefix+"gen fortnite",	
            "value": "generate an account of that service."	
          },	
          {	
            "name": prefix+"stock",	
            "value": "check the services and the accounts.."	
          }	
        ]	
      } 	
    })	
  }	
})	


bot.login('BOT TOKEN');