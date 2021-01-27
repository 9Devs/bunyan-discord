import * as crossFetch from 'cross-fetch'
import * as bunyan from 'bunyan'
import { DiscordStream } from '../src'

jest.mock('cross-fetch')

describe('index', () => {
    const fetchMockFn = jest.spyOn(crossFetch, 'fetch')

    afterEach(() => {
        fetchMockFn.mockClear()
    })

    test('Should send log stream to Discord when error is logged', async () => {
        fetchMockFn.mockResolvedValueOnce({
            status: 200,
        } as any)

        const logger = bunyan.createLogger({
            name: 'TestApp',
            streams: [
                {
                    stream: new DiscordStream({
                        webhookUrl: 'https://discord.local',
                    }),
                },
            ],
        })

        logger.error(new Error('Something failed'))

        expect(fetchMockFn).toHaveBeenCalledWith('https://discord.local', expect.anything())
    })
})