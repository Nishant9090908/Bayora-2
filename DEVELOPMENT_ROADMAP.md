# Bayora: Development Roadmap
**Securing Adversarial AI Safety Testing Infrastructure**
*Hackathon MVP Phased Execution Plan*

---

## Roadmap Overview & Strategy

This roadmap is structured into **6 bite-sized, sequential phases**. Each phase produces a testable milestone so that at any point before hackathon deadline, we have a functional, demonstrable application.

```
+-----------------------------------------------------------------------------------+
| Phase 1: Core Foundation & RBAC Security Primitives                                |
|  - Setup FastAPI + SQLite                                                         |
|  - Implement JWT authentication & role-based middleware                           |
|  - Create audit log & security violation capture system                           |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Phase 2: Red & Blue Team Isolated Workspaces                                      |
|  - Red Team: Prompt submission, categorization & owner-scoped repository           |
|  - Blue Team: Defense config builder (system prompt, keyword filters, thresholds) |
|  - Enforce backend data boundaries (Red cannot query Blue, Blue cannot query Red) |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Phase 3: The Evaluation Engine (Trusted Mediator)                                 |
|  - Isolated LLM Client (OpenAI/Groq + Offline Mock fallback)                      |
|  - Pre-execution filtering pipeline (keyword/regex blocks)                        |
|  - Model dispatch & safety response evaluator                                     |
|  - Cryptographic Provenance generation (SHA-256 hash)                             |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Phase 4: Role-Based Sanitization & Projection Layer                                |
|  - Red Team View: Evaluation metrics without Blue Team internal rules             |
|  - Blue Team View: Evaluation metrics with masked/abstracted Red prompts          |
|  - Auditor View: Full provenance trail & tamper-verification endpoint             |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Phase 5: Interactive Frontend Dashboard                                           |
|  - Role Switcher & Persona Bar (Red Team, Blue Team, Auditor)                     |
|  - Red Team Workspace (Attack Studio & Evaluation History)                        |
|  - Blue Team Workspace (Defense Studio & Mitigation History)                      |
|  - Evaluation Orchestrator (Run live test & watch pipeline steps)                 |
|  - Auditor Security Center (Live audit stream & breach attempt alerts)           |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| Phase 6: Demo Scenarios, Hardening & Presentation Script                          |
|  - Seed real-world attack scenarios (Jailbreak, System Prompt Leak, PII Harvest)   |
|  - Seed defensive guardrails (Refusal guardrail, regex sanitizer)                 |
|  - Interactive "Attack the System" demo (Simulate unauthorized cross-team access) |
+-----------------------------------------------------------------------------------+
```

---

## Detailed Phase Breakdown

