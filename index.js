require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const fs = require('fs');
const dbFile = './cashDB.json';
let db = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile)) : {};

function saveDB() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function getUser(userId) {
  if (!db[userId]) {
    db[userId] = { cash: 0, lastDaily: 0 };
  }
  return db[userId];
}

const prefix = '.';

function normalize(text) {
  return text.toLowerCase().replace(/[\s\.\-_\u200B\\/]/g, '');
}

client.on('ready', async () => {
  console.log(`current bot: ${client.user.tag}`);

  await client.user.setPresence({
    activities: [{ name: 'chess', type: 'PLAYING' }],
    status: 'idle'
  });

  setTimeout(() => {
    console.log('Current presence:', client.user.presence.activities);
  }, 2000);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // ================== MODERATION COMMANDS ==================

    if (command === 'ban') {
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply("You don't have permission to ban members.");
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to ban.");
      const member = message.guild.members.cache.get(user.id);
      if (!member) return message.reply("User not found in this server.");

      try {
        await member.ban({ reason: `Banned by ${message.author.tag}` });
        message.channel.send(`${user.tag} was banned.`);
      } catch (err) {
        message.reply('I was unable to ban that user.');
        console.error(err);
      }
      return;
    }

    if (command === 'mute') {
      if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return message.reply("You don't have permission to mute members.");
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to mute.");
      const member = message.guild.members.cache.get(user.id);
      if (!member) return message.reply("User not found in this server.");

      const muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
      if (!muteRole) return message.reply("No 'Muted' role found.");

      try {
        await member.roles.add(muteRole);
        message.channel.send(`${user.tag} was muted.`);
      } catch (err) {
        message.reply('I was unable to mute that user.');
        console.error(err);
      }
      return;
    }
if (command === 'delmsg') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply("You don't have permission to delete messages, you peasant.");
  }

  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1 || amount > 100) {
    return message.reply("Give a number between 1 and 100.");
  }

  try {
    await message.delete();
    const deleted = await message.channel.bulkDelete(amount, true);
    message.channel.send(`Deleted ${deleted.size} messages.`)
      .then(msg => setTimeout(() => msg.delete().catch(() => {}), 3000)); // auto delete confirmation
  } catch (err) {
    console.error('Failed to bulk delete:', err);
    message.channel.send("Couldn't delete messages. Try again later.");
  }

  return;
}

if (command === 'bypass') {
  const inputText = args.join(' ');
  if (!inputText) return message.reply("give me something to bypass, dumbass.");

  const normalizedBypass = normalize(inputText);
  if (
    normalizedBypass.includes('discordgg') ||
    normalizedBypass.includes('discordcominvite') ||
    normalizedBypass.includes('discordappcominvite') ||
    normalizedBypass.includes('cdndiscord') ||
    /https?:\/\//i.test(inputText)
  ) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, stop tryna sneak links like a lil rat.`);
  }

  const separator = '';
  const transformedWords = inputText.split(/\s+/).map(word => {
    // Step 1: Replace 'l' with 'I'
    let transformed = word.replace(/l/g, 'I');

    // Step 2: Insert 'ꜗ' after 2nd character if length > 2
    if (transformed.length > 2) {
      transformed = transformed.slice(0, 2) + 'ꜗ' + transformed.slice(2);
    }

    return transformed;
  });

  const result = transformedWords.join(separator);
  return message.channel.send(result);
}


    if (command === 'unmute') {
      if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return message.reply("You don't have permission to unmute members.");
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to unmute.");
      const member = message.guild.members.cache.get(user.id);
      if (!member) return message.reply("User not found in this server.");

      const muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
      if (!muteRole) return message.reply("No 'Muted' role found.");

      try {
        await member.roles.remove(muteRole);
        message.channel.send(`${user.tag} was unmuted.`);
      } catch (err) {
        message.reply('I was unable to unmute that user.');
        console.error(err);
      }
      return;
    }

if (command === 'phonebypass') {
  const bypassList = [
    'niggа', 
    'niggеr', 
    'bitᴄh', 
    'fɑggot'
  ];

  const formatted = bypassList.map((word, i) => `**${i + 1}.** \`${word}\``).join('\n');

  return message.channel.send({
    content: `here are some bypasses for payphone and yggdrasil:\n${formatted}`
  });
}


    if (command === 'kick') {
      if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply("You don't have permission to kick members.");
      }
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to kick.");
      const member = message.guild.members.cache.get(user.id);
      if (!member) return message.reply("User not found in this server.");

      try {
        await member.kick(`Kicked by ${message.author.tag}`);
        message.channel.send(`${user.tag} was kicked.`);
      } catch (err) {
        message.reply('I was unable to kick that user.');
        console.error(err);
      }
      return;
    }

    // ================== USER COMMANDS ==================

    if (command === 'ping') {
      return message.channel.send(`Pong! 🏓`);
    }

