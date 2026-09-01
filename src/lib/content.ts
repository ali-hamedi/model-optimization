import { paperById } from '../data/papers';
import { renderNote, type RenderedNote } from './markdown';

/**
 * All markdown under content/ is pulled in at build time. Editing a note and
 * committing it is the whole publishing workflow — no React changes needed.
 */
const FILES = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type NoteGroup = 'papers' | 'research' | 'foundations';

export interface NoteFile {
  group: NoteGroup;
  slug: string;
  raw: string;
  /** Site path (no base prefix). */
  path: string;
}

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function pathFor(group: NoteGroup, slug: string): string {
  if (group === 'papers' && paperById[slug]) return `/papers/${slug}`;
  if (group === 'research') return `/${slug}`;
  return `/notes/${slug}`;
}

export const NOTES: NoteFile[] = Object.entries(FILES).map(([file, raw]) => {
  const m = /\/content\/([^/]+)\/(.+)\.md$/.exec(file)!;
  const group = m[1] as NoteGroup;
  const slug = m[2];
  return { group, slug, raw, path: pathFor(group, slug) };
});

export const noteBySlug: Record<string, NoteFile> = Object.fromEntries(
  NOTES.map((n) => [n.slug, n]),
);

/**
 * Obsidian note names as they appear inside [[wiki-links]], lowercased,
 * mapped onto the slug of the file in content/.
 */
const ALIASES: Record<string, string> = {
  lth: 'lth',
  'the lottery ticket hypothesis': 'lth',
  lmc: 'lmc',
  'linear mode connectivity': 'lmc',
  'permutation invariance in lmc': 'permutation-invariance',
  tms: 'superposition',
  'toy models of superposition': 'superposition',
  'explain grokking circuit efficiency': 'grokking-circuit-efficiency',
  'explaining grokking through circuit efficiency': 'grokking-circuit-efficiency',
  'random tickets can win': 'random-tickets',
  'rewinding in pruning': 'rewinding-vs-finetuning',
  'comparing rewinding and fine-tuning': 'rewinding-vs-finetuning',
  'understanding dl requires rethinking generalization': 'rethinking-generalization',
  'measuring intrinsic dimension': 'intrinsic-dimension',
  'on the mechanism and dynamics of modular addition': 'modular-addition',
  'progress measures grokking': 'progress-measures-grokking',
  ntk: 'ntk',
  terminology: 'terminology',
  'weight decay': 'weight-decay',
  'p-norms (lebesgue norms)': 'p-norms',
  'p-norms': 'p-norms',
  trench: 'trench',
  synthesis: 'synthesis',
  notation: 'notation',
  'paper queue': 'queue',
};

function resolve(target: string): string | null {
  const key = target.trim().toLowerCase();
  const slug = ALIASES[key] ?? key.replace(/\s+/g, '-');
  const note = noteBySlug[slug];
  if (!note) return null;
  // An empty note is not worth linking to.
  return note.raw.trim().length > 0 ? note.path : null;
}

const cache = new Map<string, RenderedNote>();

// These entries are intentionally present on the map, but their reading notes
// are not published yet. Keep the source material for LTH and LMC in place
// while making the public page unambiguously empty.
const EMPTY_PAPER_NOTES = new Set(['lth', 'lmc', 'superposition']);

function isTitleOnly(raw: string): boolean {
  const body = raw.replace(/^---[\s\S]*?---\s*/, '').trim();
  return /^#\s+.+$/.test(body);
}

function publishedRaw(slug: string, raw: string): string {
  if (EMPTY_PAPER_NOTES.has(slug) || isTitleOnly(raw)) return 'Empty';
  return raw;
}

export function getNote(slug: string): RenderedNote | null {
  const file = noteBySlug[slug];
  if (!file || !file.raw.trim()) return null;
  const hit = cache.get(slug);
  if (hit) return hit;
  const rendered = renderNote(publishedRaw(slug, file.raw), { base: BASE, resolve });
  cache.set(slug, rendered);
  return rendered;
}

/** Every marker across every paper note, for the Synthesis view. */
export function allPaperMarkers() {
  return NOTES.filter((n) => n.group === 'papers')
    .map((n) => ({ note: n, rendered: getNote(n.slug) }))
    .filter((x) => x.rendered)
    .flatMap(({ note, rendered }) =>
      rendered!.markers.map((marker) => ({ marker, slug: note.slug, path: note.path })),
    );
}
