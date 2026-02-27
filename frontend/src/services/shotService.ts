import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';
import { VersionSchema, type Version } from '../schemas';

/**
 * Adds a new version to a shot.
 * Strictly follows the Immutable Storage Constraint:
 * 1. Creates a NEW document in the 'versions' collection.
 * 2. ONLY updates the parent 'Shot' document to include the new version ID.
 * 
 * @param shotId The ID of the parent shot
 * @param versionData The version data to add
 */
export async function addVersionToShot(
    shotId: string,
    versionData: Omit<Version, 'versionId' | 'createdAt'>
) {
    // 1. Prepare Version data with ID and Timestamp
    const newVersion: Version = {
        ...versionData,
        versionId: crypto.randomUUID(),
        createdAt: new Date().toISOString(), // Using ISO string as per Schema, but could use firestore serverTimestamp for production
    };

    // 2. Validate with Zod
    const validatedVersion = VersionSchema.parse(newVersion);

    // 3. Create new Version document (Immutable)
    const versionsRef = collection(db, 'versions');
    await addDoc(versionsRef, validatedVersion);

    // 4. Update parent Shot document versions array (ID pointer only)
    const shotRef = doc(db, 'shots', shotId);
    await updateDoc(shotRef, {
        versions: arrayUnion(validatedVersion.versionId)
    });

    return validatedVersion;
}
