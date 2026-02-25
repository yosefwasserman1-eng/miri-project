import type { Shot } from '../schemas';

export interface GenerationRequestPayload {
  shot: Shot;
  webhookUrl: string;
  // Placeholder for any provider-specific options.
  [key: string]: unknown;
}

export const ModelProvider = {
  // Stubbed model call; real FAL/Vertex integration will be added later.
  async requestGeneration(_payload: GenerationRequestPayload): Promise<{ jobId: string }> {
    return { jobId: 'stub-job' };
  }
};

