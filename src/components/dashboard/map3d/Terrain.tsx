import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createTerrainTexture } from "./terrainTexture";

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, texture } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 128, 128);
    const positions = geo.attributes.position.array as Float32Array;

    // Lightweight pseudo-heightmap (deterministic-ish waves + tiny random)
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] =
        Math.sin(x * 0.45) * Math.cos(y * 0.45) * 0.28 +
        Math.sin(x * 0.18 + y * 0.28) * 0.45 +
        (Math.random() - 0.5) * 0.08;
    }

    geo.computeVertexNormals();

    return {
      geometry: geo,
      texture: createTerrainTexture(512),
    };
  }, []);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      castShadow
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        // HSL strings (no hex)
        color={"hsl(28 40% 18%)"}
        roughness={0.95}
        metalness={0.02}
        map={texture ?? undefined}
      />
    </mesh>
  );
}