if (command === 'say') {
  const text = args.join(' ');
  if (!text) return message.reply("say what?");

  const normalizedSay = normalize(text);

  // Check for Discord invites
  if (
    normalizedSay.includes('discordgg') ||
    normalizedSay.includes('discordcominvite') ||
    normalizedSay.includes('discordappcominvite')
  ) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, u are not slick. im not gonna promote your shitty server.`);
  }

  // Check for file links or any HTTP links
  if (
    normalizedSay.includes('cdndiscord') ||
    /https?:\/\//i.test(text)
  ) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, im not gonna send a link lil monkey.`);
  }

  return message.channel.send(text);
}

    if (command === '8ball') {
      const responses = [
        "Yes.", "No.", "Definitely.", "Absolutely not.", "Ask again later.",
        "I'm not sure.", "You wish.", "Obviously.", "Try again.", "100%."
      ];
      const answer = responses[Math.floor(Math.random() * responses.length)];
      return message.channel.send(`🎱 ${answer}`);
    }

    if (command === 'cf') {
      const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
      return message.channel.send(result);
    }

    if (command === 'roll') {
      const number = Math.floor(Math.random() * 100) + 1;
      return message.channel.send(`🎲 You rolled: **${number}**`);
    }

  if (command === 'slur') {
  const target = message.mentions.users.first();
  if (!target) return message.reply("tag someone to slur at.");

  if (target.id === client.user.id) {
    return message.channel.send(`${message.author}, u dumbass coon im not gonna do that`);
  }
      const roasts = [
        `curry stinking indian faggot`,
        `smells like 7-11 and shit`,
        `u dothead taxi driver bitch`,
        `dirty curry muncher`,
        `turban wearing monkey`,
        `go wipe your ass with your hand again`,
        `stinky Delhi dog`,
        `brown cockroach looking ass`,
        `snake charmer descendanti`,
        `go back to your shit river`,
        `bombay street shitter`,
        `sand nigger 2.0`,
        `faggot retard talking again`,
        `sit down spastic mongoloid`,
        `nobody asked cumskin`,
        `cry about it aids baby`,
        `go overdose meth baby`,
        `stupid nigger faggot hybrid`,
        `retarded tranny dick sucker`,
        `kill yourself oxygen thief`,
        `heard u be kissing dudes pussy u ape`,
        `who let this broke ass npc speak`,
        `inbred coon faggot`,
        `white trash cum guzzler`,
        `cocksucking retard acting up`,
        `smells like wet dog nigga`,
        `pride whore behavior`
      ];
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      return message.channel.send(`${target}, ${roast}`);
    }

    if (command === 'cat') {
      return message.channel.send('here nro ❤ https://cataas.com/cat');
    }

    if (command === 'daily') {
  const user = getUser(message.author.id);
  const now = Date.now();
  const dailyCooldown = 24 * 60 * 60 * 1000;

  if (now - user.lastDaily < dailyCooldown) {
    const remaining = dailyCooldown - (now - user.lastDaily);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return message.reply(`You already claimed your daily reward. Come back in ${hours}h ${minutes}m.`);
  }

  const reward = Math.floor(Math.random() * 500) + 250; // 250-749
  user.cash += reward;
  user.lastDaily = now;
  saveDB();
  return message.reply(`You claimed your daily reward: 💰 **${reward} coins**!`);
}

if (command === 'bal' || command === 'balance') {
  const user = getUser(message.author.id);
  return message.reply(`You have 💰 **${user.cash} coins**.`);
}

if (command === 'coinflip') {
  const guess = args[0]?.toLowerCase();
  const amount = parseInt(args[1]);

  if (!['heads', 'tails'].includes(guess)) {
    return message.reply("Guess must be `heads` or `tails`.");
  }
  if (isNaN(amount) || amount <= 0) {
    return message.reply("Please enter a valid coin amount.");
  }

  const user = getUser(message.author.id);
  if (user.cash < amount) {
    return message.reply("You don't have enough coins.");
  }

  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  let reply = `🪙 The coin landed on **${result}**.\n`;

  if (guess === result) {
    user.cash += amount;
    reply += `You won 💰 **${amount} coins**!`;
  } else {
    user.cash -= amount;
    reply += `You lost 💸 **${amount} coins**.`;
  }

  saveDB();
  return message.reply(reply);
}

