const { MessageEmbed } = require("discord.js")


module.exports = {
    embed: function(category) {
        return new MessageEmbed().setColor('#000000').setFooter(category, 'https://i.ibb.co/hyMWtdZ/miku-logo.jpg').setTimestamp()
    }
}