require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');

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

const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Simple hand rank evaluation function (very basic, can be improved)
function evaluateHand(cards) {
  // For simplicity, return highest rank number for now
  const rankOrder = ranks.reduce((obj, r, i) => { obj[r] = i; return obj; }, {});
  let values = cards.map(c => rankOrder[c.slice(0, -1)]).sort((a, b) => b - a);
  return values[0]; // highest card value as score (simplify)
}

// Function to shuffle deck
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

if (!global.pokerTables) global.pokerTables = {};

if (command === 'poker') {
  const sub = args[0]?.toLowerCase();

  // Setup poker table
  if (sub === 'create') {
    if (global.pokerTables[message.channel.id]) {
      return message.reply("A poker table already exists in this channel.");
    }

    global.pokerTables[message.channel.id] = {
      host: message.author.id,
      players: [message.author.id],
      started: false,
      deck: [],
      pot: 0,
      bets: {},
      folded: new Set(),
      communityCards: [],
      currentBet: 0,
      currentPlayerIndex: 0,
      round: 'pre-flop',
      hands: {}
    };

    return message.channel.send(`🃏 ${message.author} created a poker table! Type \`${prefix}poker join\` to join.`);
  }

  // Join poker table
  if (sub === 'join') {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table exists. Use `.poker create` first.");
    if (table.started) return message.reply("The game has already started.");
    if (table.players.includes(message.author.id)) return message.reply("You're already at the table.");

    table.players.push(message.author.id);
    return message.channel.send(`${message.author} joined the poker table. Players: ${table.players.length}`);
  }

  // Leave poker table
  if (sub === 'leave') {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table in this channel.");

    const idx = table.players.indexOf(message.author.id);
    if (idx === -1) return message.reply("You're not at the table.");

    table.players.splice(idx, 1);
    table.folded.delete(message.author.id);
    delete table.bets[message.author.id];
    delete table.hands[message.author.id];

    if (table.players.length === 0) {
      delete global.pokerTables[message.channel.id];
      return message.channel.send("Everyone left. Poker table closed.");
    }

    return message.channel.send(`${message.author} left the table.`);
  }

  // Cancel poker table
  if (sub === 'cancel') {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table in this channel.");
    if (table.host !== message.author.id) return message.reply("Only the host can cancel the table.");

    delete global.pokerTables[message.channel.id];
    return message.channel.send(`Poker table cancelled by ${message.author}.`);
  }

  // Helper: advance to next player who has not folded
  function advancePlayer(table) {
    do {
      table.currentPlayerIndex = (table.currentPlayerIndex + 1) % table.players.length;
    } while (table.folded.has(table.players[table.currentPlayerIndex]));
  }

  // Helper: deal community cards according to round
  function dealCommunity(table) {
    if (table.round === 'flop') {
      table.communityCards.push(table.deck.pop(), table.deck.pop(), table.deck.pop());
    } else if (table.round === 'turn' || table.round === 'river') {
      table.communityCards.push(table.deck.pop());
    }
  }

  // Helper: check if betting round is over
  function bettingRoundOver(table) {
    // All players have matched current bet or folded
    for (const p of table.players) {
      if (table.folded.has(p)) continue;
      if ((table.bets[p] || 0) < table.currentBet) return false;
    }
    return true;
  }

  // Start poker game
  if (sub === 'start') {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table here.");
    if (table.host !== message.author.id) return message.reply("Only the host can start the game.");
    if (table.players.length < 2) return message.reply("Need at least 2 players to start.");

    if (table.started) return message.reply("Game already started.");

    table.started = true;
    table.deck = [];
    table.pot = 0;
    table.bets = {};
    table.folded = new Set();
    table.communityCards = [];
    table.currentBet = 0;
    table.currentPlayerIndex = 0;
    table.round = 'pre-flop';
    table.hands = {};

    // Build and shuffle deck
    for (const suit of suits) {
      for (const rank of ranks) {
        table.deck.push(rank + suit);
      }
    }
    shuffle(table.deck);

    // Deal two cards to each player
    for (const playerId of table.players) {
      table.hands[playerId] = [table.deck.pop(), table.deck.pop()];
    }

    // DM hole cards to each player
    for (const playerId of table.players) {
      const user = await client.users.fetch(playerId);
      const hand = table.hands[playerId];
      try {
        await user.send(`🃏 Your poker hand: ${hand.join(' ')}`);
      } catch {
        message.channel.send(`<@${playerId}>, I couldn't DM you your cards. Please enable DMs from server members.`);
      }
    }

    const mentions = table.players.map(id => `<@${id}>`).join(', ');

    return message.channel.send(`🎲 Poker game started with: ${mentions}\nIt's <@${table.players[table.currentPlayerIndex]}>'s turn to act.\nType \`${prefix}poker bet [amount]\`, \`${prefix}poker check\`, or \`${prefix}poker fold\`.`);
  }

  // Player actions during game
  if (['bet', 'raise', 'call', 'check', 'fold'].includes(sub)) {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker game in progress here.");
    if (!table.started) return message.reply("The game hasn't started yet.");

    const playerId = message.author.id;
    if (table.players[table.currentPlayerIndex] !== playerId) {
      return message.reply("It's not your turn.");
    }
    if (table.folded.has(playerId)) {
      return message.reply("You have already folded.");
    }

    const user = getUser(playerId);
    const minBet = table.currentBet;

    if (sub === 'fold') {
      table.folded.add(playerId);
      message.channel.send(`<@${playerId}> folds.`);

      // If only one player left, they win pot
      const activePlayers = table.players.filter(p => !table.folded.has(p));
      if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        user.cash += table.pot;
        saveDB();

        delete global.pokerTables[message.channel.id];
        return message.channel.send(`🏆 <@${winner}> wins the pot of 💰 **${table.pot} coins** by default (everyone else folded)!`);
      }

      // Advance to next player
      advancePlayer(table);
      return message.channel.send(`It's now <@${table.players[table.currentPlayerIndex]}>'s turn.`);
    }

    if (sub === 'check') {
      if ((table.bets[playerId] || 0) < table.currentBet) {
        return message.reply("You must call or raise to match the current bet.");
      }
      message.channel.send(`<@${playerId}> checks.`);

      // Advance turn, check if betting round over
      advancePlayer(table);
      if (bettingRoundOver(table)) {
        // Move to next round
        if (table.round === 'pre-flop') table.round = 'flop';
        else if (table.round === 'flop') table.round = 'turn';
        else if (table.round === 'turn') table.round = 'river';
        else if (table.round === 'river') {
          // Showdown
          const community = table.communityCards;
          let bestScore = -1;
          let winnerId = null;

          // For each active player, evaluate hand + community
          for (const p of table.players) {
            if (table.folded.has(p)) continue;
            const cards = [...table.hands[p], ...community];
            const score = evaluateHand(cards);
            if (score > bestScore) {
              bestScore = score;
              winnerId = p;
            }
          }

          const winnerUser = await client.users.fetch(winnerId);
          winnerUser ? message.channel.send(`🏆 <@${winnerId}> wins with the best hand! 💰 **${table.pot} coins**`) : null;
          const winnerUserDB = getUser(winnerId);
          winnerUserDB.cash += table.pot;
          saveDB();

          delete global.pokerTables[message.channel.id];
          return;
        } else {
          dealCommunity(table);
          message.channel.send(`📢 Round is now **${table.round}**. Community cards: ${table.communityCards.join(' ')}`);
        }
        // Reset bets for new round
        table.currentBet = 0;
        table.bets = {};
      }

      return message.channel.send(`It's now <@${table.players[table.currentPlayerIndex]}>'s turn.`);
    }

    if (sub === 'call') {
      const playerBet = table.bets[playerId] || 0;
      const toCall = table.currentBet - playerBet;

      if (toCall <= 0) {
        return message.reply("There's nothing to call. You can check or bet.");
      }
      if (user.cash < toCall) return message.reply("You don't have enough coins to call.");

      user.cash -= toCall;
      table.pot += toCall;
      table.bets[playerId] = table.currentBet;
      saveDB();

      message.channel.send(`<@${playerId}> calls 💰 **${toCall} coins**.`);

      // Advance turn, check if betting round over
      advancePlayer(table);
      if (bettingRoundOver(table)) {
        // Move to next round (same logic as check)
        if (table.round === 'pre-flop') table.round = 'flop';
        else if (table.round === 'flop') table.round = 'turn';
        else if (table.round === 'turn') table.round = 'river';
        else if (table.round === 'river') {
          // Showdown
          const community = table.communityCards;
          let bestScore = -1;
          let winnerId = null;

          for (const p of table.players) {
            if (table.folded.has(p)) continue;
            const cards = [...table.hands[p], ...community];
            const score = evaluateHand(cards);
            if (score > bestScore) {
              bestScore = score;
              winnerId = p;
            }
          }

          const winnerUser = await client.users.fetch(winnerId);
          winnerUser ? message.channel.send(`🏆 <@${winnerId}> wins with the best hand! 💰 **${table.pot} coins**`) : null;
          const winnerUserDB = getUser(winnerId);
          winnerUserDB.cash += table.pot;
          saveDB();

          delete global.pokerTables[message.channel.id];
          return;
        } else {
          dealCommunity(table);
          message.channel.send(`📢 Round is now **${table.round}**. Community cards: ${table.communityCards.join(' ')}`);
        }
        table.currentBet = 0;
        table.bets = {};
      }

      return message.channel.send(`It's now <@${table.players[table.currentPlayerIndex]}>'s turn.`);
    }

    if (sub === 'bet' || sub === 'raise') {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
        return message.reply("Please specify a valid bet amount.");
      }
      const user = getUser(playerId);
      const playerBet = table.bets[playerId] || 0;
      const toCall = table.currentBet - playerBet;

      if (amount < toCall) {
        return message.reply(`Your bet must be at least ${toCall} coins to call or raise.`);
      }
      if (user.cash < amount) return message.reply("You don't have enough coins for that bet.");

      // Deduct amount, add to pot, update currentBet
      user.cash -= amount;
      table.pot += amount;
      table.bets[playerId] = (table.bets[playerId] || 0) + amount;
      if (amount > table.currentBet) table.currentBet = amount;
      saveDB();

      message.channel.send(`<@${playerId}> ${sub === 'bet' ? 'bets' : 'raises'} 💰 **${amount} coins**.`);

      // Advance turn
      advancePlayer(table);

      return message.channel.send(`It's now <@${table.players[table.currentPlayerIndex]}>'s turn.`);
    }
  }

  // Show poker table status
  if (!sub || sub === 'status') {
    const table = global.pokerTables[message.channel.id];
    if (!table) return message.reply("No poker table in this channel.");

    const playersList = table.players.map((id, i) => {
      const folded = table.folded.has(id) ? ' (folded)' : '';
      const current = table.currentPlayerIndex === i ? ' <-- current turn' : '';
      return `<@${id}>${folded}${current}`;
    }).join('\n');

    return message.channel.send(`🃏 Poker Table Status:
Players:
${playersList}
Pot: 💰 **${table.pot} coins**
Community Cards: ${table.communityCards.join(' ') || 'None'}
Current Round: ${table.round}
Current Bet: 💰 **${table.currentBet} coins**
Type \`${prefix}poker [bet|raise|call|check|fold] [amount]\` to play.`);
  }

  // Help message
  return message.channel.send(`Poker commands:
\`${prefix}poker create\ – create a poker table
\`${prefix}poker join\ – join the table
\`${prefix}poker leave\ – leave the table
\`${prefix}poker cancel\ – cancel the table (host only)
\`${prefix}poker start\ – start the game (host only)
\`${prefix}poker status\ – show current game status
\`${prefix}poker bet [amount]\ – bet coins
\`${prefix}poker raise [amount]\ – raise the bet
\`${prefix}poker call\ – call the current bet
\`${prefix}poker check\ – check (if no bet)
\`${prefix}poker fold\ – fold your hand
  `);
}

    if (!global.rrRooms) global.rrRooms = {};