### Phase 1: Core Foundation, Security Primitives & Complete Frontend UI [COMPLETED]
* **Status**: Completed (Backend Auth/RBAC primitives verified with 12/12 passing tests; Complete 8-page Frontend Interface built, running on http://127.0.0.1:3000)
* **Goal**: Establish the secure backend foundation, identity management, and complete responsive frontend research console.
* **Tasks**:
  1. Initialize FastAPI project with environment configuration.
  2. Define Database models using SQLAlchemy:
     * `User` (`id`, `username`, `password_hash`, `role`: `red_team` | `blue_team` | `auditor`)
     * `AuditLog` (`id`, `timestamp`, `actor_id`, `action`, `resource`, `status`, `details`)
     * `SecurityEvent` (`id`, `timestamp`, `actor_id`, `event_type`, `ip_address`, `details`)
  3. Implement JWT-based auth:
     * `/api/auth/login` (returns signed token with role claims).
     * Dependency injection guards: `require_role(["red_team"])`, `require_role(["blue_team"])`, etc.
  4. Build automated violation logger: unauthorized route hits (401/403) automatically append to `SecurityEvent`.
  5. Seed initial accounts (`red_operator`, `blue_defender`, `compliance_auditor`).
* **Milestone / Demo Test**:
  * Attempting to access Red endpoint with Blue token returns `403 Forbidden` and creates an audit entry in the security log.

---

### Phase 2: Red & Blue Team Isolated Workspaces
* **Goal**: Enable independent data management with strict owner and role segregation.
* **Tasks**:
  1. **Red Team API**:
     * Model `AttackPrompt`: `id`, `owner_id`, `title`, `category` (e.g., Jailbreak, Injection, Extraction), `prompt_text`, `severity`, `created_at`.
     * Endpoints: `POST /api/red/prompts`, `GET /api/red/prompts` (queries strictly filtered by `owner_id`).
  2. **Blue Team API**:
     * Model `DefenseConfig`: `id`, `owner_id`, `name`, `guardrail_system_prompt`, `banned_keywords` (JSON array), `regex_rules` (JSON array), `strictness_level`, `created_at`.
     * Endpoints: `POST /api/blue/defenses`, `GET /api/blue/defenses` (queries strictly filtered by `owner_id`).
  3. Backend boundary validation: verify zero endpoints expose Blue configs to Red Team or Red prompts to Blue Team.
* **Milestone / Demo Test**:
  * Red Team user creates an attack prompt; Blue Team user cannot retrieve it via API.

---

### Phase 3: The Evaluation Engine (Trusted Mediator)
* **Goal**: Build the secure evaluation pipeline and target model isolation.
* **Tasks**:
  1. Build `LLMClient` adapter:
     * Support for external API (Groq/OpenAI) using backend `.env` keys.
     * Offline `MockLLMClient` with realistic responses to ensure 100% demo uptime.
  2. Build `EvaluationEngine`:
     * Input pre-filter step: check prompt against Blue Team's `banned_keywords` and `regex_rules`.
     * Execution step: query model with prompt wrapped inside Blue Team's `guardrail_system_prompt`.
     * Safety analysis step: score response (e.g., did model disclose target info or trigger refusal?).
     * Provenance generation: compute `SHA256(prompt + defense_config + response + timestamp)`.
  3. Model `EvaluationRun`:
     * Stores full execution data privately in backend DB with `provenance_hash`.
  4. Expose `POST /api/evaluations/run` (accessible to authorized testers/auditors).
* **Milestone / Demo Test**:
  * Trigger an evaluation run: engine tests prompt against defense, contacts LLM, scores safety, and returns success with a cryptographic hash.

---

### Phase 4: Role-Based Sanitization & Projection Layer
* **Goal**: Provide role-specific views of evaluation results to prevent mutual intelligence leakage.
* **Tasks**:
  1. Define Pydantic projection schemas:
     * `RedEvaluationView`: contains prompt, model response, attack success score, latency, but masks Blue Team's system prompt and regexes.
     * `BlueEvaluationView`: contains defense config, attack category, defense status, but masks raw Red attack prompt text (e.g., displays `[MASKED RED TEAM ADVERSARIAL PAYLOAD]`).
     * `AuditorEvaluationView`: contains full execution data + raw provenance hash verification tool.
  2. Implement verification endpoint:
     * `GET /api/audit/verify/{evaluation_id}`: recomputes SHA-256 hash from stored inputs/outputs and verifies against the stored provenance signature.
* **Milestone / Demo Test**:
  * Calling the evaluation endpoint with Red Team token reveals attack metrics without disclosing Blue defense rules. Calling with Blue Team token reveals defense metrics without disclosing the exact attack prompt.

---

### Phase 5: Interactive Frontend Dashboard
* **Goal**: Create a polished, responsive web application to showcase the security architecture.
* **Tasks**:
  1. Setup modern dark-mode responsive dashboard served directly via FastAPI `StaticFiles`.
  2. Implement **Role Switcher & Persona Bar**:
     * Quick-switch between Red Team, Blue Team, and Auditor profiles with visual badges.
  3. **Red Team Portal**:
     * Prompt submission form with attack category tags.
     * Attack history table with individual evaluation results (sanitized).
  4. **Blue Team Portal**:
     * Defense configuration builder (system prompts, banned keyword tags, sensitivity slider).
     * Defense history & resilience metrics (sanitized).
  5. **Live Evaluation Arena**:
     * Visual pipeline showing: `Input Filter` -> `Target LLM` -> `Output Judge` -> `Provenance Hash Generated`.
  6. **Auditor Security Center**:
     * Real-time audit log stream.
     * Security violation alert box (showing live 403 / breach attempt detections).
     * Hash verification widget (click "Verify Integrity" to prove run was untampered).
* **Milestone / Demo Test**:
  * Complete end-to-end visual workflow: Red submits attack, Blue submits defense, run evaluation in arena, view sanitized results in each portal, and inspect security logs in Audit Center.

---

### Phase 6: Demo Scenarios, Hardening & Presentation Script
* **Goal**: Prepare foolproof demonstration data and edge-case testing.
* **Tasks**:
  1. Pre-seed rich demo scenarios:
     * Scenario 1: *Direct Jailbreak* ("Do Anything Now") vs. *Basic Defense* (Bypassed).
     * Scenario 2: *Prompt Injection* vs. *Advanced Guardrail* (Blocked by Pre-Filter).
     * Scenario 3: *PII Extraction* vs. *Output Moderation Judge* (Blocked by Post-Filter).
  2. Prepare Live Security Breach Demonstration:
     * Show live attempt by Red Team to fetch `/api/blue/defenses` directly -> instant `403 Forbidden` + immediate red alert popup on the Auditor Security Center dashboard.
  3. Create single-command startup script (`run.bat` or `run.py`).
* **Milestone / Demo Test**:
  * Deliver a seamless 3-minute hackathon pitch showing end-to-end multi-tenant adversarial testing with zero data leakage.
