# BONDING — Market Launch Document & Media Package

**Version:** 1.0  
**Date:** 2026-06-18  
**Status:** Ready for Launch  
**Contact:** pilot@bonding.p31ca.org

---

## 1. Executive Summary

**BONDING** is a real‑world social game that turns humans into atoms, relationships into chemical bonds, and collaborative problem‑solving into chemical reactions. It is the meatspace equivalent of the C.A.R.S. digital molecular simulation — a **calm technology** designed to facilitate genuine human connection without engagement hacks, surveillance, or gamification loops.

The full stack is live: a cryptographically secured server, a mobile‑ready web app, an interactive demo, and an onboarding site. The system is ready for hyperlocal pilots in communities that want to strengthen social fabric.

**North Star:** _"Same bowl, same room — your people first."_

---

## 2. Product Overview

**What it is:**

- A location‑based mobile game (PWA + Capacitor) where users check in at physical zones (Calm, Lab, Kitchen, Deep, Wild), ping nearby atoms, form bonds, and log reactions (problem_solved, resource_shared, etc.).
- **Privacy by design:** no raw GPS is ever stored; location proofs are geohash‑only and signed with ECDSA keys; witness consensus replaces centralised trust.
- **No engagement loops:** no streaks, no leaderboards, no variable‑ratio rewards. Success is measured by off‑platform outcomes — real friendships formed, real problems solved.

**Key Features:**

- 🔐 **Cryptographic Identity** — WebCrypto ECDSA P‑256 keys (no email, no password)
- 📍 **Location Proofs** — geohash + raw GPS signed by private key, verified server‑side
- 🤝 **Witness Consensus** — atoms can witness each other's check‑ins, building a web of trust
- 🗺️ **5 Zones** — Calm, Lab, Kitchen, Deep, Wild — each with distinct social context
- ⚡ **Reactions** — log problem_solved, resource_shared, etc. to earn valence dividends
- 🌿 **Health Integration** — PHOS health data (on‑device) powers zone recommendations (opt‑in)
- 🧪 **Interactive Demo** — living molecule simulation with tutorial, available at `#/demo`

---

## 3. Key Messages

| Audience                        | Message                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Individuals**                 | "Finally, a reason to meet people who share your interests and complement your skills."                |
| **Communities**                 | "A tool to strengthen local ties, reduce loneliness, and turn passive residents into active citizens." |
| **Urban Planners / Civic Tech** | "Hyperlocal connections that lead to real‑world help, collaboration, and trust."                       |
| **Privacy‑Conscious Users**     | "We don't track you. Your location stays with you. Your identity is yours alone."                      |
| **Ethical Design Advocates**    | "No engagement loops. No variable rewards. Just connection."                                           |

**Tagline:** _"Humans are atoms. Relationships are bonds."_

---

## 4. Target Audience

**Primary:**

- Residents of Kingsland/St. Marys, GA (pilot area)
- People interested in deepening local connections
- Remote workers, creatives, makers, and community builders
- Privacy‑conscious individuals

**Secondary:**

- Urban planners, community organisers, local government
- Civic tech enthusiasts, ethical design advocates
- Academic researchers in HCI, location‑based games, and social trust

---

## 5. Press Release

**FOR IMMEDIATE RELEASE**

### BONDING Launches — A Real‑World Social Game That Turns Neighbourhoods into Living Molecules

**Kingsland, GA — June 18, 2026** — BONDING, a new real‑world social game that transforms physical spaces into interactive chemistry labs, is now live. The game lets users check in at zones, form bonds with nearby atoms, and collaborate on real‑world tasks — all while preserving privacy and avoiding engagement hacks.

Unlike traditional social apps, BONDING uses **cryptographic identity** (WebCrypto ECDSA P‑256) and **witness consensus** to build trust without surveillance. No raw GPS is stored — only geohash prefixes and signed proofs. The system is designed as "calm technology" — users open it to find their people, then put it away.

"We built BONDING to reverse digital isolation," said the team at P31 Labs. "Real connection happens in physical space, not on screens. Relationships are built through shared experiences, not notifications."

