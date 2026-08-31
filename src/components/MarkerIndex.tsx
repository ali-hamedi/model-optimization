import { MARKER_META, type Marker } from '../lib/markers';

/**
 * The rail index of a note's markers. Deductions and open questions first —
 * they are what I actually go back for.
 */
export default function MarkerIndex({ markers }: { markers: Marker[] }) {
  const order: Marker['kind'][] = ['D', 'H', 'Q', 'A', 'C', 'O'];
  const grouped = order
    .map((kind) => ({ kind, items: markers.filter((m) => m.kind === kind) }))
    .filter((g) => g.items.length > 0);

  if (grouped.length === 0) return null;

  return (
    <div>
      <div className="rail__head">In this note</div>
      {grouped.map((g) => (
        <div key={g.kind} style={{ marginBottom: '0.7rem' }}>
          <a className="rail__item" href={`#${g.items[0].id}`}>
            {MARKER_META[g.kind].label}
            <span className="rail__count">{g.items.length}</span>
          </a>
        </div>
      ))}
    </div>
  );
}
