import type { Paper } from '../../data/types';
import { ROLE_LABEL } from '../../data/lenses';
import { NODE_POS, MAP_W, MAP_H } from '../../lib/layout';

interface Props {
  paper: Paper;
  state: 'idle' | 'dim' | 'neighbour' | 'selected';
  lineage: 'ancestor' | 'descendant' | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function MapNode({
  paper,
  state,
  lineage,
  onHover,
  onSelect,
  onOpen,
}: Props) {
  const pos = NODE_POS[paper.id];
  const cls = [
    'node',
    `lens--${paper.primaryLens}`,
    state === 'dim' && 'is-dim',
    state === 'neighbour' && 'is-neighbour',
    state === 'selected' && 'is-selected',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cls}
      style={
        {
          left: `${(pos.x / MAP_W) * 100}%`,
          top: `${(pos.y / MAP_H) * 100}%`,
        } as React.CSSProperties
      }
      aria-pressed={state === 'selected'}
      aria-label={`${paper.title}. ${paper.authors}, ${paper.year}. ${ROLE_LABEL[paper.roles[0]]}.`}
      onMouseEnter={() => onHover(paper.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(paper.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(paper.id)}
      onDoubleClick={() => onOpen(paper.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onOpen(paper.id);
      }}
    >
      <span className="node__title">{paper.shortTitle}</span>
      <span className="node__meta">
        {paper.authors.split(/[,&]/)[0].trim()} · {paper.year}
      </span>
      <span className="node__role">
        {ROLE_LABEL[paper.roles[0]]}
        {lineage && (
          <span className="node__lineage" aria-hidden="true">
            {lineage === 'ancestor' ? ' ↑' : ' ↓'}
          </span>
        )}
      </span>
    </button>
  );
}
