const { Command } = require('discord-akairo');

class startCommand extends Command {
    constructor() {
        super('start', {
            aliases: ['start'],
            description: {
                content: 'Start le bot!',
                usage: '<commande>',
                examples: ['start']
           },
           ownerOnly: true,
           category: 'dev',
        });
    }

    exec(message) {
        require('child_process').execSync('pm2 start 0');
    };
};

module.exports = startCommand;