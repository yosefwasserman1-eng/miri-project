import { Request, Response } from 'express';
import { ShotSchema } from '../schemas';
import { OrchestrationService } from '../services/OrchestrationService';

export class GenerationController {
  static handleGenerate(req: Request, res: Response): Response {
    const parseResult = ShotSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parseResult.error.flatten()
      });
    }

    const webhookBase = process.env.WEBHOOK_BASE_URL ?? 'http://localhost:3000';
    const webhookUrl = `${webhookBase.replace(/\/$/, '')}/api/webhooks/fal`;

    OrchestrationService.startGenerationFlow(parseResult.data, webhookUrl);

    // Stateless Execution: immediately acknowledge and hand off to orchestration.
    return res.sendStatus(202);
  }
}

