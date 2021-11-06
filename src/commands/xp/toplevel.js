const { Command } = require("discord-akairo");

class toplevelCommand extends Command {
    constructor() {
        super('toplevel', {
            aliases: ['toplevel', 'topxp', 'leaderboardxp'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Afficher le classement du serveur', usage: 'toplevel', examples: ['toplevel'] },
            userPermissions: 'SEND_MESSAGES',
            clientPermissions: 'SEND_MESSAGES'
        });
    };

    async exec(message) {
        let db = await this.client.guildDB.get(message.guild);
        if(db.xp_system.status === 'off') return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
        .setTitle(`Niveaux du serveur ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL())

        await this.client.memberDB.getAllMembers(message.guild).then(p => {
            p.sort((a, b) => (a.xp < b.xp) ? 1 : -1).splice(0, 10).forEach(e => {
                let member = message.guild.members.cache.get(e.id);nod
                let username = member.displayName;
                embed.addField(username, `Niveau ${e.xp.level} \`(${e.xp.xp}xp)\``)
            });
        });

        return message.reply({ embeds: [embed] });
    };
};

module.exports = toplevelCommand;