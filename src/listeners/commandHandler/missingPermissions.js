const { Listener } = require('discord-akairo');

class missingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
    }

    async exec(message, command, type, missing) {
        if(type == 'client') {
            return await message.reply(`*\`\`\`/!\\ Il me faut l${missing.length > 1 ? 'es' : 'a'} permission${missing.length > 1 ? 's' : ''} ${missing} pour effectuer cette commande! /!\\\`\`\`*`)
        } else {
            return await message.reply(`*\`\`\`/!\\ Il te faut l${missing.length > 1 ? 'es' : 'a'} permission${missing.length > 1 ? 's' : ''} ${missing} pour effectuer cette commande! /!\\\`\`\`*`)
        };
    };
};

module.exports = missingPermissionsListener;