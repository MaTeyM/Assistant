const { Listener } = require('discord-akairo');
const { Member } = require('../../structures/MODELS');

class guildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    async exec(member) {
        await Member.create({ id: member.id, guildID: member.guild.id }, err => {
            if(err) return console.log(err)
        }) 
    };
};

module.exports = guildMemberAddListener;