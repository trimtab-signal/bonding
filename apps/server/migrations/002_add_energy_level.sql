-- Add energy_level column for PHOS health data integration
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS energy_level REAL;
