# P31 Labs — Equilibrium Plan

## North Star

Every project builds cleanly, has tests, is deployable, cross-links to its sibling projects, and can be verified in CI. A single `pnpm verify` from the Andromeda root proves the whole ecosystem is healthy.

---

## Tier 1 — Core MVPs (Build-First, Ship-Now)

These are the apps people use directly. They need to build, deploy, and integrate with each other today.

### 1. BONDING Chemistry Game (`software/bonding/`)

| Lever       | Status               | Action                                       |
| ----------- | -------------------- | -------------------------------------------- |
| Build       | ❌ not checked       | `pnpm install && pnpm build`                 |
| Tests       | ✅ 424 / 32 suites   | —                                            |
| Deploy      | ✅ bonding.p31ca.org | —                                            |
| CI/CD       | ❌ no workflow       | Add `.github/workflows/ci.yml`               |
| Cross-links | Partial              | Link to PHOS, p31ca, 8-ball in README footer |

### 2. SPACESHIP EARTH (`software/spaceship-earth/`)

| Lever           | Status         | Action                                                                |
| --------------- | -------------- | --------------------------------------------------------------------- |
| Build           | ❌ not checked | `pnpm install && pnpm build` (install timed out — workspace hoisting) |
| Tests           | 🤷 exists      | Run `pnpm test`                                                       |
| Deploy          | ❌ no URL      | Wire wrangler deploy for spaceship-relay                              |
| CI/CD           | ❌ no workflow | Add CI                                                                |
| Cross-links     | ❌ none        | Link to BONDING, PHOS, p31ca                                          |
| **Equilibrium** | **🔴**         | Install-fix first, then build+deploy                                  |

### 3. PHOS (`phos/`)

| Lever           | Status            | Action                                       |
| --------------- | ----------------- | -------------------------------------------- |
| Build           | ✅                | `astro build` passes (fixed above)           |
| Tests           | ✅ 85 / 12 files  | —                                            |
| Deploy          | ✅ phos.p31ca.org | —                                            |
| Cross-links     | ✅                | Ecosystem bar added (BONDING, 8-Ball, p31ca) |
| **Equilibrium** | **🟢**            | Monitor build; add to Andromeda workspace    |

### 4. BONDING Meatspace (`/home/p31/bonding/`)

| Lever           | Status                         | Action                              |
| --------------- | ------------------------------ | ----------------------------------- |
| Build           | ✅                             | All 3 apps build cleanly            |
| Tests           | ✅ 32 / 4 files                | —                                   |
| Deploy          | ✅ bonding-meatspace.pages.dev | —                                   |
| CI/CD           | ✅                             | workflows/ci.yml + deploy.yml       |
| Cross-links     | ✅                             | PHOS, GitHub in nav + footer        |
| Capacitor       | ✅                             | iOS + Android native projects ready |
| **Equilibrium** | **🟢**                         | On track                            |

### 5. P31CA.ORG (`software/p31ca/`)

| Lever           | Status                  | Action                               |
| --------------- | ----------------------- | ------------------------------------ |
| Build           | ❌ not checked          | `pnpm install && pnpm build` (Astro) |
| Tests           | ✅ Playwright e2e       | —                                    |
| Deploy          | ✅ p31ca.org            | —                                    |
| Cross-links     | ✅ hub for all products | —                                    |
| **Equilibrium** | **🟡**                  | Verify build; ensure CI runs         |

### 6. PHOSPHORUS31.ORG (`phosphorus31.org/planetary-planet/`)

| Lever           | Status                           | Action                               |
| --------------- | -------------------------------- | ------------------------------------ |
| Build           | ❌ not checked                   | `pnpm install && pnpm build` (Astro) |
| Tests           | 🤷 exists                        | Run tests                            |
| Deploy          | ✅ phosphorus31.org              | —                                    |
| Cross-links     | ✅ links to all products, donate | —                                    |
| **Equilibrium** | **🟡**                           | Verify build and donate flow         |

---

## Tier 2 — Infrastructure & Mesh (Run-the-World)

These are the Cloudflare Workers and services that power the ecosystem.

### 7. K4 CAGE (`software/k4-cage/`)

| Lever           | Status                                | Action                               |
| --------------- | ------------------------------------- | ------------------------------------ |
| Build           | ❌ not checked                        | `npm install && wrangler deploy`     |
| Tests           | ❌ none                               | Add basic ping test                  |
| Deploy          | ✅ k4-cage.trimtab-signal.workers.dev | —                                    |
| CI/CD           | ❌ no workflow                        | —                                    |
| **Equilibrium** | **🟡**                                | Verify deploy script; add smoke test |

### 8. K4 PERSONAL (`software/k4-personal/`)

| Lever           | Status           | Action                |
| --------------- | ---------------- | --------------------- |
| Build           | ❌ not checked   | `npm install`         |
| Tests           | 🤷 verify script | Converts to real test |
| Deploy          | ✅               | —                     |
| **Equilibrium** | **🟡**           | Verify; add CI        |

