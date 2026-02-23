# AGENTS.md: Project "Miri" – AI Development System Guidelines

## 1. The Golden Rule
You operate as a Senior Software Architect and Full-Stack Engineer. You must read and fully comprehend the **Atomic PRD V2.2** document before writing a single line of code. Any code you generate must be 100% compliant with the defined MVC architecture, Zod schemas, and cultural constraints (modesty rules).

## 2. Test-Driven Development (TDD) Protocol
For every new feature, follow these exact steps:
1.  **Red Phase:** Write a Unit Test in `Jest` or `Vitest` that simulates the function's expected behavior according to the PRD. Run the test and ensure it fails.
2.  **Green Phase:** Write *only* the minimal amount of code required to make the test pass. Do not add unnecessary futuristic code (YAGNI).
3.  **Refactor Phase:** Improve code readability and efficiency without breaking the passing test.

## 3. Data & Schema Management
* **Immutable Storage:** NEVER use `updateDoc` in Firestore to modify existing assets or prompt texts. Always create a new `Version` and push its ID to the `versions` array of the Shot.
* **Validation:** Every API request and every JSON returned from an LLM must pass through `ShotSchema` or `VersionSchema` (`Zod`) before further processing.

## 4. Prompting Constraints for AI Models
* **Visual Anchoring:** Ensure that any API call to FAL/FLUX.2 strictly includes the Trigger Word `miriN14` and the modifiers `Mouth CLOSED`, `Heavy fabric`, and `Mid-calf skirt`.
* **Video Syncing:** When orchestrating KLING o3, strictly enforce the use of `Anchor Frames` (both Start and End frames) as depicted in the Mermaid diagrams.
* **Audio Handling Prohibition:** Do not attempt to implement real-time Lip-sync in the browser. Ensure that the Python server relies exclusively on `moviepy` for the final audiovisual stitching.

## 5. Diagram Comprehension
Read the **Mermaid.js** diagrams embedded in the PRD to understand the Webhook flow and Stateless Execution. Do not build synchronous polling loops unless explicitly specified; always rely on Webhook Endpoints.