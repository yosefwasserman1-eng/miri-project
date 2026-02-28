"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../schemas");
const vitest_1 = require("vitest");
// Mock the Database and ModelProvider modules.
vitest_1.vi.mock('../db/VersionRepository', () => ({
    VersionRepository: {
        insertVersion: vitest_1.vi.fn().mockResolvedValue('version-id-123')
    }
}));
vitest_1.vi.mock('../providers/ModelProvider', () => ({
    ModelProvider: {
        requestGeneration: vitest_1.vi.fn().mockResolvedValue({ jobId: 'job-123' })
    }
}));
(0, vitest_1.describe)('OrchestrationService.startGenerationFlow', () => {
    (0, vitest_1.it)('persists a PENDING version and calls ModelProvider with webhook URL', async () => {
        const { VersionRepository } = await Promise.resolve().then(() => __importStar(require('../db/VersionRepository')));
        const { ModelProvider } = await Promise.resolve().then(() => __importStar(require('../providers/ModelProvider')));
        const { OrchestrationService } = await Promise.resolve().then(() => __importStar(require('../services/OrchestrationService')));
        const validShot = schemas_1.ShotSchema.parse({
            shotId: '550e8400-e29b-41d4-a716-446655440010',
            sceneId: '550e8400-e29b-41d4-a716-446655440011',
            timestamps: { startMs: 0, endMs: 5000 },
            lyricsSnippet: 'Sample lyrics for orchestration',
            status: 'DRAFT',
            versions: []
        });
        const webhookUrl = 'https://example.com/webhooks/fal';
        await OrchestrationService.startGenerationFlow(validShot, webhookUrl);
        (0, vitest_1.expect)(VersionRepository.insertVersion).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(VersionRepository.insertVersion).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            shotId: validShot.shotId,
            status: 'PENDING'
        }));
        (0, vitest_1.expect)(ModelProvider.requestGeneration).toHaveBeenCalledTimes(1);
        (0, vitest_1.expect)(ModelProvider.requestGeneration).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            shot: validShot,
            webhookUrl,
            versionId: 'version-id-123'
        }));
    });
});