### 9. P31 CORTEX (`software/p31-cortex/`)

| Lever           | Status                                   | Action         |
| --------------- | ---------------------------------------- | -------------- |
| Build           | ❌ not checked                           | `pnpm install` |
| Tests           | ✅ Vitest                                | —              |
| Deploy          | ✅ p31-cortex.trimtab-signal.workers.dev | —              |
| **Equilibrium** | **🟡**                                   | Verify build   |

### 10. KENOSIS MESH (`software/kenosis-mesh/`)

| Lever           | Status          | Action                   |
| --------------- | --------------- | ------------------------ |
| Build           | ❌ not checked  | 7-node SIC-POVM topology |
| Tests           | 🤷 test scripts | —                        |
| Deploy          | ✅              | —                        |
| **Equilibrium** | **🟡**          | Verify                   |

### 11. SPIN MESH / BARTER (`software/spin-mesh/`)

| Lever           | Status         | Action                                    |
| --------------- | -------------- | ----------------------------------------- |
| Build           | ❌ not checked | React + PGlite + TinyBase                 |
| Tests           | ✅ Vitest      | —                                         |
| Deploy          | ❌ no URL      | Add wrangler deploy                       |
| Cross-links     | ❌ none        | Link to BONDING (barter bonds for atoms?) |
| **Equilibrium** | **🔴**         | Install + build + deploy + link           |

### 12. GEODESIC ROOM (`software/geodesic-room/`)

| Lever           | Status                                      | Action         |
| --------------- | ------------------------------------------- | -------------- |
| Build           | ❌ not checked                              | Durable Object |
| Tests           | 🤷 exists                                   | —              |
| Deploy          | ✅ geodesic-room.trimtab-signal.workers.dev | —              |
| **Equilibrium** | **🟡**                                      | Verify build   |

---

## Tier 3 — Tools & Productivity (Make-Work-Flow)

### 13. P31 FORGE (`software/p31-forge/`)

| Lever           | Status         | Action                                               |
| --------------- | -------------- | ---------------------------------------------------- |
| Build           | ❌ not checked | Node.js CLI                                          |
| Tests           | ✅             | —                                                    |
| Deploy          | ✅ Worker      | —                                                    |
| Cross-links     | ❌ none        | Integrate with PHOS via IntentEngine court doc route |
| **Equilibrium** | **🟡**         | Verify; add PHOS integration                         |

### 14. SOVEREIGN COMMAND CENTER (`software/sovereign-command-center/`)

| Lever           | Status         | Action                                 |
| --------------- | -------------- | -------------------------------------- |
| Build           | ❌ not checked | Next.js 15                             |
| Tests           | ✅             | —                                      |
| Deploy          | ❌ no URL      | Cloudflare Pages Next.js adapter       |
| Cross-links     | ❌ none        | Social posts should route to P31 Forge |
| **Equilibrium** | **🔴**         | Build + deploy + Forge integration     |

### 15. SPOON CALCULATOR (`software/spoon-calculator/`)

| Lever           | Status         | Action                                   |
| --------------- | -------------- | ---------------------------------------- |
| Build           | ❌ not checked | React 19 + Vite                          |
| Tests           | ❌ none        | —                                        |
| Deploy          | ❌ no URL      | Static site                              |
| Cross-links     | ❌ none        | Should feed spoon data to PHOS + 8-Ball  |
| **Equilibrium** | **🔴**         | Build + test + deploy + PHOS integration |

### 16. HEARING OPS (`software/p31-hearing-ops/`)

| Lever           | Status           | Action                                            |
| --------------- | ---------------- | ------------------------------------------------- |
| Build           | ❌ not checked   | Vite + PWA                                        |
| Tests           | ❌ none          | —                                                 |
| Deploy          | ✅ ops.p31ca.org | —                                                 |
| **Equilibrium** | **🟡**           | Verify build (post-hearing, can archive or merge) |

### 17. COMMAND CENTER (`software/cloudflare-worker/command-center/`)

| Lever           | Status                                       | Action                                               |
| --------------- | -------------------------------------------- | ---------------------------------------------------- |
| Build           | ❌ not checked                               | KV-backed dashboard                                  |
| Tests           | ✅ Jest + Playwright                         | —                                                    |
| Deploy          | ✅ command-center.trimtab-signal.workers.dev | —                                                    |
| **Equilibrium** | **🟡**                                       | Verify; ensure status.json updates from all projects |

---

## Tier 4 — Edge & Experimental (Watch-and-Nurture)

### 18. P31 AGENT HUB (`software/p31-agent-hub/`)

DO-based agent sessions, Workers AI integration. Needs build verify + cross-link to K4.

### 19. WILLOW (`apps/willow/`)

Personal app — no package.json (vanilla JS/TS). Determine if active or archive. If active: add package.json + build.

### 20. DONATE API (`software/donate-api/`)

