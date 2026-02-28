import http from 'http';
import { app } from './app';
import { createSocketServer } from './realtime/SocketServer';

const PORT = Number(process.env.PORT) || 3000;
const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

const httpServer = http.createServer(app);

createSocketServer(httpServer, REDIS_URL);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
