/// <reference types="node" />
import { Writable } from 'stream';
interface DiscordStreamOption {
    webhookUrl: string;
}
/**
 * Pushes log streams to a Discord webhook
 */
export declare class DiscordStream extends Writable {
    private readonly args;
    /**
     * @param {Object} args
     * @param {String} args.webhookUrl
     */
    constructor(args: DiscordStreamOption);
    /**
     * @param chunk
     * @returns {Promise}
     */
    write(chunk: any): boolean;
    /**
     * Sends HTTP request to Discord webhook
     *
     * @param requestBody
     * @private
     */
    private sendHttpRequest;
}
export {};
//# sourceMappingURL=index.d.ts.map