const { Command } = require('discord-akairo');

class logsCommand extends Command {
    constructor() {
        super('logs', {
            aliases: ['logs'],
            description: {
                content: 'Logs du le bot!',
                usage: '<commande>',
                examples: ['logs']
           },
           ownerOnly: true,
           category: 'dev',
        });
    }

    exec(message) {
        require('child_process').execSync('pm2 logs 0');
    };
};

module.exports = logsCommand;