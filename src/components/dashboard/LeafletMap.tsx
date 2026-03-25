import { useEffect, memo } from "react";
import { MapContainer, TileLayer, Polygon, Circle, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MiningArea, DetectionResult } from "@/pages/Dashboard";
import { LayerSwitcher, useMapLayer, MAP_LAYERS } from "./map3d/LayerSwitcher";

interface LeafletMapProps {
  area: MiningArea | null;
  detectionResult?: DetectionResult;
}

function MapUpdater({ area }: { area: MiningArea | null }) {
  const map = useMap();

  useEffect(() => {
    if (area) {
      map.setView([area.center_lat, area.center_lng], area.zoom_level);
    }
  }, [area, map]);

  return null;
}

// Component to handle tile layer changes
function TileLayerWithSwitch({ layerId }: { layerId: string }) {
  const map = useMap();
  const config = MAP_LAYERS.find((l) => l.id === layerId) || MAP_LAYERS[0];

  useEffect(() => {
    // Force map to redraw when layer changes
    map.invalidateSize();
  }, [layerId, map]);

  return (
    <TileLayer
      key={layerId}
      attribution={config.attribution}
      url={config.url}
      className={layerId === "osm" ? "grayscale" : ""}
    />
  );
}

function LeafletMap({ area, detectionResult }: LeafletMapProps) {
  const { layer, setLayer } = useMapLayer();
  const defaultCenter: LatLngExpression = area 
    ? [area.center_lat, area.center_lng] 
    : [-23.5505, -46.6333]; // Default to São Paulo

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={area?.zoom_level || 10}
        className="h-full w-full"
        style={{ background: "hsl(var(--card))" }}
      >
        <TileLayerWithSwitch layerId={layer} />
        
        <MapUpdater area={area} />

        {/* Detected Mining Boundaries (Legal - Cyan) */}
        {detectionResult?.detected_boundaries?.map((boundary: any, index: number) => {
          const positions = boundary.coordinates?.[0]?.map(
            (coord: number[]) => [coord[1], coord[0]] as LatLngExpression
          );
          
          if (!positions) return null;

          return (
            <Polygon
              key={`legal-${index}`}
              positions={positions}
              pathOptions={{
                color: "#0891b2",
                fillColor: "#0891b2",
                fillOpacity: 0.2,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-cyan-600">Legal Mining Zone</p>
                  <p className="text-gray-600">Licensed mining area</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Illegal Mining Zones (Red) */}
        {detectionResult?.illegal_zones?.map((zone: any, index: number) => (
          <Circle
            key={`illegal-${index}`}
            center={zone.center as LatLngExpression}
            radius={Math.sqrt(zone.area) * 500}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#dc2626",
              fillOpacity: 0.4,
              weight: 3,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-red-600">⚠️ Illegal Mining Detected</p>
                <p className="text-gray-600">Area: {zone.area.toFixed(2)} km²</p>
                <p className="text-gray-600">Severity: {zone.severity}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Area Center Marker */}
        {area && (
          <Circle
            center={[area.center_lat, area.center_lng]}
            radius={200}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-amber-600">{area.name}</p>
                <p className="text-gray-600">Analysis Center Point</p>
              </div>
            </Popup>
          </Circle>
        )}
      </MapContainer>

      {/* Layer Switcher */}
      <LayerSwitcher layer={layer} onLayerChange={setLayer} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border z-[1000]">
        <p className="text-xs font-semibold mb-2">Legend</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/50 border border-cyan-500" />
            <span>Legal Mining Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
            <span>Illegal Mining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500" />
            <span>Analysis Center</span>
          </div>
        </div>
      </div>

      {/* No Data Overlay */}
      {!area && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-[1000]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-muted-foreground">Upload satellite imagery to visualize mining areas</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LeafletMap);
