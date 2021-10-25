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

module.exports = {
    Guild: model('Guild', guildSchema)
};