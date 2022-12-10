const http = require('http');

const shardsnap = require('shardsnap');
const eris = require('eris');

const config = {
  alias: process.env.PROJECT_DOMAIN,
  token: process.env.DISCORD_TOKEN,
  intents: eris.Constants.Intents.guildMessages | eris.Constants.Intents.directMessages,
  criteria: {
    // corresponds to what we declared in the intents, but further filters out messages like
    // READY, CHANNEL_CREATE, and MESSAGE_UPDATE
    t: 'MESSAGE_CREATE',
    // ignore messages from self and other bots
    $not: {'d.author.bot': true},
    $or: [
      // DMs
      {'d.guild_id': {$exists: false}},
      // mentions
      {'d.mentions': {$elemMatch: {id: process.env.BOT_USER_ID}}},
      // prefix
      {'d.content': {$regex: '^!'}},
    ],
  },
  dst: 'wss://' + process.env.PROJECT_DOMAIN + '.glitch.me/shardsnap/v1/any',
  clientSecret: process.env.SHARDSNAP_SECRET,
  endpoint: 'https://ocdcc.wh00.ml',
};

//
// web service
//

const server = http.createServer((req, res) => {
  res.end(`<a href="https://discord.com/api/oauth2/authorize?client_id=${process.env.BOT_USER_ID}&scope=bot&permissions=0">invite</a>`);
});

//
// bot
//

function logReject(p) {
  p.catch((e) => {
    console.error(e);
  });
}

// we're using Eris in this example. configure it not to connect to the gateway. we'll be receiving
// events from shardsnap in this setup. we won't have the gateway to tell us that this token is
// a bot, so we need to add that `Bot ` prefix explicitly
const bot = new eris.Client('Bot ' + config.token, {restMode: true});
bot.on('debug', (message, id) => {
  console.log('bot debug', message, id);
});
bot.on('warn', (message, id) => {
  console.warn('bot warn', message, id);
});
bot.on('error', (err, id) => {
  console.error('bot error', err, id);
});

const client = new shardsnap.Client(config.alias, config.clientSecret, {
  path: '/shardsnap/v1/any',
  server,
});
client.on('dispatch', (packet) => {
  if (packet.d.content.startsWith('!ping')) {
    logReject(bot.createMessage(packet.d.channel_id, {
      content: 'pong',
      messageReference: {messageID: packet.d.id},
    }));
    return;
  }

  console.log('unmatched command');
});

//
// start
//

server.listen(process.env.PORT, () => {
  console.log('listening', process.env.PORT);
  shardsnap.register(config).then(() => {
    console.log('register ok');
  }).catch((e) => {
    console.error('register failed', e);
  });
});
