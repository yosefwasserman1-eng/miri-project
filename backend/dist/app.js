"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const GenerationController_1 = require("./controllers/GenerationController");
const FalWebhookController_1 = require("./controllers/FalWebhookController");
const VideoWebhookController_1 = require("./controllers/VideoWebhookController");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.post('/api/shots/generate', GenerationController_1.GenerationController.handleGenerate);
app.post('/api/webhooks/fal', FalWebhookController_1.FalWebhookController.handleFalWebhook);
app.post('/api/webhooks/video', VideoWebhookController_1.VideoWebhookController.handleVideoWebhook);
