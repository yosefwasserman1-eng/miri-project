# Implementation Plan: Project Miri

## Phase 1: Infrastructure & Docker
- [x] 1.1 Create main folder structure (`backend`, `frontend`, `python-renderer`).
- [x] 1.2 Write `docker-compose.yml` for Node.js, Python, and Redis.
- [x] 1.3 Write `Dockerfile` for Node.js backend.
- [x] 1.4 Write `Dockerfile` for Python renderer (including OS-level `FFmpeg`).

## Phase 2: Backend Core & Controllers
- [x] 2.1 Initialize `package.json` with dependencies (Express, Zod, @fal-ai/client, etc.).
- [x] 2.2 Configure TypeScript (`tsconfig.json`) and Jest (`jest.config.js`).
- [x] 2.3 Implement Zod schemas in `src/schemas/index.ts` based on PRD Section 7.
- [x] 2.4 Implement `GenerationController` using strict TDD (Red/Green/Refactor).
- [x] 2.5 Implement `OrchestrationService` (Stateless stub) using strict TDD.

## Phase 3: Webhooks & External APIs
- [x] 3.1 Create `FalWebhookController` via TDD: Handle POST request from FAL AI, update Database status to `IMAGE_READY`.
- [x] 3.2 Implement actual FAL AI API integration in `OrchestrationService` replacing the stub.
- [x] 3.3 Create Video Generation Webhook logic (KLING o3 / FAL Video).

## Phase 4: Real-time Communication (WebSockets & Redis)
- [x] 4.1 Set up Socket.io server with Redis Pub/Sub adapter.
- [ ] 4.2 Emit `SHOT_UPDATED` events from the Webhook controllers via Redis.
- [ ] 4.3 Write tests simulating WebSocket client receiving status updates.

## Phase 5: Python Video Renderer (MoviePy)
- [ ] 5.1 Set up Flask/FastAPI server in `python-renderer`.
- [ ] 5.2 Create endpoint to receive list of video clips and MP3 file.
- [ ] 5.3 Implement `moviepy` logic to stitch videos and sync with audio.