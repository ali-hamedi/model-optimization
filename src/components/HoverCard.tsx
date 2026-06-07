import { Html } from '@react-three/drei';
import type { Paper } from '../data/papers';
import type { Vec3 } from '../hooks/useForceLayout';
import { tierRadius } from '../hooks/useForceLayout';

const TIER_LABEL = ['QUEUED', 'TIER I', 'TIER II', 'TIER III'] as const;

type Props = {
  paper: Paper;
  position: Vec3;
};

/** Floating card that follows a hovered node (rendered inside the Canvas). */
export default function HoverCard({ paper, position }: Props) {
  return (
    <Html
      position={[position[0], position[1] + tierRadius(paper.tier) + 0.4, position[2]]}
      center
      distanceFactor={14}
      pointerEvents="none"
      zIndexRange={[100, 50]}
    >
      <div className="hover-card">
        <div className="hover-card__title">{paper.title}</div>
        <div className="hover-card__meta">
          {paper.authors} · {paper.year}
        </div>
        <div className="hover-card__tags">
          <span className="chip chip--pillar">{paper.pillar}</span>
          <span className="chip">{TIER_LABEL[paper.tier]}</span>
          <span className={`chip ${paper.read ? 'chip--read' : 'chip--queued'}`}>
            {paper.read ? 'read' : 'queued'}
          </span>
        </div>
      </div>
    </Html>
  );
}
