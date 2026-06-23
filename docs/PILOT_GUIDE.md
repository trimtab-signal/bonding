# PILOT_GUIDE.md — Running a Hyperlocal Pilot

## Overview

A successful pilot requires **density** (critical mass in one area) and **intentionality** (clear goals). This guide walks you through a 4‑week pilot with 5–10 participants in a single neighborhood.

---

## Phase 0: Preparation (Week -1)

### 1. Choose Your Zone

Pick a neighborhood or campus with:

- Good walkability.
- At least 5 distinct locations that map to our zones (Calm, Lab, Kitchen, Deep, Wild).
- A community of people who are open to connection.

### 2. Set Real Coordinates

Edit `packages/shared-types/src/index.ts` and replace the default `lat: 0, lng: 0` with actual coordinates for each zone.

### 3. Recruit Participants

- Invite 5–10 people you trust.
- Aim for diversity: different skills, interests, backgrounds.
- Explain the north star: _"We're not testing retention; we're testing whether people actually meet."_

### 4. Install & Configure

- Deploy the server (e.g., to Render) and frontend (e.g., to Vercel) for easy access.
- Distribute the app URL to participants.

---

## Phase 1: Launch (Week 1)

### Day 1: Orientation

- Join a video call or meet in person.
- Walk through the app: profile setup, zones, check‑in, pings.
- Emphasize privacy: no one will track your location; only geohash prefixes are used.

### Day 2–7: Play

- Participants check in to zones, send pings, and form bonds.
- Encourage **one real‑world meeting** per participant by the end of the week.
- Log reactions (even small ones: "had coffee," "took a walk").

---

## Phase 2: Measure (Week 2)

### Key Metrics (Off‑Platform)

| Metric          | How to Measure                          |
| --------------- | --------------------------------------- |
| Bonds formed    | Count active bonds in the database.     |
| Real meetings   | Self‑report via reactions or check‑ins. |
| Problems solved | Reaction type `problem_solved`.         |
| Satisfaction    | Post‑pilot survey (optional).           |

### Qualitative Feedback

- Conduct short check‑ins with participants.
- Ask: "What worked? What felt awkward? What would make you want to do this again?"

---

## Phase 3: Iterate (Week 3–4)

- Based on feedback, adjust zone locations, UI, or messaging.
- Run a second week of play with any improvements.
- If successful, expand to the next neighborhood.

---

## Phase 4: Showcase

- Share results with participants.
- Write a brief case study for the blog.
- Use testimonials to invite the next wave.

---

## Success Criteria

- [ ] At least 5 bonds formed.
- [ ] At least 3 real‑world tasks completed.
- [ ] Participants express interest in continuing without the app.
- [ ] Zero privacy complaints.

---

## Risks & Mitigations

| Risk             | Mitigation                                                           |
| ---------------- | -------------------------------------------------------------------- |
| Low engagement   | Remind participants of the mission; organise a group check‑in event. |
| Flaking          | Valence penalty will discourage it; start with high‑trust group.     |
| Technical issues | Have a debug channel (e.g., Discord) for quick support.              |
| Privacy concerns | Re‑emphasise the geohash + witness model; no exact location stored.  |
