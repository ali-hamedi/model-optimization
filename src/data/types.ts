/** Core content types. Everything the map draws is derived from these. */

export type LensId = 'geometry' | 'emergence' | 'structure' | 'representation';

export interface Lens {
  id: LensId;
  /** Short label used on the map. */
  title: string;
  /** The question this lens asks of the trench. */
  question: string;
  /** One line on what the lens is for. */
  blurb: string;
  /** Paper id that anchors the lens. */
  anchor: string;
  /** Normalised attractor position on the map, 0..1 in both axes. */
  pos: { x: number; y: number };
}

export type RoleId =
  | 'foundation'
  | 'bridge'
  | 'refinement'
  | 'counter'
  | 'challenge';

export interface Paper {
  id: string;
  /** Label drawn inside the node. Keep to ~22 characters. */
  shortTitle: string;
  title: string;
  authors: string;
  year: number;
  venue?: string;
  primaryLens: LensId;
  secondaryLenses: LensId[];
  /** Roles this paper plays in the argument, most important first. */
  roles: RoleId[];
  /** 1-2 sentences, in my own words, for the hover card. */
  summary: string;
  /** What it does to the trench question. */
  trenchRelation: string;
  /** Slug under content/papers/. Omit while the note is unwritten. */
  note: string;
  /** True when the reading note is still a stub. */
  provisional?: boolean;
}

export type RelationType =
  | 'foundation'
  | 'support'
  | 'counter'
  | 'refinement'
  | 'bridge';

export interface Relation {
  source: string;
  target: string;
  type: RelationType;
  /** Reads as: "<source> <description> <target>". Shown on hover and in the rail. */
  description: string;
}
