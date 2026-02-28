"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPublisher = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const CHANNEL = 'SHOT_UPDATED';
function getRedisUrl() {
    return process.env.REDIS_URL ?? 'redis://localhost:6379';
}
let publisher = null;
function getPublisher() {
    if (!publisher) {
        publisher = new ioredis_1.default(getRedisUrl());
    }
    return publisher;
}
exports.RedisPublisher = {
    async publishShotUpdated(payload) {
        const client = getPublisher();
        await client.publish(CHANNEL, JSON.stringify(payload));
    }
};
