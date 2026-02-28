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
    const versionId = await VersionRepository.insertVersion({
      shotId: shot.shotId,
      status: 'PENDING'
    });

    await ModelProvider.requestGeneration({
      shot,
      webhookUrl,
      versionId
    });
  }
}

