const { Command } = require("discord-akairo");

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "h"],
      description: {
        content: "Renvoie la liste des commandes!",
        usage: "<commande> [commande]",
        examples: ["help", "help prefix"],
      },
      category: "Bot - Commandes en lien avec le bot",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES"],
      args: [{ id: "command", type: "commandAlias" }],
    });
  }

  async exec(message, { command }) {
    if (!command) {
      let embed = this.client.functions
        .embed("Bot - Commandes en lien avec le bot")
        .setDescription(
          `Retrouvez la liste des toutes mes commandes ci-dessous, si vous avez besoin d'aide, entrez: \`${await this.handler.prefix(message)}help [commamnde]\`.\nPour information, les \`[]\` et \`<>\` ne sont pas à entrer dans les commandes!`
        );

      for (const category of this.handler.categories.values()) {
        if (category.id != "dev") {
          embed.addField(
            `**${category.id}**`,
            `${category
              .filter((cmd) => cmd.aliases.length > 0)
              .map((cmd) => `\`${cmd.aliases[0]}: ${cmd.description.content}\``)
              .join("\n")}`
          );
        }
      }

      message.reply({ embeds: [embed] });
    } else {
      let embed = this.client.functions
        .embed("Bot - Commandes en lien avec le bot")
        .setDescription(`Commande **${command.aliases[0]}**`)
        .addFields(
          {
            name: `Description:`,
            value: `\`${command.description.content}\``,
            inline: true,
          },
          {
            name: "Usage:",
            value: `\`${command.description.usage}\``,
            inline: true,
          },
          {
            name: "Examples:",
            value: `\`${this.handler.prefix}${command.description.examples.join(
              `\` | ${this.handler.prefix}\``
            )}\``,
            inline: true,
          }
        );

      message.reply({ embeds: [embed] });
    }
  }
}

module.exports = HelpCommand;
