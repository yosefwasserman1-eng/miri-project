"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
function createSocketServer(httpServer, redisUrl) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*'
        }
    });
    const subscriber = new ioredis_1.default(redisUrl);
    subscriber.subscribe('SHOT_UPDATED');
    subscriber.on('message', (_channel, message) => {
        const payload = JSON.parse(message);
        if (payload.event === 'SHOT_UPDATED') {
            io.emit('SHOT_UPDATED', payload);
        }
    });
    return io;
}