if (command === 'give') {
  const target = message.mentions.users.first();
  const amount = parseInt(args[1]);

  if (!target || target.bot) return message.reply("Mention a valid user.");
  if (isNaN(amount) || amount <= 0) return message.reply("Enter a valid amount.");

  const sender = getUser(message.author.id);
  const receiver = getUser(target.id);

  if (sender.cash < amount) return message.reply("You don't have enough coins.");

  sender.cash -= amount;
  receiver.cash += amount;
  saveDB();

  return message.channel.send(`${message.author} gave 💰 **${amount} coins** to ${target}.`);
}

    if (command === 'work') {
  const user = getUser(message.author.id);
  const now = Date.now();
  const workCooldown = 30 * 60 * 1000;

  if (user.lastWork && now - user.lastWork < workCooldown) {
    const remaining = workCooldown - (now - user.lastWork);
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return message.reply(`you are tired. come back in ${minutes}m ${seconds}s.`);
  }

  const earnings = Math.floor(Math.random() * 200) + 100;
  user.cash += earnings;
  user.lastWork = now;
  saveDB();

  return message.reply(`you worked hard and earned 💰 **${earnings} coins**!`);
}

    if (command === 'slots' || command === 'slot') {
  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount <= 0) return message.reply("Enter a valid amount to bet.");

  const user = getUser(message.author.id);
  const now = Date.now();
  const cooldown = 6 * 1000;

  if (user.lastSlots && now - user.lastSlots < cooldown) {
    const remaining = cooldown - (now - user.lastSlots);
    const seconds = Math.ceil(remaining / 1000);
    return message.reply(`Please wait ${seconds}s before playing slots again.`);
  }

  if (user.cash < amount) return message.reply("You don't have enough coins to bet that.");

  const symbols = ['🍒', '🍋', '🍉', '🍇', '⭐', '🔔'];
  const spin = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];

  let winnings = 0;
  if (spin[0] === spin[1] && spin[1] === spin[2]) {
    winnings = amount * 5;
  } else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) {
    winnings = amount * 2;
  } else {
    winnings = -amount;
  }

  user.cash += winnings;
  user.lastSlots = now;
  saveDB();

  const resultMessage = `🎰 | [${spin.join(' ')}]\n` +
    (winnings > 0
      ? `you won 💰 **${winnings} coins**!`
      : `you lost 💸 **${amount} coins**. better luck next time!`);

  return message.reply(resultMessage);
}

    if (command === 'givemoney') {
  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return message.reply("You don't have permission to use this command.");
  }

  const target = message.mentions.users.first() || message.author;
  const amount = parseInt(args[1] ?? args[0]);

  if (!amount || isNaN(amount) || amount <= 0) {
    return message.reply("Please specify a valid amount of coins to give.");
  }

  const user = getUser(target.id);
  user.cash += amount;
  saveDB();

  return message.channel.send(`${target.tag} has been given 💰 **${amount} coins**.`);
}

    if (command === 'removemoney') {
      
  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return message.reply("You don't have permission to use this command.");
  }

  const target = message.mentions.users.first() || message.author;
  const amount = parseInt(args[1] ?? args[0]);

  if (!amount || isNaN(amount) || amount <= 0) {
    return message.reply("Please specify a valid amount of coins to remove.");
  }

  const user = getUser(target.id);

  user.cash = Math.max(0, user.cash - amount);
  saveDB();

  return message.channel.send(`Removed 💸 **${amount} coins** from ${target.tag}. New balance: 💰 **${user.cash} coins**.`);
}

if (command === 'roulette') {
  const color = args[0]?.toLowerCase();
  const amount = parseInt(args[1]);

  if (!['red', 'black', 'green'].includes(color)) {
    return message.reply("Choose a valid color: `red`, `black`, or `green`.");
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    return message.reply("Enter a valid coin amount to bet.");
  }

  const user = getUser(message.author.id);
  if (user.cash < amount) {
    return message.reply("You don't have enough coins.");
  }

  const spin = Math.floor(Math.random() * 37); // 0–36
  let resultColor;

  if (spin === 0) resultColor = 'green';
  else if (spin % 2 === 0) resultColor = 'black';
  else resultColor = 'red';

  let winAmount = 0;
  let winText = `🎰 The ball landed on **${spin} (${resultColor})**.`;

  if (color === resultColor) {
    if (color === 'green') winAmount = amount * 14;
    else winAmount = amount * 2;

    user.cash += winAmount;
    winText += `\nYou won 💰 **${winAmount} coins**! 🎉`;
  } else {
    user.cash -= amount;
    winText += `\nYou lost 💸 **${amount} coins**.`;
  }

  saveDB();
  return message.channel.send(winText);
}

    const pokerTables = {};

