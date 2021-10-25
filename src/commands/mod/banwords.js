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
      args: [
        { id: "config", type: "string" },
        { id: "word", type: "string" },
      ],
    });
  }

  async exec(message, { config, word }) {
    let db = await this.client.guildSettings.get(message.guild);
    let ban_words = db.ban_words;

    if (!config) {
      let embed = this.client.functions
        .embed("Modération - Sécurité du serveur")
        .setDescription("Voici la liste des mots-bannis:\n ```\n" + ban_words.sort().join("\n") + "```\nSi vous souhaitez en ajouter, faites: " + (await this.handler.prefix(message)) + "banwords add <mot>");

      message.reply({ embeds: [embed] });
    } else {
        if(config == 'add' && word) {
            if(ban_words.includes(word)) return message.reply('*```/!\\ Le mot est déja dans la liste! /!\\```*');
            ban_words.push(word);
            await this.client.guildSettings.update(message.guild, { ban_words: ban_words });
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription(`\`\`\`Le mot ${word} a été ajouté à la liste des mots bannis\`\`\``)

            return message.reply({ embeds: [embed] });
        } else if(config == 'remove' && word) {
            if(!ban_words.includes(word)) return message.reply('*```/!\\ Le mot n\'est pas dans la liste! /!\\```*');
            const mot = (m) => m = word;
            let pos = ban_words.find(mot);
            ban_words.splice(pos,1);
            await this.client.guildSettings.update(message.guild, { ban_words: ban_words });
            let embed = this.client.functions.embed('Modération - Sécurité du serveur')
                .setDescription(`\`\`\`Le mot ${word} a été retiré de la liste des mots bannis\`\`\``)

            return message.reply({ embeds: [embed] });
        };
    };
  };
};

module.exports = banwordsCommand;
