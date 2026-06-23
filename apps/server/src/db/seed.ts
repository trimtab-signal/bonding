import { query } from './pool.js';

const MOCK_JWK = { kty: 'EC', crv: 'P-256', x: 'mock', y: 'mock' };

const SEED_ATOMS = [
  {
    id: 'op1',
    display_name: 'Operator',
    bio: 'The trim tab',
    atom_type: 'operator',
    valence: 1.5,
    skills: ['systems', 'code', 'strategy'],
    interests: ['simulation', 'ethics', 'music'],
  },
  {
    id: 'fr1',
    display_name: 'Alex',
    bio: 'Loves cooking and deep talks',
    atom_type: 'friend',
    valence: 1.0,
    skills: ['cooking', 'listening'],
    interests: ['food', 'philosophy', 'hiking'],
  },
  {
    id: 'fr2',
    display_name: 'Sam',
    bio: 'Builder and tinkerer',
    atom_type: 'friend',
    valence: 1.0,
    skills: ['woodworking', 'electronics'],
    interests: ['making', 'science', 'gardening'],
  },
  {
    id: 'fm1',
    display_name: 'Jordan',
    bio: 'Always down for adventure',
    atom_type: 'family',
    valence: 1.2,
    skills: ['navigation', 'first aid'],
    interests: ['climbing', 'photography', 'birds'],
  },
];

async function seed() {
  for (const atom of SEED_ATOMS) {
    await query(
      `INSERT INTO atoms (id, public_key_jwk, display_name, bio, atom_type, valence, skills, interests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [
        atom.id,
        MOCK_JWK,
        atom.display_name,
        atom.bio,
        atom.atom_type,
        atom.valence,
        atom.skills,
        atom.interests,
      ],
    );
    console.warn(`[seed] Atom ${atom.id}`);
  }

  // Create a bond between Operator and Alex
  await query(
    `INSERT INTO bonds (atom_a, atom_b, status, bond_type)
     VALUES ($1, $2, 'active', 'mutual')
     ON CONFLICT DO NOTHING`,
    ['fr1', 'op1'],
  );
  console.warn('[seed] Bond fr1↔op1');

  console.warn('Seed complete');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
