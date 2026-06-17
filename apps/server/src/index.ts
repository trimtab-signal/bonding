import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import { registerGameHandlers } from './services/game-handler.js';
import { migrate } from './db/pool.js';
import { ZONES } from '@bonding/shared-types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0', service: 'bonding-server' });
});

// API routes
app.use('/api', authRoutes);

// Zone definitions endpoint
app.get('/api/zones', (_req, res) => {
  res.json(ZONES);
});

// Register WebSocket game handlers
registerGameHandlers(io);

const PORT = parseInt(process.env.PORT || '3001', 10);

async function start() {
  try {
    await migrate();
    console.log('[bonding] Database migrated');
  } catch (e) {
    console.warn('[bonding] Migration skipped (DB may not be ready):', (e as Error).message);
  }

  httpServer.listen(PORT, () => {
    console.log(`[bonding] Server running on port ${PORT}`);
  });
}

start();
