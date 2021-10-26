const { Listener } = require('discord-akairo');

class commandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished'
        });
    }

    async exec(message, command, args) {
        let db = await this.client.guildDB.get(message.guild)
        let delete_command = db.delete_command;
        if(delete_command) message.delete();
    };
};

module.exports = commandFinishedListener;