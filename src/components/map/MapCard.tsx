import { Link } from 'react-router-dom';
import type { Paper } from '../../data/types';
import { lensById, ROLE_LABEL } from '../../data/lenses';
import { MAP_W, MAP_H, type Point } from '../../lib/layout';

/**
 * An annotation, not a tooltip bubble — but it only ever shows on hover.
 * Nothing lingers once the cursor moves on, even for a selected paper;
 * double-clicking (or the link below) is how you commit to reading it.
 */
export default function MapCard({
  paper,
  position: pos,
  onHover,
  onLeave,
}: {
  paper: Paper;
  position: Point;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  const x = (pos.x / MAP_W) * 100;
  const y = (pos.y / MAP_H) * 100;

  return (
    <div
      className={`card lens--${paper.primaryLens}`}
      style={{
        '--card-x': `${x}%`,
        '--card-y': `${y}%`,
      } as React.CSSProperties}
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
      {paper.empty && <span className="card__empty">Empty</span>}
      <Link className="card__open" to={`/papers/${paper.id}`}>
        Open reading note →
      </Link>
    </div>
  );
}
