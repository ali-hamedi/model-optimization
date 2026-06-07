# The Trench · Neural Fold — Reading Constellation

A 3D "reading constellation" for the model-optimization research project. Papers are
glowing nodes laid out by a 3D force simulation; read papers glow warm gold, queued
papers sit cooler and dimmer. Click a node to open its panel-as-page.

**Live:** https://ali-hamedi.github.io/model-optimization/

## Stack

- **Vite + React + TypeScript**
- **three** / **@react-three/fiber** / **@react-three/drei** — the 3D scene
- **@react-three/postprocessing** — UnrealBloom glow
- **d3-force-3d** — the 3D force layout (run once on mount, then frozen)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/model-optimization/
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

> The Vite `base` is set to `/model-optimization/` because this is a GitHub Pages
> **project page**. Without it, hashed assets 404 in production.

## Editing content

Everything lives in `src/data/`:

- `papers.ts` — one object per paper. The `synthesis`, `surprises`, and `code`
  fields ship **empty**; fill them in and they replace the italic placeholders in
  the detail panel. `read` toggles gold vs. slate; `tier` (0–3) drives node size.
- `edges.ts` — reading relationships `[idA, idB]`. An edge is gold when both
  endpoints are read, faint gray otherwise.

## Architecture

```
src/
├── App.tsx                 # Canvas + HUD + DetailPanel; owns hover/select state
├── components/
│   ├── Scene.tsx           # lights, edges, nodes, OrbitControls, Bloom
│   ├── PaperNode.tsx       # glowing sphere + billboard label
│   ├── Edges.tsx           # force-positioned links
│   ├── HoverCard.tsx       # floating card that follows a hovered node
│   ├── DetailPanel.tsx     # slide-in "page" (Esc / × to close)
│   └── Hud.tsx             # title, legend, control hint
├── hooks/useForceLayout.ts # d3-force-3d sim → frozen id→[x,y,z] map
└── data/{papers,edges}.ts  # content
```

The detail panel is the "page" for v1 (no router). It's deliberately swappable for a
`HashRouter` later — selection is a single id in `App`.

## Deploy

`.github/workflows/deploy.yml` builds with Node 20 and publishes `dist/` to GitHub
Pages on every push to `main` (via `upload-pages-artifact` + `deploy-pages`). No
lockfile is committed, so CI uses `npm install`. Enable **Settings → Pages → Source:
GitHub Actions** once.

> Note: this repo's `.gitignore` ignores `*.md`, so this README must be force-added:
> `git add -f README.md`.
