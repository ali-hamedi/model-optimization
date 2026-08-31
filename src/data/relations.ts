import type { Relation } from './types';

/**
 * Directed edges. Read as "<source> <verb> <target>": LTH founds LMC,
 * Random Tickets counters LTH.
 */
export const RELATIONS: Relation[] = [
  {
    source: 'lth',
    target: 'lmc',
    type: 'refinement',
    description:
      'replaces the rewind point W₀ with Wk, once the network is stable to SGD noise',
  },
  {
    source: 'lmc',
    target: 'permutation-invariance',
    type: 'refinement',
    description:
      'carries mode connectivity into symmetry, toward the single-basin conjecture',
  },
  {
    source: 'lth',
    target: 'random-tickets',
    type: 'counter',
    description:
      'is sanity-checked into a much weaker claim: random tickets win too',
  },
  {
    source: 'lth',
    target: 'rewinding-vs-finetuning',
    type: 'counter',
    description:
      'loses the special status of the original initialization to LR rewinding',
  },
  {
    source: 'random-tickets',
    target: 'rewinding-vs-finetuning',
    type: 'support',
    description: 'is combined with rewinding into hybrid tickets',
  },
  {
    source: 'superposition',
    target: 'lth',
    type: 'counter',
    description:
      'undercuts the weight→importance assumption magnitude pruning stands on',
  },
  {
    source: 'rethinking-generalization',
    target: 'grokking-circuit-efficiency',
    type: 'foundation',
    description:
      'sets up the question this answers: given that it can memorize, why switch?',
  },
  {
    source: 'grokking-circuit-efficiency',
    target: 'modular-addition',
    type: 'refinement',
    description:
      'has its coarse circuit story replaced by explicit training dynamics',
  },
  {
    source: 'lth',
    target: 'modular-addition',
    type: 'bridge',
    description:
      'is re-derived from the representation side: one dominant frequency per neuron',
  },
  {
    source: 'superposition',
    target: 'modular-addition',
    type: 'bridge',
    description:
      'predicts the non-neuron-aligned features this paper works out concretely',
  },
  {
    source: 'intrinsic-dimension',
    target: 'lth',
    type: 'support',
    description:
      'gives the same "far fewer degrees of freedom than parameters" reading from the landscape side',
  },
  {
    source: 'rethinking-generalization',
    target: 'intrinsic-dimension',
    type: 'bridge',
    description:
      'asks what capacity means; this answers with effective search dimension',
  },
  {
    source: 'lmc',
    target: 'grokking-circuit-efficiency',
    type: 'bridge',
    description:
      'dates the moment a solution becomes stable; this dates the moment it becomes efficient',
  },
];

/** Every relation touching a paper, in both directions. */
export function relationsFor(id: string): Relation[] {
  return RELATIONS.filter((r) => r.source === id || r.target === id);
}

export function neighboursOf(id: string): Set<string> {
  const out = new Set<string>();
  for (const r of RELATIONS) {
    if (r.source === id) out.add(r.target);
    if (r.target === id) out.add(r.source);
  }
  return out;
}
