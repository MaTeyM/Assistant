const { Listener } = require('discord-akairo');

class MessageListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec(message) {
        if(message.author.bot) return;

        let guild_db = await this.client.guildDB.get(message.guild);

        if(message.content === '<@!896397049854046269>') message.reply({ embeds: [
            this.client.functions.embed('kyo\'s assistant')
                .setDescription(`\`\`\`Salut ${message.author.tag} :)\n\nMon préfix est ${guild_db.prefix}\nSi tu souhaites avoir la liste des commandes, je te conseille de faire ${guild_db.prefix}help\`\`\``)
        ] });

        let ban_words = guild_db.ban_words;
        let content = message.content.split(' ');
        let content_values = content.values();

        if(!message.member.permissions.has('MANAGE_MESSAGES')) {
            for(const word of content_values) {
                if(ban_words.includes(word)) {
                    message.delete()
                    message.channel.send({ embeds: [
                        this.client.functions.embed('Modération Automatique')
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setDescription('Tu as cité un mot banni, ton message a donc été supprimé!')
                    ]});
                };
            };
        }
    };
};

module.exports = MessageListener;