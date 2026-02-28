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
        const versionId = await VersionRepository_1.VersionRepository.insertVersion({
            shotId: shot.shotId,
            status: 'PENDING'
        });
        await ModelProvider_1.ModelProvider.requestGeneration({
            shot,
            webhookUrl,
            versionId
        });
    }
}
exports.OrchestrationService = OrchestrationService;
