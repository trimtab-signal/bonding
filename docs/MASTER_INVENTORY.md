# Master Inventory & Parts Catalog

**Repo:** `p31-meatspace-bonding`  
**Entity:** P31 Labs, Inc. (EIN 42-1888158)  
**Status:** Sovereign — all planes live, test suite green, lint clean  
**Last Audit:** 2026-06-23 (commit `19188f3`)  

---

## 1. Quality Gate Summary

| Gate | Result | Details |
|------|--------|---------|
| Typecheck | ✅ **PASS** | 0 errors, `tsc --noEmit` clean across 11 projects |
| Tests | ✅ **PASS** | 95/95 (11 files), 72.15% stmts / 71.18% branch / 69.23% funcs / 74.69% lines |
| Lint | ✅ **PASS** | 0 errors, 0 warnings (max-warnings=0 enforced) |
| Build | ✅ **PASS** | All 8 apps + 3 packages compile |
| Audit | ⚠️ **1 moderate** | `uuid` <11.1.1 in `@meatspace/server` (missing buffer bounds check) |

---

## 2. Monorepo Structure

```
/apps (8 deployable targets)
  ├── delta-ignition     — CF Pages plane (K⁴ tetrahedron + CLI walk)
  ├── fleet-status       — CF Pages plane (terminal fleet dashboard)
  ├── trim-sequence      — CF Pages plane (Sequencer UI)
  ├── onboarding         — CF Pages shell (redirect + hash router)
  ├── onboarding-module  — IIFE bundle (sovereign embeddable module)
  ├── server             — Render/Railway backend (Express + Socket.IO + pg)
  └── mobile             — Capacitor mobile client (webkit + cordova)

/packages (3 internal libraries)
  ├── k4-element         — React K⁴ graph primitives
  ├── k4-ui              — Shared Tetrahedron component + hooks
  └── shared-types       — Zod schemas + shared TS types

/docs (28 operational/proposal documents)
```

**Total:** 11 projects, 96 packages, 19 markdown documents (root + docs/)

---

## 3. App Parts Catalog

### 3.1 Deployable Apps

| App | Dir | Entry | Stack | Bundle Size | Deploy Target | Live URL |
|-----|-----|-------|-------|-------------|---------------|----------|
| bonding-meatspace | `apps/onboarding` | `src/main.tsx` | React 19, Vite 6 | 280 KB dist | CF Pages | bonding.p31ca.org |
| delta-ignition | `apps/delta-ignition` | `src/main.tsx` | React 19, Vite 6 | 312 KB js + 4 KB css | CF Pages | delta-ignition.p31ca.org |
| trim-sequence | `apps/trim-sequence`` | `src/main.tsx` | React 19, Vite 6 | 199 KB js + 4 KB css | CF Pages | trim-sequence.p31ca.org |
| fleet-status | `apps/fleet-status` | `src/main.tsx` | React 19, Vite 6 | 204 KB dist | CF Pages | fleet-status.p31ca.org |
| onboarding-module | `apps/onboarding-module` | `src/main.tsx` | React 19, Vite 6 IIFE | 174 KB iife + 12 KB css CF Pages onboarding-module.pages.dev |
| server | `apps/server` | `src/index.ts` | Express, Socket.IO, pg | 224 KB dist | Render/Railway | bonding-server.onrender.com |
| mobile | `apps/mobile` | `src/main.tsx` | React 18, Capacitor | 3.4 MB dist | Capacitor | — |

### 3.2 Internal Packages

| Package | Dir | Exports | Type |
|---------|-----|---------|------|
| @meatspace/k4-element` | `packages/k4-element` | Kerberos4Element, K4ValidationButton | React component |
| @meatspace/k4-ui` | `packages/k4-ui` | Tetrahedron, useK4Features | React component + hook |
| @meatspace/shared-types` | `packages/shared-types` | geo, zones, protocol types | TS types + Zod schema |

### 3.3 Server Services

| Service | File | Purpose |
|---------|------|---------|
| health | `apps/server/src/services/health.ts` | Liveness/readiness checks |
| game-loop | `apps/server/src/services/game-loop.ts` | Periodic bond/react emits |
| valence | `apps/server/src/services/valence.ts` | Bond strength calculations |
| witness | `apps/server/src/services/witness.ts` | Location proof validation |
| game-handler | `apps/server/src/services/game-handler.ts` | Socket.IO message router |

### 3.4 Database Layer

| File | Purpose |
|------|---------|
| `apps/server/src/db/pool.ts` | pg Pool + migrate/query helpers |
| `apps/server/src/db/seed.ts` | Demo atom/bond bootstrapper |
| `apps/server/migrations/001_init.sql` | Schema (atoms, bonds, reactions) |

