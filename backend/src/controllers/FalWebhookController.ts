import { Request, Response } from 'express';
import { VersionRepository } from '../db/VersionRepository';
import { RedisPublisher } from '../realtime/RedisPublisher';

export class FalWebhookController {
  static async handleFalWebhook(req: Request, res: Response): Promise<Response> {
    const { versionId, shotId, imageUrl } = req.body as {
      versionId: string;
      shotId: string;
      imageUrl: string;
    };

    await VersionRepository.updateVersionStatus(versionId, 'IMAGE_READY', {
      shotId,
      imageUrl
    });

    await RedisPublisher.publishShotUpdated({
      event: 'SHOT_UPDATED',
      shotId,
      versionId
    });

    return res.sendStatus(200);
  }
}

