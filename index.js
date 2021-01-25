const https = require('https')

const DEFAULT_DISCORD_EMBED_AVATAR_URL = 'https://i.imgur.com/WQOL3t3.png'
const DEFAULT_DISCORD_EMBED_AUTHOR_NAME = 'Alert'
const DEFAULT_DISCORD_EMBED_COLOR = 16723200

/**
 * Generates the request body for the HTTP request to Discord webhook
 *
 * @param {Object} args
 * @param {String} args.url
 * @param {String} args.stage
 * @param {String} args.details
 * @param {String} args.time
 * @param {String} args.message
 * @returns {{avatar_url: string, embeds: [{color: number, author: {icon_url: string, name: string}, fields: []}]}}
 */
const generateRequestBody = (args) => {
    const { url, stage, details, time, message } = args
    const fields = []

    if (message) {
        fields.push({
            name: 'Message:',
            value: message,
        })
    }

    if (time) {
        fields.push({
            name: 'Time:',
            value: time,
        })
    }

    if (url) {
        fields.push({
            name: 'URL:',
            value: url,
        })
    }

    if (stage) {
        fields.push({
            name: 'Stage:',
            value: stage,
        })
    }

    if (details) {
        fields.push({
            name: 'Details:',
            value: details,
        })
    }

    return {
        avatar_url: DEFAULT_DISCORD_EMBED_AVATAR_URL,
        embeds: [
            {
                author: {
                    name: DEFAULT_DISCORD_EMBED_AUTHOR_NAME,
                    icon_url: DEFAULT_DISCORD_EMBED_AVATAR_URL,
                },
                color: DEFAULT_DISCORD_EMBED_COLOR,
                fields,
            },
        ],
    }
}

/**
 * Sends HTTP request to Discord webhook
 * @param {String} url - The discord webhook URL
 * @param {Object} requestBody
 * @param {String?} requestBody.username
 * @param {String?} requestBody.content
 * @param {String?} requestBody.avatar_url
 * @param {Array?} requestBody.embeds
 * @returns {Promise}
 */
const sendHttpRequest = (url, requestBody) => {
    console.log({ url, requestBody })

    const postData = JSON.stringify(requestBody)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    return new Promise((resolve, reject) => {
        const request = https.request(url, options, (res) => {
            res.setEncoding('utf8')
        })

        request.on('error', (e) => reject(e))

        const response = request.write(postData)

        request.end()

        return (response) ? resolve(true) : reject(false)
    })
}


class DiscordStream {
    /**
     * @param {Object} args
     * @param {String} args.webhookUrl
     */
    constructor(args) {
        this.args = args;
    }

    /**
     * @param chunk
     * @param callback
     * @returns {boolean}
     */
    write(chunk, callback = null) {
        const chunkJson = JSON.parse(chunk.toString())

        const { msg: message, time, stage = 'N/A', context, err } = chunkJson
        const url = (context && context.url) ? context.url : 'N/A'
        const details = (err && err.stack) ? err.stack : 'N/A'

        const requestBody = generateRequestBody({
            message,
            time,
            details,
            stage,
            url,
        })

        sendHttpRequest(this.args.webhookUrl, requestBody)
            .then(res => {
                if (callback) callback(null, res)
            })
            .catch(e => {
                if (callback) callback(e, null)
            })

        return true
    }
}


module.exports = DiscordStream