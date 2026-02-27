import { fal } from '@fal-ai/client';
import { addVersionToShot } from './shotService';

/**
 * Mandatory triggers that must be included in every prompt to ensure character consistency.
 */
const MANDATORY_TRIGGERS = [
    'miriN14',
    'Mouth CLOSED',
    'Heavy fabric',
    'Mid-calf skirt'
];

/**
 * Constructs the final prompt by adding mandatory triggers.
 */
function constructPrompt(userPrompt: string): string {
    const triggers = MANDATORY_TRIGGERS.join(', ');
    return `${userPrompt}, ${triggers}`;
}

/**
 * Generates an image using FAL AI (Flux-2-Turbo) and saves it as a new Version.
 */
export async function generateImage(userPrompt: string, shotId: string) {
    const finalPrompt = constructPrompt(userPrompt);

    const result = await fal.subscribe('fal-ai/flux/turbo', {
        input: {
            prompt: finalPrompt
        },
        logs: true,
    });

    const imageUrl = (result as any).data.images[0].url;

    // Save via shotService (Immutable Storage Constraint)
    return await addVersionToShot(shotId, {
        shotId,
        prompt: {
            scene: userPrompt, // The raw prompt used as reference
            subjects: [], // Optional: could be parsed if needed
            style: 'Realistic',
            lighting: 'Natural',
            camera: 'Wide'
        },
        imageUrl,
        status: 'IMAGE_READY'
    });
}

/**
 * Generates a video using FAL AI (Kling-o3) and saves it as a new Version.
 */
export async function generateVideo(userPrompt: string, shotId: string) {
    const finalPrompt = constructPrompt(userPrompt);

    const result = await fal.subscribe('fal-ai/kling-video/v1.5/pro/text-to-video', {
        input: {
            prompt: finalPrompt
        },
        logs: true,
    });

    const videoUrl = (result as any).data.video.url;

    // Save via shotService (Immutable Storage Constraint)
    return await addVersionToShot(shotId, {
        shotId,
        prompt: {
            scene: userPrompt,
            subjects: [],
            style: 'Cinematic',
            lighting: 'Natural',
            camera: 'Handheld'
        },
        videoUrl,
        status: 'VIDEO_READY'
    });
}
