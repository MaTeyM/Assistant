const { Command } = require('discord-akairo');

class stopCommand extends Command {
    constructor() {
        super('stop', {
            aliases: ['stop'],
            description: {
                content: 'stop le bot!',
                usage: '<commande>',
                examples: ['stop']
           },
           ownerOnly: true,
           category: 'dev',
        });
    }

    exec(message) {
        require('child_process').execSync('pm2 stop 0');
    };
};

module.exports = stopCommand;