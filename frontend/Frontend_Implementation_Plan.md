# Frontend Implementation Plan: Project Miri (Phase 6)

## Overview
This document outlines the architectural plan for Phase 6: Frontend Development of Project Miri. As the Senior Frontend Architect, the following plan strictly adheres to the Atomic PRD V2.2 and AGENTS.md constraints, including Test-Driven Development (TDD), the INVEST and YAGNI principles, and strict Zod validation.

---

## 1. Initialization: React SPA with Vite + TypeScript
- **Framework:** React 18+ Single Page Application (SPA).
- **Bundler/Toolchain:** Vite for rapid compilation and optimized builds.
- **Language:** TypeScript with strict mode enabled for type safety.
- **Testing (TDD Protocol):** `Vitest` paired with `React Testing Library`. The "Red-Green-Refactor" cycle will be strictly required for every new feature or module.
- **Routing:** `React Router` for client-side navigation.

## 2. Styling & Components: MUI, Tailwind CSS & Native RTL Support
- **Component Library Protocol:** Material-UI (MUI) for standardized, accessible React components (`@mui/material`, `@emotion/react`, `@emotion/styled`).
- **Utility Framework:** Tailwind CSS configured via `tailwind.config.ts` for rapid layouts.
- **Localization (RTL):** 
  - Mandatory native Hebrew (RTL) direction support.
  - The root document will utilize `<html dir="rtl" lang="he">`.
  - MUI will be configured with an RTL theme using `stylis-plugin-rtl`.
  - Tailwind's logical properties (e.g., `ms-`, `me-`, `ps-`, `pe-`) will be used uniformly over physical properties (`ml-`, `mr-`) to ensure perfect mirroring.
- **Aesthetics:** High-quality, modern UI featuring loading animations for generation phases.

## 3. Backend-as-a-Service: Firebase Client SDK
- **Authentication:** Firebase Auth SDK for managing secure user sessions.
- **Database (Firestore):** 
  - Integrate Firebase Firestore SDK.
  - **Immutable Storage Constraint:** The UI will strictly follow the "append-only" rule. We will NEVER use `updateDoc` to modify existing assets or prompt texts. Instead, we will always create and append a new `Version` to the `versions` array.
- **Validation:** All incoming and outgoing data interactions will pass through `Zod` schemas (e.g., `ShotSchema`, `ProjectConfigSchema`) before further processing.

## 4. Real-time Communication: Socket.io-Client
- **Purpose:** Listen for real-time Webhook updates dispatched from the backend.
- **Implementation:**
  - Setup `socket.io-client` pointing to the Node.js API.
  - Listen for events like `'SHOT_UPDATED'` or generation completions.
  - **Constraint:** Replaces any synchronous polling loops with an event-driven flow to ensure status messages are synchronized reactively across the UI.

## 5. Component Architecture: "Human-in-the-Loop" Dashboard
The dashboard is the main operator console, focusing on conversational interactions and immutable history.

### A. Persistent Chat UI (Conversational QA)
- **Role:** The primary interface for refining AI actions, analyzing failures, and building the story iteratively (instead of simple "Reject" buttons).
- **Features:** 
  - **Chat Parity:** Any action possible in the standard UI must also be executable via the chat.
  - Fully supports Hebrew RTL.
  - Supports multiple parallel conversations (independent generation streams).
  - Integrates loading animations during async generation waits.

### B. Time-Travel Version Table (Immutable State UI)
- **Role:** Visualization of the `versions` array associated with each Shot.
- **Features:**
  - Allows operators to freely page through older versions of prompts, images, and videos.
  - Read-only historical views.
  - Ensures a visual representation of the immutable, "no-overwrite" architecture.

---

## Approval Required
Awaiting approval [Y] from the user before executing any installation commands or writing the actual application code.
