import type { ShotUpdatedEventPayload } from '../realtime/RedisPublisher';
import { describe, it, expect, vi } from 'vitest';

const redisPublishMock = vi.fn();

const RedisMock = vi.fn().mockImplementation(() => ({
  publish: redisPublishMock,
  disconnect: vi.fn()
}));

vi.mock('ioredis', () => ({
  default: RedisMock
}));

describe('RedisPublisher.publishShotUpdated', () => {
  it('publishes SHOT_UPDATED events to the Redis channel with the correct payload', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { RedisPublisher } = require('../realtime/RedisPublisher');

    const payload: ShotUpdatedEventPayload = {
      event: 'SHOT_UPDATED',
      shotId: 'shot-123',
      versionId: 'version-456'
    };

    await RedisPublisher.publishShotUpdated(payload);

    expect(RedisMock).toHaveBeenCalledTimes(1);
    expect(redisPublishMock).toHaveBeenCalledWith('SHOT_UPDATED', JSON.stringify(payload));
  });
});

