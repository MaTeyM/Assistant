const { Command } = require("discord-akairo");

class banwordsCommand extends Command {
  constructor() {
    super("banwords", {
      aliases: ["banwords", "banword", "ban_words", "bw"],
      description: {
        content: "Afficher la liste des mots bannis!",
        usage: "banwords",
        examples: ["banwords"],
      },
      category: "Modération - Sécurité du serveur",
      userPermissions: ["MANAGE_MESSAGES"],
      clientPermissions: ["MANAGE_MESSAGES"],
    });
  }

  async exec(message) {
    const db = await this.client.guildDB.get(message.guild);
    const ban_words = db.ban_words;

    let embed = this.client.functions
      .embed("Modération - Sécurité du serveur")
      .setDescription(
        "**Que voulez vous faire ?**\n```\nsee -> afficher les mots bannis\nadd -> ajouter un mot dans la liste des mots bannis\nremove -> retirer un mot dans la liste des mots bannis\n```\nTapez `cancel` si vous souhaitez annuler la commande!"
      );

    message.reply({ embeds: [embed] }).then((firstMsg) => {
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

        if (m.content == "see") {
          m.delete();
          let embed = this.client.functions
            .embed("Modération - Sécurité du serveur")
            .setDescription(
              "Voici la liste des mots-bannis:\n ```\n" +
                ban_words.join("\n") +
                "```"
            );

          return message.reply({ embeds: [embed] }) && firstMsg.delete();
        } else if (m.content == "add") {
          let embed = this.client.functions
            .embed("Modération - Sécurité du serveur")
            .setDescription(
              "**Quel mot voulez vous ajouter ?**\n\nTapez `cancel` si vous souhaitez annuler la commande!"
            );

          message.reply({ embeds: [embed] }).then((secondMsg) => {
            firstMsg.delete();

            let filter = (m) => m.author.id === message.author.id;
            let collector = message.channel.createMessageCollector({
              filter,
              time: 60000,
              max: 1,
            });

            collector.on("collect", async (m) => {
              let word = m.content;
              m.delete();

              if (ban_words.includes(word))
                return message.reply(
                  "*```/!\\ Le mot est déja dans la liste! /!\\```*"
                );
              ban_words.push(word);
              await this.client.guildDB.update(message.guild, {
                ban_words: ban_words,
              });
              let embed = this.client.functions
                .embed("Modération - Sécurité du serveur")
                .setDescription(
                  `\`\`\`Le mot ${word} a été ajouté à la liste des mots bannis\`\`\``
                );

              return message.reply({ embeds: [embed] }) && secondMsg.delete();
            });
          });
        } else if (m.content == "remove") {
          let embed = this.client.functions
          .embed("Modération - Sécurité du serveur")
          .setDescription(
            "**Quel mot voulez vous retirer ?**\n\nTapez `cancel` si vous souhaitez annuler la commande!"
          );

        message.reply({ embeds: [embed] }).then((secondMsg) => {
          firstMsg.delete();

          let filter = (m) => m.author.id === message.author.id;
          let collector = message.channel.createMessageCollector({
            filter,
            time: 60000,
            max: 1,
          });

          collector.on("collect", async (m) => {
            let word = m.content;

            if (!ban_words.includes(word))
              return message.reply(
                "*```/!\\ Le mot n'est pas dans la liste! /!\\```*"
              );
            let pos = ban_words.indexOf(word)
            ban_words.splice(pos,1);
            let newbw = ban_words;
            await this.client.guildDB.update(message.guild, {
              ban_words: newbw,
            });
            let embed = this.client.functions
              .embed("Modération - Sécurité du serveur")
              .setDescription(
                `\`\`\`Le mot ${word} a été retiré la liste des mots bannis\`\`\``
              );

            return message.reply({ embeds: [embed] }) && secondMsg.delete() && m.delete();
          });
        });
        }
      });
    });
  };
};

module.exports = banwordsCommand;
