const { Command } = require('discord-akairo');

class RestartCommand extends Command {
    constructor() {
        super('restart', {
            aliases: ['restart', 'rs', 'reload'],
            description: {
                content: 'Restart le bot!',
                usage: '<commande>',
                examples: ['rs']
           },
           ownerOnly: true,
           category: 'dev',
        });
    }

    exec(message) {
        require('child_process').execSync('pm2 restart 0');
    };
};

module.exports = RestartCommand;