"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShotSchema = exports.AgentConfigSchema = exports.ProjectConfigSchema = void 0;
const zod_1 = require("zod");
exports.ProjectConfigSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    projectName: zod_1.z.string(),
    globalSettings: zod_1.z.object({
        llmModel: zod_1.z.string(), // e.g., "gemini-3.1-pro-preview"
        imageModel: zod_1.z.string(), // e.g., "flux-2-turbo"
        videoModel: zod_1.z.string(), // e.g., "kling-o3"
        loraWeightsId: zod_1.z.string(), // e.g., "miriN14"
        requireHumanApproval: zod_1.z.boolean().default(true)
    }),
    creationTimestamp: zod_1.z.string().datetime()
});
exports.AgentConfigSchema = zod_1.z.object({
    configId: zod_1.z.string().uuid(),
    role: zod_1.z.enum(['ORCHESTRATOR', 'AUDITOR', 'VISION_ANALYZER', 'DIRECTOR']),
    modelString: zod_1.z.string(),
    active: zod_1.z.boolean(),
    updatedAt: zod_1.z.string().datetime()
});
exports.ShotSchema = zod_1.z.object({
    shotId: zod_1.z.string().uuid(),
    sceneId: zod_1.z.string().uuid(),
    timestamps: zod_1.z.object({ startMs: zod_1.z.number(), endMs: zod_1.z.number() }),
    lyricsSnippet: zod_1.z.string(),
    status: zod_1.z.enum([
        'DRAFT',
        'AWAITING_APPROVAL',
        'REFINING',
        'GENERATING_VIDEO',
        'COMPLETED',
        'FAILED'
    ]),
    versions: zod_1.z.array(zod_1.z.string().uuid())
});
