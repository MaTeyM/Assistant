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

        let ban_words = guildData.mod.automod.ban_words;
        let content = message.content.split(' ');
        let content_values = content.values();

        if(memberData.mod.muted === 'yes') return message.delete();

        if(!message.member.permissions.has('MANAGE_MESSAGES')) {
            if(guildData.mod.automod.status === 'on') {
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
        };

        if(guildData.xp_system.status === 'on') {
            const xpCD = Math.floor(Math.random() * 19) + 1;
            let xpToAdd;

            if(guildData.xp_system.xp_per_message === 1) xpToAdd = Math.floor(Math.random() * 5);
            if(guildData.xp_system.xp_per_message === 2) xpToAdd = Math.floor(Math.random() * 15) + 10;
            if(guildData.xp_system.xp_per_message === 3) xpToAdd = Math.floor(Math.random() * 25) + 25;
            if(guildData.xp_system.xp_per_message === 4) xpToAdd = Math.floor(Math.random() * 25) + 40;
        
            const UpdatedXP = memberData.xp.xp + xpToAdd;
            const neededXP = memberData.xp.level * memberData.xp.level * 100;
    
            let level = memberData.xp.level;
            let xp = memberData.xp.xp;
    
            if (xpCD >= 7 && xpCD <= 12) {
                await this.client.memberDB.update(message.member, message.guild, { 'xp.xp': UpdatedXP });
              };
    
            if (xp >= neededXP) {
                ++level
                xp-=neededXP
    
                await this.client.memberDB.update(message.member, message.guild, { 'xp.xp': xp, 'xp.level': level })
            };
            if (xp < 0) {
                level = level - 1
                xp = xp/(-1)
                xp = level * level * 100 - xp

                await this.client.memberDB.update(message.member, message.guild, { 'xp.xp': xp, 'xp.level': level })
            };
        };
    };
};

module.exports = MessageListener;