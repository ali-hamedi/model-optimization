import { LENSES } from '../data/lenses';
import { PAPERS } from '../data/papers';
import { RELATIONS } from '../data/relations';

export const MAP_W = 1200;
export const MAP_H = 620;

export interface Point {
  x: number;
  y: number;
}

/** Deterministic PRNG so the map is byte-identical on every load. */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lensAnchor: Record<string, Point> = Object.fromEntries(
  LENSES.map((l) => [l.id, { x: l.pos.x * MAP_W, y: l.pos.y * MAP_H }]),
);

/**
 * Anchor pull + edge springs + node repulsion, run to a fixed number of ticks
 * with a fixed seed. Papers settle near their lenses; related papers pull
 * together; nobody overlaps. No physics runs at render time.
 */
function solve(): Record<string, Point> {
  const rand = mulberry(0x5eed);
  const ids = PAPERS.map((p) => p.id);
  const pos: Record<string, Point> = {};
  const home: Record<string, Point> = {};

  for (const p of PAPERS) {
    const anchors: { pt: Point; w: number }[] = [
      { pt: lensAnchor[p.primaryLens], w: 1 },
      ...p.secondaryLenses.map((l) => ({ pt: lensAnchor[l], w: 0.42 })),
    ];
    const total = anchors.reduce((s, a) => s + a.w, 0);
    const hx = anchors.reduce((s, a) => s + a.pt.x * a.w, 0) / total;
    const hy = anchors.reduce((s, a) => s + a.pt.y * a.w, 0) / total;
    // Pull every paper a little toward the centre: the trench question is there.
    home[p.id] = {
      x: hx * 0.97 + MAP_W * 0.5 * 0.03,
      y: hy * 0.95 + MAP_H * 0.5 * 0.05,
    };
    pos[p.id] = {
      x: home[p.id].x + (rand() - 0.5) * 90,
      y: home[p.id].y + (rand() - 0.5) * 90,
    };
  }

  const SEP_X = 236;
  const SEP_Y = 122;
  // The four corners are reserved for the lens titles; papers are kept out.
  const CORNERS: Point[] = [
    { x: 90, y: 40 },
    { x: MAP_W - 90, y: 40 },
    { x: 90, y: MAP_H - 40 },
    { x: MAP_W - 90, y: MAP_H - 40 },
  ];
  const CORNER_X = 246;
  const CORNER_Y = 126;

  const clearCorners = () => {
    for (const id of ids) {
      for (const c of CORNERS) {
        const dx = pos[id].x - c.x;
        const dy = pos[id].y - c.y;
        const ox = CORNER_X - Math.abs(dx);
        const oy = CORNER_Y - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox / CORNER_X < oy / CORNER_Y) pos[id].x += (Math.sign(dx) || 1) * ox;
        else pos[id].y += (Math.sign(dy) || 1) * oy;
      }
    }
  };
  for (let step = 0; step < 600; step++) {
    const cool = 1 - step / 600;
    const vel: Record<string, Point> = {};
    for (const id of ids) vel[id] = { x: 0, y: 0 };

    for (const id of ids) {
      vel[id].x += (home[id].x - pos[id].x) * 0.055;
      vel[id].y += (home[id].y - pos[id].y) * 0.055;
    }

    for (const r of RELATIONS) {
      const a = pos[r.source];
      const b = pos[r.target];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const k = ((d - 270) / d) * 0.006;
      vel[r.source].x += dx * k;
      vel[r.source].y += dy * k;
      vel[r.target].x -= dx * k;
      vel[r.target].y -= dy * k;
    }

    // Nodes are boxes, so separation is measured per axis and resolved along
    // whichever axis is least penetrated. Circles would leave labels touching.
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = pos[ids[i]];
        const b = pos[ids[j]];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = SEP_X - Math.abs(dx);
        const oy = SEP_Y - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox / SEP_X < oy / SEP_Y) {
          const push = (Math.sign(dx) || 1) * ox * 0.5;
          a.x -= push;
          b.x += push;
        } else {
          const push = (Math.sign(dy) || 1) * oy * 0.5;
          a.y -= push;
          b.y += push;
        }
      }
    }

    for (const id of ids) {
      pos[id].x += vel[id].x * cool * 4;
      pos[id].y += vel[id].y * cool * 4;
    }
    clearCorners();
  }

  // A last separation-only pass: the anchor pull above can nudge boxes back
  // into contact on the final tick.
  for (let step = 0; step < 40; step++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = pos[ids[i]];
        const b = pos[ids[j]];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = SEP_X - Math.abs(dx);
        const oy = SEP_Y - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox / SEP_X < oy / SEP_Y) {
          const push = (Math.sign(dx) || 1) * ox * 0.52;
          a.x -= push;
          b.x += push;
        } else {
          const push = (Math.sign(dy) || 1) * oy * 0.52;
          a.y -= push;
          b.y += push;
        }
      }
    }
    clearCorners();
  }

  // Keep everything inside the frame with room for the node label boxes.
  const padX = 106;
  const padY = 72;
  for (const id of ids) {
    pos[id].x = Math.min(MAP_W - padX, Math.max(padX, Math.round(pos[id].x)));
    pos[id].y = Math.min(MAP_H - padY, Math.max(padY, Math.round(pos[id].y)));
  }
  return pos;
}

export const NODE_POS: Record<string, Point> = solve();

/**
 * Lens names title the corner of the map their field occupies — the way a
 * quadrant is labelled on a plotted figure.
 */
export const lensLabelAnchor: Record<
  string,
  Point & { align: 'left' | 'right' }
> = Object.fromEntries(
  LENSES.map((l) => {
    const left = l.pos.x < 0.5;
    const top = l.pos.y < 0.5;
    return [
      l.id,
      {
        x: left ? 26 : MAP_W - 26,
        y: top ? 18 : MAP_H - 84,
        align: left ? 'left' : 'right',
      },
    ];
  }),
);
