import { RELATIONS } from '../data/relations';
import type { Relation } from '../data/types';

export interface Lineage {
  /** Papers upstream of the selection, nearest first. */
  ancestors: string[];
  /** Papers downstream of the selection, nearest first. */
  descendants: string[];
  /** Every paper on the lineage, including the selection. */
  members: Set<string>;
  /** Edges on the lineage, ordered by distance from the selection. */
  edges: { relation: Relation; depth: number }[];
}

/**
 * The one idea the map is built around: selecting a paper traces the argument
 * that led to it and the argument it went on to provoke.
 */
export function lineageOf(id: string): Lineage {
  const edges: { relation: Relation; depth: number }[] = [];
  const members = new Set<string>([id]);

  const walk = (dir: 'up' | 'down'): string[] => {
    const order: string[] = [];
    let frontier = [id];
    const seen = new Set<string>([id]);
    let depth = 0;
    while (frontier.length && depth < 6) {
      depth += 1;
      const next: string[] = [];
      for (const cur of frontier) {
        for (const r of RELATIONS) {
          const from = dir === 'up' ? r.target : r.source;
          const to = dir === 'up' ? r.source : r.target;
          if (from !== cur || seen.has(to)) continue;
          seen.add(to);
          members.add(to);
          order.push(to);
          next.push(to);
          edges.push({ relation: r, depth });
        }
      }
      frontier = next;
    }
    return order;
  };

  const ancestors = walk('up');
  const descendants = walk('down');
  return { ancestors, descendants, members, edges };
}
