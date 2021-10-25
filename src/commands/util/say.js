const { Command } = require('discord-akairo');

class SayCommand extends Command {
    constructor() {
        super('say', {
            aliases: ['say'],
            description: {
                content: 'Parler via le bot!',
                usage: '<command> <text>',
                examples: ['say Salut!']
           },
           category: 'Utilitaires - Commandes utiles',
           userPermissions: ['SEND_MESSAGES'],
           clientPermissions: ['SEND_MESSAGES'],
           args: [
               {
                   id: 'text', match: 'content'
               }
           ]
        });
    }

    exec(message, { text }) {
        message.delete()
        message.channel.send(text)
    };
};

module.exports = SayCommand;