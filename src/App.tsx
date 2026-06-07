import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import Hud from './components/Hud';
import DetailPanel from './components/DetailPanel';
import { paperById } from './data/papers';
import { COLORS } from './theme';

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => setSelectedId(id), []);
  const handleClose = useCallback(() => setSelectedId(null), []);

  const selectedPaper = selectedId ? paperById[selectedId] ?? null : null;

  return (
    <div className="app">
      <div className="backdrop" />

      <Canvas
        className="canvas"
        dpr={[1, 2]}
        camera={{ fov: 55, position: [0, 4, 38], near: 0.1, far: 400 }}
        gl={{ antialias: true }}
        onPointerMissed={() => setHoveredId(null)}
      >
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 45, 120]} />
        <Scene
          hoveredId={hoveredId}
          selectedId={selectedId}
          onHover={setHoveredId}
          onSelect={handleSelect}
        />
      </Canvas>

      <Hud />
      <DetailPanel paper={selectedPaper} onClose={handleClose} />
    </div>
  );
}
