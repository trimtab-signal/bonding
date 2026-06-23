# Automation Roadmap — Make.com, n8n, CiviCRM Integration

**Purpose:** Phase-gated automation architecture to connect P31 Labs' technical stack with business operations, donor management, and grant workflows — without spending a dime until revenue arrives.  
**Estimated setup time:** Phase 1 = 2–4 hours. Phase 2 = 1–2 days (when Pis arrive).  
**Cost:** $0 (Make.com NGO free tier + self-hosted n8n + CiviCRM)

---

## Current State

| Tool                      | Usage                        | Gap                                    |
| ------------------------- | ---------------------------- | -------------------------------------- |
| GitHub                    | Code hosting, issue tracking | No automated donor/participant updates |
| Cloudflare Pages          | Deployment                   | No CMS or auto-content triggers        |
| CashPilot                 | DePIN income                 | No payout routing to financial tracker |
| Markdown docs             | Grant tracking, proposals    | No CRM, no automated follow-ups        |
| Manual localhost services | CashPilot stack              | No alerting or monitoring              |

---

## Target State

```
[Trigger] ──> [Make.com / n8n] ──> [CiviCRM] ──> [Outcome]
     │              │                   │
     ▼              ▼                   ▼
GitHub commit   Form submission      Donor follow-up
Grant deadline  Discord message      Participant milestone
DePIN payout    Email alert          Event reminder
Deploy success  Social post          Invoice generation
```

---

## Phase 1 (This Week — No Spend)

### Make.com NGO Free Tier

1. **Sign up:** [make.com/en/for-nonprofits](https://www.make.com/en/for-nonprofits)
   - Requires 501(c)(3) determination letter (pending — attach when received)
   - Free for eligible nonprofits: 10,000 operations/month

2. **Scenario 1: GitHub → Donor Update**
   - **Trigger:** New repository milestone reached
   - **Action:** Draft donor email + post to Twitter/LinkedIn
   - **Value:** Keeps donors engaged without manual outreach

3. **Scenario 2: Form → CRM Entry**
   - **Trigger:** Website contact/pilot form submitted
   - **Action:** Create contact in CiviCRM + send welcome email
   - **Value:** No leads lost; automated intake

4. **Scenario 3: Grant Deadline Alert**
   - **Trigger:** Cron (daily at 9 AM)
   - **Action:** Check `docs/FUNDING_ROADMAP.md` for deadlines within 7 days; email reminder
   - **Value:** Never miss a deadline again

### Self-Hosted n8n (Optional Alternative)

If you want full control and already run Docker:

```bash
docker compose up -d n8n
# Access at http://localhost:5678
```

- Same scenarios as Make.com, but self-hosted and unlimited operations
- No SaaS dependency

---

## Phase 2 (When Raspberry Pi Cluster Arrives)

### CiviCRM on Pi Cluster

1. **Install CiviCRM** on Pi node with:
   - MariaDB/MySQL
   - Apache/Nginx + PHP
   - CiviCRM core + extensions (CiviGrant, CiviCase)

2. **Wire to automation:**
   - Make.com/n8n → CiviCRM REST API → contact creation/updates
   - GitHub commit → CiviCRM case note (for program participant tracking)
   - DePIN payout → CiviCRM contribution record

3. **Benefits:**
   - Single source of truth for donors, participants, volunteers
   - Grant reporting: pull metrics from CiviCRM into proposal drafts
   - No monthly CRM fees

### K3s + GitOps (Pi-Fleet Upgrade)

Instead of standalone Docker, deploy a **K3s Kubernetes cluster** across your 3 Pi 5 nodes:

- **Tool:** [pi-fleet](https://github.com/your-org/pi-fleet) (Ansible + Terraform, HA config)
- **Benefits:**
  - Self-healing workloads (if a node dies, pods reschedule)
  - Load balancing for CiviCRM, GitLab, n8n
  - GitOps via FluxCD: declarative config in git → auto-deploy to cluster

**Alternative:** `ansible-rpi5-microk8s-cluster` for MicroK8s instead of K3s.

---

## Phase 3 (When Funding Arrives)

### Enterprise Automation

| Tool                       | Use Case                                           | Cost                  |
| -------------------------- | -------------------------------------------------- | --------------------- |
| Change (or Cogency Global) | Multi-state nonprofit compliance filing            | ~$500–1,000/yr        |
| Candid Premier API         | Automated Form 990 / Annual Report validation      | ~$500/yr              |
| Cloudflare Deploy Hooks    | Auto-deploy on CMS content change or CRON          | Free                  |
| GitHub Actions             | CI/CD for all repos (replaces manual `pnpm build`) | Free for public repos |

---

## Immediate Workflows to Build This Week

| #   | Workflow                  | Trigger             | Action                                   | Tool     |
| --- | ------------------------- | ------------------- | ---------------------------------------- | -------- |
| 1   | Donor intake              | Website form submit | Create contact in CiviCRM + send welcome | Make.com |
| 2   | Grant deadline alert      | Daily cron          | Email if deadline < 7 days               | Make.com |
| 3   | GitHub milestone → social | Milestone closed    | Draft tweet + LinkedIn post              | Make.com |
| 4   | DePIN payout tracker      | Daily cron          | Log payout to `docs/FUNDING_ROADMAP.md`  | n8n      |
| 5   | Mortgage reminder         | Weekly cron         | Email reminder 3 days before due date    | Make.com |

---

## Decision Tree: Make.com vs n8n

| Factor       | Make.com                       | n8n                                  |
| ------------ | ------------------------------ | ------------------------------------ |
| Cost         | Free (NGO tier, 10K ops/mo)    | Free (self-hosted)                   |
| Setup        | 30 minutes (UI-driven)         | 1–2 hours (Docker + config)          |
| Maintenance  | Zero (SaaS)                    | You manage updates                   |
| Integrations | 5,000+ apps                    | 400+ nodes (growing)                 |
| Best for     | Quick wins, non-technical team | Full control, privacy-sensitive data |

**Recommendation:** Start with Make.com for instant wins. Self-host n8n when you need more complex logic or want to go fully offline.

---

## Success Metrics

| Metric                          | Target                                 |
| ------------------------------- | -------------------------------------- |
| Manual tasks automated per week | ≥5                                     |
| Hours saved per week            | ≥10                                    |
| Donor response rate             | Increase by 20% (automated follow-ups) |
| Grant deadline misses           | Zero                                   |
| DePIN payout tracking accuracy  | 100%                                   |

---

## Next Steps

1. [ ] Sign up for Make.com NGO program (attach 501(c)(3) letter when received)
2. [ ] Build Scenario 1 (GitHub → donor update) in Make.com
3. [ ] Build Scenario 2 (Form → CRM entry) in Make.com
4. [ ] Set up CiviCRM instance (local or Pi-hosted)
5. [ ] When Pis arrive: deploy K3s cluster + migrate n8n/CiviCRM

---

## Related Docs

- `docs/FUNDING_ROADMAP.md` — Grant deadlines and tracker
- `docs/DEPIN_SETUP.md` — CashPilot local deployment
- `docs/proposals/sensata-foundation.md` — Sensata Foundation proposal
- `docs/PI_PROVISIONING_PLAN.md` — Raspberry Pi cluster hardware plan
