# PHOS Health Integration

This document describes how PHOS (Personal Health Operating System) data flows through the bonding app to enable health-aware zone suggestions.

## Overview

PHOS generates daily health summaries in `~/.p31/health-summary.json`. The bonding mobile app reads this data (on‑device only) and computes an **energy level** (0.0–1.0). This energy level is used for:

1. **Zone suggestions** — recommending zones matching the user's current capacity.
2. **Valence adjustment** — higher energy yields a small valence boost on check‑in; lower energy may reduce it slightly.

No raw health data ever leaves the device. Only the scalar `energyLevel` is sent to the server (and only if the user has explicitly opted in).

## Data Flow

```
~/.p31/health-summary.json  ──read──→  useHealth() hook  ──→  game store
                                      (computes energyLevel)      │
                                                                   │
                                                    ┌──────────────┘
                                                    ▼
                                          useWebSocket checkIn()
                                          sends { energyLevel } if opted in
                                                    │
                                                    ▼
                                          Server game-handler.ts
                                          - stores in check_ins.energy_level
                                          - adjusts valence via adjustValence(delta)
```

## Energy Level Calculation

```
energyLevel = sleepScore * 0.3 + calcium * 0.3 + spoons * 0.4
```

All components are 0.0–1.0. Missing values default to 0.7.

## Zone Suggestions

| Energy Level | Suggested Zone |
|-------------|----------------|
| < 30%       | Calm 🌿       |
| 30–60%      | Kitchen 🍳     |
| 60–80%      | Lab 🔬         |
| ≥ 80%       | Wild 🌀        |

## Opt‑In

The user must enable health awareness in the UI (stored in `localStorage` key `bonding_health_opt_in`). While opted out, the health banner shows a prompt to opt in, and no energy data is sent to the server.

## Schema

The `check_ins` table has an optional `energy_level REAL` column (added by migration `002_add_energy_level.sql`).

## Files

| File | Purpose |
|------|---------|
| `mobile/src/hooks/useHealth.ts` | Reads PHOS file, computes energy level |
| `mobile/src/components/HealthBanner.tsx` | Shows zone suggestion based on energy |
| `mobile/src/store/game-store.ts` | Stores `energyLevel` and `healthOptIn` |
| `mobile/src/hooks/useWebSocket.ts` | Sends `energyLevel` on check‑in (if opted in) |
| `mobile/src/pages/Home.tsx` | Renders `HealthBanner` |
| `server/src/services/game-handler.ts` | Handles incoming energy level |
| `server/src/services/game-loop.ts` | Stores `energy_level` in DB |
| `server/migrations/002_add_energy_level.sql` | Adds column |
| `shared-types/src/index.ts` | Type for optional `energyLevel` on `check_in` message |
