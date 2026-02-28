"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalWebhookController = void 0;
const VersionRepository_1 = require("../db/VersionRepository");
const RedisPublisher_1 = require("../realtime/RedisPublisher");
class FalWebhookController {
    static async handleFalWebhook(req, res) {
        const versionId = req.query.versionId ?? req.body?.versionId;
        const shotId = req.query.shotId ?? req.body?.shotId;
        const imageUrl = req.body?.imageUrl ??
            req.body?.images?.[0]?.url ??
            req.body?.output?.images?.[0]?.url;
        if (!versionId || !shotId) {
            return res.status(400).json({ error: 'Missing versionId or shotId' });
        }
        await VersionRepository_1.VersionRepository.updateVersionStatus(versionId, 'IMAGE_READY', {
            shotId,
            ...(imageUrl && { imageUrl })
        });
        await RedisPublisher_1.RedisPublisher.publishShotUpdated({
            event: 'SHOT_UPDATED',
            shotId,
            versionId,
            status: 'IMAGE_READY',
            ...(imageUrl && { imageUrl })
        });
        return res.sendStatus(200);
    }
}
exports.FalWebhookController = FalWebhookController;
