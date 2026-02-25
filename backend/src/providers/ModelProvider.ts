import { fal } from '@fal-ai/client';
import type { Shot } from '../schemas';

export interface GenerationRequestPayload {
  shot: Shot;
  webhookUrl: string;
  // Placeholder for any provider-specific options.
  [key: string]: unknown;
}

export const ModelProvider = {
  async requestGeneration(payload: GenerationRequestPayload): Promise<unknown> {
    const { shot, webhookUrl } = payload;

    const prompt = [
      'Child physique, Young girl, Loose fit, Heavy fabric, Mid-calf skirt, Mouth CLOSED, miriN14.',
      'Start frame: calm, neutral pose before any action.',
      shot.lyricsSnippet
    ].join(' ');

    return fal.queue.submit('fal-ai/flux-2', {
      webhookUrl,
      input: {
        prompt
      }
    });
  }
};

