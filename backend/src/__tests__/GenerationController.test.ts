import request from 'supertest';
import express, { Application } from 'express';
import { ShotSchema } from '../schemas';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

vi.mock('../services/OrchestrationService', () => ({
  OrchestrationService: {
    startGenerationFlow: vi.fn()
  }
}));

describe('GenerationController - POST /api/shots/generate', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // NOTE: Route is wired to the GenerationController.
    // The orchestration wiring will be verified via TDD.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GenerationController } = require('../controllers/GenerationController');

    app.post('/api/shots/generate', GenerationController.handleGenerate);
  });

  it('returns 400 when request body fails Zod validation', async () => {
    const invalidPayload = {
      // missing required fields from ShotSchema, e.g. shotId, sceneId, timestamps
      lyricsSnippet: 123 // wrong type on purpose
    };

    const response = await request(app)
      .post('/api/shots/generate')
      .send(invalidPayload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('returns 202 when request body passes Zod validation', async () => {
    const validShot = ShotSchema.parse({
      shotId: '550e8400-e29b-41d4-a716-446655440000',
      sceneId: '550e8400-e29b-41d4-a716-446655440001',
      timestamps: { startMs: 0, endMs: 5000 },
      lyricsSnippet: 'Sample lyrics snippet',
      status: 'DRAFT',
      versions: []
    });

    const response = await request(app)
      .post('/api/shots/generate')
      .send(validShot)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(202);
  });

  it('delegates orchestration to OrchestrationService.startGenerationFlow on valid payload', async () => {
    const validShot = ShotSchema.parse({
      shotId: '550e8400-e29b-41d4-a716-446655440100',
      sceneId: '550e8400-e29b-41d4-a716-446655440101',
      timestamps: { startMs: 0, endMs: 8000 },
      lyricsSnippet: 'Delegation test lyrics snippet',
      status: 'DRAFT',
      versions: []
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OrchestrationService } = require('../services/OrchestrationService');

    const response = await request(app)
      .post('/api/shots/generate')
      .send(validShot)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(202);
    expect(OrchestrationService.startGenerationFlow).toHaveBeenCalledTimes(1);
    expect(OrchestrationService.startGenerationFlow).toHaveBeenCalledWith(
      validShot,
      expect.any(String)
    );
  });
});

