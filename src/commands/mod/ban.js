const { Command } = require("discord-akairo");

class banCommand extends Command {
  constructor() {
    super("ban", {
      aliases: ["ban"],
      description: {
        content: "Bannir un membre du serveur!",
        usage: "ban",
        examples: ["ban"],
      },
      category: "Modération - Sécurité du serveur",
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"],
      args: [{ id: 'member', type: 'member'}, { id: 'reason', type: 'string', match: 'restContent'}]
    });
  }

  async exec(message, { member, reason }) {
    let logs_channel;

    let db = await this.client.guildDB.get(message.guild);

    if(member && reason) {
      let embed = this.client.functions.embed('Modération - Sécurité du serveur')
      .setDescription(`${member.user.tag} à été banni pour la raison suivante: ${reason}`)

      let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
      .setDescription('🔨 Un utilisateur a été banni')
      .addField('Tag:', `\`\`\`${member.user.tag}\`\`\``, true)
      .addField('ID:', `\`\`\`${member.user.id}\`\`\``, true)
      .addField('Raison:', `\`\`\`${reason}\`\`\``, true)

      member.ban({ reason: reason, days: 0 });

      if(db.logs.modlogs_channel) {
        logs_channel = message.guild.channels.cache.get(db.logs_channel) || message.guild.channels.cache.find(c => c.name == db.logs_channel) || message.guild.channels.cache.find(c => c.id == db.logs_channel)
    } else {
        logs_channel = message.guild.channels.cache.find(c => c.name == 'miku-logs');
    }

    if(logs_channel && db.logs.modlogs_status === 'on') logs_channel.send({ embeds: [logs_embed] });

      return message.reply({ embeds: [embed] });
    } else {
      let embed = this.client.functions
      .embed("Modération - Sécurité du serveur")
      .setDescription("**Quel membre voulez-vous bannir ?**\n\nTapez `cancel` pour annuler la commande!");

    message.reply({ embeds: [embed] });

    let filter = (m) => m.author.id === message.author.id;
    let collector = message.channel.createMessageCollector({
      filter,
      time: 60000,
      max: 1,
    });

    collector.on("collect", (m) => {
      if (m.content == "cancel")
        return (
          m.delete() &&
          message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
        );
      m.delete();
      let member = message.guild.members.cache.get(m.content) || m.mentions.members.first() || message.guild.members.cache.find(user => user.username == m.content) || message.guild.members.cache.find(user => user.displayName == m.content) || message.guild.members.cache.find(user => user.user.tag == m.content)
      if (!member)
        return message.channel.send(
          "*```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```*"
        );

      let embed = this.client.functions
        .embed("Modération - Sécurité du serveur")
        .setDescription(
          "**Pour quelle raison voulez-vous bannir cet utilisateur ?**\n\nTapez `cancel` pour annuler la commande!"
        );

      message.channel.send({ embeds: [embed] });

      let filter = (m) => m.author.id === message.author.id;
      let collector = message.channel.createMessageCollector({
        filter,
        time: 60000,
        max: 1,
      });

      collector.on("collect", (m) => {
        if (m.content == "cancel")
          return (
            m.delete() &&
            message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
          );
        m.delete();
        reason = m.content;

        member.ban({ reason: reason, days: 0 });

        let embed = this.client.functions
          .embed("Modération - Sécurité du serveur")
          .setDescription(
            `\`\`\`L'utilisateur ${member.user.tag} a été banni pour la raison suivante: ${reason}\`\`\``
          );

        let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
            .setDescription('🔨 Un utilisateur a été banni!')
            .addField('Tag:', `\`\`\`${member.user.tag}\`\`\``, true)
            .addField('ID:', `\`\`\`${member.user.id}\`\`\``, true)
            .addField('Raison:', `\`\`\`${reason}\`\`\``, true)

        if(db.logs.modlogs_channel) {
            logs_channel = message.guild.channels.cache.get(db.logs_channel) || message.guild.channels.cache.find(c => c.name == db.logs_channel) || message.guild.channels.cache.find(c => c.id == db.logs_channel)
        } else {
            logs_channel = message.guild.channels.cache.find(c => c.name == 'miku-logs');
        }

        if(logs_channel && db.logs.modlogs_status === 'on') logs_channel.send({ embeds: [logs_embed] });
        return message.channel.send({ embeds: [embed] });
      });
    });
    };
  };
};

module.exports = banCommand;
