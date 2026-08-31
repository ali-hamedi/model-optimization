import { useMemo } from 'react';
import { LENSES } from '../../data/lenses';
import { RELATIONS } from '../../data/relations';
import { MAP_H, MAP_W, NODE_POS, lensAnchor } from '../../lib/layout';
import { edgeGeometry } from '../../lib/geometry';

export type EdgeState = 'idle' | 'dim' | 'live' | 'lineage';

interface Props {
  edgeState: (source: string, target: string) => { state: EdgeState; depth: number };
  activeLens: string | null;
  onHoverEdge: (key: string | null) => void;
}

export default function MapEdges({ edgeState, activeLens, onHoverEdge }: Props) {
  const geometry = useMemo(
    () =>
      RELATIONS.map((r) => ({
        relation: r,
        geo: edgeGeometry(NODE_POS[r.source], NODE_POS[r.target]),
      })),
    [],
  );

  return (
    <svg
      className="map__edges"
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LENSES.map((l) => (
        <circle
          key={l.id}
          className={`lensfield lens--${l.id}${activeLens === l.id ? ' is-active' : ''}`}
          cx={lensAnchor[l.id].x}
          cy={lensAnchor[l.id].y}
          r={196}
        />
      ))}

      {geometry.map(({ relation, geo }) => {
        const key = `${relation.source}->${relation.target}`;
        const { state, depth } = edgeState(relation.source, relation.target);
        const cls = [
          'edge',
          `edge--${relation.type}`,
          state === 'dim' && 'is-dim',
          state === 'live' && 'is-live',
          state === 'lineage' && 'is-lineage',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <g key={key}>
            <path
              className={cls}
              d={geo.d}
              style={
                state === 'lineage'
                  ? ({
                      '--len': geo.length,
                      animationDelay: `${(depth - 1) * 160}ms`,
                    } as React.CSSProperties)
                  : undefined
              }
            />
            <polygon
              className={[
                'arrow',
                state === 'dim' && 'is-dim',
                state === 'live' && 'is-live',
                state === 'lineage' && 'is-lineage',
              ]
                .filter(Boolean)
                .join(' ')}
              points="0,-3.4 8,0 0,3.4"
              transform={`translate(${geo.arrow.x} ${geo.arrow.y}) rotate(${geo.arrow.angle})`}
            />
            <path
              className="edge__hit"
              d={geo.d}
              onMouseEnter={() => onHoverEdge(key)}
              onMouseLeave={() => onHoverEdge(null)}
            >
              <title>{`${relation.source} ${relation.type} ${relation.target}: ${relation.description}`}</title>
            </path>
          </g>
        );
      })}
    </svg>
  );
}
