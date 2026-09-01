import { useRef } from 'react';
import type { Paper } from '../../data/types';
import { ROLE_LABEL } from '../../data/lenses';
import { MAP_W, MAP_H, type Point } from '../../lib/layout';

interface Props {
  paper: Paper;
  state: 'idle' | 'dim' | 'neighbour' | 'selected';
  lineage: 'ancestor' | 'descendant' | null;
  position: Point;
  draggable: boolean;
  onHover: (id: string | null) => void;
  onMove: (id: string, position: Point) => void;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function MapNode({
  paper,
  state,
  lineage,
  position: pos,
  draggable,
  onHover,
  onMove,
  onSelect,
  onOpen,
}: Props) {
  const drag = useRef<{
    x: number;
    y: number;
    pointerX: number;
    pointerY: number;
    moved: boolean;
  } | null>(null);
  const didDrag = useRef(false);
  const cls = [
    'node',
    `lens--${paper.primaryLens}`,
    state === 'dim' && 'is-dim',
    state === 'neighbour' && 'is-neighbour',
    state === 'selected' && 'is-selected',
    draggable && 'is-draggable',
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
      aria-label={`${paper.title}. ${paper.authors}, ${paper.year}. ${ROLE_LABEL[paper.roles[0]]}. Double-click to open its reading note.`}
      title="Double-click to open reading note"
      onPointerDown={(event) => {
        if (!draggable || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          x: pos.x,
          y: pos.y,
          pointerX: event.clientX,
          pointerY: event.clientY,
          moved: false,
        };
        didDrag.current = false;
      }}
      onPointerMove={(event) => {
        const active = drag.current;
        if (!active) return;
        const stage = event.currentTarget.closest('.map__stage');
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const dx = ((event.clientX - active.pointerX) / rect.width) * MAP_W;
        const dy = ((event.clientY - active.pointerY) / rect.height) * MAP_H;
        active.moved ||= Math.abs(dx) > 3 || Math.abs(dy) > 3;
        didDrag.current = active.moved;
        onMove(paper.id, {
          x: Math.min(MAP_W - 106, Math.max(106, active.x + dx)),
          y: Math.min(MAP_H - 96, Math.max(96, active.y + dy)),
        });
      }}
      onPointerUp={() => {
        drag.current = null;
        window.setTimeout(() => {
          didDrag.current = false;
        }, 0);
      }}
      onMouseEnter={() => onHover(paper.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(paper.id)}
      onBlur={() => onHover(null)}
      onClick={() => {
        if (didDrag.current) return;
        onSelect(paper.id);
      }}
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
