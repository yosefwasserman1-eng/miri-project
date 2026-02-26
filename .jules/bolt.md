## 2025-02-18 - [Parallelizing Async Flows in Stateless Architecture]
**Learning:** The "Stateless Execution" pattern (fire-and-forget) returns a 202 quickly, but the background async tasks still consume Node.js event loop time. Serial execution of independent IO operations (DB insert + External API call) unnecessarily prolongs the background task's duration.
**Action:** Use Promise.all for independent async operations in background tasks to free up resources faster and improve system throughput.
