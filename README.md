# bunyan-discord

This library will send logs to a Discord channel through a webhook.

## Getting Started

Install the package;

```shell
npm i @ninedevs/bunyan-discord
```

## Usage

```js
const { DiscordStream } = require('@ninedevs/bunyan-discord')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
    name: 'ExampleApp',
    stream: new DiscordStream({
        webhookUrl: 'https://discord.com/api/webhooks/0123456789'
    })
})

logger.error(new Error('Something failed'))
```
