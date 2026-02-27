import type { Request, Response } from 'express';
import { VersionRepository } from '../db/VersionRepository';
import { RedisPublisher } from '../realtime/RedisPublisher';

export class VideoWebhookController {
  static async handleVideoWebhook(req: Request, res: Response): Promise<Response> {
    const { versionId, shotId, videoUrl } = req.body as {
      versionId: string;
      shotId: string;
      videoUrl: string;
    };

    await VersionRepository.updateVersionStatus(versionId, 'COMPLETED', {
      shotId,
      videoUrl
    });

    await RedisPublisher.publishShotUpdated({
      event: 'SHOT_UPDATED',
      shotId,
      versionId
    });

    return res.sendStatus(200);
  }
}

