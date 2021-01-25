const DiscordStream = require('../index')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
    name: 'TestApp',
    level: 'error',
    stream: new DiscordStream({
        webhookUrl: 'https://discord.local/1234567890'
    })
})

logger.error(new Error('Something failed'))