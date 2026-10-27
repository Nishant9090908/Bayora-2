# Bayora: Testing Strategy & Test Suites
**Securing Adversarial AI Safety Testing Infrastructure**

---

## 1. Testing Philosophy

In Bayora, security and data isolation are fundamental invariants. We follow these core testing principles:

1. **Automated Verification First**: No phase is considered complete without passing automated test suites.
2. **Negative Security Testing**: Always verify that unauthorized access returns HTTP 401/403 and properly records security events.
3. **Data Leakage Testing**: Assert that Red Team responses omit Blue Team defense details, and Blue Team responses omit raw Red Team prompts.
4. **Deterministic Evaluation Testing**: Verify the evaluation pipeline produces consistent metrics and valid cryptographic provenance digests under both mock and live modes.

---

## 2. Test Suites Structure

All tests reside in `tests/` and are executed using `pytest`:

| Test Suite | Purpose | Key Invariants Tested |
| :--- | :--- | :--- |
| `test_auth.py` | Authentication & JWT handling | Password hashing, valid/invalid credential login, token expiration, tampered signatures. |
| `test_rbac.py` | Access control & route guards | Red Team blocked from Blue routes (403), Blue Team blocked from Red routes (403), Auditor access permissions, security event capture upon 403. |
| `test_data_isolation.py`| Tenant & ownership boundaries | User A cannot query or modify User B's prompts/defenses even within the same role. |
| `test_evaluation_engine.py`| Pipeline & mediation logic | Input filtering catches banned keywords, LLM mock produces realistic outputs, safety scoring functions correctly, provenance hash is mathematically valid. |
| `test_sanitization.py` | Data projection verification | Serialized JSON payloads for Red Team never contain Blue defense configurations; Blue views mask raw attack prompts. |
| `test_provenance.py` | Non-repudiation & integrity | Verifies `verify_provenance()` succeeds on authentic records and fails if any input/output field is modified. |

---

## 3. Running Tests

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run all automated tests
pytest -v

# Run with test coverage report
pytest --cov=app tests/
```

---

## 4. Test Execution Log

*(Updated upon completion of each phase)*

| Phase | Test Suite | Tests Run | Result | Notes |
| :---: | :---: | :---: | :---: | :--- |
| **Phase 1 (Backend)** | `test_auth.py`, `test_rbac.py` | 12 | **PASS (100%)** | JWT authentication, PBKDF2 password hashing, server-side RBAC guards, SecurityEvent logging on 401/403 |
| **Phase 1 (Frontend)** | Static HTTP Verification & Asset Syntax | 14 assets | **PASS (100%)** | All 8 pages, 3 stylesheets, app router, mock data, and charts engine verified (HTTP 200, 0 syntax errors) |
| **Phase 2** | *Pending* | - | - | Red & Blue Team Workspaces |
| **Phase 3** | *Pending* | - | - | Evaluation Engine & Provenance |
| **Phase 4** | *Pending* | - | - | Role-based Sanitization & Projections |
| **Phase 5** | *Pending* | - | - | End-to-End Integration & UI |
| **Phase 6** | *Pending* | - | - | Scenario Validation & Intrusion Demos |
