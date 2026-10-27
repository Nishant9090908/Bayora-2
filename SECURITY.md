# Bayora: Security Specification & Threat Model
**Securing Adversarial AI Safety Testing Infrastructure**

---

## 1. Security Principles

Bayora adheres to the following foundational security tenets:

1. **Zero Client Trust**: All authorization decisions, role resolutions, and input validations are enforced exclusively on the backend. Frontend state is treated as completely untrusted.
2. **Mutual Non-Disclosure (Data Segregation)**:
   * Red Team proprietary attack vectors and raw prompts must never be exposed to Blue Team.
   * Blue Team defensive rules, system instructions, and regex filters must never be exposed to Red Team.
3. **Model Isolation (Mediated Invocation)**:
   * Target Client LLMs have zero direct network exposure to end-user clients or team dashboards.
   * All queries must transit the hardened Evaluation Engine.
4. **Non-Repudiation & Provenance**:
   * Every evaluation produces an immutable cryptographic digest linking the exact inputs, defensive rules, outputs, and timestamps.
   * Evaluation logs cannot be updated or deleted.
5. **Fail-Closed Security Posture**:
   * Any ambiguity in authentication, role assignment, or data access defaults to denial (HTTP 401 Unauthorized or HTTP 403 Forbidden).
   * Unauthorized cross-team access attempts automatically log to a permanent security events table.

---

## 2. Threat Model (STRIDE Analysis)

| Threat Category | Potential Attack Vector | Bayora Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | User claims to be an Auditor or Red Team member by modifying browser state or request headers. | Stateless cryptographic JWTs signed with server-side HMAC-SHA256 secret. Identity and role verified on every protected request. |
| **Tampering** | User alters evaluation results or retrospectively modifies attack prompts to claim false bypasses. | Cryptographic evaluation provenance (`SHA-256(prompt + defense + response + timestamp)`) stored in immutable database records. Verification endpoint recalculates hash from ground truth. |
| **Repudiation** | An operator denies submitting a harmful prompt or changing a defensive rule. | Append-only `audit_logs` record every write, update, and evaluation with authenticated `actor_id`, timestamp, and action metadata. |
| **Information Disclosure** | Red Team queries Blue Team defensive system prompts; Blue Team inspects zero-day attack payloads via DevTools. | Backend row-level tenant queries + strict Pydantic projection models that mathematically omit sensitive cross-role fields before JSON serialization. |
| **Denial of Service** | Red Team floods Client LLM with thousands of queries, exhausting API credits or compute. | Backend rate limiting and mediated batch queue. Direct API keys are shielded from team dashboards. |
| **Elevation of Privilege** | Blue Team user calls `/api/red/prompts` or `/api/audit/logs`. | Route-level dependency injection (`require_role(...)`). Access violations trigger automatic `SecurityEvent` log entry and HTTP 403. |

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint / Capability | Unauthenticated | Red Team (`red_team`) | Blue Team (`blue_team`) | Auditor (`auditor`) |
| :--- | :---: | :---: | :---: | :---: |
| **Login / Health** | Allowed | Allowed | Allowed | Allowed |
| **Submit Attack Prompt** | Denied | **Allowed** | Denied (403) | Denied (403) |
| **View Own Attack Prompts** | Denied | **Allowed** (Scoped) | Denied (403) | Allowed (Audit View) |
| **Submit Defense Config** | Denied | Denied (403) | **Allowed** | Denied (403) |
| **View Own Defense Configs**| Denied | Denied (403) | **Allowed** (Scoped) | Allowed (Audit View) |
| **Trigger Evaluation Run** | Denied | **Allowed** (Own prompt) | **Allowed** (Own defense) | **Allowed** |
| **View Evaluation Result** | Denied | **Sanitized View** (No defense rules) | **Sanitized View** (Masked raw prompt) | **Full Audit View** |
| **View Audit Logs & Events** | Denied | Denied (403) | Denied (403) | **Allowed** |
| **Verify Provenance Hash** | Denied | Allowed | Allowed | **Allowed** |
| **Direct Client LLM Query** | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** |

---

## 4. Evaluation Provenance & Cryptographic Proofs

To establish non-repudiation and prevent tampering with AI safety test metrics, each evaluation run produces a deterministic SHA-256 digest:

$$\text{Provenance Hash} = \text{SHA256}(\text{prompt\_id} \parallel \text{defense\_id} \parallel \text{prompt\_text} \parallel \text{defense\_config\_json} \parallel \text{model\_response} \parallel \text{timestamp})$$

Any modification to historical evaluation records causes the verification endpoint `GET /api/audit/verify/{id}` to fail with an integrity mismatch alert.

---

## 5. Security Logging & Intrusion Detection

1. **Audit Logs**:
   * Records business actions: `AUTH_LOGIN`, `SUBMIT_PROMPT`, `SUBMIT_DEFENSE`, `RUN_EVALUATION`.
   * Stored in append-only table `audit_logs`.
2. **Security Events**:
   * Records unauthorized access attempts: `UNAUTHORIZED_ACCESS_ATTEMPT`, `INVALID_TOKEN`, `FORGED_ROLE_ATTEMPT`, `RATE_LIMIT_EXCEEDED`.
   * Captures client IP, authenticated user ID (if any), attempted resource path, HTTP method, and timestamp.
   * Surfaces alerts directly in the Auditor Security Center dashboard in real time.

---

## 6. Operational Safeguards & Ethics

* **Controlled Environment Only**: All adversarial prompts and defenses are tested solely against designated test models (local mock or isolated test API accounts).
* **No External Targeting**: Testing is strictly confined to the Bayora sandbox infrastructure.
* **Secret Protection**: API keys, JWT secrets, and credentials must never be committed to version control and must be loaded via `.env`.
