const { TOKEN, MONGOSTRING } = require('../util/config');
const { GuildProvider }  = require('./PROVIDERS');
const { embed } = require('../util/functions');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const mongoose = require('mongoose');

module.exports = class KyoClient extends AkairoClient {
    constructor(config = {}) {
        super(
            { ownerID: '320832231302103051' },
            {
                allowedMentions: {
                    parse: ['roles', 'users', 'everyone'],
                    repliedUser: false
                },
                partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
                presence: {
                    status: 'dnd',
                    activities: [
                        {
                            name: 'kyo',
                            type: 'LISTENING'
                        }
                    ]
                },
                intents: 32767
            }
        );

        this.commandHandler = new CommandHandler(this, {
            allowMention: true,
            prefix: async message => {
                const _ = await this.guildSettings.get(message.guild);
                if (_) return _.prefix
                return config.prefix
            },
            directory: './src/commands/'
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/'
        });

        this.functions = { embed: embed };
        this.guildSettings = new GuildProvider();
    };

    async init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });
        await this.commandHandler.loadAll();
        console.log(`Commandes -> ${this.commandHandler.modules.size}`);
        await this.listenerHandler.loadAll();
        console.log(`Listeners -> ${this.listenerHandler.modules.size}`);
    };

    async start() {
        try {
            await mongoose.connect(MONGOSTRING,
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            console.log('DB connectée')
        } catch (e) {
            console.log('DB pas connectée!\n\n', e)
            return process.exit();
        }
        await this.init();
        return this.login(TOKEN);
    }
};