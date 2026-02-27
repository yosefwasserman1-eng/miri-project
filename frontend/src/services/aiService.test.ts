import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock FAL client
vi.mock('@fal-ai/client', () => ({
    fal: {
        subscribe: vi.fn(),
    }
}));

// Mock shotService
vi.mock('./shotService', () => ({
    addVersionToShot: vi.fn(),
}));

import { generateImage } from './aiService';
import { fal } from '@fal-ai/client';
import { addVersionToShot } from './shotService';

describe('aiService - RED Phase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should include mandatory triggers in the prompt sent to FAL', async () => {
        const shotId = '550e8400-e29b-41d4-a716-446655440000';
        const userPrompt = 'Miri walking in a garden';

        vi.mocked(fal.subscribe).mockResolvedValue({
            data: { images: [{ url: 'http://example.com/image.png' }] }
        } as any);

        await generateImage(userPrompt, shotId);

        const callArgs = vi.mocked(fal.subscribe).mock.calls[0];
        const sentPrompt = (callArgs[1] as any).input.prompt;

        expect(sentPrompt).toContain('miriN14');
        expect(sentPrompt).toContain('Mouth CLOSED');
        expect(sentPrompt).toContain('Heavy fabric');
        expect(sentPrompt).toContain('Mid-calf skirt');
    });

    it('should call addVersionToShot with the results after successful generation', async () => {
        const shotId = '550e8400-e29b-41d4-a716-446655440000';
        const userPrompt = 'Miri walking in a garden';
        const mockUrl = 'http://example.com/image.png';

        vi.mocked(fal.subscribe).mockResolvedValue({
            data: { images: [{ url: mockUrl }] }
        } as any);

        await generateImage(userPrompt, shotId);

        expect(addVersionToShot).toHaveBeenCalledWith(shotId, expect.objectContaining({
            imageUrl: mockUrl,
            status: 'IMAGE_READY',
        }));
    });
});
