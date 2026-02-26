import type { Shot } from '../schemas';
import { VersionRepository } from '../db/VersionRepository';
import { ModelProvider } from '../providers/ModelProvider';

export class OrchestrationService {
  /**
   * Stateless orchestration:
   * - Insert a new Version with STATUS: 'PENDING'
   * - Trigger the ModelProvider with the shot payload and webhook URL
   * - Resolve immediately without waiting for any external completion
   */
  static async startGenerationFlow(shot: Shot, webhookUrl: string): Promise<void> {
    // Parallelize DB insertion and External API call to reduce total latency.
    await Promise.all([
      VersionRepository.insertVersion({
        shotId: shot.shotId,
        status: 'PENDING'
      }),
      ModelProvider.requestGeneration({
        shot,
        webhookUrl
      })
    ]);
  }
}

