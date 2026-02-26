"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalWebhookController = void 0;
const VersionRepository_1 = require("../db/VersionRepository");
const RedisPublisher_1 = require("../realtime/RedisPublisher");
class FalWebhookController {
    static async handleFalWebhook(req, res) {
        const { versionId, shotId, imageUrl } = req.body;
        await VersionRepository_1.VersionRepository.updateVersionStatus(versionId, 'IMAGE_READY', {
            shotId,
            imageUrl
        });
        await RedisPublisher_1.RedisPublisher.publishShotUpdated({
            event: 'SHOT_UPDATED',
            shotId,
            versionId
        });
        return res.sendStatus(200);
    }
}
exports.FalWebhookController = FalWebhookController;
