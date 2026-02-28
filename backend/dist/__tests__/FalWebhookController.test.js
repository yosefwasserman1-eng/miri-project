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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const vitest_1 = require("vitest");
vitest_1.vi.mock('../db/VersionRepository', () => ({
    VersionRepository: {
        updateVersionStatus: vitest_1.vi.fn()
    }
}));
vitest_1.vi.mock('../realtime/RedisPublisher', () => ({
    RedisPublisher: {
        publishShotUpdated: vitest_1.vi.fn()
    }
}));
(0, vitest_1.describe)('FalWebhookController - POST /api/webhooks/fal', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { FalWebhookController } = await Promise.resolve().then(() => __importStar(require('../controllers/FalWebhookController')));
        app.post('/api/webhooks/fal', FalWebhookController.handleFalWebhook);
    });
    (0, vitest_1.it)('updates Version status to IMAGE_READY and publishes SHOT_UPDATED', async () => {
        const payload = {
            versionId: 'version-123',
            shotId: '550e8400-e29b-41d4-a716-446655440200',
            imageUrl: 'https://example.com/image.png'
        };
        const { VersionRepository } = await Promise.resolve().then(() => __importStar(require('../db/VersionRepository')));
        const { RedisPublisher } = await Promise.resolve().then(() => __importStar(require('../realtime/RedisPublisher')));
        const response = await (0, supertest_1.default)(app)
            .post('/api/webhooks/fal')
            .send(payload)
            .set('Content-Type', 'application/json');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(VersionRepository.updateVersionStatus).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(VersionRepository.updateVersionStatus).toHaveBeenCalledWith(payload.versionId, 'IMAGE_READY', vitest_1.expect.objectContaining({
            shotId: payload.shotId,
            imageUrl: payload.imageUrl
        }));
        (0, vitest_1.expect)(RedisPublisher.publishShotUpdated).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(RedisPublisher.publishShotUpdated).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            event: 'SHOT_UPDATED',
            shotId: payload.shotId,
            versionId: payload.versionId
        }));
    });
});
