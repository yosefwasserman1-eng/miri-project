"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ioOnMock = vitest_1.vi.fn();
const ioEmitMock = vitest_1.vi.fn();
const ioInstance = {
    on: ioOnMock,
    emit: ioEmitMock
};
const SocketIOServerMock = vitest_1.vi.fn(function () {
    return ioInstance;
});
vitest_1.vi.mock('socket.io', () => ({
    Server: SocketIOServerMock
}));
const redisSubscribeMock = vitest_1.vi.fn();
const redisOnMock = vitest_1.vi.fn();
const RedisMock = vitest_1.vi.fn(function () {
    return { subscribe: redisSubscribeMock, on: redisOnMock };
});
vitest_1.vi.mock('ioredis', () => ({
    default: RedisMock
}));
(0, vitest_1.describe)('SocketServer.createSocketServer', () => {
    (0, vitest_1.it)('creates a Socket.io server and wires Redis Pub/Sub for SHOT_UPDATED events', async () => {
        const { createSocketServer } = await Promise.resolve().then(() => __importStar(require('../realtime/SocketServer')));
        const httpServer = {};
        const redisUrl = 'redis://localhost:6379';
        const io = createSocketServer(httpServer, redisUrl);
        (0, vitest_1.expect)(SocketIOServerMock).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(SocketIOServerMock).toHaveBeenCalledWith(httpServer, vitest_1.expect.any(Object));
        (0, vitest_1.expect)(RedisMock).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(RedisMock).toHaveBeenCalledWith(redisUrl);
        (0, vitest_1.expect)(redisSubscribeMock).toHaveBeenCalledWith('SHOT_UPDATED');
        (0, vitest_1.expect)(redisOnMock).toHaveBeenCalledWith('message', vitest_1.expect.any(Function));
        // When a SHOT_UPDATED message is received on the Redis channel,
        // the payload is parsed and emitted to all connected Socket.io clients.
        const messageHandler = redisOnMock.mock.calls[0][1];
        const payload = {
            event: 'SHOT_UPDATED',
            shotId: 'shot-123',
            versionId: 'version-456'
        };
        messageHandler('SHOT_UPDATED', JSON.stringify(payload));
        (0, vitest_1.expect)(io).toBe(ioInstance);
        (0, vitest_1.expect)(ioEmitMock).toHaveBeenCalledWith('SHOT_UPDATED', payload);
    });
});
