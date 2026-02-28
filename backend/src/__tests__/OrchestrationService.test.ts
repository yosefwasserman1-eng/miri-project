import { ShotSchema } from '../schemas';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Database and ModelProvider modules.
vi.mock(
  '../db/VersionRepository',
  () => ({
    VersionRepository: {
      insertVersion: vi.fn().mockResolvedValue('version-id-123')
    }
  })
);

vi.mock(
  '../providers/ModelProvider',
  () => ({
    ModelProvider: {
      requestGeneration: vi.fn().mockResolvedValue({ jobId: 'job-123' })
    }
  })
);

describe('OrchestrationService.startGenerationFlow', () => {
  it('persists a PENDING version and calls ModelProvider with webhook URL', async () => {
    const { VersionRepository } = await import('../db/VersionRepository');
    const { ModelProvider } = await import('../providers/ModelProvider');
    const { OrchestrationService } = await import('../services/OrchestrationService');

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
        webhookUrl,
        versionId: 'version-id-123'
      })
    );
  });
});

