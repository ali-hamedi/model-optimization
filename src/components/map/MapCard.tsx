import { Link } from 'react-router-dom';
import type { Paper } from '../../data/types';
import { lensById, ROLE_LABEL } from '../../data/lenses';
import { neighboursOf } from '../../data/relations';
import { NODE_POS, MAP_W, MAP_H } from '../../lib/layout';

/**
 * An annotation, not a tooltip bubble — but it only ever shows on hover.
 * Nothing lingers once the cursor moves on, even for a selected paper;
 * double-clicking (or the link below) is how you commit to reading it.
 */
export default function MapCard({
  paper,
  onHover,
  onLeave,
}: {
  paper: Paper;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  const pos = NODE_POS[paper.id];

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
      className={`card lens--${paper.primaryLens}`}
      style={{
        left: onLeft ? undefined : `${(pos.x / MAP_W) * 100}%`,
        right: onLeft ? `${100 - (pos.x / MAP_W) * 100}%` : undefined,
        top: `${top}%`,
        marginLeft: onLeft ? undefined : '6.5rem',
        marginRight: onLeft ? '6.5rem' : undefined,
      }}
      role="tooltip"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
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
      <Link className="card__open" to={`/papers/${paper.id}`}>
        Open reading note →
      </Link>
    </div>
  );
}
