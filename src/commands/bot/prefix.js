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
    if (!prefix) {
      return message.reply({
        embeds: [
          this.client.functions
            .embed("Bot - Commandes en lien avec le bot")
            .setDescription(
              `\`\`\`Le préfix actuel est: ${await this.handler.prefix(
                message
              )}\n\nSi tu souhaites le changer, fait: ${await this.handler.prefix(
                message
              )}prefix NouveauPrefix\`\`\``
            ),
        ],
      });
    }
    await this.client.guildDB.update(message.guild, { prefix: prefix });
    message.reply({
      embeds: [
        this.client.functions
          .embed("Bot - Commandes en lien avec le bot")
          .setDescription(
            `\`\`\`Le préfix a été changé\n\nLe nouveau préfix est: ${prefix}\`\`\``
          ),
      ],
    });
  }
}

module.exports = PrefixCommand;
