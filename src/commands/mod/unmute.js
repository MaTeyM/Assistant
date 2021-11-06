const { Command } = require("discord-akairo");
const { Member } = require("../../structures/MODELS");

class unmuteCommand extends Command {
    constructor() {
        super('unmute', {
            aliases: ['unmute', 'demute'],
            description: { content: 'Unmute un utilisateur', usage: 'unmute <utilisateur>', examples: ['unmute @Kyoo', 'mute' ]},
            category: 'Modération - Sécurité du serveur',
            userPermissions: 'MANAGE_ROLES',
            clientPermissions: 'MANAGE_ROLES',
            args: [{ id: 'member', type: 'member' }]
        });
    };

    async exec(message, { member, reason }) {
        if(member) {
            let memberData = await this.client.memberDB.get(member, message.guild);
            if(!memberData) await Member.create({ id: member.id, guildID: message.guild.id });
            if(memberData.mod.muted === 'no') return message.reply('```/!\\ Cet utilisateur n\'est pas mute /!\\```')

            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription(`${member} a été unmute avec succès!`)

            await this.client.memberDB.update(member, message.guild, { 'mod.muted': 'no' });

            return message.reply({ embeds: [embed] });
        } else {
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription('**Quel utilisateur voulez-vous unmute ?**\n\nTapez `cancel` pour annuler la commande')

            message.reply({ embeds: [embed] }).then(firstMSG => {
                let filter = m => m.author.id === message.author.id;
                let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    firstMSG.delete() && m.delete();
                    if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')

                    let member = message.guild.members.cache.get(m.content) || m.mentions.members.first() || message.guild.members.cache.find(user => user.username == m.content) || message.guild.members.cache.find(user => user.displayName == m.content) || message.guild.members.cache.find(user => user.user.tag == m.content);
                    if(!member) return message.reply("**```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```**");
                    let memberData = await this.client.memberDB.get(member, message.guild);
                    if(memberData.mod.muted === 'no') return message.reply('```/!\\ Cet utilisateur n\'est pas mute /!\\```');

                    let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                    .setDescription(`${member} à été unmute avec succès!`)

                    await this.client.memberDB.update(member, message.guild, { 'mod.muted': 'no' });

                    return message.reply({ embeds: [embed] });
                });
            });
        };
    };
};

module.exports = unmuteCommand;