The game is currently available for hyperlocal pilots in the Kingsland/St. Marys area, with plans to expand. An interactive demo is live at [bonding‑meatspace.pages.dev/#/demo](https://bonding‑meatspace.pages.dev/#/demo).

**Features:**

- Five zones: Calm, Lab, Kitchen, Deep, Wild
- Ping‑based bonding and reactions (problem_solved, resource_shared)
- Privacy‑first: no accounts, no passwords, no surveillance
- Health‑aware zone suggestions (opt‑in)
- Open source and community‑driven

**Learn more:** [bonding‑meatspace.pages.dev](https://bonding‑meatspace.pages.dev)
**GitHub:** [github.com/trimtab-signal/bonding](https://github.com/trimtab-signal/bonding)
**Contact:** pilot@bonding.p31ca.org

---

## 6. Media Kit

### 6.1 Brand Assets

- **Logo:** 🧬 (emoji, scalable, used in app and site)
- **Colour Palette:**
  - Primary: `#8b6f5a` (warm earth)
  - Accent: `#6b9e6b` (calm green)
  - Zones: calm=`#6b9e6b`, lab=`#9b6bb0`, kitchen=`#d4a84b`, deep=`#4a7c9b`, wild=`#d46b4b`
- **Typography:** Inter (system‑ui fallback)

### 6.2 Screenshots

| Screenshot           | Path                        |
| -------------------- | --------------------------- |
| Onboarding Home      | `media/onboarding-home.png` |
| Living Molecule Demo | `media/onboarding-demo.png` |
| Mobile Home (Map)    | `media/mobile-home.png`     |
| Mobile Profile       | `media/mobile-profile.png`  |
| Ping Modal           | `media/mobile-ping.png`     |
| Reaction Modal       | `media/mobile-reaction.png` |

### 6.3 Social Media Cards

| Platform  | File                              | Size      |
| --------- | --------------------------------- | --------- |
| Twitter/X | `media/social-card-twitter.svg`   | 1200×628  |
| LinkedIn  | `media/social-card-linkedin.svg`  | 1200×627  |
| Instagram | `media/social-card-instagram.svg` | 1080×1080 |
| Facebook  | `media/social-card-facebook.svg`  | 1200×630  |
| OG Image  | `media/social-card-og.svg`        | 1200×630  |

### 6.4 Video Script

See section 8 for the 60‑second explainer video script.

---

## 7. Social Media Posts

### Announcement (Twitter/X)

```
🧬 BONDING is live!

We turn your neighborhood into a chemistry lab. Humans are atoms,
relationships are bonds, and solving problems together is the reaction.

No streaks. No points. No surveillance. Just connection.

Try the demo → bonding-meatspace.pages.dev/#/demo

#BONDING #P31Labs #Hyperlocal #CalmTech
```

### Feature Spotlight (LinkedIn)

```
🌟 BONDING: a new approach to community connection.

We built a real-world social game where presence replaces profiles,
co-presence replaces matching, and bonds form through shared time
in shared space.

Key principles:
🔐 Privacy by default — geohash-only, no surveillance
🌿 Calm technology — open, find people, put it away
🤝 Mutual opt-in — no unsolicited matching

Learn more: bonding-meatspace.pages.dev
```

### Behind the Scenes (Instagram)

```
🧪 The Living Molecule — our interactive demo.

Click to add atoms, drag to form bonds, switch zones to change
the mood. This is BONDING in motion.

Try it yourself: bonding-meatspace.pages.dev/#/demo

#BONDING #InteractiveDemo #Molecular #Connection
```

### Call for Pilot (Facebook/Community Groups)

```
📢 Calling neighbors in Kingsland/St. Marys!

We're looking for 5-10 people to pilot BONDING — a new real-world
social game. You'll get early access, help shape the product,
and strengthen local ties.

Interested? Sign up: pilot@bonding.p31ca.org

#BONDING #Pilot #Community #Kingsland
```

---

## 8. Explainer Video Script

**Length:** 60 seconds
**Tone:** Warm, calm, human

| Visual                                             | Audio                                                                                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Slow zoom into dark space with floating atoms      | "What if your neighbourhood was a living molecule?"                                                                                |
| Atoms drifting, glowing lines forming between them | "You are an atom."                                                                                                                 |
| One atom highlighted                               | "Relationships are bonds."                                                                                                         |
| Bond lines glow stronger                           | "And solving problems together is the reaction."                                                                                   |
| Atoms cluster, a spark appears                     |                                                                                                                                    |
| Transition to mobile app UI                        | "BONDING is a real-world game where presence replaces profiles. Check in at a zone. Ping nearby atoms. Form bonds. Log reactions." |
| Show zones (Calm, Lab, Kitchen, Deep, Wild)        | "Five zones, each with a different mood. Your energy guides which zone fits."                                                      |
| Show privacy badges                                | "Privacy is built in. No tracking. No surveillance. Just connection."                                                              |
| Show demo molecule again, ending with tagline      | "Same bowl, same room — your people first."                                                                                        |
| Logo + URL                                         | "Try the demo at bonding-meatspace.pages.dev"                                                                                      |

---

## 9. FAQ

**Q: What is BONDING?**
A: A real‑world social game that turns humans into atoms, relationships into bonds, and collaborative problem‑solving into reactions.

**Q: How is it different from dating apps or social networks?**
A: No profiles, no swiping, no DMs. You show up at a real place, check in, and the game handles the rest. All connections are mutual opt‑in.

**Q: Do you track my location?**
A: No. Only a geohash prefix (~5km precision) is shared. Your exact GPS never leaves your device.

**Q: Do I need an account?**
A: No. Your identity is a cryptographic key pair stored on your device. No email, no password.

**Q: What do I need to play?**
A: A smartphone with a browser (Chrome/Safari) and GPS. The app is a PWA — no app store install required.

**Q: How do I join the pilot?**
A: Email pilot@bonding.p31ca.org. We're currently running hyperlocal pilots in the Kingsland/St. Marys area.

**Q: Is it open source?**
A: Yes! Code is at github.com/trimtab-signal/bonding. Contributions welcome.

---

## 10. Launch Timeline

| Phase      | Activity                               | Timing       |
| ---------- | -------------------------------------- | ------------ |
| Pre‑launch | Internal testing, pilot recruitment    | Week -2 to 0 |
| Launch Day | Press release, social posts, demo live | Day 0        |
| Week 1     | Community outreach, pilot kick‑off     | Day 1–7      |
| Week 2     | Collect pilot feedback, iterate        | Day 8–14     |
| Week 3     | Showcase results, invite next wave     | Day 15–21    |
| Week 4+    | Expansion, public open‑source call     | Day 22+      |

---

## 11. Call to Action

- **Try the demo:** https://bonding‑meatspace.pages.dev/#/demo
- **Join the pilot:** pilot@bonding.p31ca.org
- **Star the repo:** https://github.com/trimtab-signal/bonding

---

_"Same bowl, same room — your people first."_
