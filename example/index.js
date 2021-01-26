const DiscordStream = require('../index')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
    name: 'ExampleApp',
    stream: new DiscordStream({
        webhookUrl: 'https://discord.com/api/webhooks/0123456789'
    })
})

logger.error(new Error('Something failed'))