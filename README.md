# 🧬 BONDING — Human/Meatspace Social Game

[![Live Demo](https://img.shields.io/badge/demo-live-b89d88?style=flat-square)](https://bonding-meatspace.pages.dev/#/demo)
[![Server Status](https://img.shields.io/badge/server-live-6b9e6b?style=flat-square)](https://bonding-server.onrender.com/health)
[![GitHub](https://img.shields.io/badge/github-open-8b6f5a?style=flat-square)](https://github.com/trimtab-signal/bonding)
[![License](https://img.shields.io/badge/license-MIT-2c241e?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-9b6bb0?style=flat-square)](https://github.com/trimtab-signal/bonding/issues)

**Version:** 0.1.0 (MVP)
**Date:** 2026-06-18
**North Star:** *"Same bowl, same room — your people first."*

---

## 1. Overview

**BONDING** is a real‑world social game that turns humans into atoms, relationships into chemical bonds, and collaborative problem‑solving into reactions. It is the meatspace equivalent of the existing C.A.R.S. digital molecular simulation, designed as **calm technology** — a tool you open to find your people, then put away.

This repository contains a complete, working TypeScript monorepo with:
- A **Capacitor‑ready mobile web app** (React + MapLibre)
- A **Node.js + Socket.io + PostgreSQL/PostGIS backend**
- **Shared types** for cryptographic identity, location proofs, and game state
- **No engagement hacks**: no leaderboards, no variable‑ratio rewards, no continuous GPS surveillance

All code is open‑source, zero‑budget, and designed for a solo operator with low‑spoons development constraints.

---

## 2. Architecture Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Interactive UI |
| **State** | Zustand | Simple, boilerplate‑free store |
| **Mobile wrapper** | Capacitor (Ionic) | PWA + native plugins (camera, GPS) |
| **Maps** | MapLibre GL JS | Free vector maps |
| **Backend** | Node.js + Express + Socket.io | REST API + real‑time game events |
| **Database** | PostgreSQL + PostGIS | Geospatial queries, relational storage |
| **Identity** | WebCrypto (ECDSA) | Client‑generated key pairs, no password storage |
| **Location proof** | Geohash prefix + witness signatures | Privacy‑preserving presence proof |

---

## 3. Monorepo Structure

```
bonding/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── docker-compose.yml          # PostgreSQL + PostGIS
├── .env.example
├── packages/
│   └── shared-types/
│       ├── src/index.ts        # Zones, geohash, KeyPair, Bond, Reaction, Client/Server messages
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── server/
│   │   ├── migrations/init.sql # Full schema: atoms, bonds, check_ins, pings, reactions
│   │   ├── src/
│   │   │   ├── index.ts        # Express + Socket.io entry point
│   │   │   ├── db/
│   │   │   │   ├── pool.ts     # Connection & migration runner
│   │   │   │   ├── migrate.ts
│   │   │   │   └── seed.ts     # Test data seed
│   │   │   ├── routes/
│   │   │   │   └── auth.ts     # /register, /atoms, /zones
│   │   │   └── services/
│   │   │       ├── game-loop.ts      # createPing, acceptPing, recordCheckIn, getNearbyAtoms
│   │   │       ├── game-handler.ts   # Socket.io message dispatcher
│   │   │       ├── valence.ts        # Reputation math (boost, decay, penalty)
│   │   │       └── witness.ts        # Hash statement, record witness, consensus check
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── mobile/
│       ├── index.html
│       ├── vite.config.ts
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx               # Tab navigation (Map / Profile)
│       │   ├── store/
│       │   │   └── game-store.ts     # Zustand state for connected user, bonds, pings, zones
│       │   ├── hooks/
│       │   │   ├── crypto.ts         # WebCrypto key generation, signing, fingerprint
│       │   │   └── useWebSocket.ts   # Socket.io connection & message handling
│       │   ├── components/
│       │   │   ├── ZoneMap.tsx       # MapLibre map with zone circles & labels
│       │   │   └── PingModal.tsx     # Accept/reject incoming ping dialog
│       │   └── pages/
│       │       ├── Home.tsx          # Main map, check‑in button, activity log toggle
│       │       └── Profile.tsx       # User stats, bonds list
│       ├── package.json
│       └── tsconfig.json
└── README.md
```

---

## 4. Build & Run

### Prerequisites
- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** (for PostgreSQL + PostGIS)

### Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start database
docker compose up -d

# 3. Build shared types & run migrations
pnpm --filter @bonding/shared-types build
pnpm --filter @bonding/server db:migrate
pnpm --filter @bonding/server db:seed

# 4. Start server (terminal 1)
pnpm dev:server

# 5. Start mobile app (terminal 2)
pnpm dev:mobile
```

- Server: `http://localhost:3001` (health: `curl localhost:3001/health`)
- Mobile app: `http://localhost:5173`

---

## 5. Core Game Loop

1. **Identity** — WebCrypto generates an ECDSA P‑256 key pair on first launch. The public key fingerprint is your atom ID.
2. **Zone** — Select a zone (Calm, Lab, Kitchen, Deep, Wild) on the map.
3. **Check In** — Press the button. A location proof (geohash prefix + witness sigs) is recorded.
4. **Ping** — Send a ping to another atom in your zone.
5. **Accept** — If they accept, a bond is formed and a reaction is logged.
6. **Valence** — Hidden reputation scalar (0.1–2.0) adjusts based on interactions.

---

## 6. Design Principles

- **Calm technology** — open to find people, then put away
- **Off-platform outcomes** — success means real friendships, not retention
- **Complementary matching** — different skills, shared interests
- **Privacy first** — no raw GPS on server, ephemeral keys, opt‑in only
- **No engagement loops** — no streaks, leaderboards, or variable‑ratio rewards

---

## 7. P31 Ecosystem Integration

BONDING is part of the larger P31 Labs ecosystem:

| Project | Role | Link |
|---------|------|------|
| **PHOS** | Cognitive convergence dashboard — spoon-aware UI, surface routing, quantum bridge | [phos.p31ca.org](https://phos.p31ca.org) |
| **8-Ball** | Decision engine — spoon-weighted action recommender for AuDHD operators | [`/home/p31/andromeda/scripts/quantum-8ball.py`](https://github.com/trimtab-signal/bonding) |
| **PMM Grader** | P31 Maturity Model — multi-dimension artifact scoring (CODE, TEST, DOCS, OPS, SEC) | [`grade-repo.py`](../../andromeda/scripts/grade-repo.py) |
| **IntentEngine** | PHOS surface router — "bonding" keyword routes to BONDING surface | [`IntentEngine.ts`](../../andromeda/phos/src/lib/IntentEngine.ts) |

### Cross-Project Links

- **PHOS** routes "bonding" / "family" / "connect" intents to the BONDING surface
- **BONDING onboarding** links to PHOS in navigation
- **8-Ball** reads grading-index.json from the PMM Grader for ecosystem fidelity scoring
- **PMM Grader** evaluates every P31 artifact including BONDING on 5 dimensions
