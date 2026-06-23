# Deployment Verification Checklist

**Purpose:** One-page smoke test for all live P31 Labs sites. Run after every deploy, weekly, or after any infrastructure change.  
**Owner:** [YOU]  
**Last verified:** [YYYY-MM-DD]  
**Sign-off:** **\*\*\*\***\_\_\_**\*\*\*\***

---

## 1. Cloudflare Pages — Site Matrix

| Site                                 | URL                                 | Expected                                      | Verified |
| ------------------------------------ | ----------------------------------- | --------------------------------------------- | -------- |
| bonding-meatspace (onboarding shell) | https://bonding.p31ca.org           | 200, redirects to `#/delta-ignition` or plane | [ ]      |
| delta-ignition (plane)               | https://delta-ignition.p31ca.org    | 200, MagnumWalk / Tetrahedron renders         | [ ]      |
| trim-sequence (plane)                | https://trim-sequence.p31ca.org     | 200, TrimTabs CLI renders                     | [ ]      |
| fleet-status (plane)                 | https://fleet-status.p31ca.org      | 200, FleetStatus terminal renders             | [ ]      |
| bonding-meatspace (raw Pages)        | https://bonding-meatspace.pages.dev | 200 (fallback)                                | [ ]      |
| delta-ignition (raw Pages)           | https://delta-ignition.pages.dev    | 200 (fallback)                                | [ ]      |
| trim-sequence (raw Pages)            | https://trim-sequence.pages.dev     | 200 (fallback)                                | [ ]      |
| fleet-status (raw Pages)             | https://fleet-status.pages.dev      | 200 (fallback)                                | [ ]      |

---

## 2. Smoke-Test Commands

Run each from terminal. All should return `200` and non-empty body:

```bash
# Main shell + planes
curl -s -o /dev/null -w "%{http_code}" https://bonding.p31ca.org
curl -s -o /dev/null -w "%{http_code}" https://delta-ignition.p31ca.org
curl -s -o /dev/null -w "%{http_code}" https://trim-sequence.p31ca.org
curl -s -o /dev/null -w "%{http_code}" https://fleet-status.p31ca.org

# Fallback raw Pages URLs
curl -s -o /dev/null -w "%{http_code}" https://bonding-meatspace.pages.dev
curl -s -o /dev/null -w "%{http_code}" https://delta-ignition.pages.dev
curl -s -o /dev/null -w "%{http_code}" https://trim-sequence.pages.dev
curl -s -o /dev/null -w "%{http_code}" https://fleet-status.pages.dev
```

**Expected output:** `200` for all eight commands.

---

## 3. DNS Propagation

```bash
# Verify CNAME records resolve to Cloudflare Pages
dig +short bonding.p31ca.org
dig +short delta-ignition.p31ca.org
dig +short trim-sequence.p31ca.org
dig +short fleet-status.p31ca.org

# Verify chemistry game domain (different repo)
dig +short chemistry.p31ca.org
```

**Expected:** All four `*.p31ca.org` should resolve to Cloudflare Pages IPs or CNAME targets.

---

## 4. Cross-Site Link Validation

| Test                   | Steps                                                                                                                                              | Expected                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Shell → delta-ignition | Visit `https://bonding.p31ca.org`, wait for auto-redirect or click "Delta Ignition"                                                                | Loads `delta-ignition.p31ca.org`                            |
| Shell → trim-sequence  | Click "Trim Sequence" from shell or manually navigate                                                                                              | Loads `trim-sequence.p31ca.org`                             |
| Shell → fleet-status   | Click "Fleet Status"                                                                                                                               | Loads `fleet-status.p31ca.org`                              |
| FleetStatus back-link  | In FleetStatus terminal, click `← Back`                                                                                                            | Returns to `bonding.p31ca.org`                              |
| IIFE global API        | Add `<script src="https://delta-ignition.p31ca.org/delta-ignition.iife.js">` to any page, console: `window.initDeltaIgnition({ mode: 'minimal' })` | Returns object with `start`, `resume`, `skipTo`, `getState` |

---

## 5. Functional Smoke Tests

| Plane                       | Key Interaction                                                 | Expected Result                                                  |
| --------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| MagnumWalk (delta-ignition) | Auto-play phases run (intro → wye → implosion → delta → stride) | 5 phases complete in ~15s, then "ENTER THE DELTA" button appears |
| TrimTabs (trim-sequence)    | Steps advance one-by-one                                        | 8 steps complete, terminal builds correctly                      |
| FleetStatus (fleet-status)  | Click terminal, type `fleet status --all` and press Enter       | K₴ fleet table renders with 6 ATOMs                              |
| FleetStatus                 | Type `help` and press Enter                                     | Shows available commands                                         |

---

## 6. Build Verification (Local)

```bash
# From /home/p31/bonding
pnpm run typecheck   # must exit 0
pnpm run test        # must show 95+ passing
pnpm run build:k4-ui
pnpm run build:onboarding-module
pnpm run build:planes
```

**Expected:** All commands exit 0 with no errors.

---

## 7. Git State Verification

```bash
git status           # must be clean
git log --oneline -3 # must show latest deploy commit
git branch -v        # master must match origin/master
```

**Expected:** Clean working tree, no uncommitted changes.

---

## 8. Monitoring Alerts

| Signal                 | Alert Threshold        | Check Frequency |
| ---------------------- | ---------------------- | --------------- |
| CF Pages error rate    | >1% over 5 min         | Daily           |
| DNS resolution failure | Any timeout            | Weekly          |
| IIFE bundle size       | >200 KB (uncompressed) | Per deploy      |
| Test suite             | Any failure            | Every deploy    |

---

## 9. Sign-off

| Item                     | Pass | Fail | Notes |
| ------------------------ | ---- | ---- | ----- |
| All 4 planes HTTP 200    | [ ]  | [ ]  |       |
| DNS propagation correct  | [ ]  | [ ]  |       |
| Functional smoke tests   | [ ]  | [ ]  |       |
| Local build + test clean | [ ]  | [ ]  |       |
| Git state clean          | [ ]  | [ ]  |       |

**Verified by:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Date:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Next verification due:** **\*\*\*\***\_\_\_**\*\*\*\***

---

## Rollback Procedure

If any check fails:

1. Identify which plane is broken (`curl` the failing URL).
2. Check CF Pages dashboard for deploy history → roll back to last green deploy.
3. If DNS is broken, verify Cloudflare DNS records in dashboard.
4. If IIFE bundle is broken, revert to previous `dist/delta-ignition.iife.js` and re-deploy.
5. If server is broken, check Render/Railway logs and redeploy from `master`.
