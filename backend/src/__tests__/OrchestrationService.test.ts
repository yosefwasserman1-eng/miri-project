import { ShotSchema } from '../schemas';

// Mock the Database and ModelProvider modules.
jest.mock(
  '../db/VersionRepository',
  () => ({
    VersionRepository: {
      insertVersion: jest.fn()
    }
  }),
  { virtual: true }
);

jest.mock(
  '../providers/ModelProvider',
  () => ({
    ModelProvider: {
      requestGeneration: jest.fn().mockResolvedValue({ jobId: 'job-123' })
    }
  }),
  { virtual: true }
);

describe('OrchestrationService.startGenerationFlow', () => {
  it('persists a PENDING version and calls ModelProvider with webhook URL', async () => {
    // Load mocked modules
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { VersionRepository } = require('../db/VersionRepository');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ModelProvider } = require('../providers/ModelProvider');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OrchestrationService } = require('../services/OrchestrationService');

    const validShot = ShotSchema.parse({
      shotId: '550e8400-e29b-41d4-a716-446655440010',
      sceneId: '550e8400-e29b-41d4-a716-446655440011',
      timestamps: { startMs: 0, endMs: 5000 },
      lyricsSnippet: 'Sample lyrics for orchestration',
      status: 'DRAFT',
      versions: []
    });

    const webhookUrl = 'https://example.com/webhooks/fal';

    await OrchestrationService.startGenerationFlow(validShot, webhookUrl);

    expect(VersionRepository.insertVersion).toHaveBeenCalledTimes(1);
    expect(VersionRepository.insertVersion).toHaveBeenCalledWith(
      expect.objectContaining({
        shotId: validShot.shotId,
        status: 'PENDING'
      })
    );

    expect(ModelProvider.requestGeneration).toHaveBeenCalledTimes(1);
    expect(ModelProvider.requestGeneration).toHaveBeenCalledWith(
      expect.objectContaining({
        shot: validShot,
        webhookUrl
      })
    );
  });
});

