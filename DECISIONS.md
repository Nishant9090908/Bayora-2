# Bayora: Architectural Decision Records (ADRs)
**Securing Adversarial AI Safety Testing Infrastructure**

---

## ADR 001: Modular Monolith vs. Distributed Microservices
* **Status**: Accepted
* **Context**: The project requires Red Team, Blue Team, and an Evaluation Engine operating with strict data isolation and auditing. In a hackathon setting, multi-service architectures (separate auth service, red service, blue service, eval service, frontend server) introduce high network latency, orchestration failure modes, and deployment friction.
* **Decision**: Adopt a modular monolith architecture using Python (FastAPI). Enforce strict domain boundaries at the package, service, and database repository layers rather than network boundaries.
* **Consequences**:
  * Positive: Zero inter-service network failures during live demo, single startup process, shared fast in-memory execution for evaluations, unified transaction management.
  * Security Trade-off: Must strictly enforce repository and view scoping within the application code to guarantee tenant separation.

---

## ADR 002: Backend-Enforced RBAC and Cryptographic JWT Claims
* **Status**: Accepted
* **Context**: Frontend-only role management allows malicious users or modified clients to bypass access controls.
* **Decision**: Implement stateless JWT tokens signed with a backend-held secret key (HS256). Every incoming request to protected routes must pass through FastAPI dependency injection (`Depends(require_role(...))`) where the token is cryptographically verified and the user role is resolved from the token payload.
* **Consequences**:
  * Client cannot forge or tamper with roles without invalidating the cryptographic signature.
  * Requests lacking the required role trigger an immediate HTTP 403 and automatically write an intrusion record to `security_events`.

---

## ADR 003: Row-Level Data Scoping & Segregated Data Transfer Objects (DTOs)
* **Status**: Accepted
* **Context**: Red Teams must not inspect Blue Team defense implementations (system prompts, regex filters). Blue Teams must not inspect raw proprietary Red Team attack prompts.
* **Decision**: 
  1. Data queries are strictly scoped by `owner_id` for team-specific management endpoints.
  2. Database ORM entities are never returned directly to API callers.
  3. Segregated Pydantic projection models (`RedEvaluationView`, `BlueEvaluationView`, `AuditorEvaluationView`) are used exclusively for serializing evaluation data, guaranteeing at the schema level that sensitive fields are never transmitted across team boundaries.
* **Consequences**: Eliminates over-the-shoulder DevTools inspection leaks where sensitive fields might be present in JSON payloads even if hidden in the UI.

---

## ADR 004: Unified Single-Server Frontend Delivery (FastAPI StaticFiles + Vanilla Web Standard)
* **Status**: Accepted
* **Context**: The host environment runs Python 3.13 without Node.js installed. A separate Node.js build pipeline introduces environment friction, build step requirements, and CORS complexity.
* **Decision**: Build the client application using standard modern web technologies (HTML5, ES6 modules, CSS Custom Properties/Vanilla CSS) served directly via FastAPI `StaticFiles`.
* **Consequences**:
  * Zero Node.js or npm dependency required on any host machine.
  * Instant startup with `py -m uvicorn app.main:app`.
  * No CORS configuration needed as frontend and backend originate from the same host.
  * Full control over visual styling, dark-mode cybersecurity aesthetics, and micro-animations.

---

## ADR 005: Evaluation Engine as Trusted Mediator & Target LLM Secret Isolation
* **Status**: Accepted
* **Context**: Red and Blue teams must not directly invoke or control the target Client LLM. Direct access invites model tampering, denial-of-service, and audit evasion.
* **Decision**: The Client LLM credentials and connection logic reside exclusively inside the Evaluation Engine module. All evaluations are initiated as a multi-stage pipeline:
  1. Input Pre-Filter (Blue Team keyword/regex checks).
  2. Guardrail Prompt Construction.
  3. Isolated Target LLM Invocation.
  4. Post-execution Safety Scoring & Output Validation.
  5. Cryptographic Provenance Hash Computation (`SHA-256`).
* **Consequences**: Neither team ever handles LLM API keys. Every model interaction is guaranteed to be intercepted, evaluated, and permanently logged.

---

## ADR 006: Dual-Engine LLM Adapter (Live Provider + Resilient Mock Fallback)
* **Status**: Accepted
* **Context**: Live hackathon presentations often fail due to rate limits (HTTP 429), API credit exhaustion, or conference Wi-Fi latency.
* **Decision**: Implement a unified `LLMClient` adapter that can invoke live providers (OpenAI / Groq) when configured, but seamlessly falls back to a deterministic, realistic `MockLLMClient` when offline or when test flags are set.
* **Consequences**: Guaranteed demonstration reliability regardless of external connectivity.
