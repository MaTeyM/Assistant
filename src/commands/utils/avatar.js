const { Command } = require("discord-akairo");

class avatarCommand extends Command {
    constructor() {
        super('avatar', {
            aliases: ['avatar', 'pdp', 'pp', 'pfp'],
            description: { content: 'Afficher la photo de profil d\'un utilisateur', usage: 'avatar <user>', examples: ['avatar Kyoo', 'pdp'] },
            category: 'Utilitaires - Commandes utiles pour le serveur',
            clientPermissions: 'SEND_MESSAGES',
            userPermissions: 'SEND_MESSAGES',
            args: [{ id: 'user', type: 'user' }]
        });
    };

    exec(message, { user }) {
        if(!user) user = message.author;

        let sizeone = `${user.displayAvatarURL({ dynamic: true, size: 128 })}`;
        let sizetwo = `${user.displayAvatarURL({ dynamic: true, size: 256 })}`;
        let sizethree = `${user.displayAvatarURL({ dynamic: true, size: 512 })}`;
        let sizefour = `${user.displayAvatarURL({ dynamic: true, size: 1024 })}`;
        let sizefive = `${user.displayAvatarURL({ dynamic: true, size: 2048 })}`;

        let embed = this.client.functions.embed('Utilitaires - Commandes utiles pour le serveur')
        .setDescription(`[[128]](${sizeone}) [[256]](${sizetwo}) [512] [[1024]](${sizefour}) [[2048]](${sizefive})`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))

        return message.reply({ embeds: [embed] });
    };
};

module.exports = avatarCommand;