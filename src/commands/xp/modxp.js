const { Command } = require("discord-akairo");

class modXPCommand extends Command {
    constructor() {
        super('modxp', {
            aliases: ['modxp', 'adminxp', 'adminlevel', 'modlevel'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Gérer l\'xp d\'un utilisateur', usage: 'modxp <option> <utilisateur> <xp>', examples: ['modxp', 'modxp add Kyoo 100'] },
            userPermissions: 'MANAGE_GUILD',
            clientPermissions: 'MANAGE_GUILD',
            args: [ { id: 'option', type: 'string' }, { id: 'member', type: 'member' }, { id: 'xpToAdd', type: 'number'} ]
        });
    };

    async exec(message, { member, option, xpToAdd }) {
        let db = await this.client.guildDB.get(message.guild);
        if(db.xp_system.status === 'off') return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
        if(member && option && xpToAdd) {
            const memberData = await this.client.memberDB.get(member, message.guild);
            const memberXP = memberData.xp.xp;

            if(option == 'add') {
                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                .setDescription(`${xpToAdd}xp ont été ajoutés à ${member}`)

                await this.client.memberDB.update(member, message.guild, { 'xp.xp': memberXP+xpToAdd });
                return message.reply({ embeds: [embed] });
            } else if(option == 'remove') {
                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                .setDescription(`${xpToAdd}xp ont été retirés à ${member}`)

                await this.client.memberDB.update(member, message.guild, { 'xp.xp': memberXP-xpToAdd });
                return message.reply({ embeds: [embed] });
            };
        } else {
            let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
            .setDescription('**Que voulez-vous faire ?**\n```add -> ajouter de l\'xp à un utilisateur\nremove -> retirer de l\'xp à un utilisateur```\nTapez `cancel` pour annuler la commande')

            message.reply({ embeds: [embed] }).then(firstMSG => {
                let filter = m => m.author.id ===  message.author.id;
                let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', m => {
                    firstMSG.delete() && m.delete();
                    if(m.content == 'cancel') return message.reply('*```/!\\ Commande annulée /!\\```*')
                    if(m.content == 'add') {
                        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                        .setDescription('**A quel membre voulez-vous ajouter de l\'xp ?**\n\nTapez `cancel` pour annuler la commande')

                        message.reply({ embeds: [embed] }).then(secondMSG => {
                            let filter = m => m.author.id === message.author.id;
                            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                            collector.on('collect', async m => {
                                secondMSG.delete() && m.delete();
                                if(m.content == 'cancel') return message.reply('*```/!\\ Commande annulée /!\\```*')

                                let member = message.guild.members.cache.get(m.content) || m.mentions.members.first() || message.guild.members.cache.find(user => user.username == m.content) || message.guild.members.cache.find(user => user.displayName == m.content) || message.guild.members.cache.find(user => user.user.tag == m.content)
                                if(!member) return message.reply('```/!\\ Membre Invalide /!\\```')
                                let memberData = await this.client.memberDB.get(member, message.guild);
                                let memberXP = memberData.xp.xp;

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription(`**Combien d'xp voulez-vous ajouter à ${member}**\n\nTapez \`cancel\` pour annuler la commande`)

                                message.reply({ embeds: [embed] }).then(thirdMSG => {
                                    let filter = m => m.author.id === message.author.id;
                                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                                    collector.on('collect', async m => {
                                        thirdMSG.delete() && m.delete();
                                        if(m.content == 'cancel') return message.reply('*```/!\\ Commande annulée /!\\```*')

                                        let xp = m.content;
                                        if(isNaN(xp)) return message.reply('```/!\\ Cette valeur doit être un nombre /!\\```')
                                        xp = Number(xp);

                                        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                        .setDescription(`${member} a reçu ${xp} points d'expérience!`)

                                        await this.client.memberDB.update(member, message.guild, { 'xp.xp': memberData.xp+xp });

                                        return message.reply({ embeds: [embed] });
                                    });
                                });
                            });
                        });
                    } else if(m.content == 'remove') {
                        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                        .setDescription('**A quel membre voulez-vous retirer de l\'xp ?**\n\nTapez `cancel` pour annuler la commande')

                        message.reply({ embeds: [embed] }).then(secondMSG => {
                            let filter = m => m.author.id === message.author.id;
                            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                            collector.on('collect', async m => {
                                secondMSG.delete() && m.delete();
                                if(m.content == 'cancel') return message.reply('*```/!\\ Commande annulée /!\\```*')

                                let member = message.guild.members.cache.get(m.content) || m.mentions.members.first() || message.guild.members.cache.find(user => user.username == m.content) || message.guild.members.cache.find(user => user.displayName == m.content) || message.guild.members.cache.find(user => user.user.tag == m.content)
                                if(!member) return message.reply('```/!\\ Membre Invalide /!\\```')
                                let memberData = await this.client.memberDB.get(member, message.guild);
                                let memberXP = memberData.xp.xp;

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription(`**Combien d'xp voulez-vous retirer à ${member}**\n\nTapez \`cancel\` pour annuler la commande`)

                                message.reply({ embeds: [embed] }).then(thirdMSG => {
                                    let filter = m => m.author.id === message.author.id;
                                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                                    collector.on('collect', async m => {
                                        thirdMSG.delete() && m.delete();
                                        if(m.content == 'cancel') return message.reply('*```/!\\ Commande annulée /!\\```*')

                                        let xp = m.content;
                                        if(isNaN(xp)) return message.reply('```/!\\ Cette valeur doit être un nombre /!\\```')
                                        xp = Number(xp);

                                        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                        .setDescription(`${member} a perdu ${xp} points d'expérience!`)

                                        await this.client.memberDB.update(member, message.guild, { 'xp.xp': memberData.xp-xp });

                                        return message.reply({ embeds: [embed] });
                                    });
                                });
                            });
                        });
                    };
                });
            });
        };
    };
};

module.exports = modXPCommand;