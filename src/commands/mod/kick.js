const { Command } = require("discord-akairo");

class kickCommand extends Command {
  constructor() {
    super("kick", {
      aliases: ["kick"],
      description: {
        content: "Exclure un membre du serveur!",
        usage: "kick",
        examples: ["kick"],
      },
      category: "Modération - Sécurité du serveur",
      userPermissions: ["KICK_MEMBERS"],
      clientPermissions: ["KICK_MEMBERS"],
    });
  }

  async exec(message) {
    let member;
    let reason;
    let logs_channel;

    let db = await this.client.guildDB.get(message.guild);

    let embed = this.client.functions
      .embed("Modération - Sécurité du serveur")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription("```Quel membre voulez-vous exclure?```");

    message.reply({ embeds: [embed] });

    let filter = (m) => m.author.id === message.author.id;
    let collector = message.channel.createMessageCollector({
      filter,
      time: 60000,
      max: 1,
    });

    collector.on("collect", (m) => {
      if (m.content === "cancel")
        return (
          m.delete() &&
          message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
        );
      m.delete();
      member =
        message.guild.members.cache.get(m.content) ||
        message.guild.members.cache.find((u) => u.user.id == m.content) ||
        message.guild.members.cache.find((u) => u.name == m.content) ||
        message.guild.members.cache.find((u) => u.username == m.content) ||
        message.guild.members.cache.find((u) => u.user.tag == m.content) ||
        message.mentions.members.first();
      if (!member)
        return message.channel.send(
          "*```Le membre est invalide! \n\n/!\\ Veuillez refaire la commande! /!\\```*"
        );

      let embed = this.client.functions
        .embed("Modération - Sécurité du serveur")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setDescription(
          "Pour quelle raison voulez-vous éxclure cet utilisateur?"
        );

      message.channel.send({ embeds: [embed] });

      let filter = (m) => m.author.id === message.author.id;
      let collector = message.channel.createMessageCollector({
        filter,
        time: 60000,
        max: 1,
      });

      collector.on("collect", (m) => {
        if (m.content === "cancel")
          return (
            m.delete() &&
            message.channel.send(`*\`\`\`/!\\ Commande annulée /!\\\`\`\`*`)
          );
        m.delete();
        reason = m.content;

        member.kick(reason);

        let embed = this.client.functions
          .embed("Modération - Sécurité du serveur")
          .setDescription(
            `\`\`\`L'utilisateur ${member.user.tag} a été éxclu pour la raison suivante: ${reason}\`\`\``
          );

          let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
          .setDescription('🔨 `Un utilisateur a été éxclu!`')
          .addField('Tag:', `\`\`\`${member.user.tag}\`\`\``, true)
          .addField('ID:', `\`\`\`${member.user.id}\`\`\``, true)
          .addField('Raison:', `\`\`\`${reason}\`\`\``, true)

      if(db.logs_channel) {
          logs_channel = message.guild.channels.cache.get(db.logs_channel) || message.guild.channels.cache.find(c => c.name == db.logs_channel) || message.guild.channels.cache.find(c => c.id == db.logs_channel)
      } else {
          logs_channel = message.guild.channels.cache.find(c => c.name == 'miku-logs');
      }

      if(logs_channel) logs_channel.send({ embeds: [logs_embed] });

        return message.channel.send({ embeds: [embed] });
      });
    });
  }
}

module.exports = kickCommand;
