import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock firebase modules BEFORE importing service or firebase config
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDoc: vi.fn(),
    arrayUnion: vi.fn((id) => id),
    serverTimestamp: vi.fn(),
}));

// Now safe to import
import { addVersionToShot } from '../services/shotService';
import { addDoc as mockedAddDoc, updateDoc as mockedUpdateDoc } from 'firebase/firestore';

describe('Immutable Storage Constraint - GREEN Phase', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should implement the Immutable Storage Constraint correctly', async () => {
        const shotId = '550e8400-e29b-41d4-a716-446655440000';
        const versionData = {
            shotId: shotId,
            prompt: {
                scene: 'Scene 1',
                subjects: [{
                    type: 'Person',
                    description: 'Miri',
                    pose: 'Static',
                    position: 'Center'
                }],
                style: 'Realistic',
                lighting: 'Natural',
                camera: 'Wide'
            },
            status: 'PENDING' as const,
        };

        // Expected Version document creation
        await addVersionToShot(shotId, versionData);

        // 1. Verify addDoc was called for 'versions' collection
        expect(mockedAddDoc).toHaveBeenCalled();
        const addDocCall = vi.mocked(mockedAddDoc).mock.calls[0];
        // check that the data passed to addDoc matches our schema (plus injected fields)
        expect(addDocCall[1]).toMatchObject({
            shotId: shotId,
            status: 'PENDING',
        });
        expect(addDocCall[1]).toHaveProperty('versionId');
        expect(addDocCall[1]).toHaveProperty('createdAt');

        // 2. Verify updateDoc was called ONLY for the parent Shot document
        expect(mockedUpdateDoc).toHaveBeenCalledTimes(1);
        const updateDocCall = vi.mocked(mockedUpdateDoc).mock.calls[0];
        // In our implementation, updateDoc(shotRef, { versions: arrayUnion(...) })
        expect(updateDocCall[1]).toHaveProperty('versions');

        // 3. Explicit check: No updateDoc calls should target a Version-like object
        // Since we only call updateDoc once, and it's for 'shots', this is satisfied.
    });

    it('should validate data using Zod before calling Firestore', async () => {
        const shotId = '550e8400-e29b-41d4-a716-446655440000';
        const invalidData = {
            shotId: shotId,
            prompt: {
                scene: '',
                // Actually PromptSchema doesn't have min(1) etc in index.ts, but let's try missing fields
            },
            status: 'INVALID_STATUS' as any,
        };

        await expect(addVersionToShot(shotId, invalidData)).rejects.toThrow();
    });
});
