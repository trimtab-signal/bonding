import { Router } from 'express';
import { getCommunityState } from '../services/era.js';

const router = Router();

router.get('/community', async (_req, res) => {
  try {
    const state = await getCommunityState();
    res.json({
      era: state.era,
      total_bonds: state.total_bonds,
      total_check_ins: state.total_check_ins,
      total_reactions: state.total_reactions,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch community state' });
  }
});

export default router;
