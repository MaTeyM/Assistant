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

        let guild_db = await this.client.guildSettings.get(message.guild);
        let prefix = guild_db.prefix;

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