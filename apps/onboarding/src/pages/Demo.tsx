import { useEffect, useRef, useState, useCallback } from 'react';
import { Layout } from '../components/Layout';
import styles from './Demo.module.css';

interface Atom {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  emoji: string;
  color: string;
  label: string;
  phase: number;
}

interface Bond {
  a: number;
  b: number;
  strength: number;
  phase: number;
}

const ZONES = [
  { id: 'calm', label: '🌿 Calm', bondThreshold: 90, speed: 0.4, color: '#6b9e6b' },
  { id: 'lab', label: '🔬 Lab', bondThreshold: 130, speed: 0.7, color: '#9b6bb0' },
  { id: 'kitchen', label: '🍳 Kitchen', bondThreshold: 110, speed: 0.6, color: '#d4a84b' },
  { id: 'deep', label: '🌊 Deep', bondThreshold: 70, speed: 0.3, color: '#4a7c9b' },
  { id: 'wild', label: '🌀 Wild', bondThreshold: 150, speed: 1.0, color: '#d46b4b' },
];

const EMOJIS = [
  '🧬',
  '⚛️',
  '🌟',
  '💫',
  '🔮',
  '✨',
  '🌀',
  '🌱',
  '🌿',
  '🌸',
  '🍃',
  '🌊',
  '🔥',
  '💧',
  '🌙',
  '☀️',
];
const COLORS = [
  '#6b9e6b',
  '#9b6bb0',
  '#d4a84b',
  '#4a7c9b',
  '#d46b4b',
  '#e8a87c',
  '#7c9b6b',
  '#b09b6b',
];

const TUTORIAL_STEPS = [
  {
    id: 'intro',
    title: '👋 Welcome to the Living Molecule',
    text: 'This is BONDING in action. Each floating atom represents a person — just like you! Watch how they drift, connect, and form bonds.',
    target: 'canvas',
    action: 'Just watch for a moment…',
  },
  {
    id: 'click',
    title: '✨ Click to Add',
    text: 'Tap anywhere on the dark canvas. A new atom appears! You are adding people to the molecule.',
    target: 'canvas',
    action: 'Click the canvas to add an atom →',
  },
  {
    id: 'drag',
    title: '🖐️ Drag to Bond',
    text: 'Grab an atom and pull it toward another. When they get close, a glowing bond forms.',
    target: 'canvas',
    action: 'Drag one atom toward another',
  },
  {
    id: 'zones',
    title: '🎚️ Switch the Mood',
    text: 'Try different zones. Calm is gentle, Wild is fast. The environment changes how atoms move and bond.',
    target: 'zoneBtn',
    action: 'Click a zone button below',
  },
  {
    id: 'reset',
    title: '🔄 Start Fresh',
    text: 'Reset the molecule to see how a new group behaves. Every reset is a new community.',
    target: 'resetBtn',
    action: "Click Reset when you're ready",
  },
  {
    id: 'done',
    title: "🎉 You're Ready!",
    text: "That's the whole idea. In the real game, you are the atom, and your connections become bonds. Go explore!",
    target: 'done',
    action: 'Close tutorial and play',
  },
];

