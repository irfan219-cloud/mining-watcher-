import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExtrudedBoundaryProps {
  coordinates: number[][][]; // GeoJSON polygon coordinates [lng, lat][]
  height: number;
  color: string;
  emissiveIntensity?: number;
  isIllegal?: boolean;
  baseY?: number;
}

// Convert GeoJSON coordinates to local 3D space
// Maps lng/lat to x/z with a scale factor
function geoToLocal(
  coords: number[][],
  center: { lng: number; lat: number },
  scale: number
): THREE.Vector2[] {
  return coords.map(([lng, lat]) => {
    const x = (lng - center.lng) * scale;
    const z = (lat - center.lat) * scale;
    return new THREE.Vector2(x, -z); // Flip z for correct orientation
  });
}

export function ExtrudedBoundary({
  coordinates,
  height,
  color,
  emissiveIntensity = 0.3,
  isIllegal = false,
  baseY = -0.9,
}: ExtrudedBoundaryProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (!coordinates || coordinates.length === 0 || !coordinates[0]) {
      return null;
    }

    const ring = coordinates[0];
    if (ring.length < 3) return null;

    // Calculate center of the polygon
    const center = ring.reduce(
      (acc, coord) => ({
        lng: acc.lng + coord[0] / ring.length,
        lat: acc.lat + coord[1] / ring.length,
      }),
      { lng: 0, lat: 0 }
    );

    // Scale factor to convert degrees to scene units (approx 111km per degree)
    const scale = 500;

    const points = geoToLocal(ring, center, scale);

    // Create shape from points
    const shape = new THREE.Shape(points);

    // Extrude settings
    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [coordinates, height]);

  // Animate illegal zones with pulsing
  useFrame((state) => {
    if (!meshRef.current || !isIllegal) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    meshRef.current.scale.y = pulse;
  });

  if (!geometry) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, baseY, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={isIllegal ? 0.85 : 0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Render multiple boundaries from detection result
export function BoundaryGroup({
  boundaries,
  illegalZones,
}: {
  boundaries?: any[];
  illegalZones?: any[];
}) {
  return (
    <>
      {/* Legal boundaries - cyan extruded polygons */}
      {boundaries?.map((boundary: any, i: number) => {
        if (!boundary.coordinates) return null;
        return (
          <ExtrudedBoundary
            key={`legal-${i}`}
            coordinates={boundary.coordinates}
            height={0.15}
            color="hsl(188 85% 35%)"
            emissiveIntensity={0.25}
            isIllegal={false}
          />
        );
      })}

      {/* Illegal zones - red extruded with animation */}
      {illegalZones?.map((zone: any, i: number) => {
        // Create a simple polygon from center + area
        if (zone.boundary?.coordinates) {
          return (
            <ExtrudedBoundary
              key={`illegal-${i}`}
              coordinates={zone.boundary.coordinates}
              height={0.25}
              color="hsl(0 84% 52%)"
              emissiveIntensity={0.5}
              isIllegal
            />
          );
        }

        // Fallback: create circle approximation from center and area
        if (zone.center) {
          const radius = Math.sqrt((zone.area || 1) / Math.PI) * 0.01;
          const circleCoords = Array.from({ length: 24 }, (_, j) => {
            const angle = (j / 24) * Math.PI * 2;
            return [
              zone.center[1] + Math.cos(angle) * radius,
              zone.center[0] + Math.sin(angle) * radius,
            ];
          });
          return (
            <ExtrudedBoundary
              key={`illegal-${i}`}
              coordinates={[circleCoords]}
              height={0.25}
              color="hsl(0 84% 52%)"
              emissiveIntensity={0.5}
              isIllegal
            />
          );
        }

        return null;
      })}
    </>
  );
}
