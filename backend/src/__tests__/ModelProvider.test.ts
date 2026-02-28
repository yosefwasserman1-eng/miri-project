import { ShotSchema } from '../schemas';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const queueSubmitMock = vi.fn().mockResolvedValue({ requestId: 'req-123' });

vi.mock(
  '@fal-ai/client',
  () => ({
    fal: {
      queue: {
        submit: queueSubmitMock
      },
      config: vi.fn()
    }
  })
);

describe('ModelProvider.requestGeneration', () => {
  it('submits a flux-2 generation with required prompt constraints and webhook URL', async () => {
    const { fal } = await import('@fal-ai/client');
    const { ModelProvider } = await import('../providers/ModelProvider');

    const shot = ShotSchema.parse({
      shotId: '550e8400-e29b-41d4-a716-446655440300',
      sceneId: '550e8400-e29b-41d4-a716-446655440301',
      timestamps: { startMs: 0, endMs: 4000 },
      lyricsSnippet: 'A gentle, hopeful verse about sunrise',
      status: 'DRAFT',
      versions: []
    });

    const webhookUrl = 'https://example.com/api/webhooks/fal';
    const versionId = 'version-456';

    await ModelProvider.requestGeneration({
      shot,
      webhookUrl,
      versionId
    });

    expect(fal.queue.submit).toHaveBeenCalledTimes(1);

    const [endpointId, options] = (fal.queue.submit as any).mock
      .calls[0] as [string, { webhookUrl: string; input: { prompt: string } }];

    expect(endpointId).toBe('fal-ai/flux-2');
    expect(options.webhookUrl).toContain(webhookUrl);
    expect(options.webhookUrl).toContain('versionId=version-456');
    expect(options.webhookUrl).toContain('shotId=550e8400-e29b-41d4-a716-446655440300');

    const { prompt } = options.input;

    expect(prompt).toEqual(expect.stringContaining('miriN14'));
    expect(prompt).toEqual(expect.stringContaining('Mouth CLOSED'));
    expect(prompt).toEqual(expect.stringContaining('Heavy fabric'));
    expect(prompt).toEqual(expect.stringContaining('Mid-calf skirt'));
    expect(prompt).toEqual(expect.stringContaining(shot.lyricsSnippet));
  });
});

