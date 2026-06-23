import { useMemo } from 'react';
import { TetrahedronVertex, K4Edge, K4ValidationState, buildDefaultEdges } from '../lib/k4-geometry';

const VERTEX_RADIUS = 22;
const STROKE = 1.6;

const FACE_COLORS = ['rgba(79,143,255,0.12)', 'rgba(52,211,153,0.12)', 'rgba(251,191,36,0.12)', 'rgba(192,132,252,0.12)'];

function faceCenter(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
  return { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 };
}

const DEFAULT_HL: [number, number][] = [[0, 1], [2, 3]];

export interface Kerberos4ElementProps {
  vertices?: TetrahedronVertex[];
  edges?: K4Edge[];
  validationState?: K4ValidationState;
  highlightEdges?: [number, number][];
  showFaces?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function Kerberos4Element({
  vertices = [
    { label: 'A', x: 150, y: 30,  color: '#4f8fff', status: 'ACTIVE'   },
    { label: 'B', x: 30,  y: 230, color: '#34d399', status: 'ACTIVE'   },
    { label: 'C', x: 270, y: 230, color: '#fbbf24', status: 'DEGRADED' },
    { label: 'D', x: 150, y: 160, color: '#c084fc', status: 'OFFLINE'  },
  ],
  edges = buildDefaultEdges(),
  validationState = 'idle',
  highlightEdges = DEFAULT_HL,
  showFaces = true,
  showLabels = true,
  className = '',
}: Kerberos4ElementProps) {
  const edgeMidpoints = useMemo(() => {
    const pts: Record<string, { x: number; y: number }> = {};
    for (const e of edges) {
      const a = vertices[e.from]!;
      const b = vertices[e.to]!;
      pts[`${e.from}-${e.to}`] = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      pts[`${e.to}-${e.from}`] = pts[`${e.from}-${e.to}`]!;
    }
    return pts;
  }, [vertices, edges]);

  const faces = useMemo(() => {
    const TRI_FACES: [number, number, number][] = [[0, 2, 1], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
    return TRI_FACES.map((idx, fi) => {
      const [i, j, k] = idx;
      const a = vertices[i]!;
      const b = vertices[j]!;
      const c = vertices[k]!;
      const center = faceCenter(a, b, c);
      return { i, j, k, cx: center.x, cy: center.y, color: FACE_COLORS[fi]! };
    });
  }, [vertices]);

  const statusColor = (s: string) => (s === 'ACTIVE' ? '#34d399' : s === 'DEGRADED' ? '#fbbf24' : '#ff6058');

  return (
    <svg
      viewBox="0 0 300 260"
      className={className}
      style={{ width: 'min(340px, 88vw)', height: 'auto', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="k4-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showFaces &&
        faces.map((f, idx) => (
          <polygon
            key={`face-${idx}`}
            points={`${vertices[f.i]!.x},${vertices[f.i]!.y} ${vertices[f.j]!.x},${vertices[f.j]!.y} ${vertices[f.k]!.x},${vertices[f.k]!.y}`}
            fill={f.color}
            stroke="none"
          />
        ))}

      {edges.map((e) => {
        const a = vertices[e.from]!;
        const b = vertices[e.to]!;
        const mid = edgeMidpoints[`${e.from}-${e.to}`]!;
        const isHL = highlightEdges.some(([f, t]) => (f === e.from && t === e.to) || (f === e.to && t === e.from));
        const valid = e.checked ? e.valid : true;
        const color = validationState === 'valid' ? '#34d399' : valid ? '#7e9ab8' : '#ff6058';
        return (
          <g key={`e-${e.from}-${e.to}`}>
            {isHL && (
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={STROKE + 1.5} strokeDasharray="5 4" opacity="0.9" filter="url(#k4-glow)" />
            )}
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isHL ? 'none' : color}
              strokeWidth={isHL ? 0.5 : STROKE}
              opacity={isHL ? 0.5 : 1}
            />
            {showLabels && validationState !== 'idle' && (
              <text x={mid.x} y={mid.y - 5} textAnchor="middle" fill={color} fontSize="8.5" fontFamily="monospace">{e.label}</text>
            )}
          </g>
        );
      })}

      {vertices.map((v, idx) => (
        <g key={`v-${idx}`}>
          <circle
            cx={v.x} cy={v.y} r={VERTEX_RADIUS}
            fill={v.status === 'OFFLINE' ? '#1a1a2e' : v.color}
            stroke={statusColor(v.status)}
            strokeWidth={STROKE}
            filter={validationState === 'valid' ? 'url(#k4-glow)' : undefined}
          />
          {showLabels && <text x={v.x} y={v.y + 4} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="monospace" fontWeight="600">{v.label}</text>}
        </g>
      ))}
    </svg>
  );
}
