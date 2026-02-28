"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationController = void 0;
const schemas_1 = require("../schemas");
const OrchestrationService_1 = require("../services/OrchestrationService");
class GenerationController {
    static handleGenerate(req, res) {
        const parseResult = schemas_1.ShotSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: parseResult.error.flatten()
            });
        }
        const webhookBase = process.env.WEBHOOK_BASE_URL ?? 'http://localhost:3000';
        const webhookUrl = `${webhookBase.replace(/\/$/, '')}/api/webhooks/fal`;
        OrchestrationService_1.OrchestrationService.startGenerationFlow(parseResult.data, webhookUrl);
        // Stateless Execution: immediately acknowledge and hand off to orchestration.
        return res.sendStatus(202);
    }
}
exports.GenerationController = GenerationController;
