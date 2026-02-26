"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelProvider = void 0;
const client_1 = require("@fal-ai/client");
exports.ModelProvider = {
    async requestGeneration(payload) {
        const { shot, webhookUrl } = payload;
        const prompt = [
            'Child physique, Young girl, Loose fit, Heavy fabric, Mid-calf skirt, Mouth CLOSED, miriN14.',
            'Start frame: calm, neutral pose before any action.',
            shot.lyricsSnippet
        ].join(' ');
        return client_1.fal.queue.submit('fal-ai/flux-2', {
            webhookUrl,
            input: {
                prompt
            }
        });
    }
};
