/** The research markers used in my notes. Order matters: it is the reading order. */
export const MARKER_KINDS = [
  'PRE',
  'O',
  'D',
  'H',
  'Q',
  'A',
  'C',
  'POST',
] as const;

export type MarkerKind = (typeof MARKER_KINDS)[number];

export interface MarkerMeta {
  label: string;
  /** What the marker means, shown in the notation legend and on hover. */
  gloss: string;
  glyph: string;
}

export const MARKER_META: Record<MarkerKind, MarkerMeta> = {
  PRE: { label: 'Before reading', gloss: 'What I expected going in', glyph: '⌐' },
  POST: { label: 'After reading', gloss: 'What changed in my world model', glyph: '¬' },
  D: { label: 'Deduction', gloss: 'What I take to follow', glyph: '∴' },
  Q: { label: 'Open question', gloss: 'Unresolved', glyph: '?' },
  A: { label: 'Attack', gloss: 'Where I disagree', glyph: '×' },
  C: { label: 'Connection', gloss: 'Link to another paper or idea', glyph: '⇄' },
  H: { label: 'Hypothesis', gloss: 'A guess I am willing to defend', glyph: '△' },
  O: { label: 'Observation', gloss: 'Noted, not yet interpreted', glyph: '·' },
};

export interface Marker {
  id: string;
  kind: MarkerKind;
  /** Plain-text preview for indexes and rails. */
  text: string;
}

const KIND_RE = new RegExp(`^(${MARKER_KINDS.join('|')})::`);

export function markerKindAt(line: string): MarkerKind | null {
  const m = KIND_RE.exec(line.trimStart());
  return m ? (m[1] as MarkerKind) : null;
}
