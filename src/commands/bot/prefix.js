const { addSeconds } = require("date-and-time");
const { Command } = require("discord-akairo");

class PrefixCommand extends Command {
  constructor() {
    super("prefix", {
      aliases: ["prefix"],
      description: {
        content: "Afficher ou modifier le prefix du bot!",
        usage: "<command> <prefix>",
        examples: ["prefix !", "prefix"],
      },
      category: "Bot - Commandes en lien avec le bot",
      userPermissions: ["ADMINISTRATOR"],
      clientPermissions: ["ADMINISTRATOR"],
      args: [{ id: "prefix", type: "string " }],
    });
  }

  async exec(message, { prefix }) {
    let pastprefix = await this.handler.prefix(message);
    if(prefix) {
      let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
      .setDescription('Le préfix a été changé')
      .addField('Ancien Préfix:', `${'```'}${pastprefix}${'```'}`, true)
      .addField('Nouveau Préfix:', `${'```'}${prefix}${'```'}`, true)

      await this.client.guildDB.update(message.guild, { prefix: prefix });

      return message.reply({ embeds: [embed] });
    } else {
      let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
      .setDescription('**Que voulez-vous faire ?**\n```see -> afficher le préfix actuel\nedit -> modifier le préfix```\nTapez `cancel` pour annuler la commande')

      message.reply({ embeds: [embed] }).then(firstMSG => {
        let filter = m => m.author.id === message.author.id;
        let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async m => {
          firstMSG.delete() && m.delete();
          if(m.content == 'cancel') return message.reply('```/!\\ Commande annulée /!\\```')
          if(m.content == 'see') {
            let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
            .addField('Préfix:', `${'```'}${pastprefix}${'```'}`, true)
            .addField('Nouveau Préfix:', `${'```'}${pastprefix}prefix nouveau_prefix${'```'}`, true)

            return message.reply({ embeds: [embed] });
          } else if(m.content == 'edit') {
            let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
            .setDescription('**Quel préfix voulez-vous mettre ?**\n\nTapez `cancel` pour annuler la commande')

            message.reply({ embeds: [embed] }).then(secondMSG => {
              let filter = m => m.author.id === message.author.id;
              let collector = message.channel.createMessageCollector({ filter, time: 60000, max: 1 });

              collector.on('collect', async m => {
                secondMSG.delete() && m.delete();
                if(m.content == 'cancel') return message.reply('```/!\\ Commande annuléé /!\\```')

                await this.client.guildDB.update(message.guild, { prefix: m.content });

                let embed = this.client.functions.embed('Bot - Commandes en lien avec le bot')
                .setDescription('Le préfix a été changé')
                .addField('Ancien Préfix:', `${'```'}${pastprefix}${'```'}`, true)
                .addField('Nouveau Préfix:', `${'```'}${m.content}${'```'}`, true)

                return message.reply({ embeds: [embed] });
              });
            });
          };
        });
      });
    };
  };
};

module.exports = PrefixCommand;
