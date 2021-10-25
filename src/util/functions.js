const { MessageEmbed } = require("discord.js")


module.exports = {
    embed: function(category) {
        return new MessageEmbed().setColor('e63946').setFooter(category, 'https://i.ibb.co/SdVncDq/kyoo-s-logo.jpg').setTimestamp()
    }
}