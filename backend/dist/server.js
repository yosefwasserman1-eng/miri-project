"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const SocketServer_1 = require("./realtime/SocketServer");
const PORT = Number(process.env.PORT) || 3000;
const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
const httpServer = http_1.default.createServer(app_1.app);
(0, SocketServer_1.createSocketServer)(httpServer, REDIS_URL);
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
