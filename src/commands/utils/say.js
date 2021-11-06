const { Command } = require("discord-akairo");

class sayCommand extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 'dire', 'parler'],
            description: { content: 'Parler via le bot', usage: 'say <text>', examples: ['say Salut'] },
            category: 'Utilitaires - Commandes utiles pour le serveur',
            userPermissions: 'SEND_MESSAGES',
            clientPermissions: 'SEND_MESSAGES',
            args: [{ id: 'text', type: 'string', match: 'content'}]
        });
    };

    exec(message, { text }) {
        message.delete() && message.channel.send(text);
    };
};

module.exports = sayCommand;