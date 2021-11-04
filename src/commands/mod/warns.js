const { Command } = require("discord-akairo");
const date = require('date-and-time');

class warnsCommand extends Command {
  constructor() {
    super("warns", {
      aliases: ["warn", "warns", "avertissement", "infraction", "infractions"],
      description: {
        content: "Avertir un membre du serveur!",
        usage: "warns",
        examples: ["warns"],
      },
      category: "Modération - Sécurité du serveur",
      userPermissions: ["KICK_MEMBERS"],
      clientPermissions: ["KICK_MEMBERS"],
    });
  }

  async exec(message) {
    let member;
    let reason;
    let authorTag = message.author.tag;

    let embed = this.client.functions.embed('Modération - Sécurité du serveur')
        .setDescription("**Que voulez vous faire ?> **\n```\nsee -> afficher les warns d'un utilisateur\nadd -> avertir un utilisateur\nremove -> retirer un avertissement à un utilisateur\n```\nTapez `cancel` pour annuler la commande!")

    message.reply({ embeds: [embed] }).then(firstMSG => {
        let filter = m => m.author.id === message.author.id;
        let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', m => {
            firstMSG.delete();
            if (m.content === "cancel")
            return (
              m.delete() &&
              message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
            );
            m.delete();
            if(m.content == 'see') {
                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription('**De quel utilisateur voulez-vous voir les avertissements?**\n\nTapez `cancel` pour annuler la commande!')

                message.reply({ embeds: [embed] }).then(secondMSG => {
                    let filter = m => m.author.id === message.author.id;
                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                    collector.on('collect', async m => {
                        secondMSG.delete();
                        if (m.content === "cancel")
                        return (
                          m.delete() &&
                          message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
                        );
                        m.delete();
                        member =
                        message.guild.members.cache.get(m.content) ||
                        message.guild.members.cache.find((u) => u.user.id == m.content) ||
                        message.guild.members.cache.find((u) => u.user.name == m.content) ||
                        message.guild.members.cache.find((u) => u.username == m.content) ||
                        message.guild.members.cache.find((u) => u.user.tag == m.content) ||
                        message.mentions.members.first();
                      if (!member)
                        return message.channel.send(
                          "*```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```*"
                        );

                        let memberData = await this.client.memberDB.get(member, message.guild);

                        let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                        .setDescription(memberData.warns.length > 0 ? `\`Voici les avertissement de ${member.user.tag}:\`` : `\`${member.user.tag} ne possède aucun avertissement\``)

                        memberData.warns.forEach(warn => {
                            embed.addField('ID:', `\`\`\`${warn.id}\`\`\``, true)
                            embed.addField('Raison:', `\`\`\`${warn.reason}\`\`\``, true)
                            embed.addField('Date', `\`\`\`${warn.date}\`\`\``, true)
                        });

                        return message.reply({ embeds: [embed] });
                    });
                });
            } else if(m.content == 'add') {
                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription('**Quel membre voulez-vous avertir ?**\n\nTapez `cancel` pour annuler la commande!')

                let warnID = Math.round(Math.random(1, 999));

                message.reply({ embeds: [embed] }).then(secondMSG => {
                    let filter = m => m.author.id === message.author.id;
                    let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                    collector.on('collect', m => {
                        secondMSG.delete();
                        if (m.content === "cancel")
                        return (
                          m.delete() &&
                          message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
                        );
                        m.delete();
                        member =
                        message.guild.members.cache.get(m.content) ||
                        message.guild.members.cache.find((u) => u.user.id == m.content) ||
                        message.guild.members.cache.find((u) => u.user.name == m.content) ||
                        message.guild.members.cache.find((u) => u.username == m.content) ||
                        message.guild.members.cache.find((u) => u.user.tag == m.content) ||
                        message.mentions.members.first();
                        if (!member) return message.channel.send("*```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```*");

                        let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                        .setDescription(`**Pour quelle raison voulez vous avertir ${member.user.tag} ?**\n\nTapez \`cancel\` si vous souhaitez annuler la commande!`)

                        message.reply({ embeds: [embed] }).then(thirdMSG => {
                            let filter = m => m.author.id === message.author.id;
                            let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                            collector.on('collect', async m => {
                                thirdMSG.delete();
                                if (m.content === "cancel")
                                return (
                                  m.delete() &&
                                  message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
                                );
                                m.delete();
                                reason = m.content;
                                let memberData = await this.client.memberDB.get(member, message.guild);

                                let now = new Date();
                                let time = date.format(now, 'DD/MM/YYYY HH:mm:ss')

                                let newWarn = {
                                    'id': Math.round(Math.random(999) * 100),
                                    'date': time,
                                    'reason': reason
                                };
                                let db = await this.client.memberDB.get(member, message.guild);
                                let guildDB = await this.client.guildDB.get(message.guild);
                                let warns = db.warns;
                                warns.push(newWarn)
                                let newWarns = warns;

                               await this.client.memberDB.update(member, message.guild, { warns: newWarns });

                                let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                                .setDescription(`\`\`\`${member.user.tag} a été averti pour la raison: ${reason}\`\`\``)

                                let logs_embed = this.client.functions.embed('Logs - Sécurité de serveur')
                                .setDescription(`⚠ Un utilisateur a été averti!`)
                                .addField('ID:', `\`\`\`${memberData.warns = null ? '0' : memberData.warns.length}\`\`\``, true)
                                .addField('Raison:', `\`\`\`${reason}\`\`\``, true)
                                .addField('Modérateur:', `\`\`\`${authorTag}\`\`\``, true)

                                let salon_logs = message.guild.channels.cache.find( c => c.name == 'miku-logs') || message.guild.channels.cache.get(guildDB.modlogs_channel);

                                if(salon_logs) salon_logs.send({ embeds: [logs_embed] });
                                return message.reply({ embeds: [embed] });
                            });
                        });
                    });
                });
            } else if(m.content == 'remove') {
              let embed = this.client.functions.embed('Modération - Sécurité du serveur')
              .setDescription('**De quel utilisateur voulez-vous retirer un warn ?**\n\nTapez `cancel` pour annuler la commande!')

              message.reply({ embeds: [embed] }).then(secondMSG => {
                  let filter = m => m.author.id === message.author.id;
                  let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                  collector.on('collect', m => {
                      secondMSG.delete();
                      if (m.content === "cancel")
                      return (
                        m.delete() &&
                        message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
                      );
                      m.delete();
                      member =
                      message.guild.members.cache.get(m.content) ||
                      message.guild.members.cache.find((u) => u.user.id == m.content) ||
                      message.guild.members.cache.find((u) => u.user.name == m.content) ||
                      message.guild.members.cache.find((u) => u.username == m.content) ||
                      message.guild.members.cache.find((u) => u.user.tag == m.content) ||
                      message.mentions.members.first();
                      if (!member) return message.channel.send("*```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```*");

                      let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                      .setDescription(`**Quel warn voulez-vous retirer a ${member.user.tag} ?** (Veuillez entrer son ID)\n\nTapez \`cancel\` si vous souhaitez annuler la commande!`)

                      message.reply({ embeds: [embed] }).then(thirdMSG => {
                          let filter = m => m.author.id === message.author.id;
                          let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

                          collector.on('collect', async m => {
                              thirdMSG.delete();
                              if (m.content === "cancel")
                              return (
                                m.delete() &&
                                message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
                              );
                              m.delete();
                              let warnID = m.content;
                              let memberData = await this.client.memberDB.get(member, message.guild);
                              
                              let db = await this.client.memberDB.get(member, message.guild);
                              let warns = db.warns;

                            warns.splice(warnID,1);
                            let newWarns = warns;
                            await this.client.memberDB.update(member, message.guild, { warns: newWarns });

                              let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                              .setDescription(`\`\`\`Le warn ${warnID} de ${member.user.tag} a été supprimé!\`\`\``)

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

module.exports = warnsCommand;
