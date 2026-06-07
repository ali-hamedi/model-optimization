import { Line } from '@react-three/drei';
import { edges } from '../data/edges';
import { paperById } from '../data/papers';
import type { Vec3 } from '../hooks/useForceLayout';
import { COLORS } from '../theme';

type Props = {
  layout: Map<string, Vec3>;
};

export default function Edges({ layout }: Props) {
  return (
    <group>
      {edges.map(([a, b]) => {
        const pa = layout.get(a);
        const pb = layout.get(b);
        if (!pa || !pb) return null;

        const bothRead = !!paperById[a]?.read && !!paperById[b]?.read;
        return (
          <Line
            key={`${a}-${b}`}
            points={[pa, pb]}
            color={bothRead ? COLORS.edgeGold : COLORS.edgeGray}
            lineWidth={bothRead ? 0.7 : 0.5}
            transparent
            opacity={bothRead ? 0.32 : 0.1}
            toneMapped={false}
          />
        );
      })}
    </group>
  );
}
