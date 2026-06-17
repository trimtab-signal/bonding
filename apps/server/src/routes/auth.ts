import { Router, type Request, type Response } from 'express';

const router: ReturnType<typeof Router> = Router();

// Register or update atom profile
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { id, publicKeyJwk, displayName, bio, skills, interests } = req.body;
    const { query } = await import('../db/pool.js');
    const result = await query(
      `INSERT INTO atoms (id, public_key_jwk, display_name, bio, skills, interests)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         display_name = COALESCE($3, atoms.display_name),
         bio = COALESCE($4, atoms.bio),
         skills = CASE WHEN $5 IS NOT NULL THEN $5 ELSE atoms.skills END,
         interests = CASE WHEN $6 IS NOT NULL THEN $6 ELSE atoms.interests END,
         last_seen = NOW()
       RETURNING id, display_name, bio, skills, interests, atom_type, current_zone, created_at`,
      [id, JSON.stringify(publicKeyJwk), displayName, bio, skills, interests]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get atom profile
router.get('/atoms/:id', async (req: Request, res: Response) => {
  try {
    const { query } = await import('../db/pool.js');
    const result = await query(
      `SELECT id, display_name, bio, skills, interests, atom_type, current_zone, last_seen, total_bonds
       FROM atoms WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Query failed' });
  }
});

// List atoms (public directory)
router.get('/atoms', async (_req: Request, res: Response) => {
  try {
    const { query } = await import('../db/pool.js');
    const result = await query(
      `SELECT id, display_name, bio, skills, interests, atom_type, current_zone, last_seen, total_bonds
       FROM atoms ORDER BY last_seen DESC`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Query failed' });
  }
});

export default router;
