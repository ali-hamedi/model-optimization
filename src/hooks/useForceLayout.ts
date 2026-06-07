import { useMemo } from 'react';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from 'd3-force-3d';
import { papers } from '../data/papers';
import { edges } from '../data/edges';

export type Vec3 = [number, number, number];

type SimNode = { id: string; tier: number; x?: number; y?: number; z?: number };
type SimLink = { source: string; target: string };

// Tier drives both node size and how strongly it repels — bigger papers
// claim more space so the constellation reads hierarchically.
function tierRadius(tier: number): number {
  return 0.9 + tier * 0.55;
}

/**
 * Runs a 3D d3-force simulation ONCE on mount and freezes the result.
 * Returns a stable id -> [x, y, z] map of node positions.
 */
export function useForceLayout(): Map<string, Vec3> {
  return useMemo(() => {
    const nodes: SimNode[] = papers.map((p) => ({ id: p.id, tier: p.tier }));
    const links: SimLink[] = edges.map(([source, target]) => ({ source, target }));

    const sim = forceSimulation(nodes, 3)
      .force('charge', forceManyBody().strength((d: SimNode) => -90 - d.tier * 40))
      .force(
        'link',
        forceLink(links)
          .id((d: SimNode) => d.id)
          .distance(9)
          .strength(0.5),
      )
      .force('center', forceCenter(0, 0, 0))
      .force('collide', forceCollide((d: SimNode) => tierRadius(d.tier) + 1.5))
      .stop();

    // Tick to convergence deterministically, then freeze.
    const ticks = Math.ceil(
      Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()),
    );
    for (let i = 0; i < ticks; i += 1) sim.tick();

    const layout = new Map<string, Vec3>();
    for (const n of nodes) {
      layout.set(n.id, [n.x ?? 0, n.y ?? 0, n.z ?? 0]);
    }
    return layout;
  }, []);
}

export { tierRadius };