if (command === 'rr') {
  const sub = args[0]?.toLowerCase();

  // Create room
  if (sub === 'create') {
    if (global.rrRooms[message.channel.id]) {
      return message.reply('A Russian Roulette room already exists in this channel.');
    }
    global.rrRooms[message.channel.id] = {
      host: message.author.id,
      players: [message.author.id],
      started: false,
      bulletChamber: Math.floor(Math.random() * 6) + 1, // 1 to 6
      currentChamber: 1,
      currentTurn: 0
    };
    return message.channel.send(`🔫 ${message.author} created a Russian Roulette room! Type \`${prefix}rr join\` to join. Max 6 players.`);
  }

  // Join room
  if (sub === 'join') {
    const room = global.rrRooms[message.channel.id];
    if (!room) return message.reply('No Russian Roulette room exists here. Use `.rr create` first.');
    if (room.started) return message.reply('The game has already started.');
    if (room.players.includes(message.author.id)) return message.reply('You are already in the room.');
    if (room.players.length >= 6) return message.reply('Room is full (max 6 players).');

    room.players.push(message.author.id);
    return message.channel.send(`${message.author} joined the Russian Roulette room. Players: ${room.players.length}`);
  }

  // Leave room
  if (sub === 'leave') {
    const room = global.rrRooms[message.channel.id];
    if (!room) return message.reply('No Russian Roulette room exists here.');

    const idx = room.players.indexOf(message.author.id);
    if (idx === -1) return message.reply('You are not in the room.');

    room.players.splice(idx, 1);

    if (room.players.length === 0) {
      delete global.rrRooms[message.channel.id];
      return message.channel.send('Everyone left. Russian Roulette room closed.');
    }

    // If host left, assign new host
    if (room.host === message.author.id) {
      room.host = room.players[0];
      message.channel.send(`Host left. New host is <@${room.host}>.`);
    }

    return message.channel.send(`${message.author} left the Russian Roulette room.`);
  }

  // Cancel room (host only)
  if (sub === 'cancel') {
    const room = global.rrRooms[message.channel.id];
    if (!room) return message.reply('No Russian Roulette room exists here.');
    if (room.host !== message.author.id) return message.reply('Only the host can cancel the room.');

    delete global.rrRooms[message.channel.id];
    return message.channel.send(`Russian Roulette room cancelled by ${message.author}.`);
  }

  // Start game (host only)
  if (sub === 'start') {
    const room = global.rrRooms[message.channel.id];
    if (!room) return message.reply('No Russian Roulette room exists here.');
    if (room.host !== message.author.id) return message.reply('Only the host can start the game.');
    if (room.players.length < 2) return message.reply('Need at least 2 players to start.');

    room.started = true;
    room.bulletChamber = Math.floor(Math.random() * 6) + 1;
    room.currentChamber = 1;
    room.currentTurn = 0;

    message.channel.send(`🔫 Russian Roulette game started with players: ${room.players.map(id => `<@${id}>`).join(', ')}.\nIt's <@${room.players[0]}>'s turn! Type \`${prefix}rr pull\` to pull the trigger.`);

    return;
  }

  // Pull trigger
  if (sub === 'pull') {
    const room = global.rrRooms[message.channel.id];
    if (!room || !room.started) return message.reply('No ongoing Russian Roulette game in this channel.');

    if (room.players[room.currentTurn] !== message.author.id) return message.reply("It's not your turn!");

    const chamber = room.currentChamber;
    const bullet = room.bulletChamber;

    if (chamber === bullet) {
      // Player "dies"
      const deadPlayer = message.author;
      room.players.splice(room.currentTurn, 1);
      room.currentChamber = 1; // reset chamber after each shot
      room.bulletChamber = Math.floor(Math.random() * 6) + 1; // new bullet position

      message.channel.send(`💥 Bang! <@${deadPlayer.id}> has been eliminated!`);

      // Check if only one player remains
      if (room.players.length === 1) {
        message.channel.send(`🏆 <@${room.players[0]}> is the last survivor and wins Russian Roulette!`);
        delete global.rrRooms[message.channel.id];
        return;
      }

      // Adjust currentTurn because array got smaller
      if (room.currentTurn >= room.players.length) room.currentTurn = 0;

      message.channel.send(`Next turn: <@${room.players[room.currentTurn]}>. Type \`${prefix}rr pull\` to pull the trigger.`);

      return;
    } else {
      // Player survives
      message.channel.send(`🔫 Click. <@${message.author.id}> survived this round.`);

      // Advance turn and chamber
      room.currentTurn = (room.currentTurn + 1) % room.players.length;
      room.currentChamber = chamber === 6 ? 1 : chamber + 1;

      message.channel.send(`Next turn: <@${room.players[room.currentTurn]}>. Type \`${prefix}rr pull\` to pull the trigger.`);

      return;
    }
  }

  // If no subcommand matched, show usage
  return message.channel.send(`Russian Roulette commands:
\`${prefix}rr create\` – create a room (max 6 players)
\`${prefix}rr join\` – join the room
\`${prefix}rr leave\` – leave the room
\`${prefix}rr cancel\` – cancel the room (host only)
\`${prefix}rr start\` – start the game (host only, min 2 players)
\`${prefix}rr pull\` – pull the trigger on your turn
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

**Admin Cash Commands:**
\`${prefix}givemoney [@user] [amount]\` – give coins to yourself or another user (admin only)
\`${prefix}removemoney [@user] [amount]\` – remove coins from a user (admin only)

**Poker Commands:**

\`${prefix}poker create\` – create a poker table
\`${prefix}poker join\` – join the table
\`${prefix}poker leave\` – leave the table
\`${prefix}poker cancel\` – cancel the table (host only)
\`${prefix}poker start\` – start the game (host only)
\`${prefix}poker status\` – show current game status
\`${prefix}poker bet [amount]\` – bet coins
\`${prefix}poker raise [amount]\` – raise the bet
\`${prefix}poker call\` – call the current bet
\`${prefix}poker check\` – check (if no bet)
\`${prefix}poker fold\` – fold your hand

**Russian Roulette Commands:**

\`${prefix}rr create\` – create a room (max 6 players)
\`${prefix}rr join\` – join the room
\`${prefix}rr leave\` – leave the room
\`${prefix}rr cancel\` – cancel the room (host only)
\`${prefix}rr start\` – start the game (host only, min 2 players)
\`${prefix}rr pull\` – pull the trigger on your turn

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