---

## 4. Dependency Audit

**Total:** 156 production, 355 dev, 79 optional = 512 total dependencies

### 4.1 Vulnerabilities

| Advisory | Package | Severity | Status |
|----------|---------|----------|--------|
| Missing buffer bounds check in v3/v5/v6 | `uuid` 10.0.0 | Moderate | **OPEN** — patched at 11.1.1 |

**Impact:** Low. `uuid` is server-side only. The vulnerable buffer check only affects inputs where `buf` is explicitly passed (rare in standard `v4()` usage).  
**Fix:** `pnpm update uuid@latest` (currently 10.0.0 → 11.1.1+)  
**Tracking:** Not yet patched in repo; should be resolved before next funding due diligence.

### 4.2 Prohibited/Critical Dependencies

None found. No console-based secrets, no eval(), no dynamic require from untrusted input.

---

## 5. Security & Hardening

### 5.1 Secrets Scan

| Scan Target | Result |
|-------------|--------|
| AWS keys (AKIA*) | ✅ No exposure |
| GitHub PATs (ghp_*) | ✅ No exposure |
| Slack tokens | ✅ No exposure |
| Private keys (OPENSSH/RSA/EC) | ✅ No exposure |
| .env in working tree | ✅ Not present (gitignored) |

### 5.2 Network Exposure

| Interface | Binding | Notes |
|-----------|---------|-------|
| Server HTTP | `0.0.0.0` | Render/Railway; CORS whitelist recommended |
| Socket.IO | Same HTTP | Rate limit enforced (1 check-in/2 min) |
| CORS default | `*` | **TODO:** restrict to CF Pages domains in production |

### 5.3 Docker Hardening

| Item | Status |
|------|--------|
| Base image | `node:22-alpine` ✅ |
| Multi-stage build | ✅ (builder → runtime) |
| Non-root user | ❌ Missing (runs as root) |
| HEALTHCHECK | ❌ Missing |
| Lockfile pin | ✅ (`--frozen-lockfile`) |
| Build arg secrets | ✅ (build-time only) |

### 5.4 Content Security

| Check | Result |
|-------|--------|
| CJS require() in client | ✅ None |
| Inline scripts | ✅ None (Vite CSP-friendly) |
| eval() / new Function() | ✅ None |
| JSONP endpoints | ✅ None |

---

## 6. Build Artifacts

| Target | Dir | Size | Compressed |
|--------|-----|------|------------|
| delta-ignition | `apps/delta-ignition/dist` | 324 KB | — |
| fleet-status | `apps/fleet-status/dist` | 204 KB | — |
| trim-sequence | `apps/trim-sequence/dist` | 316 KB | — |
| onboarding | `apps/onboarding/dist` | 280 KB | — |
| onboarding-module | `apps/onboarding-module/dist` | 184 KB | — |
| mobile | `apps/mobile/dist` | 3.4 MB | — |
| server | `apps/server/dist` | 224 KB | — |
| shared-types | `packages/shared-types/dist` | 20 KB | — |

**IIFE Bundle:** `onboarding-module/dist/delta-ignition.iife.js` = 174 KB (56.85 KB gzip)

---

## 7. CI/CD Pipeline

### 7.1 GitHub Actions

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `ci.yml` | push/PR to master | typecheck → lint → test → build → bundle check → deploy onboarding |
| `deploy.yml` | push to master (docs-only excluded) | CF Pages deploy |

### 7.2 Manual Deploy Scripts

| Script | Tool | Target |
|--------|------|--------|
| `deploy:delta-ignition` | Wrangler | CF Pages |
| `deploy:trim-sequence` | Wrangler | CF Pages |
| `deploy:fleet-status` | Wrangler | CF Pages |
| `deploy:onboarding` | Wrangler | CF Pages |
| `deploy:onboarding-module` | Wrangler | CF Pages |
| `deploy:server` | git push | Render/Railway auto-deploy |

---

## 8. Technical Debt & TODO Queue

| Item | Severity | Owner |
|------|----------|-------|
| Restrict CORS to CF Pages origins | Medium | Dev |
| Run Docker as non-root | Medium | Dev |
| Add Docker HEALTHCHECK | Low | Dev |
| Update `uuid` to ≥11.1.1 | Low | Dev |
| Add `prettier` config to CI | Low | Dev |
| Add coverage threshold gate (80%) | Medium | Dev |
| Add bundle size regression test | Low | Dev |
| Remove debug `warn/error` logging in prod | Low | Dev |

**No inline `TODO`/`FIXME`/`HACK` markers found in source.**

---

## 9. Documentation Inventory

