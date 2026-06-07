import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh, MeshStandardMaterial } from 'three';
import type { Paper } from '../data/papers';
import type { Vec3 } from '../hooks/useForceLayout';
import { tierRadius } from '../hooks/useForceLayout';
import { nodeColor } from '../theme';

type Props = {
  paper: Paper;
  position: Vec3;
  hovered: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export default function PaperNode({
  paper,
  position,
  hovered,
  selected,
  onHover,
  onSelect,
}: Props) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const [pointer, setPointer] = useState(false);
  const baseRadius = tierRadius(paper.tier);
  const color = nodeColor(paper.read);

  // Glow whispers: read papers carry a soft warm halo, queued ones a faint
  // cool corona. Kept low so no node bleeds into its neighbour.
  const baseIntensity = paper.read ? 1.1 : 0.45;
  const active = hovered || selected || pointer;

  useFrame((_, delta) => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const targetScale = active ? 1.26 : 1;
    m.scale.x += (targetScale - m.scale.x) * Math.min(1, delta * 10);
    m.scale.y = m.scale.z = m.scale.x;
    const targetIntensity = active ? baseIntensity * 1.6 : baseIntensity;
    mat.emissiveIntensity +=
      (targetIntensity - mat.emissiveIntensity) * Math.min(1, delta * 10);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setPointer(true);
          onHover(paper.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setPointer(false);
          onHover(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(paper.id);
        }}
      >
        <sphereGeometry args={[baseRadius, 32, 32]} />
        <meshStandardMaterial
          ref={material}
          color={color}
          emissive={color}
          emissiveIntensity={baseIntensity}
          roughness={0.35}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>

      <Html
        center
        position={[0, baseRadius + 0.9, 0]}
        distanceFactor={18}
        pointerEvents="none"
        zIndexRange={[10, 0]}
      >
        <div
          className={`node-label ${paper.read ? 'is-read' : 'is-queued'} ${
            active ? 'is-active' : ''
          }`}
        >
          {paper.title}
        </div>
      </Html>
    </group>
  );
}
