import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MiningArea } from "@/pages/Dashboard";

export function LegalMiningZone({
  position,
  size,
}: {
  position: [number, number, number];
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = -0.9 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[size, size, 0.2, 32]} />
      <meshStandardMaterial
        color={"hsl(188 85% 35%)"}
        transparent
        opacity={0.6}
        emissive={"hsl(188 85% 35%)"}
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

export function IllegalMiningZone({
  position,
  size,
}: {
  position: [number, number, number];
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[size * 0.3, 0]} />
        <meshStandardMaterial
          color={"hsl(0 84% 52%)"}
          emissive={"hsl(0 84% 52%)"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Danger ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <ringGeometry args={[size * 0.3, size * 0.42, 32]} />
        <meshBasicMaterial
          color={"hsl(0 84% 52%)"}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function AnalysisCenter({ position }: { position: [number, number, number] }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!beamRef.current) return;
    beamRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });

  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={"hsl(43 96% 56%)"}
          emissive={"hsl(43 96% 56%)"}
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh ref={beamRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshBasicMaterial color={"hsl(43 96% 56%)"} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export function MiningOverlays({
  area,
  legalZones,
  illegalZones,
}: {
  area: MiningArea | null;
  legalZones: Array<{ position: [number, number, number]; size: number }>;
  illegalZones: Array<{ position: [number, number, number]; size: number }>;
}) {
  return (
    <>
      {legalZones.map((zone, i) => (
        <LegalMiningZone key={`legal-${i}`} position={zone.position} size={zone.size} />
      ))}
      {illegalZones.map((zone, i) => (
        <IllegalMiningZone key={`illegal-${i}`} position={zone.position} size={zone.size} />
      ))}
      {area && <AnalysisCenter position={[0, -0.7, 0]} />}
    </>
  );
}
