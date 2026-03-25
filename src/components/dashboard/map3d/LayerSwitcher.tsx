import { useState, useEffect, useCallback } from "react";
import { Layers, Satellite, Map, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type MapLayer = "osm" | "satellite" | "terrain";

interface LayerConfig {
  id: MapLayer;
  label: string;
  icon: React.ReactNode;
  url: string;
  attribution: string;
}

export const MAP_LAYERS: LayerConfig[] = [
  {
    id: "osm",
    label: "OpenStreetMap",
    icon: <Map className="w-4 h-4" />,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  {
    id: "satellite",
    label: "Satellite",
    icon: <Satellite className="w-4 h-4" />,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    id: "terrain",
    label: "Terrain",
    icon: <Mountain className="w-4 h-4" />,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
];

const STORAGE_KEY = "mining-dashboard-map-layer";

export function useMapLayer() {
  const [layer, setLayerState] = useState<MapLayer>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ["osm", "satellite", "terrain"].includes(saved)) {
        return saved as MapLayer;
      }
    }
    return "osm";
  });

  const setLayer = useCallback((newLayer: MapLayer) => {
    setLayerState(newLayer);
    localStorage.setItem(STORAGE_KEY, newLayer);
  }, []);

  return { layer, setLayer };
}

export function LayerSwitcher({
  layer,
  onLayerChange,
}: {
  layer: MapLayer;
  onLayerChange: (layer: MapLayer) => void;
}) {
  const currentLayer = MAP_LAYERS.find((l) => l.id === layer) || MAP_LAYERS[0];

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-2">
            <Layers className="w-4 h-4" />
            {currentLayer.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {MAP_LAYERS.map((l) => (
            <DropdownMenuItem
              key={l.id}
              onClick={() => onLayerChange(l.id)}
              className={layer === l.id ? "bg-accent" : ""}
            >
              <span className="mr-2">{l.icon}</span>
              {l.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
