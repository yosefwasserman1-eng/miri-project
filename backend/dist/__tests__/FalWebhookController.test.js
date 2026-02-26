"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
jest.mock('../db/VersionRepository', () => ({
    VersionRepository: {
        updateVersionStatus: jest.fn()
    }
}));
jest.mock('../realtime/RedisPublisher', () => ({
    RedisPublisher: {
        publishShotUpdated: jest.fn()
    }
}), { virtual: true });
describe('FalWebhookController - POST /api/webhooks/fal', () => {
    let app;
    beforeAll(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { FalWebhookController } = require('../controllers/FalWebhookController');
        app.post('/api/webhooks/fal', FalWebhookController.handleFalWebhook);
    });
    it('updates Version status to IMAGE_READY and publishes SHOT_UPDATED', async () => {
        const payload = {
            versionId: 'version-123',
            shotId: '550e8400-e29b-41d4-a716-446655440200',
            imageUrl: 'https://example.com/image.png'
        };
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { VersionRepository } = require('../db/VersionRepository');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { RedisPublisher } = require('../realtime/RedisPublisher');
        const response = await (0, supertest_1.default)(app)
            .post('/api/webhooks/fal')
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
        expect(VersionRepository.updateVersionStatus).toHaveBeenCalledTimes(1);
        expect(VersionRepository.updateVersionStatus).toHaveBeenCalledWith(payload.versionId, 'IMAGE_READY', expect.objectContaining({
            shotId: payload.shotId,
            imageUrl: payload.imageUrl
        }));
        expect(RedisPublisher.publishShotUpdated).toHaveBeenCalledTimes(1);
        expect(RedisPublisher.publishShotUpdated).toHaveBeenCalledWith(expect.objectContaining({
            event: 'SHOT_UPDATED',
            shotId: payload.shotId,
            versionId: payload.versionId
        }));
    });
});
