import { ShotSchema } from '../schemas';

const queueSubmitMock = jest.fn().mockResolvedValue({ requestId: 'req-123' });

jest.mock(
  '@fal-ai/client',
  () => ({
    fal: {
      queue: {
        submit: queueSubmitMock
      },
      config: jest.fn()
    }
  }),
  { virtual: true }
);

describe('ModelProvider.requestGeneration', () => {
  it('submits a flux-2 generation with required prompt constraints and webhook URL', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { fal } = require('@fal-ai/client');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ModelProvider } = require('../providers/ModelProvider');

    const shot = ShotSchema.parse({
      shotId: '550e8400-e29b-41d4-a716-446655440300',
      sceneId: '550e8400-e29b-41d4-a716-446655440301',
      timestamps: { startMs: 0, endMs: 4000 },
      lyricsSnippet: 'A gentle, hopeful verse about sunrise',
      status: 'DRAFT',
      versions: []
    });

    const webhookUrl = 'https://example.com/api/webhooks/fal';

    await ModelProvider.requestGeneration({
      shot,
      webhookUrl
    });

    expect(fal.queue.submit).toHaveBeenCalledTimes(1);

    const [endpointId, options] = (fal.queue.submit as jest.Mock).mock
      .calls[0] as [string, { webhookUrl: string; input: { prompt: string } }];

    expect(endpointId).toBe('fal-ai/flux-2');
    expect(options.webhookUrl).toBe(webhookUrl);

    const { prompt } = options.input;

    expect(prompt).toEqual(expect.stringContaining('miriN14'));
    expect(prompt).toEqual(expect.stringContaining('Mouth CLOSED'));
    expect(prompt).toEqual(expect.stringContaining('Heavy fabric'));
    expect(prompt).toEqual(expect.stringContaining('Mid-calf skirt'));
    expect(prompt).toEqual(expect.stringContaining(shot.lyricsSnippet));
  });
});

