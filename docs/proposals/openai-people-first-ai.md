# Proposal Template — OpenAI People-First AI Fund

**Funder:** OpenAI Foundation  
**Program:** People-First AI Fund  
**Amount:** Unrestricted (varies by grant)  
**Deadline:** Next window TBD (likely Fall 2026)  
**Focus areas:** AI literacy & public understanding; community innovation; economic opportunity  
**Eligibility:** U.S. 501(c)(3) organizations  
**Application:** Short form (4 questions)  
**Template version:** 2026-06-23 (pre-staged for Fall 2026 window)  

---

## Application Questions (Draft Responses)

### Question 1: Organization & Mission

**Prompt (expected):** Briefly describe your organization and its mission.

**Draft response (250 words):**

> P31 Labs, Inc. is a 501(c)(3) nonprofit technology laboratory based in Camden County, Georgia. We build open-source infrastructure for social coordination, cryptographic identity, and neurodivergent accessibility. Our flagship projects include CashPilot (a local DePIN stack for passive income generation), the Delta Ignition onboarding module (a sovereign IIFE bundle for embedding K₄-based interfaces), and QuantumCalm (an assistive communication system merging tetrahedral geometry with biofeedback for autistic and ADHD users). We run four live Cloudflare Pages projects, maintain 95/95 test coverage, and operate under the @meatspace/* namespace to ensure ethical, self-sovereign software. Our mission is to prove that small, lean teams can build production-grade, self-hosted systems that serve human flourishing without engagement hacks, surveillance, or extractive business models.

---

### Question 2: Project Description

**Prompt (expected):** Describe the project you are proposing. What are you building, and who does it serve?

**Draft response (300 words):**

> We propose **QuantumCalm Kiosk**: a self-hosted, open-source assistive communication interface for neurodivergent individuals who experience aphasia, selective mutism, or sensory overload. The system merges real-time biofeedback (heart-rate variability via Web Bluetooth) with K₄ tetrahedral geometry to create a non-verbal expression system. Users wear a consumer HRV sensor (e.g., Polar H10); the interface maps physiological state to four visual anchor vertices (belief, somatic action, structural logic, physical health). Output is visual (tetrahedron color/rotation), haptic (vibration patterns), and textual (calm, plain-language expressions). The hardware target is a Raspberry Pi 5 (4GB) + 7" touchscreen, costing ~$150/unit vs. $2,000+ for commercial AAC devices. No SaaS dependency, no cloud required—fully self-hosted for privacy. We serve autistic and ADHD adults and youth in Georgia, with a curriculum extension (Neuro-Tech Career Catalyst) that trains neurodivergent young adults to build, customize, and deploy their own units. The project is open-source (AGPL-3.0) so any community can fork and adapt it.

---

### Question 3: Impact & Outcomes

**Prompt (expected):** What impact do you expect this project to have? How will you measure success?

**Draft response (250 words):**

> **Short-term (6 months):**
> - 5 neurodivergent beta testers complete 3+ sessions
> - 20% reduction in self-reported communication anxiety (pre/post survey)
> - 50+ GitHub stars; 10+ forks
> - 3 units deployed in pilot locations (Kingsland, GA area)
>
> **Medium-term (12 months):**
> - 12 participants complete Neuro-Tech Career Catalyst bootcamp + project lab
> - 8/12 secure internships in Georgia tech firms
> - Curriculum adopted by 2+ external organizations
>
> **Long-term (24 months):**
> - 20+ QuantumCalm units deployed across 3+ communities
> - Replicable framework adopted by assistive-tech nonprofits nationally
> - Evidence base published: open dataset of HRV-to-expression mappings for neurodivergent users
>
> **Measurement:** Mixed-methods evaluation combining quantitative usage logs (session duration, vertex transitions, expression selections) with qualitative semi-structured interviews. All data is opt-in and FERPA-compliant. We track Net Promoter Score from caregivers and participants separately. Our technical infrastructure (Docker, Git, Cloudflare) allows us to instrument every deployment and push aggregated analytics to a public dashboard without exposing individual identities.

---

### Question 4: Budget & Sustainability

**Prompt (expected):** How will you use the funding, and how will the project continue after the grant period?

**Draft response (300 words):**

> **Budget allocation for QuantumCalm Kiosk (if funded at $50,000–$100,000 level):**
> - Hardware (10 Pi 5 kiosks + sensors): $1,500
> - Developer stipends (2 neurodivergent devs × 20 hrs/wk × 6 months): $24,000
> - beta tester stipends (10 participants × $500): $5,000
> - Curriculum development & caregiver training: $8,000
> - Open-source tooling, hosting, monitoring (6 months): $4,000
> - Evaluation & reporting: $5,000
> - Administrative overhead (15%): $10,500
> - **Total:** $58,000 (flexible based on actual award amount)
>
> **Sustainability:**
> - **Open-source model:** No licensing fees for end users; community contributions reduce maintenance cost.
> - **Hardware-as-donation:** Seek hardware donations from corporate CSR programs (Raspberry Pi Foundation, Microsoft Accessibility).
> - **Training contracts:** After pilot validation, offer paid caregiver training to schools and therapy centers ($500–$2,000/session).
> - **Subsequent grants:** AWS Imagine Grant ($50K–$200K) and Spectrum Digital Education ($1M+ pool) targeted for scale phase.
> - **DePIN integration:** Local CashPilot deployment (`docs/DEPIN_SETUP.md`) generates $5–30/month to offset ongoing hosting costs.
>
> If funded at a lower tier ($20,000–$50,000), we scope to a single community pilot (5 kiosks + 5 beta testers) with a detailed Year 2 plan for scaling. Our lean, containerized architecture ensures every dollar goes to direct service delivery, not overhead.

---

## Pre-Submission Checklist

- [ ] 501(c)(3) determination letter attached
- [ ] Budget spreadsheet (line-item detail) ready
- [ ] Technical architecture diagram ready (see `docs/PI_PROVISIONING_PLAN.md`)
- [ ] Letters of support from 2+ partner organizations pending
- [ ] OpenAI application portal URL confirmed (watch for Fall 2026 window announcement)
- [ ] 4 responses finalized by team review

---

## Related Proposals

- `docs/proposals/sensata-foundation.md` — $20,000 Phase 1 pilot (June 30, 2026)
- `docs/proposals/art-berg-fund.md` — $5,000 QuantumCalm prototype (2027 window)
- `docs/proposals/akamai-stem.md` — pending draft
- `docs/proposals/spectrum-digital-education.md` — pending draft
- `docs/proposals/aws-imagine-grant.md` — pending draft

---

## Notes

- OpenAI's first wave (208 grants, $40.5M) was highly competitive (~3,000 applicants for 208 awards).
- Emphasize **measurable outcomes**, **open-source commitment**, and **neurodivergent-led design**.
- Keep responses concise but specific — avoid buzzwords.
- If awarded, public acknowledgment is expected; ensure you're comfortable with OpenAI branding requirements.
