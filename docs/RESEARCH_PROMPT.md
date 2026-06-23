# P31 Labs — Research Prompt: Frontend Crypto Shim & Edge Deps

## Context
`software/frontend` (`p31-frontend`) is a browser-targeted Vite 5.4 app that depends on `@lit-protocol/auth-browser@7.4.0`. That package’s bundled `auth-browser.js` contains a hard-coded `require('crypto')` Node built-in. Under the Andromeda pnpm workspace, the alias `crypto: 'crypto-browserify'` is correctly set in `vite.config.ts`, but the resolver still emits:

```
[commonjs--resolver] Failed to resolve entry for package "crypto".
    at @lit-protocol/auth-browser/src/lib/auth-browser.js
```

`crypto-browserify` is installed as a devDependency in `software/frontend/node_modules/`. The local shim `node_modules/crypto/package.json` was created (name=crypto, main=crypto-browserify). The issue persists across Vite alias rewrites because the failure comes from the CJS resolver inside `@lit-protocol/auth-browser`, not from source imports Vite can rewrite.

## Hypothesis
`@lit-protocol/auth-browser` ships a CJS bundle whose internal `require('crypto')` bypasses Vite’s `resolve.alias`. The bundled dep resolution path in Vite 5 / Rollup 4 uses a different resolver for CJS/Node built-ins than for ESM source. The workspace’s pnpm hoisting (`.pnpm` store + workspace root `node_modules`) adds another resolution layer that may shadow the local `node_modules/crypto` shim.

## Research Questions
1. Does adding `optimizeDeps.exclude: ['@lit-protocol/auth-browser']` in `vite.config.ts` force Vite to treat it as external and skip CJS resolution?
2. Would pre-bundling `@lit-protocol/auth-browser` with `esbuild` (via `optimizeDeps.esbuildOptions`) eliminate the `require('crypto')` path?
3. Can we patch `node_modules/@lit-protocol/auth-browser/src/lib/auth-browser.js` by replacing `require('crypto')` with an ESM dynamic `import('crypto-browserify')` without breaking the package?
4. Is there a lighter-weight Lit Protocol alternative (`@lit-protocol/lit-auth-client`, `@lit-protocol/client`) that doesn’t bundle Node built-ins?
5. Does disabling the Vite CJS resolver plugin (`vite-plugin-cjs`) help, or is it already active?
6. Can the app be restructured to load Lit Protocol features lazily (dynamic import), so the CJS bundle is only resolved in dev and never in production build?

## Constraints
- No changes to workspace root `pnpm-workspace.yaml` or root `package.json`.
- No new system-level npm packages; only `pnpm add -D` within `software/frontend/`.
- Preserve existing Vite 5.4 + TypeScript 5.9 + React 18 stack.
- Do not upgrade or downgrade `@lit-protocol/*` packages unless install succeeds cleanly.

## Desired Outcome
A production `vite build` that completes without the `[commonjs--resolver] Failed to resolve entry for package "crypto"` error, producing `dist/` ready for Cloudflare Pages deploy.

## Secondary Research: spin-mesh Build Structure
`software/spin-mesh/` has no standard entry point:
- No `index.html`
- No `vite.config.ts`
- `package.json` main is empty
- Subdirs: `combined/`, `demo/`, `logistics/`, `logistics-do/`, `matchmaking-do/`, `phos-ui/`, `sync/`
- `build` script is `"vite build && tsc"` but Vite can’t find an entry

Question: Is `spin-mesh` intended as a library + worker pair, where the Worker is built separately (e.g., `matchmaking-do/` via `wrangler publish`) and the frontend is a sub-app? Identify the correct entry file and whether the root `vite build` should reference a subdirectory.

## Output Format
Return:
1. Exact `vite.config.ts` edit that resolves the crypto issue
2. Bash commands to verify (typecheck + build)
3. If alternative: exact `package.json` dependency swap
4. For spin-mesh: exact build command per subdir, or confirmation it’s a Worker-only project
