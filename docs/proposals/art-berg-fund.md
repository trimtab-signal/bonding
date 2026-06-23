# Proposal Template — Art Berg Fund Grant

**Funder:** Art Berg Fund  
**Amount:** $5,000  
**Deadline:** Rolling / annual — apply ASAP  
**Restrictions:** 501(c)(3) organizations; technology projects enhancing communication  
**Template version:** 2026-06-23

---

## 1. Executive Summary (150 words)

> P31 Labs, Inc. requests $5,000 to develop **QuantumCalm**, an open-source assistive communication interface designed for neurodivergent individuals. The project merges K₄ tetrahedral geometry with real-time biofeedback (heart-rate variability, galvanic skin response) to create a non-verbal, geometry-driven expression system. The core deliverable is a self-hosted web application deployable on Raspberry Pi edge nodes, enabling low-cost, privacy-preserving communication for autistic and ADHD users who struggle with traditional AAC (augmentative and alternative communication) devices.

---

## 2. Mission Alignment

| Art Berg Fund Priority             | P31 Labs Match                                                |
| ---------------------------------- | ------------------------------------------------------------- |
| Technology enhancing communication | QuantumCalm: biofeedback → K₄ tetrahedron → expressive output |
| 501(c)(3) public benefit           | P31 Labs, Inc. is a Georgia nonprofit                         |
| Accessible / inclusive design      | Open-source, self-hosted, no SaaS dependency                  |

---

## 3. Problem Statement

- **1 in 36** children in the U.S. are diagnosed with autism (CDC, 2023).
- Traditional AAC devices cost **$200–$8,000+** and lock users into proprietary ecosystems.
- Many neurodivergent individuals experience **aphasia, selective mutism, or sensory overload** that makes speech interfaces unusable.
- Existing open-source AAC tools (e.g., OpenBoard, Jabberwocky) lack **embodied, sensory-driven expression** — they are static grids of icons.

---

## 4. Proposed Solution

**QuantumCalm** is a three-layer architecture:

1. **Input Layer:** Browser-based biofeedback via Web Bluetooth (compatible with consumer HRV/GSR sensors like the Polar H10 or Empatica E4).
2. **Processing Layer:** Real-time signal processing maps physiological state to K₄ tetrahedron vertex transitions (belief → somatic action → structural logic → physical health).
3. **Output Layer:** Visual (tetrahedron color/rotation), haptic (vibration patterns via Web Vibration API), and textual (calm, plain-language expressions generated from state).

**Why tetrahedral geometry?** The K₄ complete graph is isostatic — every vertex has exactly three edges. This mirrors the neurodivergent need for **predictable, bounded choice spaces** (3 options, not 30). The user never faces a blank page; they always have four anchor states.

---

## 5. Technical Approach

| Component           | Technology                 | Rationale                                                     |
| ------------------- | -------------------------- | ------------------------------------------------------------- |
| Frontend            | React + TypeScript         | Already used in CashPilot stack; accessible component library |
| Geometry            | Custom SVG + CSS 3D        | No Three.js dependency; runs on Pi 5 / mobile                 |
| Biofeedback         | Web Bluetooth API          | No native app required; works in Chromium on Raspberry Pi OS  |
| Edge deployment     | Docker + Cloudflare Tunnel | Self-hosted; no cloud SaaS dependency                         |
| Open-source license | AGPL-3.0                   | Ensures forks remain open                                     |

**Hardware target:** Raspberry Pi 5 (4GB) + 7" touchscreen + Bluetooth HRV sensor = ~$150 total hardware cost per unit (vs. $2,000+ for commercial AAC).

---

## 6. Project Timeline (6 months)

| Month | Milestone                                                    |
| ----- | ------------------------------------------------------------ |
| 1     | Requirements validation with 3–5 neurodivergent beta testers |
| 2     | MVP: tetrahedron visualization + 2 biofeedback inputs        |
| 3     | Docker image + Pi 5 deployment script                        |
| 4     | Usability testing with beta testers (remote + in-person)     |
| 5     | Documentation + caregiver training guide                     |
| 6     | Public release (GitHub + CFD training program)               |

---

## 7. Budget ($5,000)

| Item                                                    | Amount     |
| ------------------------------------------------------- | ---------- |
| Raspberry Pi 5 hardware (3 units for beta)              | $450       |
| HRV/GSR sensors (3 units)                               | $600       |
| 7" touchscreens (3 units)                               | $300       |
| Stipend for neurodivergent consultant (20 hrs @ $50/hr) | $1,000     |
| Open-source dev tooling / hosting (6 months)            | $500       |
| Documentation + caregiver training materials            | $500       |
| Contingency (15%)                                       | $825       |
| **Total**                                               | **$4,175** |
| **Administrative overhead (20%)**                       | **$835**   |
| **Grand Total**                                         | **$5,010** |

_Note: Overhead can be reduced if the funder caps it at 10% ($417 → total $4,592)._

---

## 8. Evaluation & Outcomes

| Metric                                                             | Target                        |
| ------------------------------------------------------------------ | ----------------------------- |
| Beta testers completing 3+ sessions                                | 5+                            |
| Reduction in self-reported communication anxiety (pre/post survey) | 20%+                          |
| GitHub stars / community engagement                                | 50+ within 3 months of launch |
| Units deployed in pilot locations                                  | 3 (Kingsland, GA area)        |
| Caregiver satisfaction (Net Promoter Score)                        | 40+                           |

---

## 9. Sustainability Plan

- **Open-source model:** Attracts community contributors; no licensing fees for end users.
- **Hardware-as-a-donation:** Seek hardware donations from corporate CSR programs (e.g., Raspberry Pi Foundation education grants).
- **Training contracts:** Offer paid caregiver training to schools and therapy centers after pilot.
- **Future grant pipeline:** AWS Imagine Grant + Spectrum Digital Education for scaling to 20+ units.

---

## 10. Organizational Capacity

| Factor                | Evidence                                                             |
| --------------------- | -------------------------------------------------------------------- |
| Technical execution   | 4 live Cloudflare Pages projects; 95/95 tests; K₄ mesh architecture  |
| Community trust       | Active pilot programs in Georgia; AGENTS.md guardrail for ethical AI |
| Financial stewardship | Root package `p31-meatspace-bonding`; transparent git history        |
| Accessibility focus   | Neurodivergent-led design (founder is autistic/ADHD)                 |

---

## 11. Conclusion

The Art Berg Fund’s focus on **technology that enhances communication** maps directly onto QuantumCalm’s mission: giving neurodivergent individuals a **geometry-driven, low-cost, private** alternative to proprietary AAC devices. A $5,000 investment yields an open-source prototype deployable on $150 hardware — a **13× cost advantage** over commercial solutions.

We are requesting $5,000 to build, test, and release QuantumCalm as a public good.

---

## Appendices

- **Appendix A:** Technical architecture diagram (see `docs/PI_PROVISIONING_PLAN.md` for hardware reference)
- **Appendix B:** 501(c)(3) determination letter (pending — attach when received)
- **Appendix C:** Board of directors list (see `docs/GEORGIA_ANNUAL_REGISTRATION_TEMPLATE.md`)
- **Appendix D:** Letters of support from pilot participants (pending)
