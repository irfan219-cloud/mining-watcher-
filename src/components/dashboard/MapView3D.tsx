import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import type { MiningArea, DetectionResult } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { RotateCcw, Eye, ArrowUp, Mountain, Target } from "lucide-react";
import { Map3DScene, Map3DSceneRef } from "./map3d/Map3DScene";
import type { CameraPreset } from "./map3d/CameraPresets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MapView3DProps {
  area: MiningArea | null;
  detectionResult?: DetectionResult;
}

const CAMERA_PRESETS: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
  { id: "default", label: "Default", icon: <Eye className="w-4 h-4" /> },
  { id: "top", label: "Top Down", icon: <ArrowUp className="w-4 h-4" /> },
  { id: "oblique", label: "Oblique", icon: <Mountain className="w-4 h-4" /> },
  { id: "follow", label: "Follow Area", icon: <Target className="w-4 h-4" /> },
];

export default function MapView3D({ area, detectionResult }: MapView3DProps) {
  const [resetSeq, setResetSeq] = useState(0);
  const sceneRef = useRef<Map3DSceneRef>(null);

  const handlePreset = (preset: CameraPreset) => {
    sceneRef.current?.applyPreset(preset);
  };

  return (
    <div className="h-full w-full relative bg-gradient-to-b from-background to-muted">
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Map3DScene ref={sceneRef} area={area} detectionResult={detectionResult} resetSeq={resetSeq} />
        </Suspense>
      </Canvas>

      {/* Camera controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setResetSeq((s) => s + 1)}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Camera
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {CAMERA_PRESETS.map((preset) => (
              <DropdownMenuItem key={preset.id} onClick={() => handlePreset(preset.id)}>
                <span className="mr-2">{preset.icon}</span>
                {preset.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <p className="text-xs font-semibold mb-2">3D Legend</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Legal Mining Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive transform rotate-45" />
            <span>Illegal Mining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>Analysis Center</span>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
        <p className="text-xs text-muted-foreground">
          🖱️ Drag to rotate • Scroll to zoom • 🧭 Compass shows north
        </p>
      </div>

      {/* No Data Overlay */}
      {!area && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <p className="text-muted-foreground">Upload satellite imagery for 3D terrain visualization</p>
          </div>
        </div>
      )}
    </div>
  );
}
