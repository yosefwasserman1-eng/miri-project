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
const queueSubmitMock = vitest_1.vi.fn().mockResolvedValue({ requestId: 'req-123' });
vitest_1.vi.mock('@fal-ai/client', () => ({
    fal: {
        queue: {
            submit: queueSubmitMock
        },
        config: vitest_1.vi.fn()
    }
}));
(0, vitest_1.describe)('ModelProvider.requestGeneration', () => {
    (0, vitest_1.it)('submits a flux-2 generation with required prompt constraints and webhook URL', async () => {
        const { fal } = await Promise.resolve().then(() => __importStar(require('@fal-ai/client')));
        const { ModelProvider } = await Promise.resolve().then(() => __importStar(require('../providers/ModelProvider')));
        const shot = schemas_1.ShotSchema.parse({
            shotId: '550e8400-e29b-41d4-a716-446655440300',
            sceneId: '550e8400-e29b-41d4-a716-446655440301',
            timestamps: { startMs: 0, endMs: 4000 },
            lyricsSnippet: 'A gentle, hopeful verse about sunrise',
            status: 'DRAFT',
            versions: []
        });
        const webhookUrl = 'https://example.com/api/webhooks/fal';
        const versionId = 'version-456';
        await ModelProvider.requestGeneration({
            shot,
            webhookUrl,
            versionId
        });
        (0, vitest_1.expect)(fal.queue.submit).toHaveBeenCalledTimes(1);
        const [endpointId, options] = fal.queue.submit.mock
            .calls[0];
        (0, vitest_1.expect)(endpointId).toBe('fal-ai/flux-2');
        (0, vitest_1.expect)(options.webhookUrl).toContain(webhookUrl);
        (0, vitest_1.expect)(options.webhookUrl).toContain('versionId=version-456');
        (0, vitest_1.expect)(options.webhookUrl).toContain('shotId=550e8400-e29b-41d4-a716-446655440300');
        const { prompt } = options.input;
        (0, vitest_1.expect)(prompt).toEqual(vitest_1.expect.stringContaining('miriN14'));
        (0, vitest_1.expect)(prompt).toEqual(vitest_1.expect.stringContaining('Mouth CLOSED'));
        (0, vitest_1.expect)(prompt).toEqual(vitest_1.expect.stringContaining('Heavy fabric'));
        (0, vitest_1.expect)(prompt).toEqual(vitest_1.expect.stringContaining('Mid-calf skirt'));
        (0, vitest_1.expect)(prompt).toEqual(vitest_1.expect.stringContaining(shot.lyricsSnippet));
    });
});
