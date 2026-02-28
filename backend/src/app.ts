import express from 'express';
import { GenerationController } from './controllers/GenerationController';
import { FalWebhookController } from './controllers/FalWebhookController';
import { VideoWebhookController } from './controllers/VideoWebhookController';

const app = express();

app.use(express.json());

app.post('/api/shots/generate', GenerationController.handleGenerate);
app.post('/api/webhooks/fal', FalWebhookController.handleFalWebhook);
app.post('/api/webhooks/video', VideoWebhookController.handleVideoWebhook);

export { app };

