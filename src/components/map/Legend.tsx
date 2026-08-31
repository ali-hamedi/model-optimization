import type { RelationType } from '../../data/types';

const EDGE_KEY: { type: RelationType; note: string }[] = [
  { type: 'foundation', note: 'founds: the later paper stands on it' },
  { type: 'refinement', note: 'refines: same claim, corrected' },
  { type: 'counter', note: 'counters: the claim is weakened' },
  { type: 'bridge', note: 'bridges: joins two lenses' },
  { type: 'support', note: 'supports: independent agreement' },
];

const STROKE: Record<RelationType, string> = {
  foundation: 'none',
  refinement: 'none',
  counter: '10 5 2 5',
  bridge: '7 6',
  support: '1 4',
};

/**
 * The key stays folded away. A reader who wants to know what a dashed line
 * means will look for it; everyone else should get the map, not a manual.
 */
export default function Legend() {
  return (
    <details className="map__foot">
      <summary>What the lines mean</summary>
      <div className="legend__keys">
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
        <span className="legend__row">
          The colour down the left of a paper is its primary lens.
        </span>
      </div>
    </details>
  );
}
