const { Command } = require("discord-akairo");

class rankCommand extends Command {
    constructor() {
        super('rank', {
            aliases: ['rank', 'xp', 'level'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Afficher le niveau et l\'xp d\'un utilisateur', usage: 'rank <utilisateur>', examples: ['rank', 'rank Kyoo'] },
            userPermissions: 'SEND_MESSAGES',
            clientPermissions: 'SEND_MESSAGES',
            args: [{ id: 'member', type: 'member' }]
        });
    };

    async exec(message, { member }) {
        let db = await this.client.guildDB.get(message.guild);
        if(db.xp_system.status === 'off') return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
        if(!member) member = message.guild.members.cache.get(message.author.id);

        let memberData = await this.client.memberDB.get(member, message.guild);

        let xp = memberData.xp.xp;
        let level = memberData.xp.level;
        let xpNeeded = (level * level * 100) - xp;

        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
        .setDescription(`*Informations de ${member}*`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField('Niveau:', `${'```'}${level}${'```'}`, true)
        .addField('XP:', `${'```'}${xp}${'```'}`, true)
        .addField('XP Restant:', `${'```'}${xpNeeded}${'```'}`, true)

        return message.reply({ embeds: [embed] });
    };
};

module.exports = rankCommand;