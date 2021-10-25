const { Command } = require('discord-akairo');

class SupportCommand extends Command {
    constructor() {
        super('support', {
            aliases: ['support'],
            description: {
                content: 'Renvoie le lien du support!',
                usage: '<command>',
                examples: ['support']
           },
           category: 'Bot - Commandes en lien avec le bot',
           userPermissions: ['SEND_MESSAGES'],
           clientPermissions: ['SEND_MESSAGES']
        });
    }

    exec(message) {
        message.reply('https://discord.gg/D4mxChFjQu')
    };
};

module.exports = SupportCommand;