export const Demo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const atomsRef = useRef<Atom[]>([]);
  const bondsRef = useRef<Bond[]>([]);
  const dragRef = useRef<{ index: number; offX: number; offY: number } | null>(null);
  const wasDragRef = useRef(false);

  const [zoneIndex, setZoneIndex] = useState(0);
  const [_stats, setStats] = useState({ atoms: 8, bonds: 0, reactions: 0 });
  const [_dragging, setDragging] = useState(false);

  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    try {
      return localStorage.getItem('bonding_demo_tutorial_done') === 'true' ? -1 : 0;
    } catch {
      return 0;
    }
  });

  const zone = (ZONES[zoneIndex] ?? ZONES[0])!;
  const totalSteps = TUTORIAL_STEPS.length;
  const step = tutorialStep >= 0 && tutorialStep < totalSteps ? TUTORIAL_STEPS[tutorialStep] : null;

  const persistDone = useCallback(() => {
    try {
      localStorage.setItem('bonding_demo_tutorial_done', 'true');
    } catch {}
    setTutorialStep(-1);
  }, []);

  const goToStep = useCallback(
    (i: number) => {
      if (i >= totalSteps) {
        persistDone();
      } else {
        setTutorialStep(i);
      }
    },
    [totalSteps, persistDone],
  );

  const initAtoms = useCallback(() => {
    const w = containerRef.current?.clientWidth || 800;
    const h = containerRef.current?.clientHeight || 600;
    const count = 8 + Math.floor(Math.random() * 4);
    const newAtoms: Atom[] = [];
    for (let i = 0; i < count; i++) {
      newAtoms.push({
        id: i,
        x: 80 + Math.random() * (w - 160),
        y: 80 + Math.random() * (h - 160),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 28 + Math.random() * 12,
        baseRadius: 28 + Math.random() * 12,
        emoji: EMOJIS[i % EMOJIS.length]!,
        color: COLORS[i % COLORS.length]!,
        label: ['You', 'Friend', 'Mate', 'Buddy', 'Peer', 'Ally', 'Sibling', 'Companion'][i % 8]!,
        phase: Math.random() * Math.PI * 2,
      });
    }
    atomsRef.current = newAtoms;
    bondsRef.current = [];
    setStats({ atoms: newAtoms.length, bonds: 0, reactions: 0 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let w = container.clientWidth;
    let h = container.clientHeight;
    let frame = 0;

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);
    initAtoms();

    const physics = () => {
      frame++;
      const { bondThreshold, speed } = zone;
      const atoms = atomsRef.current;
      const existingBonds = bondsRef.current;
      const t = frame * 0.02;

      // ─── Update atoms ────────────────────────────────────────
      const newAtoms = atoms.map((atom) => {
        let { x, y, vx, vy } = atom;
        const r = atom.baseRadius;

        vx += (Math.random() - 0.5) * 0.06 * speed;
        vy += (Math.random() - 0.5) * 0.06 * speed;
        vx *= 0.985;
        vy *= 0.985;

        const margin = r + 10;
        if (x < margin) {
          x = margin;
          vx = Math.abs(vx) * 0.6;
        }
        if (x > w - margin) {
          x = w - margin;
          vx = -Math.abs(vx) * 0.6;
        }
        if (y < margin) {
          y = margin;
          vy = Math.abs(vy) * 0.6;
        }
        if (y > h - margin) {
          y = h - margin;
          vy = -Math.abs(vy) * 0.6;
        }

        const cx = w / 2,
          cy = h / 2;
        const dxc = cx - x,
          dyc = cy - y,
          dc = Math.hypot(dxc, dyc);
        if (dc > 80) {
          vx += (dxc / dc) * 0.004 * speed;
          vy += (dyc / dc) * 0.004 * speed;
        }

        for (const other of atoms) {
          if (other.id === atom.id) continue;
          const dxo = x - other.x,
            dyo = y - other.y;
          const d2 = dxo * dxo + dyo * dyo;
          const minD = (r + other.radius) * 0.5;
          if (d2 < minD * minD && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = ((minD - d) / minD) * 0.3;
            vx += (dxo / d) * push;
            vy += (dyo / d) * push;
          }
        }

        const spd = Math.hypot(vx, vy);
        const max = 3 * speed + 0.5;
        if (spd > max) {
          vx = (vx / spd) * max;
          vy = (vy / spd) * max;
        }

        const breathe = Math.sin(t * 1.5 + atom.phase) * 0.06;
        const radius = atom.baseRadius * (1 + breathe);

        return { ...atom, x, y, vx, vy, radius };
      });

      // ─── Bond detection ──────────────────────────────────────
      const newBonds: Bond[] = [];
      for (let i = 0; i < newAtoms.length; i++) {
        for (let j = i + 1; j < newAtoms.length; j++) {
          const a = newAtoms[i]!,
            b = newAtoms[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const existing = existingBonds.find(
            (bd) => (bd.a === i && bd.b === j) || (bd.a === j && bd.b === i),
          );

          if (d < bondThreshold) {
            if (existing) {
              const s = Math.min(1, existing.strength + 0.03);
              newBonds.push({ ...existing, strength: s });
            } else if (d < bondThreshold * 0.65) {
              newBonds.push({ a: i, b: j, strength: 0.35, phase: Math.random() * Math.PI * 2 });
            }
          } else if (existing) {
            const faded = Math.max(0, existing.strength - 0.03);
            if (faded > 0.01) newBonds.push({ ...existing, strength: faded });
          }
        }
      }

      // Bond attraction
      for (const bond of newBonds) {
        if (bond.strength < 0.2) continue;
        const a = newAtoms[bond.a]!,
          b = newAtoms[bond.b]!;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 20) {
          const pull = bond.strength * 0.004 * speed;
          const dx = (a.x - b.x) / d,
            dy = (a.y - b.y) / d;
          a.vx -= dx * pull;
          a.vy -= dy * pull;
          b.vx += dx * pull;
          b.vy += dy * pull;
        }
      }

      atomsRef.current = newAtoms;
      bondsRef.current = newBonds;

      const activeBonds = newBonds.filter((b) => b.strength > 0.3).length;
      setStats((s) =>
        s.atoms !== newAtoms.length || s.bonds !== activeBonds
          ? { atoms: newAtoms.length, bonds: activeBonds, reactions: Math.floor(activeBonds / 2) }
          : s,
      );

      // ─── Draw ──────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Atmosphere
      const ag = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 1.2);
      ag.addColorStop(0, zone.color + '18');
      ag.addColorStop(0.5, zone.color + '08');
      ag.addColorStop(1, 'transparent');
      ctx.fillStyle = ag;
      ctx.fillRect(0, 0, w, h);

      // Bonds
      for (const bond of newBonds) {
        if (bond.strength < 0.02) continue;
        const a = newAtoms[bond.a]!,
          b = newAtoms[bond.b]!;

        const shimmer = Math.sin(t * 2 + bond.phase) * 0.15 + 0.85;
        const alpha = bond.strength * 0.7 * shimmer;
        const width = 1.5 + bond.strength * 5;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = width;
        ctx.shadowColor = `${zone.color}${Math.round(alpha * 80)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const mx = (a.x + b.x) / 2,
          my = (a.y + b.y) / 2;
        const gr = 3 + bond.strength * 5;
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, gr);
        mg.addColorStop(0, `rgba(255,255,255,${alpha * 0.8})`);
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, gr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Atoms
      for (const atom of newAtoms) {
        const gs = atom.radius * 2;
        const g = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, gs);
        g.addColorStop(0, atom.color + '25');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, gs, 0, Math.PI * 2);
        ctx.fill();

        if (
          newBonds.some(
            (b) =>
              (b.a === newAtoms.indexOf(atom) || b.b === newAtoms.indexOf(atom)) &&
              b.strength > 0.4,
          )
        ) {
          ctx.beginPath();
          ctx.arc(atom.x, atom.y, atom.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = atom.color + '30';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        const pulse = Math.sin(t * 2 + atom.phase) * 0.15 + 0.85;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#12111a';
        ctx.fill();
        ctx.strokeStyle = atom.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = pulse;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.font = `${atom.radius * 1.1}px system-ui,sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(atom.emoji, atom.x, atom.y + 1);

        if (atom.radius > 30) {
          ctx.font = '10px system-ui,sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.fillText(atom.label, atom.x, atom.y + atom.radius + 16);
        }
      }

      ctx.font = '11px system-ui,sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(
        `🧬 ${newAtoms.length}  🔗 ${activeBonds}  ⚡ ${Math.floor(activeBonds / 2)}  🌐 ${zone.id}`,
        14,
        14,
      );

      rafRef.current = requestAnimationFrame(physics);
    };

    rafRef.current = requestAnimationFrame(physics);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [zone, initAtoms]);

  // ─── Interaction handlers ─────────────────────────────────────

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    wasDragRef.current = false;

    const atoms = atomsRef.current;
    for (let i = atoms.length - 1; i >= 0; i--) {
      const a = atoms[i]!;
      if (Math.hypot(mx - a.x, my - a.y) < a.radius + 8) {
        dragRef.current = { index: i, offX: mx - a.x, offY: my - a.y };
        setDragging(true);
        return;
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragRef.current) {
      if (!wasDragRef.current) wasDragRef.current = true;
      const atoms = [...atomsRef.current];
      const atom = atoms[dragRef.current.index];
      if (!atom) return;
      const cw = containerRef.current?.clientWidth || 800;
      const ch = containerRef.current?.clientHeight || 600;
      atom.x = Math.max(
        atom.radius + 10,
        Math.min(cw - atom.radius - 10, mx - dragRef.current.offX),
      );
      atom.y = Math.max(
        atom.radius + 10,
        Math.min(ch - atom.radius - 10, my - dragRef.current.offY),
      );
      atom.vx = 0;
      atom.vy = 0;
      atomsRef.current = atoms;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
    if (tutorialStep === 2 && bondsRef.current.some((b) => b.strength > 0.3)) {
      goToStep(3);
    }
  }, [tutorialStep, goToStep]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (wasDragRef.current) {
        wasDragRef.current = false;
        return;
      }
      if (tutorialStep === 1) {
        goToStep(2);
        return;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const atoms = atomsRef.current;
      atomsRef.current = [
        ...atoms,
        {
          id: atoms.length,
          x,
          y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 28 + Math.random() * 12,
          baseRadius: 28 + Math.random() * 12,
          emoji: EMOJIS[atoms.length % EMOJIS.length]!,
          color: COLORS[atoms.length % COLORS.length]!,
          label: ['You', 'Friend', 'Mate', 'Buddy', 'Peer', 'Ally', 'Sibling', 'Companion'][
            atoms.length % 8
          ]!,
          phase: Math.random() * Math.PI * 2,
        },
      ];
    },
    [tutorialStep, goToStep],
  );

  return (
    <Layout showFooter={false}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <h2 className={styles.title}>🧪 The Living Molecule</h2>
            <p className={styles.desc}>
              Atoms drift, bond, and react. <strong>Click</strong> to add, <strong>drag</strong> to
              bond. Switch zones to change the vibe.
            </p>
            {tutorialStep === -1 && (
              <button
                className={styles.replayBtn}
                onClick={() => {
                  try {
                    localStorage.setItem('bonding_demo_tutorial_done', 'false');
                  } catch {}
                  setTutorialStep(0);
                }}
              >
                🔄 Show Tutorial Again
              </button>
            )}
          </div>

          <div className={styles.canvasWrap} ref={containerRef}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {step && (
              <div className={styles.tutorialOverlay}>
                <div className={styles.tooltip}>
                  <div className={styles.tooltipHeader}>
                    <span className={styles.tooltipStep}>
                      Step {tutorialStep + 1} of {totalSteps}
                    </span>
                    <button className={styles.tooltipSkip} onClick={persistDone}>
                      Skip
                    </button>
                  </div>
                  <h3 className={styles.tooltipTitle}>{step.title}</h3>
                  <p className={styles.tooltipText}>{step.text}</p>
                  {step.action && <div className={styles.tooltipAction}>{step.action}</div>}
                  {tutorialStep === totalSteps - 1 && (
                    <button className={styles.tooltipNext} onClick={persistDone}>
                      🎉 Start Playing
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={styles.controls}>
              {ZONES.map((z, i) => (
                <button
                  key={z.id}
                  className={`${styles.zoneBtn} ${i === zoneIndex ? styles.active : ''}`}
                  onClick={() => {
                    setZoneIndex(i);
                    if (tutorialStep === 3) goToStep(4);
                  }}
                  style={{ '--zone-color': z.color } as React.CSSProperties}
                >
                  {z.label}
                </button>
              ))}
              <button
                className={styles.resetBtn}
                onClick={() => {
                  initAtoms();
                  if (tutorialStep === 4) goToStep(5);
                }}
              >
                ⟳ Reset
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
