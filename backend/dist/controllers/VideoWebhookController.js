"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoWebhookController = void 0;
const VersionRepository_1 = require("../db/VersionRepository");
const RedisPublisher_1 = require("../realtime/RedisPublisher");
class VideoWebhookController {
    static async handleVideoWebhook(req, res) {
        const { versionId, shotId, videoUrl } = req.body;
        await VersionRepository_1.VersionRepository.updateVersionStatus(versionId, 'COMPLETED', {
            shotId,
            videoUrl
        });
        await RedisPublisher_1.RedisPublisher.publishShotUpdated({
            event: 'SHOT_UPDATED',
            shotId,
            versionId
        });
        return res.sendStatus(200);
    }
}
exports.VideoWebhookController = VideoWebhookController;
