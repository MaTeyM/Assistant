const { Command } = require('discord-akairo');

class InviteCommand extends Command {
    constructor() {
        super('invite', {
            aliases: ['invite', 'inv'],
            description: {
                content: 'Renvoie le lien d\'invitation du bot!',
                usage: '<commande>',
                examples: ['invite']
           },
           category: 'Bot - Commandes en lien avec le bot',
           userPermissions: ['SEND_MESSAGES'],
           clientPermissions: ['SEND_MESSAGES']
        });
    }

    exec(message) {
        message.reply('Le lien sera bientôt disponible ^^')
    };
};

module.exports = InviteCommand;