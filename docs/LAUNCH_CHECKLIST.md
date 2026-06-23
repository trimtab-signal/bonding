# BONDING Launch Checklist

## Pre-Launch (Week -2 to 0)

### Infrastructure

- [ ] Server health endpoint responding: `https://bonding-server.onrender.com/health`
- [ ] Database migrations applied and current
- [ ] CORS configured for onboarding site origin
- [ ] Onboarding site builds with zero errors: `pnpm build`
- [ ] Mobile app builds with zero errors: `pnpm build`
- [ ] Custom domain `meatspace.bonding.p31ca.org` resolves
- [ ] All 5 API routes tested: `/health`, `/api/community`, `/api/zones`, auth flow, check-in flow

### Content

- [ ] Onboarding site deployed (all pages: Home, How It Works, Zones, About, Demo, Join, Press)
- [ ] Press kit page live at `#/press`
- [ ] Pilot sign-up page live at `#/pilot`
- [ ] OG meta tags rendering correctly in social previews
- [ ] Social media card images generated in `media/`
- [ ] Launch document finalised: `docs/LAUNCH.md`

### Recruitment

- [ ] Pilot email list started (pilot@bonding.p31ca.org)
- [ ] Pilot guide ready: `docs/PILOT_GUIDE.md`
- [ ] Email templates drafted (invite, onboarding, feedback)
- [ ] Target of 5-10 pilot participants identified in Kingsland/St. Marys

### Legal / Compliance

- [ ] Privacy policy drafted (no user data collected server-side)
- [ ] Open source license confirmed (repo is public)

---

## Launch Day (Day 0)

### Delta Ignition / Onboarding Module

#### IIFE Bundle

- [ ] `pnpm run build:onboarding-module` produces `dist/delta-ignition.iife.js` (zero TS/Vite errors)
- [ ] Bundle exposes `window.initDeltaIgnition(config)` with methods: `start()`, `resume()`, `skipTo(plane)`, `getState()`
- [ ] CSS module styles embedded in `dist/delta-ignition.css` (no Tailwind dependency)

#### k4-element Package

- [ ] `packages/k4-element/` compiles with `tsc --noEmit` (zero errors)
- [ ] `Kerberos4Element` renders SVG K₄ graph with vertices, edges, validation states
- [ ] `K4ValidationButton` runs 10-command walk sequence, sets valid/invalid/validating state
- [ ] `k4-geometry.ts` exports: `buildDefaultEdges`, `validateK4`, `K4ValidationResult`, `texCoordinates`
- [ ] CSS module types declared in `src/types.d.ts`

#### Adapter Pipeline

- [ ] `k4-bridge.ts`: `getK4NetworkStatus`, `pushK4Entry`, `validateWyeDelta`
- [ ] `meatspace-sync.ts`: `syncGroundTruth`, `syncMedicalFloor`
- [ ] `phos-proxy.ts`: `triggerPhosSession`
- [ ] Each adapter fires on phase transitions (magnum-walk → trim-tabs → fleet-status)
- [ ] Adapter errors are silent-fail (no UI breakage)

#### Persistence / State Machine

- [ ] `localStorage` key `di_state_v1` saves after each plane transition
- [ ] Resume mode (`resume: true`) restores last saved phase on reload
- [ ] Complete/exit clears session from `localStorage`

#### Embedding Tests

- [ ] Vanilla HTML test page mounts via `<script src="dist/delta-ignition.iife.js">`
- [ ] React shell integration test passes (mount to container div)
- [ ] Cloudflare Worker embed test (global API reachable in worker context)

#### Commit & Deploy

- [ ] Namespace severance committed: `@bonding/*` → `@meatspace/*`
- [ ] Root package `p31-meatspace-bonding` committed
- [ ] Commit message: "feat(redirect): bonding.p31ca.org → delta-ignition.p31ca.org; deploy 3 new planes; k4-element package; onboarding-module IIFE bundle"
- [ ] All 4 Pages projects (bonding-meatspace, delta-ignition, trim-sequence, fleet-status) verified HTTP 200

### Morning

- [ ] Final build deployed to Cloudflare Pages
- [ ] Server monitoring active
- [ ] All links verified (no 404s)
- [ ] Demo tutorial flow tested end-to-end
- [ ] Mobile app loads on test device

### Social

- [ ] Twitter/X announcement posted
- [ ] LinkedIn feature spotlight posted
- [ ] Instagram behind-the-scenes posted
- [ ] Facebook community call posted
- [ ] Press release sent to local outlets (Kingsland/St. Marys)

### Community

- [ ] Pilot participants invited via email
- [ ] Pilot kick-off scheduled
- [ ] GitHub repo starred and issues enabled

### Monitoring

- [ ] Server logs checked for errors
- [ ] Health endpoint monitored (every 5 min)
- [ ] Email inbox monitored for pilot sign-ups

---

## Week 1 (Day 1-7)

- [ ] Pilot welcome email sent with setup instructions
- [ ] First check-in flow guided for pilot users
- [ ] Bug reports collected and triaged
- [ ] Daily server log review
- [ ] Social media engagement monitored

## Week 2 (Day 8-14)

- [ ] Pilot feedback form distributed
- [ ] Top 3 issues identified and fixed
- [ ] Iteration deployed
- [ ] First pilot results documented

## Week 3 (Day 15-21)

- [ ] Results shared with community
- [ ] Next wave of participants invited
- [ ] Public open-source contribution call

## Week 4+ (Day 22+)

- [ ] Expansion to additional areas
- [ ] Multi-site support (JAX, etc.)
- [ ] P4 features evaluated
