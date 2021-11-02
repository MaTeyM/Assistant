const { Command } = require("discord-akairo");

class modRoleCommand extends Command {
    constructor() {
        super('modrole', {
            aliases: ['modrole', 'adminrole', 'role'],
            description: {
                content: 'Ajouter ou retirer un rôle à un utilisateur',
                usage: 'modrole <option> <utiliateur> <role>',
                examples: ['modrole add @miku @Graphiste', 'modrole']
            },
            category: 'Modération - Sécurité du serveur',
            userPermissions: 'SEND_MESSAGES',
            clientPermissions: 'SEND_MESSAGES',
            args: [{ id: 'option', type: 'string' }, { id: 'member', type: 'member' }, { id: 'role', type: 'role' }]
        });
    };
    async exec(message, { option, member, role }) {
        if(option && member) {
            if(option == 'add') {
                member.roles.cache.sort().forEach(r => {
                    if(r.id === role.id) return message.reply('***```/!\\ L\'utilisateur possède déjà ce rôle! /!\\```***');
                });
                member.roles.add(role.id);

                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription(`Le role ${role} a été ajouté à ${member}`)

                return message.reply({ embeds: [embed] });
            } else if(option == 'remove') {
                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription(`Le role ${role} a été retiré à ${member}`)

                let memberRoles = [];

                member.roles.cache.sort().forEach(r => {
                  memberRoles.push(r.id)
              });
              if(memberRoles.includes(role.id)) {
                  return message.reply({ embeds: [embed] }) && member.roles.remove(role.id);
              } else {
                  return message.reply('***```/!\\ L\'utilisateur ne possède pas ce rôle! /!\\```***')
              }
            } else if(option == 'clear') {
                member.roles.cache.sort().forEach(r => {
                    if(r.name != '@everyone') member.roles.remove(r.id);
                });

                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription(`Tout les rôles de ${member} ont étés rétirés!`)

                return message.reply({ embeds: [embed] });
            };
        } else {
            let role;
            let member;

            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
            .setDescription('**Que voulez-vous faire ?**\n```add -> ajouter un rôle à un utilisateur\nremove -> retirer un rôle à un utilisateur\nclear -> supprimer tout les rôles d\'un utilisateur```\nTapez `cancel` si vous souhaitez annuler la commande!')

            message.reply({ embeds: [embed] }).then(firstMSG => {
                let filter = m => m.author.id === message.author.id;
                let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async m => {
                    m.delete();
                    if(m.content == 'cancel') return message.channel.send('***```/!\\ Commande annulée /!\\```***') && firstMSG.delete();

                    if(m.content == 'add') {
                        let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                        .setDescription('**A quel membre voulez-vous ajouter un rôle ?**\n\nTapez `cancel` si vous souhaitez annuler la commande')

                        firstMSG.delete()
                        message.reply({ embeds: [embed] }).then(secondMSG => {
                            let filter = m => m.author.id === message.author.id;
                            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                            collector.on('collect', m => {
                                m.delete();
                                if(m.content == 'cancel') return message.channel.send('***```/!\\ Commande annulée /!\\```***')

                                member =
                                message.guild.members.cache.get(m.content) ||
                                message.guild.members.cache.find((u) => u.user.id == m.content) ||
                                message.guild.members.cache.find((u) => u.name == m.content) ||
                                message.guild.members.cache.find((u) => u.username == m.content) ||
                                message.guild.members.cache.find((u) => u.user.tag == m.content) ||
                                m.mentions.members.first();
                                if(!member) return message.channel.send("***```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```***");

                                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                                .setDescription('**Quel rôle voulez vous ajouter ce membre ?**\n\nTapez `cancel` si vous souhaitez annuler la commande')

                                secondMSG.delete();
                                message.reply({ embeds: [embed] }).then(thirdMSG => {
                                    let filter = m => m.author.id === message.author.id;
                                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                                    collector.on('collect', m => {
                                        m.delete();
                                        if(m.content == 'cancel') return message.channel.send('***```/!\\ Commande annulée /!\\```***')

                                        let role = message.guild.roles.cache.get(m.content) || m.mentions.roles.first() || message.guild.roles.cache.find(r => r.name == m.content) || message.guild.roles.cache.find(r => r.id == m.content);
                                        if(!role) return message.reply('```/!\\ Le rôle est invalide /!\\```')

                                        member.roles.cache.sort().forEach(r => {
                                            if(r.id === role.id) return message.reply('***```/!\\ L\'utilisateur possède déjà ce rôle! /!\\```***');
                                        });
                                        member.roles.add(role.id);
    
                                        let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                                        .setDescription(`Le rôle ${role} a été ajouté à ${member}`)
    
                                        thirdMSG.delete();
                                        return message.reply({ embeds: [embed] });
                                    });
                                });
                            });
                        });
                    } else if(m.content == 'remove') {
                        let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                        .setDescription('**A quel membre voulez vous retirer un rôle ?**\n\nTapez `cancel` si vous souhaitez annuler la commande')

                        firstMSG.delete()
                        message.reply({ embeds: [embed] }).then(secondMSG => {
                            let filter = m => m.author.id === message.author.id;
                            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                            collector.on('collect', m => {
                                m.delete();
                                if(m.content == 'cancel') return message.channel.send('***```/!\\ Commande annulée /!\\```***') && secondMSG.delete();

                                member = message.guild.members.cache.get(m.content) || message.guild.members.cache.find((u) => u.user.id == m.content) || message.guild.members.cache.find((u) => u.name == m.content) || message.guild.members.cache.find((u) => u.username == m.content) || message.guild.members.cache.find((u) => u.user.tag == m.content) || m.mentions.members.first();
                                      if(!member) return message.channel.send("***```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```***");

                                let memberRoles = []

                                member.roles.cache.sort().forEach(r => {
                                    memberRoles.push(r.name)
                                });

                                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                                .setDescription(`**Quel rôle voulez-vous retirer à ce membre ?**\n\`\`\`Voici la liste de ses rôles:\n\n${memberRoles.join('\n')}\`\`\`\nTapez \`cancel\` si vous souhaitez annuler la commande`)

                                secondMSG.delete();
                                message.reply({ embeds: [embed] }).then(thirdMSG => {
                                    let filter = m => m.author.id === message.author.id;
                                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                                    collector.on('collect', m => {
                                        m.delete();
                                        if(m.content == 'cancel') return message.channel.send('***```/!\\ Commande annulée /!\\```***') && thirdMSG.delete();

                                        let role = message.guild.roles.cache.get(m.content) || m.mentions.roles.first() || message.guild.roles.cache.find(r => r.name == m.content) || message.guild.roles.cache.find(r => r.id == m.content);
    
                                      let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                                        .setDescription(`Le rôle ${role} a été retiré à ${member}`)

                                      thirdMSG.delete();

                                      let memberRoles = [];

                                      member.roles.cache.sort().forEach(r => {
                                        memberRoles.push(r.id)
                                    });
                                    if(memberRoles.includes(role.id)) {
                                        return message.reply({ embeds: [embed] }) && member.roles.remove(role.id);
                                    } else {
                                        return message.reply('***```/!\\ L\'utilisateur ne possède pas ce rôle! /!\\```***')
                                    }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        }
    };
};

module.exports = modRoleCommand;