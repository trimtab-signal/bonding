# CashPilot Local Deployment — Node 0 Setup

**Purpose:** Turn your primary workstation into an active DePIN node (Node 0) to generate $5–30/month in passive income while you execute the funding pipeline.  
**Target:** Linux workstation (Ubuntu/Debian) with Docker + Docker Compose  
**Est. earnings:** $5–30/month depending on services enabled and network conditions  
**Time to deploy:** 15–30 minutes

---

## Pre-Flight

- [ ] Docker installed (`docker --version` ≥ 24.x)
- [ ] Docker Compose installed (`docker compose version` ≥ 2.x)
- [ ] At least 10 GB free disk space
- [ ] Ports 8080, 3000, 5000, 9090 available (or mapped to alternate ports)

---

## Step 1 — Clone & Launch

```bash
git clone https://github.com/trimtab-signal/cashpilot.git
cd cashpilot
docker compose pull
docker compose up -d
```

**If the repo is private:** SSH clone or download the archive.

---

## Step 2 — Verify Stack Health

```bash
# Check all containers are running
docker compose ps

# View real-time logs
docker compose logs -f

# Quick health check (example endpoint — adjust to your actual health route)
curl -s http://localhost:3000/health | jq .
```

**Expected:** All services `healthy` or `running`. Health endpoint returns `{"status":"ok"}` or similar.

---

## Step 3 — Configure Services

Edit `docker-compose.yml` or `.env` to enable/disable specific DePIN services based on your hardware:

| Service                | Resource Cost           | Est. Earnings | Notes                     |
| ---------------------- | ----------------------- | ------------- | ------------------------- |
| Honeygain              | Low (bandwidth)         | $2–10/mo      | Passive bandwidth sharing |
| Pawns.app              | Low (bandwidth)         | $1–5/mo       | Similar bandwidth model   |
| TraffMonetizer         | Low (bandwidth)         | $1–5/mo       | Traffic monetization      |
| Storage node           | Medium (disk)           | $2–8/mo       | If running Filecoin/Storj |
| Compute node           | High (CPU/GPU)          | $5–20/mo      | Akash, Render, etc.       |
| Full verification node | Medium (disk+bandwidth) | $2–10/mo      | Ethereum/Tenderly-style   |

**Recommendation for Node 0:** Enable bandwidth services only (Honeygain + Pawns + TraffMonetizer = ~$5–20/mo) while you run the mortgage call and grant applications. Avoid high-CPU tasks on your primary workstation during crunch time.

---

## Step 4 — Monitoring & Payouts

- **Dashboard:** Grafana (default port 3000) for real-time metrics
- **Logs:** `docker compose logs -f <service>` for troubleshooting
- **Payouts:** Varies by service — typically monthly via PayPal, crypto, or bank transfer. Check each service's dashboard.

---

## Step 5 — Scaling to Pi Cluster (Future)

When your Raspberry Pi 5 nodes arrive (per `docs/PI_PROVISIONING_PLAN.md`):

1. Flash Pi OS + Docker on each node
2. Copy `cashpilot-compose.yml` to each Pi
3. Run `docker compose up -d` on each
4. Each node becomes an independent DePIN earner
5. Register nodes in K₄ topology ledger

**Estimated Pi cluster earnings:** $15–90/month across 3 nodes (bandwidth-only model).

---

## Zero-Fiat Emergency Bridge

If you need the $400 Georgia late fee **now** and cannot wait for DePIN:

1. **Barter:** Offer n8n/Make.com automation setup to local business. Value: $500–$2,000 in trade.
2. **GitHub Sponsors:** Enable on your repos. Even $1/month from 5 patrons = $5/month recurring.
3. **Bridge loan:** Ask trusted network (person, not bank) for $440 with a written payback date.
4. **Deploy FIRST, then barter the earnings:** Run Node 0 for 1 week → ~$5–10 → add to barter pool.

---

## Troubleshooting

| Issue                             | Fix                                                                  |
| --------------------------------- | -------------------------------------------------------------------- |
| Port already in use               | Change `ports:` mapping in `docker-compose.yml`                      |
| Container exits immediately       | `docker compose logs <service>` for error details                    |
| Bandwidth services blocked by ISP | Check ISP TOS; use VPN if allowed                                    |
| Earnings not showing              | Most services have a 30-day activation window; verify account status |

---

## Next Steps

- [ ] Clone and launch CashPilot stack
- [ ] Enable 2–3 bandwidth services
- [ ] Verify health endpoint
- [ ] Check payouts after 30 days
- [ ] When Pis arrive, extend to 3-node mesh

---

## References

- `docs/PI_PROVISIONING_PLAN.md` — Hardware setup for 3-node cluster
- `docs/FUNDING_ROADMAP.md` — Grant pipeline for Year 2 expansion
- `docs/MORTGAGE_FORBEARANCE_SCRIPT.md` — Financial bridge tactics
