const { Command } = require("discord-akairo");

class clearCommand extends Command {
  constructor() {
    super("clear", {
      aliases: ["clear"],
      description: {
        content: "Supprimer plusieurs messages!",
        usage: "clear",
        examples: ["clear"],
      },
      category: "Modération - Sécurité du serveur",
      userPermissions: ["MANAGE_MESSAGES"],
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [{ id: 'num', type: 'int' }]
    });
  }

  async exec(message, { num }) {

    let db = await this.client.guildDB.get(message.guild);

    if(num) {
      message.channel.bulkDelete(num + 1);

      let embed = this.client.functions
      .embed("Modération - Sécurité du serveur")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`\`\`\`${num} messag${num > 1 ? 'es' : 'e'} ont été supprim${num > 1 ? 'és' : 'é'}!\`\`\``);

      let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
      .setDescription(`💬 \`${num} messag${num > 1 ? 'es' : 'e'} ont été supprim${num > 1 ? 'és' : 'é'}!\``)
      .addField('Tag:', `\`\`\`${message.author.tag}\`\`\``, true)
      .addField('ID:', `\`\`\`${message.author.id}\`\`\``, true)

      let modlogs_salon = message.guild.channels.cache.get(db.modlogs_channel) || message.guild.channels.cache.find(c => c.id == db.modlogs_channel)

  if(modlogs_salon) modlogs_salon.send({ embeds: [logs_embed] });

    return message.channel.send({ embeds: [embed] });
    } else {

    let embed = this.client.functions
      .embed("Modération - Sécurité du serveur")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription("```Combien de messages voulez-vous supprimer?```");

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
      let num = Number(m.content);
      if(isNaN(num)) return message.channel.send(`*\`\`\`/!\\ Le nombre n'est pas valide | Commande annulée /!\\\`\`\`*`);
        message.channel.bulkDelete(num);

          let embed = this.client.functions
          .embed("Modération - Sécurité du serveur")
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`\`\`\`${num} messag${num > 1 ? 'es' : 'e'} ont été supprim${num > 1 ? 'és' : 'é'}!\`\`\``);

          let logs_embed = this.client.functions.embed('Logs - Sécurité du serveur')
          .setDescription(`💬 ${num} messag${num > 1 ? 'es' : 'e'} ont été supprim${num > 1 ? 'és' : 'é'}!`)
          .addField('Tag:', `\`\`\`${message.author.tag}\`\`\``, true)
          .addField('ID:', `\`\`\`${message.author.id}\`\`\``, true)

          let modlogs_salon = message.guild.channels.cache.get(db.modlogs_channel) || message.guild.channels.cache.find(c => c.id == db.modlogs_channel)

      if(modlogs_salon) modlogs_salon.send({ embeds: [logs_embed] });

        return message.channel.send({ embeds: [embed] });
      });
    };
  };
};

module.exports = clearCommand;
