# Session record — interactive literature map

Working file so another session can pick this up cold. Update after each step.

## Target
GitHub Pages: https://ali-hamedi.github.io/model-optimization
Repo: ~/githubPage/model-optimization (remote `origin`, branch `main`)
Vault source of truth: `~/Obsidian Vault/AI resarch/` + `Foundations/`

## Decisions taken
- **Dropped the 3D stack** (three, r3f, drei, postprocessing, three-stdlib, d3-force-3d).
  10 nodes; 3D cost label legibility and bought nothing. Replaced with a 2D SVG
  map on a fixed 1200x620 coordinate stage + HTML nodes positioned by percentage.
- **Deterministic layout** (`src/lib/layout.ts`): seeded relaxation, anchor pull to
  lens attractors, box-aware (per-axis) separation, reserved corners for the lens
  titles. Runs once at module load; nothing animates physically at render time.
- **One memorable idea:** selecting a paper traces its *argumentative ancestry*
  (`src/lib/ancestry.ts`) — ancestors ↑, descendants ↓, edges drawn in argument order.
- **Content-driven:** every note stays plain Obsidian markdown under `content/`,
  pulled in with `import.meta.glob`. Adding a paper = one entry in
  `src/data/papers.ts` + a markdown file. No component edits.
- **Routing:** BrowserRouter + `dist/404.html` (copied from index.html in `npm run build`)
  so deep links like `/model-optimization/papers/lth` survive a refresh on Pages.
- **Design:** warm paper light theme + charcoal dark theme, Source Serif 4 + IBM Plex
  Mono, colour used only to mean a lens. Attack markers are the one judgement colour.

## Repo shape
```
content/papers/*.md      one per paper (verbatim vault notes)
content/research/*.md    trench, synthesis, history, notation, queue
content/foundations/*.md terminology, weight decay, p-norms
public/notes/*.png       vault attachments (referenced by ![[...]])
src/data/                types, lenses, papers, relations
src/lib/                 layout, ancestry, geometry, markdown, markers, content
src/components/          Chrome, Prose, MarkerIndex, map/*
src/routes/              MapView, PaperView, NoteView, Trench, Synthesis, History, NotFound
src/styles/              base.css, map.css, note.css
```

## Status
- [x] Phase 1 inspect
- [x] Phase 2 data model, map, lens filter, relation types, hover card, selection
- [x] Phase 3 markdown pipeline (LaTeX, wiki-links, images, D/Q/A/C/H/O/PRE/POST), paper view
- [x] Phase 4 trench / synthesis / history views
- [x] Phase 5 polish (layout fit, lens corners, docked selection card, mobile,
      accessibility, obsidian tab/list normalisation)
- [x] Phase 6 deployed and verified live at
      https://ali-hamedi.github.io/model-optimization (deep link /papers/lth
      returns the app via 404.html; assets and note images 200)

## Verified in production
- `/` renders the map, `/papers/lth` deep-links and survives a refresh
  (GitHub serves 404.html with a 404 *status* — that is expected and correct).
- Google fonts, hashed JS/CSS and `public/notes/*.png` all load under
  `/model-optimization/`.

## Notes / gotchas
- `.gitignore` used to contain `*.md` (swallows every note) and an unanchored
  `lib/` (swallows `src/lib/`). Both fixed; the Python patterns are now anchored
  to the repo root. Check `git check-ignore -v <path>` if a file ever vanishes.
- The vault is edited live; re-run `npm run sync` before committing note changes.
- Two notes have unbalanced `$`/`$$` in the vault (authoring typos). The renderer now
  refuses to treat a `$$…$$` span containing a blank line or heading as math, so a
  stray delimiter can no longer swallow the page. Lines to fix in the vault:
  `Measuring Intrinsic Dimension.md:160` (`with random $θ_0`) and one stray `$` inside a
  display block in `Understanding DL requires rethinking Generalization.md`.
- Missing reading notes: Toy Models of Superposition, Rewinding vs Fine-tuning.
  Stubs live at `content/papers/superposition.md` and `rewinding-vs-finetuning.md`,
  flagged `provisional: true` in `src/data/papers.ts`. Replace the file when written.
- Verify visuals with: `npm run build && npx vite preview --port 4173` then
  `chromium --headless --screenshot=x.png "http://localhost:4173/model-optimization/"`.
