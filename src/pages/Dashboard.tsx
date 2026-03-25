import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import UploadPanel from "@/components/dashboard/UploadPanel";
import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
import MapView2D from "@/components/dashboard/MapView2D";
import MapView3D from "@/components/dashboard/MapView3D";
import TimelineSlider from "@/components/dashboard/TimelineSlider";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import StatsCards from "@/components/dashboard/StatsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Box, Loader2 } from "lucide-react";

export interface MiningArea {
  id: string;
  name: string;
  description?: string;
  center_lat: number;
  center_lng: number;
  zoom_level: number;
}

export interface DetectionResult {
  id: string;
  mining_area_id: string;
  detection_date: string;
  detected_boundaries: any;
  total_detected_area: number;
  legal_area: number;
  illegal_area: number;
  illegal_zones: any[];
  confidence_score: number;
  processing_status: string;
}

export interface ProcessingJob {
  id: string;
  status: string;
  current_step: string;
  progress: number;
  steps_completed: string[];
}

export interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedArea, setSelectedArea] = useState<MiningArea | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [processingJob, setProcessingJob] = useState<ProcessingJob | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const currentResult = detectionResults.find(
    (r) => r.detection_date === selectedDate
  ) || detectionResults[detectionResults.length - 1];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          alerts={alerts}
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Overview */}
              <StatsCards 
                detectionResult={currentResult}
                processingJob={processingJob}
              />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                {/* Left Column - Upload & Processing */}
                <div className="space-y-6">
                  <UploadPanel 
                    selectedArea={selectedArea}
                    onAreaCreated={setSelectedArea}
                    onProcessingStart={setProcessingJob}
                    onDetectionComplete={(results) => {
                      setDetectionResults(results);
                      if (results.length > 0) {
                        setSelectedDate(results[results.length - 1].detection_date);
                      }
                    }}
                    onAlertCreated={(alert) => setAlerts(prev => [alert, ...prev])}
                  />
                  
                  <ProcessingStatus job={processingJob} />
                </div>

                {/* Center Column - Map Visualization */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "2d" | "3d")}>
                      <TabsList className="bg-secondary/50">
                        <TabsTrigger value="2d" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Map className="w-4 h-4 mr-2" />
                          2D Map
                        </TabsTrigger>
                        <TabsTrigger value="3d" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Box className="w-4 h-4 mr-2" />
                          3D Terrain
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="h-[500px] rounded-lg overflow-hidden border border-border bg-card">
                    {viewMode === "2d" ? (
                      <MapView2D 
                        area={selectedArea}
                        detectionResult={currentResult}
                      />
                    ) : (
                      <MapView3D 
                        area={selectedArea}
                        detectionResult={currentResult}
                      />
                    )}
                  </div>

                  {/* Timeline Slider */}
                  {detectionResults.length > 0 && (
                    <TimelineSlider
                      results={detectionResults}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                    />
                  )}
                </div>
              </div>

              {/* Alerts Panel */}
              <AlertsPanel 
                alerts={alerts}
                onMarkRead={(id) => {
                  setAlerts(prev => 
                    prev.map(a => a.id === id ? { ...a, is_read: true } : a)
                  );
                }}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
