const { Command } = require("discord-akairo");

class automodCommand extends Command {
    constructor() {
        super('automod', {
            aliases: ['automod', 'mod'],
            description: { content: 'Configurer la modération automatique', usage: 'automod', examples: ['automod']},
            category: 'Modération - Sécurtié du serveur',
            userPermissions: 'MANAGE_GUILD',
            clientPermissions: 'MANAGE_GUILD'
        });
    };

    async exec(message) {
        let guildData = await this.client.guildDB.get(message.guild);
        let automod_system_status = guildData.mod.automod.status;
        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
        .setDescription('**Que voulez-vous faire ?**\n```on -> activer le système de modération automatique\noff -> désactiver le système de modération automatique```\nTapez `cancel` pour annuler la commande')

        message.reply({ embeds: [embed] }).then(firstMSG => {
            let filter = m => m.author.id === message.author.id;
            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                firstMSG.delete() && m.delete();
                if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')
                if(m.content == 'on') {
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription('Le système de modération automatique est désormais activer sur le serveur :)')

                    if(automod_system_status === 'on') return message.reply('```/!\\ Le système de modération automatique est déjà activé sur ce serveur /!\\```')
                    await this.client.guildDB.update(message.guild, { 'mod.automod.status': 'on' });

                    return message.reply({ embeds: [embed] });
                } else if(m.content == 'off') {
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription('Le système de modération automatique est désormais désactiver sur le serveur :)')

                    if(automod_system_status === 'off') return message.reply('```/!\\ Le système de modération automatique n\'est pas activé sur ce serveur /!\\```')
                    await this.client.guildDB.update(message.guild, { 'mod.automod.status': 'off' });

                    return message.reply({ embeds: [embed] });
                }
            });
        });
    };
};

module.exports = automodCommand;