import { Request, Response } from 'express';
import { VersionRepository } from '../db/VersionRepository';
import { RedisPublisher } from '../realtime/RedisPublisher';

export class FalWebhookController {
  static async handleFalWebhook(req: Request, res: Response): Promise<Response> {
    const versionId = (req.query.versionId as string) ?? (req.body?.versionId as string);
    const shotId = (req.query.shotId as string) ?? (req.body?.shotId as string);
    const imageUrl =
      (req.body?.imageUrl as string) ??
      (req.body?.images?.[0]?.url as string) ??
      (req.body?.output?.images?.[0]?.url as string);

    if (!versionId || !shotId) {
      return res.status(400).json({ error: 'Missing versionId or shotId' });
    }

    await VersionRepository.updateVersionStatus(versionId, 'IMAGE_READY', {
      shotId,
      ...(imageUrl && { imageUrl })
    });

    await RedisPublisher.publishShotUpdated({
      event: 'SHOT_UPDATED',
      shotId,
      versionId,
      status: 'IMAGE_READY',
      ...(imageUrl && { imageUrl })
    });

    return res.sendStatus(200);
  }
}

