"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Project folder structure (Implementation Plan 1.1)', () => {
    (0, vitest_1.it)('has backend, frontend, and python-renderer directories at the repo root', () => {
        const repoRoot = path_1.default.resolve(__dirname, '..', '..', '..');
        const expectedDirs = ['backend', 'frontend', 'python-renderer'];
        expectedDirs.forEach((dirName) => {
            const fullPath = path_1.default.join(repoRoot, dirName);
            (0, vitest_1.expect)(fs_1.default.existsSync(fullPath)).toBe(true);
            (0, vitest_1.expect)(fs_1.default.statSync(fullPath).isDirectory()).toBe(true);
        });
    });
});
