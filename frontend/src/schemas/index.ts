import { z } from 'zod';

/**
 * Zod Schema: User & Project Config Object (Global Settings)
 * Matches PRD Section 7 and Backend Implementation
 */
export const ProjectConfigSchema = z.object({
    projectId: z.string().uuid(),
    projectName: z.string(),
    globalSettings: z.object({
        llmModel: z.string(), // e.g., "gemini-3.1-pro-preview"
        imageModel: z.string(), // e.g., "flux-2-turbo"
        videoModel: z.string(), // e.g., "kling-o3"
        loraWeightsId: z.string(), // e.g., "miriN14"
        requireHumanApproval: z.boolean().default(true)
    }),
    creationTimestamp: z.string().datetime()
});

/**
 * Zod Schema: Agent Configs (Dynamic Models)
 * Matches PRD Section 7 and Backend Implementation
 */
export const AgentConfigSchema = z.object({
    configId: z.string().uuid(),
    role: z.enum(['ORCHESTRATOR', 'AUDITOR', 'VISION_ANALYZER', 'DIRECTOR']),
    modelString: z.string(),
    active: z.boolean(),
    updatedAt: z.string().datetime()
});

/**
 * Zod Schema: Version (Immutable Structure)
 * Represents a single iteration of a shot generation.
 * Based on PRD Section 3 (JSON Structured Prompting) and Section 5 (Webhooks).
 */
export const PromptSchema = z.object({
    scene: z.string(),
    subjects: z.array(z.object({
        type: z.string(),
        description: z.string(),
        pose: z.string(),
        position: z.string()
    })),
    style: z.string(),
    lighting: z.string(),
    camera: z.string()
});

export const VersionSchema = z.object({
    versionId: z.string().uuid(),
    shotId: z.string().uuid(),
    prompt: PromptSchema,
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    status: z.enum(['PENDING', 'IMAGE_READY', 'VIDEO_READY', 'FAILED']),
    createdAt: z.string().datetime()
});

/**
 * Zod Schema: Shot Metadata
 * Matches PRD Section 7 and Backend Implementation
 */
export const ShotSchema = z.object({
    shotId: z.string().uuid(),
    sceneId: z.string().uuid(),
    timestamps: z.object({ startMs: z.number(), endMs: z.number() }),
    lyricsSnippet: z.string(),
    status: z.enum([
        'DRAFT',
        'AWAITING_APPROVAL',
        'REFINING',
        'GENERATING_VIDEO',
        'COMPLETED',
        'FAILED'
    ]),
    versions: z.array(z.string().uuid()) // Array of Version IDs
});

// Inferred TypeScript types
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type Prompt = z.infer<typeof PromptSchema>;
export type Version = z.infer<typeof VersionSchema>;
export type Shot = z.infer<typeof ShotSchema>;
