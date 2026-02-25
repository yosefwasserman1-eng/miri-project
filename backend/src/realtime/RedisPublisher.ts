export interface ShotUpdatedEventPayload {
  event: 'SHOT_UPDATED';
  shotId: string;
  versionId: string;
  [key: string]: unknown;
}

export const RedisPublisher = {
  // Stubbed Redis Pub/Sub publisher; real implementation will be added later.
  async publishShotUpdated(_payload: ShotUpdatedEventPayload): Promise<void> {
    return;
  }
};

