const { Command } = require("discord-akairo");

class dropXPCommand extends Command {
    constructor() {
        super('dropxp', {
            aliases: ['dropxp', 'drop', 'givexp'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Ajoute de l\'xp au premier membre à réagir au message', usage: 'droxp <xp>', examples: ['dropxp 100', 'dropxp'] },
            args: [{ id: 'xp', type: 'number' }],
            clientPermissions: 'MANAGE_ROLES',
            userPermissions: 'MANAGE_ROLES'
        });
    };

    async exec(message, { xp }) {
        let db = await this.client.guildDB.get(message.guild);
        if(db.xp_system === false) return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
        if(xp) {
            let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
            .setDescription(`Le premier à cliquer sur la réaction 🎁 receveras ${xp} points d'expérience!`)

            message.channel.send({ embeds: [embed] }).then(msg => {
                msg.react('🎁');
                let filter = (reaction, user) => reaction.emoji.name === '🎁' && user.id !== message.author.id;
                let collector = msg.createReactionCollector({ filter, max: 1});

                collector.on('collect', async(reaction, user) => {
                    let member = message.guild.members.cache.get(user.id);
                    let memberXP = await this.client.memberDB.get(member, message.guild).xp;

                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription(`${member} a gagner les ${xp} points d'expérience! Bravo à lui :)`)

                    await this.client.memberDB.update(member, message.guild, { xp: memberXP+xp });

                    return message.reply({ embeds: [embed] });
                });
            });
        }
    };
};

module.exports = dropXPCommand;