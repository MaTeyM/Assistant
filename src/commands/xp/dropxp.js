const { Command } = require("discord-akairo");

class dropXPCommand extends Command {
    constructor() {
        super('dropxp', {
            aliases: ['dropxp', 'drop', 'givexp'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Ajoute de l\'xp au premier membre à réagir au message', usage: 'droxp <xp>', examples: ['dropxp 100', 'dropxp'] },
            args: [{ id: 'xp', type: 'number' }],
            clientPermissions: 'MANAGE_GUILD',
            userPermissions: 'MANAGE_GUILD'
        });
    };

    async exec(message, { xp }) {
        let db = await this.client.guildDB.get(message.guild);
        if(db.xp_system.status === 'off') return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
        if(xp) {
            let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
            .setDescription(`Le premier à cliquer sur la réaction 🎁 receveras ${xp} points d'expérience!`)

            message.channel.send({ embeds: [embed] }).then(msg => {
                msg.react('🎁');
                let filter = (reaction, user) => reaction.emoji.name === '🎁' && user.id != message.author.id && user.id != this.client.user.id;
                let collector = msg.createReactionCollector({ filter, max: 2 });

                collector.on('collect', async(reaction, user) => {
                    msg.delete()
                    let member = message.guild.members.cache.get(user.id);
                    let memberData = await this.client.memberDB.get(member, message.guild);
                    let memberXP = memberData.xp.xp;

                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription(`${member} a gagner les ${xp} points d'expérience! Bravo à lui :)`)

                    await this.client.memberDB.update(member, message.guild, { 'xp.xp': memberXP+xp });

                    return message.reply({ embeds: [embed] });
                });
            });
        }
    };
};

module.exports = dropXPCommand;