Stripe Checkout via HCB. Verify Stripe integration still works with new EIN.

### 21. P31 GOOGLE BRIDGE (`software/p31-google-bridge/`)

OAuth token management. Verify build.

### 22. P31 DELTA HIRING (`software/p31-delta-hiring/`)

Role packet generation. Verify build + link from p31ca.org.

### 23. WEAVE MACHINE (`/home/p31/p31labs/weave-machine/`)

Content fusion engine. Test + link to PHOS (archive surface).

### 24. CASHPLIOT (`/home/p31/cashpilot/`)

DePIN ROI management. Verify Docker compose works. Link to Command Center.

---

## Integration Map

```
                          ┌─────────────────────────────┐
                          │       phosphorus31.org       │
                          │   (Institutional + Donate)   │
                          └─────────────┬───────────────┘
                                        │
                          ┌─────────────▼───────────────┐
                          │          p31ca.org          │
                          │    (Technical Hub + Fleet)   │
                          └────┬──────┬──────┬────┬─────┘
                               │      │      │    │
              ┌────────────────┘      │      │    └──────────────┐
              ▼                       ▼      ▼                   ▼
     ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
     │ BONDING Game  │     │   BONDING Meat   │     │    SPACESHIP     │
     │ (Chemistry)   │◄───►│     space        │◄───►│     EARTH        │
     │ bonding.p31.. │     │ (Social + Map)   │     │  (Dashboard)     │
     └──────┬───────┘     └────────┬─────────┘     └────────┬─────────┘
            │                     │                         │
            │      ┌──────────────┼──────────────┐          │
            │      ▼              ▼              ▼          │
            │  ┌────────┐ ┌──────────┐ ┌──────────────┐    │
            │  │   K4   │ │  P31     │ │  KENOSIS     │    │
            └──► CAGE  │ │ CORTEX   │ │  MESH        │    │
               │        │ │          │ │  (7-node)    │    │
               └───┬────┘ └────┬─────┘ └──────────────┘    │
                   │           │                            │
          ┌────────▼───┐ ┌────▼────────┐  ┌────────────────▼──┐
          │ P31 FORGE  │ │ 8-BALL      │  │ PHOS Convergence  │
          │ (Docs)     │ │ (Decision)  │  │ (Dashboard)       │
          └────────────┘ └────┬────────┘  └────────┬──────────┘
                              │                    │
                              ▼                    ▼
                    ┌──────────────────┐  ┌──────────────────┐
                    │ SPOON CALCULATOR │  │ COMMAND CENTER   │
                    │ (Spoon tracking) │  │ (Status + KV)    │
                    └──────────────────┘  └──────────────────┘
```

---

## Priority Action Queue

### Phase 1 — Build Verification This Session

- [ ] `software/bonding/` — run `pnpm build`, verify 424 tests pass
- [ ] `software/spaceship-earth/` — fix install (workspace hoisting), build, test
- [ ] `software/p31ca/` — `pnpm build`, verify Astro output
- [ ] `software/p31-forge/` — `node forge.js --help`, verify CLI works
- [ ] `software/sovereign-command-center/` — fix install, build
- [ ] `software/spin-mesh/` — fix install, build, test
- [ ] `software/spoon-calculator/` — build, deploy to Cloudflare Pages
- [ ] `software/k4-cage/` — verify deploy script works
- [ ] `software/p31-cortex/` — `pnpm build`, verify worker

### Phase 2 — Equilibrium Upgrades

- [ ] Add CI workflows for all Tier 1–2 projects
- [ ] Cross-link all READMEs (every project lists sibling projects)
- [ ] Every project gets a short `README.md` with build + test status badge
- [ ] `GROUND_TRUTH.yaml` lists all services with health endpoints
- [ ] Fork-merge `phos/` into Andromeda workspace (add to `pnpm-workspace.yaml`)
- [ ] Unify deploy tokens (single `CF_API_TOKEN` for all Pages deploys)

### Phase 3 — Deep Integration

- [ ] Spoon Calculator → PHOS API (spoon state feeds PHOS atmosphere)
- [ ] PHOS IntentEngine → P31 Forge (court doc intent → Forge CLI)
- [ ] PHOS IntentEngine → 8-Ball ("should I" routes to quantum-8ball.py)
- [ ] 8-Ball dashboard → PHOS surface (iframe or iframe-resizer)
- [ ] BONDING meatspace → SPIN-MESH (barter bonds → physical media swap)
- [ ] BONDING chemistry game → BONDING meatspace (molecule solve → zone unlock)
- [ ] K4 Cage → all Personal K4 nodes (unified mesh health dashboard)
- [ ] Command Center status.json → p31ca.org fleet status strip

---

## Build-All Command

Once workspace is unified:

```bash
# From andromeda root
pnpm install
pnpm -r build        # Builds EVERYTHING in workspace
pnpm -r test         # Runs ALL tests
```

This should be the single verify command. Any project that breaks it needs fixing — or removing from workspace.
