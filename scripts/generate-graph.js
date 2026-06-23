#!/usr/bin/env node
import madge from 'madge';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const entryPoints = [
  'apps/onboarding/src/main.tsx',
  'apps/delta-ignition/src/main.tsx',
  'apps/trim-sequence/src/main.tsx',
  'apps/fleet-status/src/main.tsx',
  'apps/onboarding-module/src/main.tsx',
  'apps/server/src/index.ts',
  'packages/k4-ui/src/index.ts',
  'packages/k4-element/src/index.ts',
  'packages/shared-types/src/index.ts',
].map((f) => path.join(root, f));

const res = await madge(entryPoints, {
  baseDir: root,
  extensions: ['ts', 'tsx', 'js', 'jsx'],
  excludeRegExp: ['node_modules', 'dist', 'coverage', '.test.ts', '.stories.tsx'],
});

const graph = res.obj();
const nodes = [];
const edges = [];
const seen = new Set();

for (const [from, toList] of Object.entries(graph)) {
  const fromRel = path.relative(root, from);
  const fromId = fromRel.replace(/[\/\\]/g, '-');

  if (!seen.has(fromId)) {
    seen.add(fromId);
    let type = 'other';
    if (fromRel.startsWith('apps/')) type = 'app';
    else if (fromRel.startsWith('packages/')) type = 'package';
    nodes.push({ id: fromId, type, path: fromRel });
  }

  for (const to of toList) {
    const toRel = path.relative(root, to);
    const toId = toRel.replace(/[\/\\]/g, '-');
    if (!seen.has(toId)) {
      seen.add(toId);
      let type = 'other';
      if (toRel.startsWith('apps/')) type = 'app';
      else if (toRel.startsWith('packages/')) type = 'package';
      nodes.push({ id: toId, type, path: toRel });
    }
    edges.push({ from: fromId, to: toId });
  }
}

const output = { nodes, edges };
const outPath = path.join(root, 'docs', 'graph-data.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Graph written to ${outPath} (${nodes.length} nodes, ${edges.length} edges)`);
