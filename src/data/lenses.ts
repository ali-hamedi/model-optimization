import type { Lens, LensId, RelationType, RoleId } from './types';

/**
 * Four attractors, placed as a wide diamond. Geometry and Structure sit on the
 * horizontal axis (how it is found / what does the work); Representation and
 * Emergence on the vertical (how it is encoded / when it appears).
 */
export const LENSES: Lens[] = [
  {
    id: 'geometry',
    title: 'Optimization Geometry',
    question: 'How is the solution found?',
    blurb:
      'How overparameterization changes the landscape through which optimization travels.',
    anchor: 'permutation-invariance',
    pos: { x: 0.15, y: 0.31 },
  },
  {
    id: 'structure',
    title: 'Structure & Circuits',
    question: 'What actually computes?',
    blurb: 'Whether the useful computation lives in a sparse subnetwork.',
    anchor: 'lth',
    pos: { x: 0.85, y: 0.28 },
  },
  {
    id: 'representation',
    title: 'Representation',
    question: 'How is the computation encoded?',
    blurb: 'How efficiently computation is represented inside the network.',
    anchor: 'superposition',
    pos: { x: 0.8, y: 0.85 },
  },
  {
    id: 'emergence',
    title: 'Dynamics & Emergence',
    question: 'When does the generalizing computation appear?',
    blurb:
      'How the eventual generalizing computation emerges over the course of training.',
    anchor: 'grokking-circuit-efficiency',
    pos: { x: 0.19, y: 0.86 },
  },
];

export const lensById: Record<LensId, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l]),
) as Record<LensId, Lens>;

export const ROLE_LABEL: Record<RoleId, string> = {
  foundation: 'Foundation',
  bridge: 'Bridge',
  refinement: 'Refinement',
  counter: 'Counter',
  challenge: 'Challenge',
};

export const RELATION_LABEL: Record<RelationType, string> = {
  foundation: 'founds',
  support: 'supports',
  counter: 'counters',
  refinement: 'refines',
  bridge: 'bridges to',
};

/** The same edge, read from the target end. */
export const RELATION_LABEL_INVERSE: Record<RelationType, string> = {
  foundation: 'is founded on',
  support: 'is supported by',
  counter: 'is countered by',
  refinement: 'is refined by',
  bridge: 'is bridged from',
};
