export const API_BASE = 'http://localhost:3000';

/**
 * All generations are routed through the backend. The frontend must NEVER use
 * @fal-ai/client directly; FAL_KEY must stay server-side only.
 *
 * Payload required by backend ShotSchema for POST /api/shots/generate.
 */
interface GenerateShotPayload {
  shotId: string;
  sceneId: string;
  timestamps: { startMs: number; endMs: number };
  lyricsSnippet: string;
  status: 'DRAFT' | 'AWAITING_APPROVAL' | 'REFINING' | 'GENERATING_VIDEO' | 'COMPLETED' | 'FAILED';
  versions: string[];
}

/**
 * Requests image generation by POSTing the user's prompt to the backend.
 * Backend orchestrates FAL with webhook; no direct FAL calls from the client.
 */
export async function requestImageGeneration(userPrompt: string): Promise<Response> {
  const payload: GenerateShotPayload = {
    shotId: crypto.randomUUID(),
    sceneId: crypto.randomUUID(),
    timestamps: { startMs: 0, endMs: 5000 },
    lyricsSnippet: userPrompt,
    status: 'DRAFT',
    versions: []
  };

  const response = await fetch(`${API_BASE}/api/shots/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response;
}
