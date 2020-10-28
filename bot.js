const tmi = require('tmi.js');
require('dotenv').config();

const options = {
    identity: {
        username: 'NThreeBot',
        password: process.env.PASSWORD
    },
    channels: [
        'patrickauri'
    ]
}

const client = new tmi.client(options);

const onMessageHandler = (target, context, msg, self) => {
    if (self) { return; }

    const commandName = msg.trim();

    if (commandName === '!test') {
        client.say(target, 'This is working!');
    }
    else {
        console.log(msg);
    }
}

const onConnectedHandler = (addr, port) => {
    console.log(`Connected to ${addr}:${port}`);
}


client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();