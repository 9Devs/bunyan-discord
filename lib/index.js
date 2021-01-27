"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordStream = void 0;
var cross_fetch_1 = require("cross-fetch");
var stream_1 = require("stream");
var DEFAULT_DISCORD_EMBED_AVATAR_URL = '';
var DEFAULT_DISCORD_EMBED_COLOR = 9807270;
var ERROR_DISCORD_EMBED_AVATAR_URL = 'https://i.imgur.com/60Llv9W.png';
var ERROR_DISCORD_EMBED_COLOR = 15158332;
/**
 * Pushes log streams to a Discord webhook
 */
var DiscordStream = /** @class */ (function (_super) {
    __extends(DiscordStream, _super);
    /**
     * @param {Object} args
     * @param {String} args.webhookUrl
     */
    function DiscordStream(args) {
        var _this = _super.call(this) || this;
        _this.args = args;
        _this.args = args;
        return _this;
    }
    /**
     * @param chunk
     * @returns {Promise}
     */
    DiscordStream.prototype.write = function (chunk) {
        var chunkJson = JSON.parse(chunk.toString());
        var name = chunkJson.name, msg = chunkJson.msg, err = chunkJson.err, time = chunkJson.time;
        var author = { icon_url: DEFAULT_DISCORD_EMBED_AVATAR_URL };
        var avatar_url = DEFAULT_DISCORD_EMBED_AVATAR_URL;
        var color = DEFAULT_DISCORD_EMBED_COLOR;
        var fields = [
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
        ];
        if (err) {
            fields.push({
                name: 'Error details:',
                value: JSON.stringify(err),
            });
            author.icon_url = ERROR_DISCORD_EMBED_AVATAR_URL;
            avatar_url = ERROR_DISCORD_EMBED_AVATAR_URL;
            color = ERROR_DISCORD_EMBED_COLOR;
        }
        this.sendHttpRequest({
            avatar_url: avatar_url,
            embeds: [{
                    author: author,
                    color: color,
                    fields: fields,
                }],
        }).catch(function (err) { return console.error(err); });
        return true;
    };
    /**
     * Sends HTTP request to Discord webhook
     *
     * @param requestBody
     * @private
     */
    DiscordStream.prototype.sendHttpRequest = function (requestBody) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchResponse, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cross_fetch_1.fetch(this.args.webhookUrl, {
                            body: JSON.stringify(requestBody),
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                    case 1:
                        fetchResponse = _a.sent();
                        if (fetchResponse.status >= 400) {
                            error = new Error('Request to discord webhook failed');
                            error.code = fetchResponse.status;
                            throw error;
                        }
                        return [2 /*return*/, fetchResponse];
                }
            });
        });
    };
    return DiscordStream;
}(stream_1.Writable));
exports.DiscordStream = DiscordStream;
//# sourceMappingURL=index.js.map