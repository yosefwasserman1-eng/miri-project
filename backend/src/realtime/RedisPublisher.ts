import Redis from 'ioredis';

export interface ShotUpdatedEventPayload {
  event: 'SHOT_UPDATED';
  shotId: string;
  versionId: string;
  status?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

const CHANNEL = 'SHOT_UPDATED';

function getRedisUrl(): string {
  return process.env.REDIS_URL ?? 'redis://localhost:6379';
}

let publisher: Redis | null = null;

function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(getRedisUrl());
  }
  return publisher;
}

export const RedisPublisher = {
  async publishShotUpdated(payload: ShotUpdatedEventPayload): Promise<void> {
    const client = getPublisher();
    await client.publish(CHANNEL, JSON.stringify(payload));
  }
};

