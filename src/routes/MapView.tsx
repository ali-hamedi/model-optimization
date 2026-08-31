import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LENSES, ROLE_LABEL } from '../data/lenses';
import { PAPERS, paperById } from '../data/papers';
import { neighboursOf } from '../data/relations';
import type { LensId } from '../data/types';
import { lineageOf } from '../lib/ancestry';
import { MAP_H, MAP_W, lensLabelAnchor } from '../lib/layout';
import MapEdges, { type EdgeState } from '../components/map/MapEdges';
import MapNode from '../components/map/MapNode';
import MapCard from '../components/map/MapCard';
import Legend from '../components/map/Legend';

export default function MapView() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [hovered, setHovered] = useState<string | null>(null);

  const selected = params.get('p');
  const lens = params.get('lens') as LensId | null;

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params);
      if (value === null) next.delete(key);
      else next.set(key, value);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setParam('p', null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setParam]);

  const lineage = useMemo(
    () => (selected && paperById[selected] ? lineageOf(selected) : null),
    [selected],
  );
  const neighbours = useMemo(
    () => (hovered ? neighboursOf(hovered) : new Set<string>()),
    [hovered],
  );

  const inLens = useCallback(
    (id: string) => {
      if (!lens) return true;
      const p = paperById[id];
      return p.primaryLens === lens || p.secondaryLenses.includes(lens);
    },
    [lens],
  );

  const nodeState = (id: string): 'idle' | 'dim' | 'neighbour' | 'selected' => {
    if (!inLens(id)) return 'dim';
    if (selected) {
      if (id === selected) return 'selected';
      return lineage!.members.has(id) ? 'neighbour' : 'dim';
    }
    if (hovered) {
      if (id === hovered) return 'selected';
      return neighbours.has(id) ? 'neighbour' : 'dim';
    }
    return 'idle';
  };

  const lineageRole = (id: string): 'ancestor' | 'descendant' | null => {
    if (!lineage || id === selected) return null;
    if (lineage.ancestors.includes(id)) return 'ancestor';
    if (lineage.descendants.includes(id)) return 'descendant';
    return null;
  };

  const edgeState = useCallback(
    (source: string, target: string): { state: EdgeState; depth: number } => {
      if (!inLens(source) || !inLens(target)) return { state: 'dim', depth: 0 };
      if (lineage) {
        const hit = lineage.edges.find(
          (e) => e.relation.source === source && e.relation.target === target,
        );
        return hit ? { state: 'lineage', depth: hit.depth } : { state: 'dim', depth: 0 };
      }
      if (hovered) {
        return source === hovered || target === hovered
          ? { state: 'live', depth: 0 }
          : { state: 'dim', depth: 0 };
      }
      return { state: 'idle', depth: 0 };
    },
    [hovered, lineage, inLens],
  );

  const cardPaper = hovered
    ? paperById[hovered]
    : selected
      ? paperById[selected]
      : null;

  return (
    <section className={`map${selected && !hovered ? ' has-selection' : ''}`}>
      <header className="map__head">
        <div>
          <p className="eyebrow">The trench · a literature map</p>
          <h1 className="map__question">
            How does an overparameterized neural network discover and represent
            the <em>efficient computation that generalizes?</em>
          </h1>
          <p className="map__sub">
            Ten papers, read through four lenses, with compression used as the
            probe. Every edge is an argument: what founds what, what counters
            what, and where the story was corrected.
          </p>
        </div>
        <div className="map__lenskeys">
          {LENSES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`lenskey lens--${l.id}${lens === l.id ? ' is-active' : ''}`}
              onClick={() => setParam('lens', lens === l.id ? null : l.id)}
              aria-pressed={lens === l.id}
            >
              <span className="lenskey__title">
                <i className="lens-dot" />
                {l.title}
              </span>
              <span className="lenskey__q">{l.question}</span>
            </button>
          ))}
        </div>
      </header>

      <div
        className="map__stage"
        onMouseLeave={() => setHovered(null)}
        role="group"
        aria-label="Paper map"
      >
        <MapEdges
          edgeState={edgeState}
          activeLens={lens}
          onHoverEdge={() => undefined}
        />

        <div className="map__layer">
          {LENSES.map((l) => (
            <span
              key={l.id}
              className={`lenslabel lens--${l.id}`}
              style={{
                left:
                  lensLabelAnchor[l.id].align === 'left'
                    ? `${(lensLabelAnchor[l.id].x / MAP_W) * 100}%`
                    : undefined,
                right:
                  lensLabelAnchor[l.id].align === 'right'
                    ? `${100 - (lensLabelAnchor[l.id].x / MAP_W) * 100}%`
                    : undefined,
                top: `${(lensLabelAnchor[l.id].y / MAP_H) * 100}%`,
                textAlign: lensLabelAnchor[l.id].align,
                transform: 'none',
                opacity: lens && lens !== l.id ? 0.28 : 1,
              }}
            >
              <span className="lenslabel__name">{l.title}</span>
              <span className="lenslabel__q">{l.question}</span>
            </span>
          ))}

          {PAPERS.map((p, i) => (
            <MapNode
              key={p.id}
              paper={p}
              index={i}
              state={nodeState(p.id)}
              lineage={lineageRole(p.id)}
              onHover={setHovered}
              onSelect={(id) => setParam('p', selected === id ? null : id)}
              onOpen={(id) => navigate(`/papers/${id}`)}
            />
          ))}

          {cardPaper && (
            <MapCard
              paper={cardPaper}
              pinned={!hovered && Boolean(selected)}
              lineage={lineage}
            />
          )}
        </div>
      </div>

      <div className="map__list">
        {PAPERS.map((p) => (
          <Link
            key={p.id}
            to={`/papers/${p.id}`}
            className={`listrow lens--${p.primaryLens}${inLens(p.id) ? '' : ' is-dim'}`}
          >
            <span className="listrow__title">{p.title}</span>
            <span className="listrow__meta">
              {p.authors} · {p.year} · {ROLE_LABEL[p.roles[0]]}
            </span>
            <span className="listrow__summary">{p.summary}</span>
          </Link>
        ))}
      </div>

      <Legend />
    </section>
  );
}
