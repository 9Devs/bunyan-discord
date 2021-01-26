const crossFetch = require('cross-fetch')
const DiscordStream = require('../index')
const bunyan = require('bunyan')

jest.mock('cross-fetch')

describe('index', () => {
    const fetchMockFn = jest.spyOn(crossFetch, 'fetch')

    afterEach(() => {
        fetchMockFn.mockClear()
    })

    test('Should send log stream to Discord when error is logged', async () => {
        fetchMockFn.mockReturnValueOnce(Promise.resolve({
            status: 200
        }))

        const logger = bunyan.createLogger({
            name: 'TestApp',
            streams: [
                {
                    stream: new DiscordStream({
                        webhookUrl: 'https://discord.local'
                    })
                }
            ]
        })

        logger.error(new Error('Something failed'))

        expect(fetchMockFn).toHaveBeenCalledWith('https://discord.local', expect.anything())
    })
})