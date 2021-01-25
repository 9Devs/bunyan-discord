const DiscordStream = require('../index')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
    name: 'TestApp',
    // level: 'error',
    stream: new DiscordStream({
        webhookUrl: 'https://discord.com/api/webhooks/801559367777910865/k7NtSSRfowcK8dWkuBtouc0BbyQrr2ErhP0uFz2Eavb2BI-j6GEWdb8Ox0xsbTtyYzRm'
    })
})

logger.error(new Error('Something failed'))