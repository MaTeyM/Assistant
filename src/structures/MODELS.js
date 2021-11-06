const { Schema, model } = require('mongoose');

const guildSchema = Schema({
    id: String,
    prefix: { type: String, default: '>' },
    logs: {
        eventlogs_channel: { type: String, default: 'miku-logs' },
        eventlogs_status: { type: String, default: 'off' },
        modlogs_channel: { type: String, default: 'miku-logs' },
        modlogs_status: { type: String, default: 'off' },
    },
    xp_system: {
        status: { type: String, default: 'off' },
        xp_per_message: { type: Number, default: 2 }
    },
    economy_system: {
        status: { type: String, default: 'off' }
    },
    mod: {
        automod: {
            status: { type: String, default: 'off' },
            ban_words: []
        }
    },
    others: {
        delete_command: { type: String, default: 'off' },
        welcome_channel: { type: String, default: 'welcome' },
        welcome_message: { type: String, default: 'Bienvenu' }
    }
});

const memberSchema = Schema({
    id: String,
    guildID: String,
    xp: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 }
    },
    economy: {
        cash: { type: Number, default: 0 },
        bank: { type: Number, default: 500 }
    },
    mod: {
        warns: [],
        muted: { type: String, default: 'no' }
    },
    info: {
        afk: {
            status: { type: String, default: 'off' },
            reason: { type: String, default: null}
        }
    }
});

module.exports = {
    Guild: model('Guild', guildSchema),
    Member: model('Member', memberSchema)
};