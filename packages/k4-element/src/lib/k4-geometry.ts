export interface TetrahedronVertex {
  label: string;
  x: number;
  y: number;
  color: string;
  status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE';
}

export interface K4Edge {
  from: number;
  to: number;
  label: string;
  valid: boolean;
  checked: boolean;
}

export type K4ValidationState = 'idle' | 'walking' | 'valid' | 'invalid';

export function buildDefaultEdges(): K4Edge[] {
  const labels: Record<string, string> = {
    '0-1': 'AB',
    '0-2': 'AC',
    '0-3': 'AD',
    '1-2': 'BC',
    '1-3': 'BD',
    '2-3': 'CD',
  };
  return [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
  ].map((e) => ({
    from: e.from,
    to: e.to,
    label: labels[`${e.from}-${e.to}`]!,
    valid: true,
    checked: false,
  }));
}

export function texCoordinates(
  i: number,
  j: number,
  n: number,
): { u: number; v: number; w: number } {
  const u = i / n;
  const v = j / n;
  const w = 1 - u - v;
  return { u, v, w: Math.max(0, w) };
}

export interface K4ValidationResult {
  valid: boolean;
  validEdges: number;
  totalEdges: number;
  invalidEdges: string[];
}

export function validateK4(edges: K4Edge[]): K4ValidationResult {
  const invalid = edges.filter((e) => !e.valid);
  return {
    valid: invalid.length === 0,
    validEdges: edges.length - invalid.length,
    totalEdges: edges.length,
    invalidEdges: invalid.map((e) => e.label),
  };
}
