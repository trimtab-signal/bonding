-- BONDING database schema
-- PostgreSQL + PostGIS

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Atoms (users) ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS atoms (
  id            TEXT PRIMARY KEY,           -- public key fingerprint
  public_key_jwk JSONB NOT NULL,            -- JWK for signature verification
  display_name  TEXT NOT NULL DEFAULT '',
  bio           TEXT NOT NULL DEFAULT '',
  skills        TEXT[] NOT NULL DEFAULT '{}',
  interests     TEXT[] NOT NULL DEFAULT '{}',
  atom_type     TEXT NOT NULL DEFAULT 'friend',
  valence       REAL NOT NULL DEFAULT 1.0,  -- 0.1 – 2.0
  current_zone  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_check_ins INTEGER NOT NULL DEFAULT 0,
  total_bonds   INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT valid_valence CHECK (valence >= 0.1 AND valence <= 2.0),
  CONSTRAINT valid_atom_type CHECK (atom_type IN ('operator', 'family', 'friend', 'ally'))
);

-- ─── Bonds (relationships) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS bonds (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  atom_a            TEXT NOT NULL REFERENCES atoms(id),
  atom_b            TEXT NOT NULL REFERENCES atoms(id),
  status            TEXT NOT NULL DEFAULT 'pending',
  bond_type         TEXT NOT NULL DEFAULT 'mutual',
  formed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_interaction_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_in_count    INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT unique_bond UNIQUE (atom_a, atom_b),
  CONSTRAINT valid_bond_status CHECK (status IN ('pending', 'active', 'decayed')),
  CONSTRAINT valid_bond_type CHECK (bond_type IN ('mutual', 'mentor', 'sibling')),
  CONSTRAINT atoms_ordered CHECK (atom_a < atom_b)
);

-- ─── Check-ins (location proofs) ────────────────────────────────

CREATE TABLE IF NOT EXISTS check_ins (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  atom_id           TEXT NOT NULL REFERENCES atoms(id),
  bond_id           TEXT REFERENCES bonds(id),
  zone_id           TEXT NOT NULL,
  geohash_prefix    TEXT NOT NULL,
  geohash_precision INTEGER NOT NULL DEFAULT 5,
  location          GEOGRAPHY(POINT, 4326), -- optional precise location
  witnessed_by      TEXT[] NOT NULL DEFAULT '{}',
  witness_count     INTEGER NOT NULL DEFAULT 0,
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_zone CHECK (zone_id IN ('calm', 'lab', 'kitchen', 'deep', 'wild'))
);

CREATE INDEX IF NOT EXISTS idx_check_ins_atom ON check_ins(atom_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_zone ON check_ins(zone_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_timestamp ON check_ins(timestamp DESC);

-- ─── Pings (invitations) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pings (
  id            TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  from_atom     TEXT NOT NULL REFERENCES atoms(id),
  to_atom       TEXT NOT NULL REFERENCES atoms(id),
  zone_id       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at  TIMESTAMPTZ,

  CONSTRAINT valid_ping_status CHECK (status IN ('pending', 'accepted', 'rejected', 'expired'))
);

-- ─── Reactions (events) ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reactions (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  type        TEXT NOT NULL,
  atoms       TEXT[] NOT NULL DEFAULT '{}',
  bond_id     TEXT REFERENCES bonds(id),
  zone_id     TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_reaction_type CHECK (type IN ('bond_formed', 'check_in', 'witnessed', 'problem_solved', 'resource_shared', 'era_advanced'))
);

CREATE INDEX IF NOT EXISTS idx_reactions_bond ON reactions(bond_id);
CREATE INDEX IF NOT EXISTS idx_reactions_timestamp ON reactions(timestamp DESC);
