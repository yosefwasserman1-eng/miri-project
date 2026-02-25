export interface VersionRecord {
  shotId: string;
  status: string;
  // Additional fields can be added later as needed.
  [key: string]: unknown;
}

export const VersionRepository = {
  // Stubbed Firestore interaction for TDD; implementation will be added later.
  async insertVersion(_version: VersionRecord): Promise<void> {
    return;
  },

  async updateVersionStatus(
    _versionId: string,
    _status: string,
    _metadata: Record<string, unknown>
  ): Promise<void> {
    return;
  }
};

