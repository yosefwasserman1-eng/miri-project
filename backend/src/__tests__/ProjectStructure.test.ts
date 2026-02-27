import fs from 'fs';
import path from 'path';

describe('Project folder structure (Implementation Plan 1.1)', () => {
  it('has backend, frontend, and python-renderer directories at the repo root', () => {
    const repoRoot = path.resolve(__dirname, '..', '..', '..');
    const expectedDirs = ['backend', 'frontend', 'python-renderer'];

    expectedDirs.forEach((dirName) => {
      const fullPath = path.join(repoRoot, dirName);

      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.statSync(fullPath).isDirectory()).toBe(true);
    });
  });
});

