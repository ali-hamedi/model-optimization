import type { Paper } from './types';

/**
 * The map. Adding a paper = one entry here + a markdown file at
 * content/papers/<note>.md. Nothing else needs to change.
 */
export const PAPERS: Paper[] = [
  {
    id: 'lth',
    shortTitle: 'LTH',
    title:
      'The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks',
    authors: 'Frankle & Carbin',
    year: 2019,
    venue: 'ICLR 2019 (best paper)',
    primaryLens: 'structure',
    secondaryLenses: ['geometry'],
    roles: ['foundation'],
    summary:
      'A dense network contains a sparse subnetwork that, trained from its original initialization, matches the full network. The winning ticket is a (structure, θ₀) pair — not structure alone.',
    trenchRelation:
      'The first paper of the trench: it makes "where is the computation?" an empirical question, and smuggles in a geometry claim it never says out loud.',
    note: 'lth',
  },
  {
    id: 'lmc',
    shortTitle: 'LMC',
    title: 'Linear Mode Connectivity and the Lottery Ticket Hypothesis',
    authors: 'Frankle, Dziugaite, Roy & Carbin',
    year: 2020,
    venue: 'ICML 2020',
    primaryLens: 'geometry',
    secondaryLenses: ['structure'],
    roles: ['bridge', 'refinement'],
    summary:
      'Builds a ruler — linear interpolation instability — and uses it to show that matching subnetworks appear once the network becomes stable to SGD noise, at Wk rather than W₀.',
    trenchRelation:
      'Turns the ticket story into a landscape story: the question moves from where the ticket is to when the trajectory settles.',
    note: 'lmc',
  },
  {
    id: 'permutation-invariance',
    shortTitle: 'Permutation Inv.',
    title:
      'The Role of Permutation Invariance in Linear Mode Connectivity of Neural Networks',
    authors: 'Entezari, Sedghi, Saukh & Neyshabur',
    year: 2021,
    primaryLens: 'geometry',
    secondaryLenses: ['representation'],
    roles: ['foundation'],
    summary:
      'Conjectures that apparently distinct minima are permutation-equivalent versions of one another — under a symmetry-aware view the landscape collapses toward a single basin.',
    trenchRelation:
      'If solutions are one basin modulo symmetry, "which solution SGD found" is a much weaker distinction than it looked.',
    note: 'permutation-invariance',
  },
  {
    id: 'superposition',
    shortTitle: 'Superposition (TMS)',
    title: 'Toy Models of Superposition',
    authors: 'Elhage, Hume, Olsson, et al.',
    year: 2022,
    venue: 'Anthropic',
    primaryLens: 'representation',
    secondaryLenses: [],
    roles: ['foundation'],
    summary:
      'Networks pack more features than they have neurons. neuron→feature, weight→importance and subnetwork→computation stop being the same question.',
    trenchRelation:
      'Removes the assumption every structure-lens result quietly relies on: that what a parameter weighs tells you what it does.',
    note: 'superposition',
    provisional: true,
  },
  {
    id: 'grokking-circuit-efficiency',
    shortTitle: 'Circuit Efficiency',
    title: 'Explaining Grokking through Circuit Efficiency',
    authors: 'Varma, Shah, Kenton, Kramár & Kumar',
    year: 2023,
    primaryLens: 'emergence',
    secondaryLenses: ['structure'],
    roles: ['foundation', 'bridge'],
    summary:
      'Grokking as a competition between a memorizing circuit that is easy to learn and a generalizing circuit that is more efficient — larger logits at the same parameter norm.',
    trenchRelation:
      'Gives "efficient computation" an operational definition and a mechanism for why training would ever switch to it.',
    note: 'grokking-circuit-efficiency',
  },
  {
    id: 'random-tickets',
    shortTitle: 'Random Tickets',
    title: 'Sanity-Checking Pruning Methods: Random Tickets Can Win the Jackpot',
    authors: 'Su, Chen, Cai, Wu, Gao, Wang & Lee',
    year: 2020,
    venue: 'NeurIPS 2020',
    primaryLens: 'structure',
    secondaryLenses: ['geometry'],
    roles: ['counter'],
    summary:
      'Sanity checks — random labels, shuffled pixels, layerwise weight shuffling — that pruning methods largely survive. Layerwise sparsity ratios carry much of the claimed magic.',
    trenchRelation:
      'Changed the holiness of LTH. If a random ticket wins, the specialness was never in the individual weights.',
    note: 'random-tickets',
  },
  {
    id: 'rewinding-vs-finetuning',
    shortTitle: 'Rewinding vs Fine-Tuning',
    title: 'Comparing Rewinding and Fine-tuning in Neural Network Pruning',
    authors: 'Renda, Frankle & Carbin',
    year: 2020,
    venue: 'ICLR 2020',
    primaryLens: 'structure',
    secondaryLenses: ['emergence'],
    roles: ['refinement', 'counter'],
    summary:
      'Learning-rate rewinding ≥ weight rewinding ≥ fine-tuning. Keeping the trained weights and rewinding only the schedule does at least as well.',
    trenchRelation:
      'Erodes the special role of the original initialization from inside the LTH lineage itself.',
    note: 'rewinding-vs-finetuning',
    provisional: true,
  },
  {
    id: 'rethinking-generalization',
    shortTitle: 'Rethinking Generalization',
    title: 'Understanding Deep Learning Requires Rethinking Generalization',
    authors: 'Zhang, Bengio, Hardt, Recht & Vinyals',
    year: 2017,
    venue: 'ICLR 2017',
    primaryLens: 'emergence',
    secondaryLenses: [],
    roles: ['foundation', 'challenge'],
    summary:
      'Networks fit random labels perfectly, and explicit regularization is not what stops them. Capacity arguments cannot explain generalization on their own.',
    trenchRelation:
      'Moves the question from "can it memorize?" to "given that it absolutely can, why does optimization select a generalizing solution instead?"',
    note: 'rethinking-generalization',
  },
  {
    id: 'intrinsic-dimension',
    shortTitle: 'Intrinsic Dimension',
    title: 'Measuring the Intrinsic Dimension of Objective Landscapes',
    authors: 'Li, Farkhoor, Liu & Yosinski',
    year: 2018,
    venue: 'ICLR 2018',
    primaryLens: 'geometry',
    secondaryLenses: ['representation'],
    roles: ['foundation', 'bridge'],
    summary:
      'Training inside a random low-dimensional subspace still reaches a target performance. d_int is the dimension of a sufficient random subspace — not the minimum parameters a task needs.',
    trenchRelation:
      'Ambient parameter count ≠ effective search dimension. The capacity needed to search may greatly exceed the degrees of freedom actually used.',
    note: 'intrinsic-dimension',
  },
  {
    id: 'modular-addition',
    shortTitle: 'Modular Addition',
    title:
      'On the Mechanism and Dynamics of Modular Addition: Fourier Features, Lottery Ticket, and Grokking',
    authors: 'He, Wang, Chen & Yang',
    year: 2026,
    primaryLens: 'representation',
    secondaryLenses: ['emergence'],
    roles: ['bridge'],
    summary:
      'A two-layer model where each neuron carries a full spectrum with one dominant frequency; training silences the rest, phases align across layers, and width buys diversification.',
    trenchRelation:
      'Ties Fourier features, the lottery ticket picture and grokking into one mechanism — and re-derives LTH from a representation-first direction.',
    note: 'modular-addition',
  },
];

export const paperById: Record<string, Paper> = Object.fromEntries(
  PAPERS.map((p) => [p.id, p]),
);
