import { useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type CameraPreset = "default" | "top" | "oblique" | "follow";

interface CameraPresetConfig {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const PRESETS: Record<CameraPreset, CameraPresetConfig> = {
  default: {
    position: new THREE.Vector3(10, 8, 10),
    target: new THREE.Vector3(0, -0.7, 0),
  },
  top: {
    position: new THREE.Vector3(0, 18, 0.01),
    target: new THREE.Vector3(0, -0.7, 0),
  },
  oblique: {
    position: new THREE.Vector3(12, 6, 4),
    target: new THREE.Vector3(0, -0.7, 0),
  },
  follow: {
    position: new THREE.Vector3(5, 4, 8),
    target: new THREE.Vector3(0, -0.7, 0),
  },
};

export function useCameraPreset(
  controlsRef: React.RefObject<OrbitControlsImpl | null>
) {
  const { camera } = useThree();
  const animatingRef = useRef(false);
  const targetPosRef = useRef(new THREE.Vector3());
  const targetLookRef = useRef(new THREE.Vector3());

  const applyPreset = useCallback(
    (preset: CameraPreset) => {
      const config = PRESETS[preset];
      targetPosRef.current.copy(config.position);
      targetLookRef.current.copy(config.target);
      animatingRef.current = true;
    },
    []
  );

  useFrame(() => {
    if (!animatingRef.current || !controlsRef.current) return;

    // Lerp camera position
    camera.position.lerp(targetPosRef.current, 0.08);
    controlsRef.current.target.lerp(targetLookRef.current, 0.08);
    controlsRef.current.update();

    // Check if close enough to stop animating
    if (
      camera.position.distanceTo(targetPosRef.current) < 0.01 &&
      controlsRef.current.target.distanceTo(targetLookRef.current) < 0.01
    ) {
      animatingRef.current = false;
    }
  });

  return { applyPreset };
}

// Mini compass that shows camera orientation
export function Compass() {
  const { camera } = useThree();
  const compassRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!compassRef.current) return;
    // Get camera's forward direction projected on XZ plane
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    const angle = Math.atan2(forward.x, forward.z);
    compassRef.current.rotation.y = -angle;
  });

  return (
    <group ref={compassRef} position={[8, 4, -8]} scale={0.5}>
      {/* North arrow */}
      <mesh position={[0, 0, -0.5]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial color="hsl(0 84% 52%)" emissive="hsl(0 84% 52%)" emissiveIntensity={0.3} />
      </mesh>
      {/* South arrow */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color="hsl(0 0% 60%)" />
      </mesh>
      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 8, 32]} />
        <meshStandardMaterial color="hsl(0 0% 50%)" />
      </mesh>
      {/* E/W markers */}
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="hsl(0 0% 70%)" />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="hsl(0 0% 70%)" />
      </mesh>
    </group>
  );
}
