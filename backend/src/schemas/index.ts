import { z } from 'zod';

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

export const AgentConfigSchema = z.object({
  configId: z.string().uuid(),
  role: z.enum(['ORCHESTRATOR', 'AUDITOR', 'VISION_ANALYZER', 'DIRECTOR']),
  modelString: z.string(),
  active: z.boolean(),
  updatedAt: z.string().datetime()
});

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
  versions: z.array(z.string().uuid())
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type Shot = z.infer<typeof ShotSchema>;

