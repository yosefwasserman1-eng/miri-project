import type { Server as HttpServer } from 'http';

const ioOnMock = jest.fn();
const ioEmitMock = jest.fn();

const ioInstance = {
  on: ioOnMock,
  emit: ioEmitMock
};

const SocketIOServerMock = jest.fn().mockReturnValue(ioInstance);

jest.mock(
  'socket.io',
  () => ({
    Server: SocketIOServerMock
  }),
  { virtual: true }
);

const redisSubscribeMock = jest.fn();
const redisOnMock = jest.fn();

const RedisMock = jest.fn().mockImplementation(() => ({
  subscribe: redisSubscribeMock,
  on: redisOnMock
}));

jest.mock('ioredis', () => RedisMock, { virtual: true });

describe('SocketServer.createSocketServer', () => {
  it('creates a Socket.io server and wires Redis Pub/Sub for SHOT_UPDATED events', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createSocketServer } = require('../realtime/SocketServer');

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

