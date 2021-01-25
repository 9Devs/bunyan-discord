const crossFetch = require('cross-fetch')
const DiscordStream = require('../index')

jest.mock('cross-fetch')

describe('index', () => {
    const fetchMockFn = jest.spyOn(crossFetch, 'fetch')
    const exampleLog = {
        stage: 'test',
        msg: 'hello world',
        time: '00000',
        context: {
            url: '/demo/test'
        },
        err: { stack: (new Error('Failed yes')).stack }
    }
    const chunk = {
        toString: () => JSON.stringify(exampleLog)
    }

    afterEach(() => {
        fetchMockFn.mockClear()
    })

    test('Should send request to Discord channel and return response', async () => {
        fetchMockFn.mockReturnValueOnce(Promise.resolve({
            status: 200
        }))

        const stream = new DiscordStream({ webhookUrl: 'https://discord.local' })
        const response = await stream.write(chunk)

        expect(response).toEqual({ status: 200 })
        expect(fetchMockFn).toHaveBeenCalledWith('https://discord.local', expect.anything())
    })

    test('Should return error response if request fail', async () => {
        fetchMockFn.mockReturnValueOnce(Promise.resolve({
            status: 400
        }))

        try {
            const stream = new DiscordStream({ webhookUrl: 'https://discord.local' })
            await stream.write(chunk)
        } catch (e) {
            expect(e.code).toEqual(400)
            expect(e.message).toEqual('Request to discord webhook failed')
        }
    })
})