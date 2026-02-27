import type { ShotUpdatedEventPayload } from '../realtime/RedisPublisher';

const redisPublishMock = jest.fn();

const RedisMock = jest.fn().mockImplementation(() => ({
  publish: redisPublishMock,
  disconnect: jest.fn()
}));

jest.mock('ioredis', () => RedisMock, { virtual: true });

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

