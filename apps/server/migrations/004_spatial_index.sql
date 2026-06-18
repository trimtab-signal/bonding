-- P1.3: Add GIST index for fast ST_DWithin spatial queries
CREATE INDEX IF NOT EXISTS idx_check_ins_location
ON check_ins USING GIST (location);