if (command === 'poker') {
  const sub = args[0]?.toLowerCase();

  // Create table
  if (sub === 'create') {
    if (pokerTables[message.channel.id]) {
      return message.reply("A poker table already exists in this channel.");
    }

    pokerTables[message.channel.id] = {
      host: message.author.id,
      players: [message.author.id],
      started: false
    };

    return message.channel.send(`🃏 ${message.author} created a poker table! Type \`${prefix}poker join\` to join.`);
  }

  if (sub === 'join') {
    const table = pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table exists. Use `.poker create` first.");
    if (table.started) return message.reply("The game has already started.");
    if (table.players.includes(message.author.id)) return message.reply("You're already at the table.");

    table.players.push(message.author.id);
    return message.channel.send(`${message.author} joined the poker table. Players: ${table.players.length}`);
  }

  if (sub === 'leave') {
    const table = pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table in this channel.");

    const index = table.players.indexOf(message.author.id);
    if (index === -1) return message.reply("You're not at the table.");

    table.players.splice(index, 1);
    if (table.players.length === 0) {
      delete pokerTables[message.channel.id];
      return message.channel.send("Everyone left. Poker table closed.");
    }

    return message.channel.send(`${message.author} left the table.`);
  }

  if (sub === 'cancel') {
    const table = pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table in this channel.");
    if (table.host !== message.author.id) return message.reply("Only the host can cancel the table.");

    delete pokerTables[message.channel.id];
    return message.channel.send(`Poker table cancelled by ${message.author}.`);
  }

  if (sub === 'start') {
    const table = pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table here.");
    if (table.host !== message.author.id) return message.reply("Only the host can start the game.");
    if (table.players.length < 2) return message.reply("Need at least 2 players to start.");

    table.started = true;

    const mentions = table.players.map(id => `<@${id}>`).join(', ');
    return message.channel.send(`🎲 Poker game started with: ${mentions}\n(Dealing cards coming soon...)`);
  }

  return message.channel.send(`Available poker commands:
\`${prefix}poker create\` – create a poker table
\`${prefix}poker join\` – join the table
\`${prefix}poker leave\` – leave the table
\`${prefix}poker cancel\` – cancel the table (host only)
\`${prefix}poker start\` – start the game (host only)
  `);
}

    // ================== HELP COMMAND ==================

    if (command === 'help') {
      return message.channel.send(`
**Moderation Commands:**
\`${prefix}ban @user\` – ban a user
\`${prefix}kick @user\` – kick a user
\`${prefix}delmsg [amount]\` – delete a specified amount of messages
\`${prefix}mute @user\` – mute a user
\`${prefix}unmute @user\` – unmute a user

**User Commands:**
\`${prefix}ping\` – pong.
\`${prefix}say [text]\` – make the bot say something
\`${prefix}8ball [question]\` – ask the magic 8ball
\`${prefix}cf\` – flip a coin
\`${prefix}roll\` – roll a number (1-100)
\`${prefix}slur @user\` – slur at someone
\`${prefix}cat\` – random cat pic
\`${prefix}bypass\` – chat bypasser for roblox
\`${prefix}phonebypass\` – bypasses for yggdrasil and payphone

**User Cash Commands:**
\`${prefix}daily\` – collect a daily 💰 reward (once every 24h)
\`${prefix}bal or balance\` – check how much 💰 cash you have
\`${prefix}coinflip heads/tails [amount]\` – bet coins on a 50/50 coinflip
\`${prefix}give @user [amount]\` – send cash to another user
\`${prefix}work\` – work every 30 minutes to earn cash
\`${prefix}slots [amount]\` – play slots and try your luck (6s cooldown)
\`${prefix}roulette [color] [amount]\` – bet coins on red/black (2x) or green (14x)
\`${prefix}poker\` – create or join a multiplayer poker room (type \`${prefix}poker\` to see options)

**Admin Cash Commands:**
\`${prefix}givemoney [@user] [amount]\` – give coins to yourself or another user (admin only)
\`${prefix}removemoney [@user] [amount]\` – remove coins from a user (admin only)

\`${prefix}help\` – Show this help message
      `);
    }
  }

  // ================== LINK BLOCKING ==================

  const normalized = normalize(message.content);

  if (
    normalized.includes('discordgg') ||
    normalized.includes('discordcominvite') ||
    normalized.includes('discordappcominvite')
  ) {
    try {
      await message.delete();
      await message.channel.send(`${message.author}, no one is here to see you promote your shitty server.`);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
    return;
  }

  if (normalized.includes('cdndiscord')) {
    try {
      await message.delete();
      await message.channel.send(`${message.author}, file links are not allowed.`);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
    return;
  }

  if (/https?:\/\//i.test(message.content)) {
    try {
      await message.delete();
      await message.channel.send(`${message.author}, no external links allowed.`);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
    return;
  }
});
if (process.env.TOKEN) {
  console.log('TOKEN length:', process.env.TOKEN.length);
} else {
  console.log('TOKEN is undefined!');
}
console.log('TOKEN:', process.env.TOKEN ? '[TOKEN EXISTS]' : '[NO TOKEN]');
client.login(process.env.TOKEN);
