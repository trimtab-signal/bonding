# Raspberry Pi 5 Provisioning Plan — K₄ Edge Nodes

**Purpose:** Three physical K₄ nodes (rpi5-01, rpi5-02, rpi5-03) that form a local Wye-Delta mesh. Each node runs Docker, participates in the K₄ topology, and can host CashPilot tier-1 services offline.

---

## Hardware Bill of Materials (×1 node)

| Item | Spec | Qty | Est. Cost |
|------|------|-----|-----------|
| Raspberry Pi 5 | 4 GB RAM (recommended) | 1 | $50–$80 |
| Raspberry Pi 5 | 8 GB RAM (if memory-intensive workloads) | 1 | $80–$100 |
| Official Pi 5 power supply | USB-C 27 W | 1 | $12 |
| MicroSD card | 64 GB A2-class (for boot) | 1 | $10 |
| NVMe SSD (optional but recommended) | M.2 2230, 128 GB+ | 1 | $15–$25 |
| Pi 5 case + cooling | Active cooler recommended | 1 | $10 |
| Ethernet cable | Cat6, 1 m | 1 | $2 |
| **Total per node (4GB config)** | | | **~$85** |
| **×3 nodes + misc** | | | **~$295** |

**Recommended retailer:** [raspberrypi.com](https://www.raspberrypi.com/products/) or [adafruit.com](https://www.adafruit.com/) (check for bundle deals).

---

## Network Topology

```
              [rpi5-01]  ←── SSH / management
             /            \
      [rpi5-02]────────[rpi5-03]
             \            /
              [your laptop / gateway]
```

- All three nodes on the same LAN (or tailnet / ZeroTier for remote access)
- Node names: `rpi5-01`, `rpi5-02`, `rpi5-03`
- SSH access only — no exposed ports to internet unless explicitly forwarded
- Each node runs Docker with its own `docker-compose.yml` (CashPilot tier1 + optional K4 relay)

---

## Step 1 — Base OS Installation

1. Download **Raspberry Pi OS Lite (64-bit)** from [raspberrypi.com](https://www.raspberrypi.com/software/).
2. Flash to MicroSD (or NVMe) using `rpi-imager`.
3. Enable SSH, set hostname, configure Wi-Fi (headless) via `rpi-imager` advanced settings **before first boot**.
4. First boot: `ssh pi@rpi5-01.local` (default password `raspberry`, change immediately).

---

## Step 2 — Node Configuration

Run on each node after first login:

```bash
# 1. Change password
passwd

# 2. Update system
sudo apt update && sudo apt full-upgrade -y
sudo reboot

# 3. Set hostname (per node)
sudo hostnamectl set-hostname rpi5-01   # change to rpi5-02 / rpi5-03

# 4. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 5. Install Docker Compose (already included in Docker install above)
docker compose version

# 6. Enable and start Docker
sudo systemctl enable --now docker

# 7. (Optional) Install UFW firewall — deny all except SSH
sudo apt install ufw -y
sudo ufw allow 22/tcp
sudo ufw deny 80/tcp
sudo ufw deny 443/tcp
sudo ufw enable

# 8. (Optional) Install fail2ban
sudo apt install fail2ban -y
```

---

## Step 3 — SSH Key Injection

From your primary workstation:

```bash
# Copy your public key to each node
ssh-copy-id pi@rpi5-01.local
ssh-copy-id pi@rpi5-02.local
ssh-copy-id pi@rpi5-03.local

# Verify passwordless login
ssh pi@rpi5-01.local "hostname && uptime"
```

**If you use ed25519 keys and the default `~/.ssh/id_ed25519.pub`, the playbook below automates this step.**

---

## Step 4 — CashPilot Tier-1 Deployment

Each node pulls the same base `cashpilot-compose.yml` (already in this repo or at `cashpilot/` if you have that workspace):

```bash
# On each node
mkdir -p ~/cashpilot && cd ~/cashpilot
# Copy or git-clone your cashpilot repo here
docker compose pull
docker compose up -d
```

---

## Step 5 — K₄ Topology Registration

Add each node to your K₄ ledger (or whatever tracking mechanism you use for the mesh):

```bash
# Register node (example endpoint — replace with your actual API)
curl -X POST https://k4.p31ca.org/nodes/register \
  -H "Content-Type: application/json" \
  -d '{
    "id": "rpi5-01",
    "hostname": "rpi5-01.local",
    "ip": "192.168.1.101",
    "role": "base-alpha",
    "sshKey": "'"$(cat ~/.ssh/id_ed25519.pub)"'"
  }'
```

Repeat for rpi5-02 and rpi5-03 with adjusted IPs and roles.

---

## Step 6 — Verification

```bash
# From any node, verify Docker
docker info

# Verify compose stack is running
docker compose ps

# Verify node can reach others (ping / mDNS)
ping -c 3 rpi5-02.local
ping -c 3 rpi5-03.local

# Verify K4 registration accepted
curl -s https://k4.p31ca.org/nodes | jq '.[] | select(.id | startswith("rpi5"))'
```

---

## Maintenance Notes

- **Updates:** `sudo apt update && sudo apt full-upgrade -y` monthly; reboot if kernel changes.
- **Backups:** Periodically `dd` the MicroSD/NVMe or use `raspiBackup`.
- **Monitoring:** Optional Netdata install (`bash <(curl -Ss https://my-netdata.io/kickstart.sh)`) for per-node dashboards.
- **Physical security:** Nodes are not internet-exposed by default; keep behind your LAN firewall.

---

## Open Questions

| Item | Decision needed |
|------|----------------|
| Static IPs or DHCP reservations? | Prefer DHCP reservations on router |
| Tailscale / ZeroTier for remote access? | Recommended — keeps SSH off public internet |
| Domain for per-node APIs? | e.g., `rpi5-01.p31ca.org` via CF Tunnel |
| Auto-update policy? | Manual on pilot; consider unattended-upgrades later |
| Pre-provisioning testing? | Use [ptrsr/pi-ci](https://github.com/ptrsr/pi-ci) Docker image for reproducible Pi 5 VM testing before flashing |

---

## Next Steps After Hardware Arrival

1. Unbox and inventory (match against BOM).
2. Flash SD cards in parallel (use one master image, `dd` to others).
3. Run the playbook above (or a converted Ansible playbook) against all three.
4. Verify mesh: each node can reach the other two.
5. Register nodes in K₄ ledger.
6. Run CashPilot tier1 stack and confirm health endpoints.
