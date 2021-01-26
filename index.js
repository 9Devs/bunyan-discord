const { fetch } = require('cross-fetch')

const DEFAULT_DISCORD_EMBED_AVATAR_URL = ''
const DEFAULT_DISCORD_EMBED_COLOR = 9807270

const ERROR_DISCORD_EMBED_AVATAR_URL = 'https://i.imgur.com/60Llv9W.png'
const ERROR_DISCORD_EMBED_COLOR = 15158332


/**
 * Sends HTTP request to Discord webhook
 *
 * @param {Object} args
 * @param {String} args.webhookUrl
 * @param {Object} args.body
 * @param {String} args.body.avatar
 * @param {{author,color,fields}[]} args.body.embeds
 * @returns {Promise}
 */
const sendHttpRequest = async (args) => {
    const fetchResponse = await fetch(args.webhookUrl, {
        body: JSON.stringify(args.body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (fetchResponse.status >= 400) {
        const error = new Error('Request to discord webhook failed')
        error.code = fetchResponse.status

        throw error
    }

    return fetchResponse
}

/**
 * Pushes log streams to a Discord webhook
 */
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
     * @returns {Promise}
     */
    write(chunk) {
        let chunkJson = JSON.parse(chunk.toString())
        let { name, msg, err, time } = chunkJson
        let author = { icon_url: DEFAULT_DISCORD_EMBED_AVATAR_URL }
        let avatar_url = DEFAULT_DISCORD_EMBED_AVATAR_URL
        let color = DEFAULT_DISCORD_EMBED_COLOR
        let fields = [
            {
                name: 'Name:',
                value: name
            },
            {
                name: 'Message:',
                value: msg
            },
            {
                name: 'Time:',
                value: time
            }
        ]

        if (err) {
            fields.push({
                name: 'Error details:',
                value: JSON.stringify(err)
            })

            author.icon_url = ERROR_DISCORD_EMBED_AVATAR_URL
            avatar_url = ERROR_DISCORD_EMBED_AVATAR_URL
            color = ERROR_DISCORD_EMBED_COLOR
        }

        return sendHttpRequest({
            webhookUrl: this.args.webhookUrl,
            body: {
                avatar_url,
                embeds: [{
                    author,
                    color,
                    fields
                }]
            }
        })
    }
}


module.exports = DiscordStream