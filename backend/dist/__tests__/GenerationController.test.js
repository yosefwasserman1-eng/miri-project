"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const schemas_1 = require("../schemas");
const vitest_1 = require("vitest");
vitest_1.vi.mock('../services/OrchestrationService', () => ({
    OrchestrationService: {
        startGenerationFlow: vitest_1.vi.fn()
    }
}));
(0, vitest_1.describe)('GenerationController - POST /api/shots/generate', () => {
    let app;
    (0, vitest_1.beforeAll)(async () => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { GenerationController } = await Promise.resolve().then(() => __importStar(require('../controllers/GenerationController')));
        app.post('/api/shots/generate', GenerationController.handleGenerate);
    });
    (0, vitest_1.it)('returns 400 when request body fails Zod validation', async () => {
        const invalidPayload = {
            // missing required fields from ShotSchema, e.g. shotId, sceneId, timestamps
            lyricsSnippet: 123 // wrong type on purpose
        };
        const response = await (0, supertest_1.default)(app)
            .post('/api/shots/generate')
            .send(invalidPayload)
            .set('Content-Type', 'application/json');
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body).toHaveProperty('error');
    });
    (0, vitest_1.it)('returns 202 when request body passes Zod validation', async () => {
        const validShot = schemas_1.ShotSchema.parse({
            shotId: '550e8400-e29b-41d4-a716-446655440000',
            sceneId: '550e8400-e29b-41d4-a716-446655440001',
            timestamps: { startMs: 0, endMs: 5000 },
            lyricsSnippet: 'Sample lyrics snippet',
            status: 'DRAFT',
            versions: []
        });
        const response = await (0, supertest_1.default)(app)
            .post('/api/shots/generate')
            .send(validShot)
            .set('Content-Type', 'application/json');
        (0, vitest_1.expect)(response.status).toBe(202);
    });
    (0, vitest_1.it)('delegates orchestration to OrchestrationService.startGenerationFlow on valid payload', async () => {
        const validShot = schemas_1.ShotSchema.parse({
            shotId: '550e8400-e29b-41d4-a716-446655440100',
            sceneId: '550e8400-e29b-41d4-a716-446655440101',
            timestamps: { startMs: 0, endMs: 8000 },
            lyricsSnippet: 'Delegation test lyrics snippet',
            status: 'DRAFT',
            versions: []
        });
        const { OrchestrationService } = await Promise.resolve().then(() => __importStar(require('../services/OrchestrationService')));
        const response = await (0, supertest_1.default)(app)
            .post('/api/shots/generate')
            .send(validShot)
            .set('Content-Type', 'application/json');
        (0, vitest_1.expect)(response.status).toBe(202);
        (0, vitest_1.expect)(OrchestrationService.startGenerationFlow).toHaveBeenCalledWith(validShot, vitest_1.expect.any(String));
    });
});
