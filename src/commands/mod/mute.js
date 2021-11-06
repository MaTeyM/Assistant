const { Command } = require("discord-akairo");
const { Member } = require("../../structures/MODELS");

class muteCommand extends Command {
    constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'muet'],
            description: { content: 'Rendre muet un utilisateur', usage: 'mute <utilisateur> <raison>', examples: ['mute @Kyoo insultes', 'mute' ]},
            category: 'Modération - Sécurité du serveur',
            userPermissions: 'MANAGE_ROLES',
            clientPermissions: 'MANAGE_ROLES',
            args: [{ id: 'member', type: 'member' }, { id: 'reason', type: 'string', match: 'restContent' }]
        });
    };

    async exec(message, { member, reason }) {
        let logs_channel;
        if(member && reason) {
            let logs_channel;
            let memberData = await this.client.memberDB.get(member, message.guild);
            if(!memberData) await Member.create({ id: member.id, guildID: message.guild.id });
            let guildData = await this.client.guildDB.get(message.guild);
            if(memberData.mod.muted === 'yes') return message.reply('```/!\\ Cet utilisateur est déjà mute /!\\```')

            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription(`${member} a été mute avec succès!`)

            let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
            .setDescription('🔈 Un utilisateur a été mute')
            .addField('Utilisateur:', `${'```'}${member.user.tag}${'```'}`, true)
            .addField('Raison:', `${'```'}${reason}${'```'}`, true)
            .addField('Modérateur:', `${'```'}${message.author.tag}${'```'}`, true)

            await this.client.memberDB.update(member, message.guild, { 'mod.muted': 'yes' });

            if(guildData.logs.modlogs_status === 'on') logs_channel = message.guild.channels.cache.find(channel => channel.name === guildData.logs.modlogs_channel) || message.guild.channels.cache.find(channel => channel.name === 'miku-logs');
            if(logs_channel) logs_channel.send({ embeds: [logs_embed] });

            return message.reply({ embeds: [embed] });
        } else {
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription('**Quel membre voulez-vous rendre muet ?**\n\nTapez `cancel` pour annuler la commande')

            message.reply({ embeds: [embed] }).then(firstMSG => {
                let filter = m => m.author.id === message.author.id;
                let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    firstMSG.delete() && m.delete();
                    if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')

                    let member = message.guild.members.cache.get(m.content) || m.mentions.members.first() || message.guild.members.cache.find(user => user.username == m.content) || message.guild.members.cache.find(user => user.displayName == m.content) || message.guild.members.cache.find(user => user.user.tag == m.content);
                    if(!member) return message.reply("**```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```**");
                    let memberData = await this.client.memberDB.get(member, message.guild);
                    if(memberData.mod.muted === 'yes') return message.reply('```/!\\ Cet utilisateur est déjà mute /!\\```');

                    let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                    .setDescription(`**Pour quelle raison voulez-vous mute ${member} ?**\n\nTapez ${'`'}cancel${'`'} pour annuler la commande`)

                    message.reply({ embeds: [embed] }).then(secondMSG => {
                        let filter = m => m.author.id === message.author.id;
                        let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                        collector.on('collect', async m => {
                            secondMSG.delete() && m.delete();
                            if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')

                            let reason = m.content;

                            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                            .setDescription(`${member} a été mute avec succès!`)
                
                            let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
                            .setDescription('🔈 Un utilisateur a été mute')
                            .addField('Utilisateur:', `${'```'}${member.user.tag}${'```'}`, true)
                            .addField('Raison:', `${'```'}${reason}${'```'}`, true)
                            .addField('Modérateur:', `${'```'}${message.author.tag}${'```'}`, true)
                
                            await this.client.memberDB.update(member, message.guild, { 'mod.muted': 'yes' });
                
                            let guildData = await this.client.guildDB.get(message.guild);
                            if(guildData.logs.modlogs_status === 'on') logs_channel = message.guild.channels.cache.find(channel => channel.name === guildData.logs.modlogs_channel) || message.guild.channels.cache.find(channel => channel.name === 'miku-logs');
                            if(logs_channel) logs_channel.send({ embeds: [logs_embed] });
                
                            return message.reply({ embeds: [embed] });
                        });
                    });
                });
            });
        };
    };
};

module.exports = muteCommand;