| Doc | Path | Status |
|-----|------|--------|
| AGENTS.md | `AGENTS.md` | ✅ Active (AI guardrail) |
| README | `README.md` | ✅ Present |
| Delta Tech Spec | `docs/TECH_SPEC.md` | ✅ |
| Deployment Guide | `docs/DEPLOYMENT.md` | ✅ |
| Deployment Verification | `docs/DEPLOYMENT_VERIFICATION.md` | ✅ |
| Developer Guide | `docs/DEVELOPER_GUIDE.md` | ✅ |
| Build Guide | `docs/BUILD.md` | ✅ |
| Launch Checklist | `docs/LAUNCH_CHECKLIST.md` | ✅ |
| Launch Plan | `docs/LAUNCH.md` | ✅ |
| Pilot Guide | `docs/PILOT_GUIDE.md` | ✅ |
| User Guide | `docs/USER_GUIDE.md` | ✅ |
| Health Integration | `docs/HEALTH_INTEGRATION.md` | ✅ |
| Delta Spec | `docs/DELTA.md` | ✅ |
| Equilibrium Plan | `docs/EQUILIBRIUM_PLAN.md` | ✅ |
| P3 Synthesis | `docs/P3_SYNTHESIS.md` | ✅ |
| Research Prompt | `docs/RESEARCH_PROMPT.md` | ✅ |
| Road to Equilibrium | `docs/ROAD_TO_EQUILIBRIUM.md` | ✅ |
| Why | `docs/WHY.md` | ✅ |
| Marketing | `docs/MARKETING.md` | ✅ |
| Social Media | `docs/SOCIAL_MEDIA.md` | ✅ |
| Store Listings | `docs/STORE_LISTINGS.md` | ✅ |
| Email Templates | `docs/EMAIL_TEMPLATES.md` | ✅ |
| Mortgage Forbearance Script | `docs/MORTGAGE_FORBEARANCE_SCRIPT.md` | ✅ Operational |
| GA Annual Registration Template | `docs/GEORGIA_ANNUAL_REGISTRATION_TEMPLATE.md` | ✅ Operational |
| Pi Provisioning Plan | `docs/PI_PROVISIONING_PLAN.md` | ✅ Operational |
| Funding Roadmap | `docs/FUNDING_ROADMAP.md` | ✅ Operational |
| Automation Roadmap | `docs/AUTOMATION_ROADMAP.md` | ✅ Operational |
| DePIN Setup | `docs/DEPIN_SETUP.md` | ✅ Operational |
| Sensata Proposal | `docs/proposals/sensata-foundation.md` | ✅ $20K Phase 1 |
| Art Berg Fund Proposal | `docs/proposals/art-berg-fund.md` | ✅ $5K QuantumCalm |
| OpenAI People-First AI | `docs/proposals/openai-people-first-ai.md` | ✅ Pre-staged |

---

## 10. Environment & Toolchain

| Component | Version |
|-----------|---------|
| Node.js | 24.16.0 |
| pnpm | 11.3.0 |
| Corepack | 0.35.0 |
| TypeScript | 5.9.3 |
| Vite | 6.4.3 |
| React | 19.2.7 (desktop), 18.3.1 (mobile) |
| Vitest | 4.1.9 |
| Socket.IO | 4.8.3 |
| PostgreSQL client | pg 8.21.0 |
| Docker base (server) | node:22-alpine |

---

## 11. Known Gaps & Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CORS wildcard in production | High | Medium | Restrict to CF Pages domains |
| uuid moderate advisory | Low | Low | `pnpm update uuid` |
| No Docker HEALTHCHECK | Medium | Low | Add `HEALTHCHECK CMD curl -f` |
| Server runs as root | Medium | Medium | Add `USER node` in Dockerfile |
| Coverage below 80% | Medium | Low | Add tests for witness.ts and pool.ts |
| Render/Railway single point | Medium | Medium | Multi-region or CF Workers fallback |

---

## 12. Provenance Log (Recent Commits)

| Commit | Date | Description |
|--------|------|-------------|
| 19188f3 | 2026-06-23 | fix lint warnings (prettier + eslint) and add error logging |
| 68e8490 | 2026-06-23 | docs: cut Sensata to $20K, add DEPIN_SETUP, AUTOMATION_ROADMAP |
| 042c032 | 2026-06-23 | refactor(funding): apply deadline research to grant tracker |
| d6700b1 | — | Namespace Severance — @meatspace/* scope, DNS routing |
| 938b1c0 | — | Delta Ignition Zoolander-style onboarding + Blue Steel hardening |

---

*This document is the single authoritative snapshot of the p31-meatspace-bonding system. Update it when gates, dependencies, or architecture change.*
