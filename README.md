# Compression as a Lens on Computation

An interactive literature map for the trench question:

> **How does an overparameterized neural network discover and represent the
> efficient computation that generalizes?**

Live: <https://ali-hamedi.github.io/model-optimization>

Ten papers, four lenses — optimization geometry, structure & circuits,
representation, dynamics & emergence — and the arguments between them. Selecting
a paper traces its argumentative ancestry: what it stands on, and what it
provoked. Clicking through opens the actual Obsidian reading note.

## Adding a paper

Two steps, no component changes:

1. Add an entry to `src/data/papers.ts` (id, titles, authors, lenses, roles,
   summary, `note` slug) and any edges to `src/data/relations.ts`.
2. Drop the markdown note at `content/papers/<slug>.md`.

The layout in `src/lib/layout.ts` re-solves itself deterministically — same
input, same map, every time.

## Keeping the notes in sync

The Obsidian vault is the source of truth; `content/` holds a committed
snapshot.

```bash
npm run sync      # copy the vault into content/ and public/notes/
git diff --stat   # look at what changed
git commit -am "notes: …" && git push
```

`VAULT=/path/to/vault npm run sync` if the vault is not at `~/Obsidian Vault`.

## Obsidian syntax that is supported

`$inline$` and `$$display$$` LaTeX (KaTeX) · `[[wiki-links]]` resolved to site
routes · `![[attachments]]` served from `public/notes/` · `#tags` ·
`~ verbatim paper quotes` · and the research markers, which get their own
typographic treatment rather than coloured boxes:

| marker | reads as |
| --- | --- |
| `PRE::` / `POST::` | the frame around a read |
| `D::` | deduction |
| `H::` | hypothesis |
| `Q::` | open question |
| `A::` | attack |
| `C::` | connection — rendered as links back into the map |
| `O::` | observation |

Markers are also collected automatically into the Synthesis view, so nothing is
written twice.

## Development

```bash
npm install
npm run dev
npm run build     # tsc + vite build, and copies dist/index.html to dist/404.html
npm run preview
```

### One setting to check on GitHub

**Settings → Pages → Build and deployment → Source must be _GitHub Actions_.**

If it is set to _Deploy from a branch_, GitHub also runs its own legacy
"pages build and deployment" job on every push. That job publishes the raw
repository (the un-built `index.html`, which points at `/src/main.tsx`) and
races our workflow — whichever finishes last wins, so the site flickers between
the real build and a blank page. Both jobs report success, which is what makes
it confusing. Switching the source to GitHub Actions stops the legacy job.

Deployment is `.github/workflows/deploy.yml`: every push to `main` builds and
publishes to GitHub Pages. `vite.config.ts` sets `base: '/model-optimization/'`;
the `404.html` copy is what makes deep links such as
`/model-optimization/papers/lth` survive a refresh.

See `SESSION.md` for the working record of decisions and open items.
