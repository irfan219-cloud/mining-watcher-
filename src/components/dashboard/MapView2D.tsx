import { useEffect, useState, lazy, Suspense } from "react";
import { Loader2, Map } from "lucide-react";
import type { MiningArea, DetectionResult } from "@/pages/Dashboard";

interface MapView2DProps {
  area: MiningArea | null;
  detectionResult?: DetectionResult;
}

// Lazy-load the actual map to isolate react-leaflet from the main bundle
const LeafletMap = lazy(() => import("./LeafletMap"));

export default function MapView2D({ area, detectionResult }: MapView2DProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-card">
        <div className="text-center space-y-3">
          <Map className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">Map failed to load</p>
          <button
            onClick={() => setHasError(false)}
            className="text-xs text-primary underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center bg-card">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <MapErrorBoundary onError={() => setHasError(true)}>
        <LeafletMap area={area} detectionResult={detectionResult} />
      </MapErrorBoundary>
    </Suspense>
  );
}

// Minimal error boundary for the map
import * as React from "react";

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
