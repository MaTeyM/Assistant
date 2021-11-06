const { Command } = require("discord-akairo");

class modLogsCommand extends Command {
    constructor() {
        super('modlogs', {
            aliases: ['modlogs', 'adminlogs', 'configlogs'],
            category: 'Bot - Commandes en lien avec le bot',
            description: { content: 'Configurer les logs de modération', usage: 'modlogs', examples: ['modlogs']},
            userPermissions: 'MANAGE_GUILD',
            clientPermissions: 'MANAGE_GUILD'
        });
    };

    async exec(message) {
        let guildData = await this.client.guildDB.get(message.guild);
        let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
        .setDescription('**Que voulez-vous faire ?**\n```on -> activer les logs de modération\noff -> désactiver les logs de modération\nconfig -> configurer le salon des logs de modération```\nTapez `cancel` pour annuler la commande')

        message.reply({ embeds: [embed] }).then(firstMSG => {
            let filter = m => m.author.id === message.author.id;
            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                firstMSG.delete() && m.delete();
                if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')
                if(m.content == 'on') {
                    if(guildData.logs.modlogs_status === 'on') return message.reply('```/!\\ Les logs de modération sont déjà activés /!\\```')
                    let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
                    .setDescription('Les logs de modération ont étés activés!')

                    await this.client.guildDB.update(message.guild, { 'logs.modlogs_status': 'on' });
                    return message.reply({ embeds: [embed] });
                } else if(m.content == 'off') {
                    if(guildData.logs.modlogs_status === 'off') return message.reply('```/!\\ Les logs de modération ne sont pas activés /!\\```')
                    let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
                    .setDescription('Les logs de modération ont étés désactivés!')

                    await this.client.guildDB.update(message.guild, { 'logs.modlogs_status': 'off' });
                    return message.reply({ embeds: [embed] });
                }
            });
        });
    };
};

module.exports = modLogsCommand;