import express from 'express';
import { GenerationController } from './controllers/GenerationController';

const app = express();

app.use(express.json());

app.post('/api/shots/generate', GenerationController.handleGenerate);

export { app };

