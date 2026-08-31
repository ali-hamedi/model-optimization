import type { Point } from './layout';

/** Half-extents of a node box in stage coordinates. */
const HW = 94;
const HH = 40;

function boxExit(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const t = Math.min(
    Math.abs(dx) > 1e-6 ? HW / Math.abs(dx) : Infinity,
    Math.abs(dy) > 1e-6 ? HH / Math.abs(dy) : Infinity,
  );
  return { x: from.x + dx * t, y: from.y + dy * t };
}

export interface EdgeGeometry {
  d: string;
  /** Arrowhead position and heading, in degrees. */
  arrow: { x: number; y: number; angle: number };
  mid: Point;
  length: number;
}

function quad(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

/**
 * A shallow arc from the edge of one node box to the edge of the next, always
 * bowing the same way so parallel arguments stay separable.
 */
export function edgeGeometry(a: Point, b: Point, curve = 0.13): EdgeGeometry {
  const start = boxExit(a, b);
  const end = boxExit(b, a);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ctrl = {
    x: (start.x + end.x) / 2 - (dy / dist) * dist * curve,
    y: (start.y + end.y) / 2 + (dx / dist) * dist * curve,
  };

  let length = 0;
  let prev = start;
  for (let i = 1; i <= 24; i++) {
    const p = quad(start, ctrl, end, i / 24);
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }

  const tip = quad(start, ctrl, end, 0.99);
  const before = quad(start, ctrl, end, 0.9);
  const angle = (Math.atan2(tip.y - before.y, tip.x - before.x) * 180) / Math.PI;

  return {
    d: `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`,
    arrow: { x: tip.x, y: tip.y, angle },
    mid: quad(start, ctrl, end, 0.5),
    length: Math.round(length),
  };
}
