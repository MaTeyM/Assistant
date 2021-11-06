const { Command } = require("discord-akairo");

class configxpCommand extends Command {
    constructor() {
        super('configxp', {
            aliases: ['configxp'],
            category: 'Éxpérience - Système d\'xp pour le serveur',
            description: { content: 'Configuer le système d\'xp', usage: 'configxp', examples: ['configxp'] },
            userPermissions: 'MANAGE_GUILD',
            clientPermissions: 'MANAGE_GUILD'
        });
    };

    async exec(message) {
        let guildData = await this.client.guildDB.get(message.guild);
        let xp_per_message = guildData.xp_system.xp_per_message;
        let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
        .setDescription('**Que voulez-vous faire ?**\n```on -> activer le système d\'éxpérience\noff -> désactiver le système d\'xp\nconfig -> configurer le système d\'éxpérience\nreset -> rénitialiser l\'s de tout les utilisateurs```\nTapez `cancel` pour annuler la commande')

        message.reply({ embeds: [embed] }).then(firstMSG => {
            let filter = m => m.author.id === message.author.id;
            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

            collector.on('collect', async m => {
                firstMSG.delete() && m.delete();
                if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')
                if(m.content == 'on') {
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription('Le système d\'xp est désormais activer sur le serveur :)')

                    if(guildData.xp_system.status === 'on') return message.reply('```/!\\ Le système d\'éxpérience est déjà activé sur ce serveur /!\\```')
                    let xp_system_status = guildData.xp_system.status;
                    await this.client.guildDB.update(message.guild, { 'xp_system.status': 'on' });

                    return message.reply({ embeds: [embed] });
                } else if(m.content == 'off') {
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription('Le système d\'xp est désormais désactiver sur le serveur :)')

                    if(guildData.xp_system.status === 'off') return message.reply('```/!\\ Le système d\'éxpérience n\'est pas activé sur ce serveur /!\\```')
                    await this.client.guildDB.update(message.guild, { 'xp_system.status': 'off' });

                    return message.reply({ embeds: [embed] });
                } else if(m.content == 'config') {
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription(`Combien d'éxpérience voulez-vous attribuer par message ?\n${'```'}1 -> Entre 0 et 5 ${guildData.xp_system.xp_per_message === 1 ? '(Option séléctionée)' : ''}\n2 -> Entre 10 et 25 ${guildData.xp_system.xp_per_message === 2 ? '(Option séléctionée)' : ''}\n3 -> Entre 25 et 50 ${guildData.xp_system.xp_per_message === 3 ? '(Option séléctionée)' : ''}\n4 -> entre 40 et 65 ${guildData.xp_system.xp_per_message === 4 ? '(Option séléctionée)' : ''}${'```'}\nTapez \`cancel\` pour annuler la commande`)

                    message.reply({ embeds: [embed] }).then(secondMSG => {
                        secondMSG.react('1️⃣');
                        secondMSG.react('2️⃣');
                        secondMSG.react('3️⃣');
                        secondMSG.react('4️⃣');
                        let filter = (reaction, user) => user.id === message.author.id;
                        let collector = secondMSG.createReactionCollector({ filter, time: 60000, max: 1 });

                        collector.on('collect', async r => {
                            secondMSG.delete()
                            if(r.emoji.name === '1️⃣') {
                                if(guildData.xp_system.xp_per_message === 1) return message.reply('```/!\\ Cette option est déjà l\'option choisie /!\\```')
                                await this.client.guildDB.update(message.guild, { 'xp_system.xp_per_message': 1 });

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription('Les messages rapportent désormais entre `0` et `5` points d\'éxpérience!')

                                return message.reply({ embeds: [embed] });
                            } else if(r.emoji.name === '2️⃣') {
                                if(guildData.xp_system.xp_per_message === 2) return message.reply('```/!\\ Cette option est déjà l\'option choisie /!\\```')
                                await this.client.guildDB.update(message.guild, { 'xp_system.xp_per_message': 2 });

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription('Les messages rapportent désormais entre `10` et `25` points d\'éxpérience!')

                                return message.reply({ embeds: [embed] });
                            } else if(r.emoji.name === '3️⃣') {
                                if(guildData.xp_system.xp_per_message === 3) return message.reply('```/!\\ Cette option est déjà l\'option choisie /!\\```')
                                await this.client.guildDB.update(message.guild, { 'xp_system.xp_per_message': 3 });

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription('Les messages rapportent désormais entre `25` et `50` points d\'éxpérience!')

                                return message.reply({ embeds: [embed] });
                            } else if(r.emoji.name === '4️⃣') {
                                if(guildData.xp_system.xp_per_message === 4) return message.reply('```/!\\ Cette option est déjà l\'option choisie /!\\```')
                                await this.client.guildDB.update(message.guild, { 'xp_system.xp_per_message': 4 });

                                let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                                .setDescription('Les messages rapportent désormais entre `40` et `65` points d\'éxpérience!')

                                return message.reply({ embeds: [embed] });
                            }
                        });
                    });
                } else if(m.content == 'reset') {
                    let data = await this.client.memberDB.getAllMembers(message.guild).then(p => p.sort());
                    data.forEach(async m => {
                        let member = message.guild.members.cache.get(m.id)
                        let memberData = await this.client.memberDB.get(member, message.guild)
                        let xp = memberData.xp.xp;
                        let level = memberData.xp.level
                        await this.client.memberDB.update(member, message.guild, { 'xp.xp': 0, 'xp.level': 1 });
                        });
                    let embed = this.client.functions.embed('Éxpérience - Système d\'xp pour le serveur')
                    .setDescription('L\'xp de tout les utilisateurs à été remis à zero!')

                    return message.reply({ embeds: [embed] });
                }
            });
        });
    };
};

module.exports = configxpCommand;