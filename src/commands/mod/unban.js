const { Command } = require("discord-akairo");

class unbanCommand extends Command {
    constructor() {
        super('unban', {
            aliases: ['unban', 'deban', 'uban'],
            category: 'Modération - Sécurité du serveur',
            description: { content: 'Retirer le banissement d\'un utilisateur', usage: 'unban <utilisateur>', examples: ['unban 320832231302103051', 'unban'] },
            clientPermissions: 'BAN_userS',
            userPermissions: 'BAN_userS',
            args: [{ id: 'userID', type: 'string' }]
        });
    };

    async exec(message, { userID }) {
        const db = await this.client.guildDB.get(message.guild);
        let logs_channel;
        
        if(userID) {
            const bannedUser = await message.guild.bans.fetch(userID);
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription(`${bannedUser.user.username} a été débanni du serveur`)

            let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
            .setDescription('🔨 Un utilisateur a été débanni')
            .addField('Username', `\`\`\`${bannedUser.user.username}\`\`\``, true)
            .addField('ID', `\`\`\`${bannedUser.user.id}\`\`\``, true)
            .addField('Moderator', `\`\`\`${message.author.tag}\`\`\``, true)

            if(!bannedUser) return message.reply('```/!\\ Cet utilisateur ne figure pas parmis les bans /!\\```')

            message.guild.bans.remove(userID);

            if(db.logs.modlogs_channel) {
                logs_channel = message.guild.channels.cache.get(db.logs_channel) || message.guild.channels.cache.find(c => c.name == db.logs_channel) || message.guild.channels.cache.find(c => c.id == db.logs_channel)
            } else {
                logs_channel = message.guild.channels.cache.find(c => c.name == 'miku-logs');
            }
        
            if(logs_channel && db.logs.modlogs_status === 'on') logs_channel.send({ embeds: [logs_embed] });

            return message.reply({ embeds: [embed] });
        } else {
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription('**Quel membre voulez-vous débannir ? (Ne fonctionne uniquement avec son ID)**\n\nTapez `cancel` pour annuler la commande!')

            message.reply({ embeds: [embed] }).then(firstMSG => {
                let filter = m => m.author.id === message.author.id;
                let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    m.delete() && firstMSG.delete();
                    if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')

                    let userID = m.content

                    const bannedUser = await message.guild.bans.fetch(userID);
                    if(!bannedUser) return message.reply('```/!\\ Cet utilisateur ne figure pas parmis les bans /!\\```')

                    message.guild.bans.remove(userID);

                    let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                    .setDescription(`${bannedUser.user.username} à été débanni!`)

                    let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
                    .setDescription('🔨 Un utilisateur a été débanni')
                    .addField('Username', `\`\`\`${bannedUser.user.username}\`\`\``, true)
                    .addField('ID', `\`\`\`${bannedUser.user.id}\`\`\``, true)
                    .addField('Moderator', `\`\`\`${message.author.tag}\`\`\``, true)

                    if(db.logs.modlogs_channel) {
                        logs_channel = message.guild.channels.cache.get(db.logs_channel) || message.guild.channels.cache.find(c => c.name == db.logs_channel) || message.guild.channels.cache.find(c => c.id == db.logs_channel)
                    } else {
                        logs_channel = message.guild.channels.cache.find(c => c.name == 'miku-logs');
                    }
                
                    if(logs_channel && db.logs.modlogs_status === 'on') logs_channel.send({ embeds: [logs_embed] });

                    return message.reply({ embeds: [embed ]});
                });
            });
        };
    };
};

module.exports = unbanCommand;