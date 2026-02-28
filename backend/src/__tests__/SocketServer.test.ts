import type { Server as HttpServer } from 'http';
import { describe, it, expect, vi } from 'vitest';

const ioOnMock = vi.fn();
const ioEmitMock = vi.fn();

const ioInstance = {
  on: ioOnMock,
  emit: ioEmitMock
};

const SocketIOServerMock = vi.fn(function (this: unknown) {
  return ioInstance;
});

vi.mock(
  'socket.io',
  () => ({
    Server: SocketIOServerMock
  })
);

const redisSubscribeMock = vi.fn();
const redisOnMock = vi.fn();

const RedisMock = vi.fn(function (this: unknown) {
  return { subscribe: redisSubscribeMock, on: redisOnMock };
});

vi.mock('ioredis', () => ({
  default: RedisMock
}));

describe('SocketServer.createSocketServer', () => {
  it('creates a Socket.io server and wires Redis Pub/Sub for SHOT_UPDATED events', async () => {
    const { createSocketServer } = await import('../realtime/SocketServer');

    const httpServer = {} as HttpServer;
    const redisUrl = 'redis://localhost:6379';

    const io = createSocketServer(httpServer, redisUrl);

    expect(SocketIOServerMock).toHaveBeenCalledTimes(1);
    expect(SocketIOServerMock).toHaveBeenCalledWith(httpServer, expect.any(Object));

    expect(RedisMock).toHaveBeenCalledTimes(1);
    expect(RedisMock).toHaveBeenCalledWith(redisUrl);

    expect(redisSubscribeMock).toHaveBeenCalledWith('SHOT_UPDATED');
    expect(redisOnMock).toHaveBeenCalledWith('message', expect.any(Function));

    // When a SHOT_UPDATED message is received on the Redis channel,
    // the payload is parsed and emitted to all connected Socket.io clients.
    const messageHandler = redisOnMock.mock.calls[0][1] as (
      channel: string,
      message: string
    ) => void;

    const payload = {
      event: 'SHOT_UPDATED' as const,
      shotId: 'shot-123',
      versionId: 'version-456'
    };

    messageHandler('SHOT_UPDATED', JSON.stringify(payload));

    expect(io).toBe(ioInstance);
    expect(ioEmitMock).toHaveBeenCalledWith('SHOT_UPDATED', payload);
  });
});

