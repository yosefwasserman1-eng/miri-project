import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';
import type { ShotUpdatedEventPayload } from './RedisPublisher';

export function createSocketServer(httpServer: HttpServer, redisUrl: string) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*'
    }
  });

  const subscriber = new Redis(redisUrl);

  subscriber.subscribe('SHOT_UPDATED');

  subscriber.on('message', (_channel: string, message: string) => {
    const payload = JSON.parse(message) as ShotUpdatedEventPayload;

    if (payload.event === 'SHOT_UPDATED') {
      io.emit('SHOT_UPDATED', payload);
    }
  });

  return io;
}

