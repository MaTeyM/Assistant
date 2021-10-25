const { Command } = require('discord-akairo');

class testCommand extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            description: {
                content: 'test command!',
                usage: '<command> <text>',
                examples: ['test']
           },
           category: 'Utilitaires - Commandes utiles',
           userPermissions: ['SEND_MESSAGES'],
           clientPermissions: ['SEND_MESSAGES']
        });
    }

    exec(message) {
        message.reply('Envoie moi un message et je vais m\'en souvenir :)')

        let filter = m => m.author.id === message.author.id;
        let collector = message.channel.createMessageCollector({filter, time: 60000, max: 1 });

        collector.on('collect', m => {
            if(m.content === 'cancel') return m.delete() && message.channel.send('Commande annulée!');
            m.reply(m.content)
        });
    };
};

module.exports = testCommand;