"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationService = void 0;
const VersionRepository_1 = require("../db/VersionRepository");
const ModelProvider_1 = require("../providers/ModelProvider");
class OrchestrationService {
    /**
     * Stateless orchestration:
     * - Insert a new Version with STATUS: 'PENDING'
     * - Trigger the ModelProvider with the shot payload and webhook URL
     * - Resolve immediately without waiting for any external completion
     */
    static async startGenerationFlow(shot, webhookUrl) {
        // Parallelize DB insertion and External API call to reduce total latency.
        await Promise.all([
            VersionRepository_1.VersionRepository.insertVersion({
                shotId: shot.shotId,
                status: 'PENDING'
            }),
            ModelProvider_1.ModelProvider.requestGeneration({
                shot,
                webhookUrl
            })
        ]);
    }
}
exports.OrchestrationService = OrchestrationService;
