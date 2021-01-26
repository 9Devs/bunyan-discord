# bunyan-discord

This library will send logs to a Discord channel through a webhook. It assumes you already have a webhook setup.

## Usage

```js
const DiscordStream = require('../index')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
    name: 'ExampleApp',
    stream: new DiscordStream({
        webhookUrl: 'https://discord.com/api/webhooks/0123456789'
    })
})

logger.error(new Error('Something failed'))
```
