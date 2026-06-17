import { migrate } from './pool.js';

migrate()
  .then(() => { console.log('Migration done'); process.exit(0); })
  .catch(e => { console.error('Migration failed:', e); process.exit(1); });
