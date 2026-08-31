import type { RelationType } from '../../data/types';

const EDGE_KEY: { type: RelationType; note: string }[] = [
  { type: 'foundation', note: 'founds — the later paper stands on it' },
  { type: 'refinement', note: 'refines — same claim, corrected' },
  { type: 'counter', note: 'counters — the claim is weakened' },
  { type: 'bridge', note: 'bridges — joins two lenses' },
  { type: 'support', note: 'supports — independent agreement' },
];

const STROKE: Record<RelationType, string> = {
  foundation: 'none',
  refinement: 'none',
  counter: '10 5 2 5',
  bridge: '7 6',
  support: '1 4',
};

export default function Legend() {
  return (
    <div className="map__foot">
      <div className="legend__group">
        <span className="legend__head">Edges</span>
        {EDGE_KEY.map((e) => (
          <span className="legend__row" key={e.type}>
            <svg className="legend__line" viewBox="0 0 40 2" aria-hidden="true">
              <line
                x1="0"
                y1="1"
                x2="40"
                y2="1"
                stroke="currentColor"
                strokeWidth={e.type === 'foundation' ? 1.8 : 1.2}
                strokeDasharray={STROKE[e.type] === 'none' ? undefined : STROKE[e.type]}
              />
            </svg>
            {e.note}
          </span>
        ))}
      </div>
      <div className="legend__group">
        <span className="legend__head">Nodes</span>
        <span className="legend__row">colour of the left rule = primary lens</span>
        <span className="legend__row">small caps line = role in the argument</span>
        <span className="legend__row">dashed ring = a lens attractor</span>
      </div>
      <p className="legend__hint">
        Click a paper to trace its argumentative ancestry: what it stands on
        (↑) and what it provoked (↓). Click again, or press Escape, to release.
      </p>
    </div>
  );
}
