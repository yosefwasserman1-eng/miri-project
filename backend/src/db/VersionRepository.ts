import * as admin from 'firebase-admin';
import { db } from './firestore';

const FieldValue = admin.firestore.FieldValue;

export interface VersionRecord {
  shotId: string;
  status: string;
  [key: string]: unknown;
}

const VERSIONS_COLLECTION = 'versions';

export const VersionRepository = {
  /**
   * Inserts a new Version document (immutable pattern: never update existing
   * assets or prompt text; only append new versions).
   */
  async insertVersion(version: VersionRecord): Promise<string> {
    const ref = await db.collection(VERSIONS_COLLECTION).add({
      ...version,
      createdAt: FieldValue.serverTimestamp()
    });
    return ref.id;
  },

  /**
   * Updates only the status and metadata of an existing Version (e.g. IMAGE_READY
   * with imageUrl). Does not overwrite prompt or asset content per immutable constraints.
   */
  async updateVersionStatus(
    versionId: string,
    status: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const ref = db.collection(VERSIONS_COLLECTION).doc(versionId);
    await ref.update({
      status,
      ...metadata,
      updatedAt: FieldValue.serverTimestamp()
    });
  }
};
