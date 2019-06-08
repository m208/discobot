const net = require('net');

// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");

const servers = require("./servers.json");
const greetings = require("./greetings.json");

let resString = '';
let results = [];





async function mainLoop(){
	const guild = client.guilds.get(config.guild);
if (!guild) return console.log('Unable to find guild.');

const channel = guild.channels.find(c => c.id === config.statusChannel && c.type === 'text');
if (!channel) return console.log('Unable to find channel.');
	
	
	
while (1){


try {
    const message = await channel.fetchMessage(config.statusMessage);
    if (!message) return console.log('Unable to find message.');
   
	resString = 'текущие статусы:  \n';
			await asyncQuerry(servers);
			let timeStamp = new Date().toString().slice(16, 21);
			resString += ' \n Обновлено: ' + timeStamp;
	

	await message.edit(resString);
    console.log('Done.');
} catch(err) {
    console.error(err);
}

await timeout(config.delay*1000);

}
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  mainLoop();
  
  
  
  
});




































//client.login(config.token);
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});













function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  
  
    if(command === "greetings") {
		let quote = getRandomMessage(greetings.greetings);
		message.reply(quote); 
  }
  
  	if(command === "status"){
		
	//	if(!message.member.hasPermission("ADMINISTRATOR")) return;
		
		const m = await message.channel.send('секундочку...');
	
		//	while (1){
			resString = 'текущие статусы:  \n';
			await asyncQuerry(servers);
			let timeStamp = new Date().toString().slice(16, 21);
			resString += ' \n Обновлено: ' + timeStamp;
		//	m.edit(resString);
		
		message.reply(resString); 
		
		
		//	await timeout(config.delay*1000);
		//	}
		
	}
  if(command === "ping") {
//let m = client.channels.get(config.statusChannel).message(config.statusMessage);
/*


const guild = client.guilds.get(config.guild);
if (!guild) return console.log('Unable to find guild.');

const channel = guild.channels.find(c => c.id === config.statusChannel && c.type === 'text');
if (!channel) return console.log('Unable to find channel.');

try {
    const message = await channel.fetchMessage(config.statusMessage);
    if (!message) return console.log('Unable to find message.');

    
	resString = 'текущие статусы:  \n';
			await asyncQuerry(servers);
			let timeStamp = new Date().toString().slice(16, 21);
			resString += ' \n Обновлено: ' + timeStamp;
	
	
	
	
	
	
	
	
	
	
	
	
	
	await message.edit(resString);
    console.log('Done.');
} catch(err) {
    console.error(err);
}















*/

  }
  /*
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
  
  */
  
  
  
});

client.on('error', console.error);


client.on("guildMemberAdd", member => { 
	let guildChannel = member.guild.channels.find(channel => channel.id === 'config.defaultChannel'); 
	if(!guildChannel) { return } 
	if(guildChannel.type != "text"){ return } 
	let quote = getRandomMessage(greetings.greetings);
	guildChannel.send(''+member.user+' '+quote+'').catch(console.error);
});
//493882788307664897


function getRandomMessage(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

async function connectServer(host, port, name){
	const sendMsg = new Buffer([0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF, 0xFFFFFFFF]);
	
	return new Promise(function(resolve, reject) {
		
	let client = new net.Socket();
	client.setTimeout(900, function(data) {
		client.destroy();
		results[name] = [-1]; //timeout
		resolve('timeout');
	});
	
	client.connect(port, host, function() {
		//console.log('CONNECTED TO: ' + host + ':' + port);
		client.write(sendMsg);
		client.on('data', function(data) {
			let ppl =  data.readUIntLE(0, 3);
			//let upTime = secToDays(data.readUIntLE(4, 7));
			let upTime = 0;
			results[name] = [ppl, upTime];
			//console.log(': онлайн: ', ppl, ', аптайм: ', upTime ); 
			client.end();
			
		});
		client.on('end', function() {
			client.end();
			resolve('ok');
		});
	});

	});
}


async function asyncQuerry(array){
	for (let name in array) {
		let host = array[name][0];
		let port = array[name][1];
		await connectServer(host, port, name);
	}
	sortResults();
}


function sortResults(){
	let sortable = [];
		for (let name in results) {
			sortable.push([name, results[name]]);
		}
		sortable.sort(function(a, b) {
			return  b[1][0]- a[1][0];
		});
		
		for (val in sortable){
			let name = sortable[val][0];
			let ppl = sortable[val][1][0];
			let upTime = sortable[val][1][1];
			var txt = (ppl>=0) ? (''+name+': онлайн: '+ppl+', аптайм: '+upTime+'') : ''+name+' : offline';
			var okSymbol = (ppl>=0) ? '+' : '-';
			resString +=('```diff\n'+okSymbol+''+txt+'\n```');
			
		}
		//console.log(resString); 
}

function secToDays(sec){
	let min = Math.floor( sec / 60 );
	let hrs = Math.floor( min / 60 );
	let days = Math.floor( hrs / 24 );
	
	if ( days > 0 ) {
		return (days + ' дн') ;
	}else if (hrs > 0){
		return (hrs + ' ч') ;
	}else return (min + ' мин');	

}



