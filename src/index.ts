import { fetch } from 'cross-fetch'
import { Writable } from 'stream'

const DEFAULT_DISCORD_EMBED_AVATAR_URL = ''
const DEFAULT_DISCORD_EMBED_COLOR = 9807270

const ERROR_DISCORD_EMBED_AVATAR_URL = 'https://i.imgur.com/60Llv9W.png'
const ERROR_DISCORD_EMBED_COLOR = 15158332

//
interface RequestOption {
    avatar_url: string
    embeds: Array<{
        author: {
            icon_url: string
        },
        color: number
        fields: Array<{
            name: string
            value: string
        }>,
    }>,
}

//
interface DiscordStreamOption {
    webhookUrl: string
}

/**
 * Pushes log streams to a Discord webhook
 */
export class DiscordStream extends Writable {
    /**
     * @param {Object} args
     * @param {String} args.webhookUrl
     */
    constructor(private readonly args: DiscordStreamOption) {
        super()
        
        this.args = args
    }

    /**
     * @param chunk
     * @returns {Promise}
     */
    write(chunk: any): boolean {
        let chunkJson = JSON.parse(chunk.toString())
        let { name, msg, err, time } = chunkJson
        let author = { icon_url: DEFAULT_DISCORD_EMBED_AVATAR_URL }
        let avatar_url = DEFAULT_DISCORD_EMBED_AVATAR_URL
        let color = DEFAULT_DISCORD_EMBED_COLOR
        let fields = [
            {
                name: 'Name:',
                value: name,
            },
            {
                name: 'Message:',
                value: msg,
            },
            {
                name: 'Time:',
                value: time,
            },
        ]

        if (err) {
            fields.push({
                name: 'Error details:',
                value: JSON.stringify(err),
            })

            author.icon_url = ERROR_DISCORD_EMBED_AVATAR_URL
            avatar_url = ERROR_DISCORD_EMBED_AVATAR_URL
            color = ERROR_DISCORD_EMBED_COLOR
        }

        this.sendHttpRequest({
            avatar_url,
            embeds: [{
                author,
                color,
                fields,
            }],
        }).catch(err => console.error(err))

        return true
    }


    /**
     * Sends HTTP request to Discord webhook
     *
     * @param requestBody
     * @private
     */
    private async sendHttpRequest(requestBody: RequestOption): Promise<any> {
        const fetchResponse = await fetch(this.args.webhookUrl, {
            body: JSON.stringify(requestBody),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (fetchResponse.status >= 400) {
            const error: any = new Error('Request to discord webhook failed')
            error.code = fetchResponse.status

            throw error
        }

        return fetchResponse
    }
}