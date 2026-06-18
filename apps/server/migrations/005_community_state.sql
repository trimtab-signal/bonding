-- P2: Community state for era progression
CREATE TABLE IF NOT EXISTS community_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- singleton
  era INTEGER NOT NULL DEFAULT 0,
  total_bonds INTEGER NOT NULL DEFAULT 0,
  total_check_ins INTEGER NOT NULL DEFAULT 0,
  total_reactions INTEGER NOT NULL DEFAULT 0,
  total_problems_solved INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial row
INSERT INTO community_state (id, era) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
