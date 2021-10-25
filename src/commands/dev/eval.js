const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            description: {
                content: 'Évaluer du code javascript!',
                usage: '<commande> <code>',
                examples: ['eval']
           },
           ownerOnly: true,
           category: 'dev',
           args: [
               { id: 'code', type: 'string', match: 'content'}
           ]
        });
    }

    exec(message, { code }) {
        try {
            let toEval = code;
            let evaluated = inspect(eval(toEval, { depth: 0 }));
    
            if (!toEval) {
              return message.reply(`Je n'ai pas pu évaluer: \`air\``);
            } else {
              let hrStart = process.hrtime();
              let hrDiff;
              hrDiff = process.hrtime(hrStart);
              let embed = this.client.functions.embed('dev')
                .addField("Code", "```" + code + "```")
                .addField(
                  "Temps d'exécution",
                  `Exécuté en ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ""}${hrDiff[1] /
                    1000000}ms`
                )
                .addField("Réponse", "```js\n" + evaluated + "```");
              return message.reply({ embeds: [embed] });
            }
          } catch (e) {
            console.log(e);
          }
    };
};

module.exports = EvalCommand;