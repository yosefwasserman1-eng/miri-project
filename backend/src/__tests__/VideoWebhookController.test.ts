import request from 'supertest';
import express, { Application } from 'express';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

vi.mock('../db/VersionRepository', () => ({
  VersionRepository: {
    updateVersionStatus: vi.fn()
  }
}));

vi.mock(
  '../realtime/RedisPublisher',
  () => ({
    RedisPublisher: {
      publishShotUpdated: vi.fn()
    }
  })
);

describe('VideoWebhookController - POST /api/webhooks/video', () => {
  let app: Application;

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    const { VideoWebhookController } = await import('../controllers/VideoWebhookController');

    app.post('/api/webhooks/video', VideoWebhookController.handleVideoWebhook);
  });

  it('updates Version status to COMPLETED and publishes SHOT_UPDATED for video readiness', async () => {
    const payload = {
      versionId: 'version-456',
      shotId: '550e8400-e29b-41d4-a716-446655440300',
      videoUrl: 'https://example.com/video.mp4'
    };

    const { VersionRepository } = await import('../db/VersionRepository');
    const { RedisPublisher } = await import('../realtime/RedisPublisher');

    const response = await request(app)
      .post('/api/webhooks/video')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);

    expect(VersionRepository.updateVersionStatus).toHaveBeenCalledTimes(1);
    expect(VersionRepository.updateVersionStatus).toHaveBeenCalledWith(
      payload.versionId,
      'COMPLETED',
      expect.objectContaining({
        shotId: payload.shotId,
        videoUrl: payload.videoUrl
      })
    );

    expect(RedisPublisher.publishShotUpdated).toHaveBeenCalledTimes(1);
    expect(RedisPublisher.publishShotUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'SHOT_UPDATED',
        shotId: payload.shotId,
        versionId: payload.versionId
      })
    );
  });
});

