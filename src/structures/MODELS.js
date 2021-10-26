const { Schema, model } = require('mongoose');

const guildSchema = Schema({
    id: String,
    prefix: {
        type: String,
        default: '>'
    },
    logs_channel: {
        type: String,
        default: 'kyo-logs'
    },
    modlogs_channel: {
        type: String,
        default: 'kyo-logs'
    },
    welcome_channel: {
        type: String,
        default: 'welcome'
    },
    welcome_message: {
        type: String,
        default: 'Bienvenu'
    },
    delete_command: {
        type: Boolean,
        default: false
    },
    mod_logs: {
        type: Boolean,
        default: false
    },
    event_logs: {
        type: Boolean,
        default: false
    },
    ban_words: {
        type: Array,
        default: ['ntm', 'fdp', 'enculé']
    }
});

const memberSchema = Schema({
    id: String,
    guildID: String,
    xp: {
        type: Number,
        default: 0
    },
    cash: {
        type: Number,
        default: 500
    },
    afk: {
        type: Boolean,
        default: false
    },
    afk_reason: {
        type: String,
        default: null
    }
});

module.exports = {
    Guild: model('Guild', guildSchema),
    Member: model('Member', memberSchema)
};