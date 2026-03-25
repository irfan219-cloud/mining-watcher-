import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { MiningArea, DetectionResult } from "@/pages/Dashboard";
import { Terrain } from "./Terrain";
import { MiningOverlays } from "./MiningOverlays";
import { BoundaryGroup } from "./ExtrudedBoundary";
import { useCameraPreset, Compass, CameraPreset } from "./CameraPresets";

const DEFAULT_CAMERA_POS = new THREE.Vector3(10, 8, 10);
const DEFAULT_TARGET = new THREE.Vector3(0, -0.7, 0);

export interface Map3DSceneRef {
  applyPreset: (preset: CameraPreset) => void;
}

interface Map3DSceneProps {
  area: MiningArea | null;
  detectionResult?: DetectionResult;
  resetSeq: number;
}

export const Map3DScene = forwardRef<Map3DSceneRef, Map3DSceneProps>(
  function Map3DScene({ area, detectionResult, resetSeq }, ref) {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const { camera } = useThree();
    const { applyPreset } = useCameraPreset(controlsRef);

    // Expose applyPreset to parent
    useImperativeHandle(ref, () => ({
      applyPreset,
    }));

    // Initialize controls defaults once
    useEffect(() => {
      camera.position.copy(DEFAULT_CAMERA_POS);
      camera.lookAt(DEFAULT_TARGET);
    }, [camera]);

    useEffect(() => {
      if (!controlsRef.current) return;
      controlsRef.current.target.copy(DEFAULT_TARGET);
      controlsRef.current.update();
      controlsRef.current.saveState();
    }, []);

    // Reset when requested
    useEffect(() => {
      if (!controlsRef.current) return;
      applyPreset("default");
    }, [resetSeq, applyPreset]);

    return (
      <>
        <color attach="background" args={["hsl(215 28% 6%)"]} />
        <fog attach="fog" args={["hsl(215 28% 6%)", 15, 45]} />

        <ambientLight intensity={0.22} />
        <hemisphereLight
          intensity={0.65}
          color={"hsl(0 0% 100%)"}
          groundColor={"hsl(28 35% 10%)"}
        />
        <directionalLight
          position={[10, 14, 8]}
          intensity={1.25}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00015}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.55} color={"hsl(43 96% 60%)"} />

        <Environment preset="sunset" />

        <Terrain />

        {/* Use extruded boundaries when detection data is available */}
        {detectionResult && (
          <BoundaryGroup
            boundaries={detectionResult.detected_boundaries as any[]}
            illegalZones={detectionResult.illegal_zones as any[]}
          />
        )}

        {/* Legacy overlays for fallback/demo visuals */}
        <MiningOverlays area={area} legalZones={[]} illegalZones={[]} />

        {/* 3D Compass */}
        <Compass />

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={30}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.2}
        />
      </>
    );
  }
);
