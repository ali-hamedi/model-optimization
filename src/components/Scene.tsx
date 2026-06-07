import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { papers, paperById } from '../data/papers';
import { useForceLayout } from '../hooks/useForceLayout';
import PaperNode from './PaperNode';
import Edges from './Edges';
import HoverCard from './HoverCard';

type Props = {
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

// Seconds of stillness before the slow auto-rotate resumes after a drag/zoom.
const RESUME_DELAY = 3500;

export default function Scene({ hoveredId, selectedId, onHover, onSelect }: Props) {
  const layout = useForceLayout();
  const controls = useRef<OrbitControlsImpl>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { camera } = useThree();

  // Frame the constellation on mount.
  useEffect(() => {
    camera.position.set(0, 4, 38);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;

    const pause = () => {
      c.autoRotate = false;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
    const scheduleResume = () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        c.autoRotate = true;
      }, RESUME_DELAY);
    };

    c.addEventListener('start', pause);
    c.addEventListener('end', scheduleResume);
    return () => {
      c.removeEventListener('start', pause);
      c.removeEventListener('end', scheduleResume);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const hoveredPaper = hoveredId ? paperById[hoveredId] : undefined;
  const hoveredPos = hoveredId ? layout.get(hoveredId) : undefined;

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[20, 20, 20]} intensity={120} distance={120} decay={1.4} />
      <pointLight position={[-25, -10, -15]} intensity={60} distance={120} decay={1.6} />

      <Edges layout={layout} />

      {papers.map((paper) => {
        const pos = layout.get(paper.id);
        if (!pos) return null;
        return (
          <PaperNode
            key={paper.id}
            paper={paper}
            position={pos}
            hovered={hoveredId === paper.id}
            selected={selectedId === paper.id}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}

      {hoveredPaper && hoveredPos && (
        <HoverCard paper={hoveredPaper} position={hoveredPos} />
      )}

      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.045}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        autoRotate
        autoRotateSpeed={0.14}
        minDistance={12}
        maxDistance={80}
        makeDefault
      />

      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}
