const { Listener } = require('discord-akairo');
const { Member, Guild } = require('../../structures/MODELS');

class MessageListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec(message) {
        if(message.author.bot) return;

        let memberData = await this.client.memberDB.get(message.member, message.guild);
        let guildData = await this.client.guildDB.get(message.guild);

        if(!memberData) return Member.create({ id: message.author.id, guildID: message.guild.id });
        if(!guildData) return Guild.create({ id: message.guild.id });

        if(message.content === '<@!896397049854046269>') return message.reply({ embeds: [
            this.client.functions.embed('miku :)')
                .setDescription(`\`\`\`Salut ${message.author.tag} :)\n\nMon préfix est ${guildData.prefix}\nSi tu souhaites avoir la liste des commandes, je te conseille de faire ${guildData.prefix}help\`\`\``)
        ] });

        let ban_words = guildData.ban_words;
        let content = message.content.split(' ');
        let content_values = content.values();

        if(!message.member.permissions.has('MANAGE_MESSAGES')) {
            for(const word of content_values) {
                if(ban_words.includes(word)) {
                    message.delete()
                    message.channel.send({ embeds: [
                        this.client.functions.embed('Modération Automatique - Sécurité du serveur')
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setDescription('Tu as cité un mot banni, ton message a donc été supprimé!')
                    ]});
                };
            };
        };

        if(guildData.xp_system === true) {
            const xpCD = Math.floor(Math.random() * 19) + 1;
            const xpToAdd = Math.floor(Math.random() * 25) + 10;
        
            const UpdatedXP = memberData.xp + xpToAdd;
            const neededXP = memberData.level * memberData.level * 100;
    
            let level = memberData.level;
            let xp = memberData.xp
    
            if (xpCD >= 7 && xpCD <= 12) {
                await this.client.memberDB.update(message.member, message.guild, { xp: UpdatedXP });
              };
    
            if (xp >= neededXP) {
                ++level
                xp-=neededXP
    
                await this.client.memberDB.update(message.member, message.guild, { xp: xp, level: level })
            };
        };
    };
};

module.exports = MessageListener;