const tmi = require('tmi.js');
const cron = require('node-cron');
const mysql = require('mysql');

require('dotenv').config();

let viewers = [];

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    timeout: 60000
});

const options = {
    identity: {
        username: 'N3Bot',
        password: process.env.PASSWORD
    },
    channels: [
        'patrickauri'
    ]
}

const isMod = (context) => {
    if (context.badges)
    {
        return (context.badges.broadcaster == 1 || context.mod);
    }
    else{
        return context.mod;
    }
}

const client = new tmi.client(options);

const onMessageHandler = (target, context, msg, self) => {
    if (self) { return; }

    const commandName = msg.trim();

    switch (commandName)
    {
        case '!test':
            client.say(target, 'This is working!');
            break;
        case '!viewers':
            client.say(target, JSON.stringify(viewers));
    }
}

const giveFreeKroner = () => {

}

const currencyUpdateHandler = () => {

}

cron.schedule('* * * * *', () => {
    console.log('Timer update');
    giveFreeKroner();
})

const onConnectedHandler = (addr, port) => {
    console.log(`Connected to ${addr}:${port}`);

    dbConnection.connect((err) => {
        if (err) throw err;
        console.log('Connected to database');
    });
    client.color('blueviolet').then(() => {
        //console.log('Color changed.');
    }).catch((e) => {
        console.error(e);
    });

}

const onJoinHandler = (channel, username, self) => {
    viewers.push(username);
    console.log(JSON.stringify(viewers));
}

const onPartHandler = (channel, username, self) => {
    viewers.splice(viewers.findIndex(username), 1);
    console.log(`${username} left the channel`);
}

const onActionHandler = (channel, userstate, message, self) => {
    console.log(channel);
};

const onRoomstateHandler = (channel, state) => {
    console.log(state);
}

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('join', onJoinHandler);
client.on('part', onPartHandler);
client.on('action', onActionHandler);
client.on('roomstate', onRoomstateHandler);
client.connect();