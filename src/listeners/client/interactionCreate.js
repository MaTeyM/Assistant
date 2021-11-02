const { Listener } = require('discord-akairo');
const { Member } = require('../../structures/MODELS');

class interactionListener extends Listener {
    constructor() {
        super('interactionCreate', {
            emitter: 'client',
            event: 'interactionCreate'
        });
    }

    async exec(interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    };
};

module.exports = interactionListener;