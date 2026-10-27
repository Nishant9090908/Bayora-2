# Bayora: Securing Adversarial AI Safety Testing Infrastructure

![Security Posture](https://img.shields.io/badge/Security_Enclave-Level--4_Isolated-0284c7)
![Tests](https://img.shields.io/badge/Tests-12%2F12_Passing-10b981)
![Provenance](https://img.shields.io/badge/Provenance-SHA--256_Verifiable-8b5cf6)
![RBAC](https://img.shields.io/badge/RBAC-Backend--Enforced-ef4444)

Bayora is an adversarial AI safety testing platform designed to enable **Red Teams**, **Blue Teams**, and **Client LLMs** to collaborate safely in an isolated, multi-tenant environment without unauthorized access to each other's proprietary intelligence.

---

## 🏛️ System Architecture & Core Pillars

1. **Red Team Workspace (Offensive Studio)**:
   * Submit and benchmark adversarial jailbreaks, indirect prompt injections, system prompt extraction probes, and tool-use exploits.
   * Prompts are owner-scoped and encrypted at rest; Blue Teams cannot inspect raw zero-day payloads.

2. **Blue Team Workspace (Defensive Studio)**:
   * Configure defensive guardrails, system prompt wrappers, banned keyword lists, and PCRE regex pattern rules.
   * Defensive configurations are confidential; Red Teams cannot inspect rules to reverse-engineer bypasses.

3. **Client LLM Isolation**:
   * The model being tested remains strictly isolated with zero direct network or API access from team dashboards.
   * All interactions route through the **Evaluation Engine Mediator**.

4. **Trusted Evaluation Mediator**:
   * Intercepts and validates inputs through a multi-stage pipeline:
     `Input Pre-Filter` ➔ `Mediated LLM Query` ➔ `Output Safety Judge` ➔ `Cryptographic Provenance Commitment`.
   * Automatically projects sanitized response views (masking defense rules from Red Team and masking raw attack payloads from Blue Team).
   * Generates deterministic **SHA-256 provenance digests** binding all inputs, configurations, model responses, and timestamps for non-repudiation.

5. **Security & Intrusion Traps**:
   * Server-side cryptographic JWT verification.
   * Automatic capture and alerting of unauthorized 401/403 cross-tenant access attempts.

---

## 📁 Repository Directory Structure

```
Bayora/
├── app/                        # Backend Application (FastAPI & SQLAlchemy)
│   ├── api/                    # API Routers (Auth, Audit, Dependencies, RBAC guards)
│   ├── models/                 # Relational Models (User, AuditLog, SecurityEvent)
│   ├── schemas/                # Pydantic v2 schemas and sanitized DTOs
│   ├── services/               # Cryptographic auth (PBKDF2/JWT) & Audit service
│   ├── config.py               # Environment configuration & secret isolation
│   ├── database.py             # SQLite database session & engine
│   ├── main.py                 # FastAPI application & lifecycle hooks
│   └── seed.py                 # Automated demo role account seeding
├── frontend/                   # Frontend Research Console (Zero node/npm dependency)
│   ├── index.html              # Main application shell with client router
│   ├── css/
│   │   ├── base.css            # Design tokens, reset, typography, cybersecurity dark palette
│   │   ├── components.css      # Badges, cards, tables, forms, toasts, pipeline visualizer
│   │   └── pages.css           # Page-specific layouts (Red/Blue studios, breach panel)
│   └── js/
│       ├── app.js              # Router, global state, persona switcher, toast notifications
│       ├── charts.js           # High-DPI HTML5 canvas charts (bar & gauge)
│       ├── mock-data.js        # Prototype sample data (strictly separated from backend)
│       └── pages/              # Modular page views:
│           ├── landing.js      # Platform overview & 3-pillar breakdown
│           ├── auth.js         # Enterprise login & researcher registration
│           ├── red-team.js     # Adversarial prompt crafting & taxonomy analytics
│           ├── blue-team.js    # Defensive guardrail builder & resilience metrics
│           ├── admin.js        # System telemetry & append-only audit trail
│           ├── evaluation.js   # 4-stage pipeline & sanitized view projection switcher
│           └── security-events.js # Intrusion violation stream & breach simulation
├── tests/                      # Automated Pytest Suite
│   ├── conftest.py             # In-memory test fixtures & authenticated tokens
│   ├── test_auth.py            # Authentication, JWT tampering, and security event traps
│   └── test_rbac.py            # Role-Based Access Control and boundary enforcement
├── ARCHITECTURE.md             # Detailed Architectural Specification
├── DEVELOPMENT_ROADMAP.md      # Phased Hackathon Execution Plan
├── DECISIONS.md                # Architectural Decision Records (ADRs 001 - 006)
├── SECURITY.md                 # Threat Model (STRIDE) & RBAC Matrix
├── TESTING.md                  # Test Strategy and Execution Log
├── requirements.txt            # Minimal Python dependencies
├── run.py                      # Backend launcher script
├── pytest.ini                  # Pytest configuration
└── .env.example                # Configuration template
```

---

## 🚀 Quickstart & Setup

### 1. Running the Frontend Research Console (Standalone)
To run the pure frontend console without any external dependencies:
```bash
python -m http.server 3000 --directory frontend
```
Open **[http://127.0.0.1:3000](http://127.0.0.1:3000)** in your browser.

### 2. Running the Backend API
```bash
# 1. Create and activate Python virtual environment
py -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Launch application server
python run.py
```
* **API Server**: `http://127.0.0.1:8000`
* **Interactive OpenAPI Documentation**: `http://127.0.0.1:8000/docs`

### 3. Running Automated Tests
```bash
.\venv\Scripts\python -m pytest -v
```

---

## 👥 Demo Pre-Seeded Accounts

| Role | Username | Password | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **Red Team** | `red_operator` | `RedOperator2026!` | Adversarial prompt submissions & scoped evaluations |
| **Blue Team** | `blue_defender` | `BlueDefender2026!` | Defensive guardrails & confidential rule configurations |
| **Auditor** | `compliance_auditor` | `AuditorSecurity2026!` | System-wide audit trail & cryptographic provenance |
