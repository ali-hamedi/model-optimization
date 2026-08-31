import { Link } from 'react-router-dom';
import type { Paper } from '../../data/types';
import {
  lensById,
  RELATION_LABEL,
  RELATION_LABEL_INVERSE,
  ROLE_LABEL,
} from '../../data/lenses';
import { paperById } from '../../data/papers';
import { neighboursOf, relationsFor } from '../../data/relations';
import { NODE_POS, MAP_W, MAP_H } from '../../lib/layout';
import type { Lineage } from '../../lib/ancestry';

/**
 * An annotation, not a tooltip bubble. On hover it floats beside its node; on
 * selection it docks out of the way so the traced lineage stays visible.
 */
export default function MapCard({
  paper,
  pinned,
  lineage,
}: {
  paper: Paper;
  pinned: boolean;
  lineage?: Lineage | null;
}) {
  const pos = NODE_POS[paper.id];
  const relations = relationsFor(paper.id).slice(0, 4);

  // Put the card on whichever side hides the least: the annotation must never
  // cover the neighbours whose edges it is explaining.
  const NEED = 380;
  const neighbours = [...neighboursOf(paper.id)].map((id) => NODE_POS[id]);
  const cost = (side: 'left' | 'right') => {
    const blocked = neighbours.filter((n) =>
      side === 'left' ? n.x < pos.x : n.x > pos.x,
    ).length;
    const room = side === 'left' ? pos.x : MAP_W - pos.x;
    return blocked * 220 + Math.max(0, NEED - room);
  };
  const onLeft = cost('left') <= cost('right');

  // sit beside the node, roughly level with it, and never off the plate
  const top = Math.min(64, Math.max(2, (pos.y / MAP_H) * 100 - 13));

  return (
    <div
      className={`card lens--${paper.primaryLens}${pinned ? ' is-pinned' : ''}`}
      style={
        pinned
          ? undefined
          : {
              left: onLeft ? undefined : `${(pos.x / MAP_W) * 100}%`,
              right: onLeft ? `${100 - (pos.x / MAP_W) * 100}%` : undefined,
              top: `${top}%`,
              marginLeft: onLeft ? undefined : '6.5rem',
              marginRight: onLeft ? '6.5rem' : undefined,
            }
      }
      role={pinned ? undefined : 'tooltip'}
    >
      <div className="card__kicker">
        <span>
          <i className="lens-dot" />
          {lensById[paper.primaryLens].title}
          {paper.secondaryLenses.map((l) => ` + ${lensById[l].title}`).join('')}
        </span>
        <span>{paper.roles.map((r) => ROLE_LABEL[r]).join(' / ')}</span>
      </div>
      <h2 className="card__title">{paper.title}</h2>
      <div className="card__authors">
        {paper.authors} · {paper.year}
        {paper.venue ? ` · ${paper.venue}` : ''}
      </div>
      <p className="card__summary">{paper.summary}</p>
      {pinned && relations.length > 0 && (
        <div className="card__rel">
          {relations.map((r) => {
            const outgoing = r.source === paper.id;
            const other = paperById[outgoing ? r.target : r.source];
            return (
              <span key={`${r.source}-${r.target}-${r.type}`}>
                {outgoing ? '→ ' : '← '}
                <span className="rail__verb">
                  {outgoing ? RELATION_LABEL[r.type] : RELATION_LABEL_INVERSE[r.type]}
                </span>{' '}
                <b>{other.shortTitle}</b>
              </span>
            );
          })}
        </div>
      )}
      {pinned && lineage && (
        <p className="card__trace">
          Tracing {lineage.members.size} papers along {lineage.edges.length}{' '}
          relations · {lineage.ancestors.length} upstream ↑ ·{' '}
          {lineage.descendants.length} downstream ↓
        </p>
      )}
      {pinned && (
        <Link className="card__open" to={`/papers/${paper.id}`}>
          Open reading note →
        </Link>
      )}
    </div>
  );
}
