const { Command } = require('discord-akairo');

class BotInfoCommand extends Command {
    constructor() {
        super('botinfo', {
            aliases: ['botinfo', 'binfo', 'b-info'],
            description: {
                content: 'Renvoie des informations sur le bot!',
                usage: '<commande>',
                examples: ['botinfo', 'binfo']
           },
           category: 'Bot - Commandes en lien avec le bot',
           userPermissions: ['SEND_MESSAGES'],
           clientPermissions: ['SEND_MESSAGES']
        });
    }

    exec(message) {
        return message.reply({ 
            embeds: [ 
                this.client.functions.embed('Bot - Commandes en lien avec le bot')
                    .setDescription('Voici quelques informations me concernant:')
                    .addFields(
                        { name: `Version:`, value: '```1.0.0```', inline: true },
                        { name: 'Serveurs:', value: `\`\`\`${this.client.guilds.cache.size}\`\`\``, inline: true },
                        { name: 'Utilisateurs:', value: `\`\`\`${this.client.users.cache.size}\`\`\``, inline: true },
                        { name: 'Mémoire:', value: `\`\`\`16gb\`\`\``, inline: true },
                        { name: 'Développeur:', value: `\`\`\`>_ky0O'#5948\`\`\``, inline: true },
                        { name: 'Date de Création:', value: `\`\`\`10/10/2021\`\`\``, inline: true },
                        { name: 'Twitter:', value: `[twitter](https://twitter.com/kyoocreatives)`, inline: true },
                        { name: 'Des Questions?:', value: `[support](https://discord.gg/D4mxChFjQu)`, inline: true },
                        { name: 'Portfolio:', value: `[behance](https://t.co/8gVcJDAQxT?amp=1)`, inline: true }
                        )
                    .setThumbnail('https://i.ibb.co/hyMWtdZ/miku-logo.jpg')
            ]
        });
    };
};

module.exports = BotInfoCommand;