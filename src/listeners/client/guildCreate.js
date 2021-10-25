const { Listener } = require('discord-akairo');
const { Guild } = require('../../structures/MODELS');

class GuildCreateListener extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
        await Guild.create({ id: guild.id }, err => {
            if(err) return console.log(err)
        }) 
    };
};

module.exports = GuildCreateListener;