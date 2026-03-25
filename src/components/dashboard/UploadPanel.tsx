import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image, MapPin, Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { MiningArea, DetectionResult, ProcessingJob, Alert } from "@/pages/Dashboard";

interface UploadPanelProps {
  selectedArea: MiningArea | null;
  onAreaCreated: (area: MiningArea) => void;
  onProcessingStart: (job: ProcessingJob) => void;
  onDetectionComplete: (results: DetectionResult[]) => void;
  onAlertCreated: (alert: Alert) => void;
}

export default function UploadPanel({ 
  selectedArea, 
  onAreaCreated, 
  onProcessingStart,
  onDetectionComplete,
  onAlertCreated
}: UploadPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setUploadedFile(file);
      toast({
        title: "Image uploaded",
        description: `${file.name} ready for processing`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (satellite imagery)",
        variant: "destructive",
      });
    }
  };

  const simulateProcessing = async () => {
    if (!user || !uploadedFile || !areaName) return;

    setProcessing(true);

    // Create mining area
    const { data: area, error: areaError } = await supabase
      .from("mining_areas")
      .insert({
        user_id: user.id,
        name: areaName,
        description: `Satellite analysis for ${locationName || areaName}`,
        location_name: locationName,
        center_lat: -23.5505 + (Math.random() - 0.5) * 10,
        center_lng: -46.6333 + (Math.random() - 0.5) * 10,
        zoom_level: 12,
      })
      .select()
      .single();

    if (areaError) {
      toast({
        title: "Error",
        description: "Failed to create mining area",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    onAreaCreated(area);

    // Simulate processing steps
    const steps = [
      { step: "data_intake", label: "Data Intake", duration: 1500 },
      { step: "preprocessing", label: "Pre-processing", duration: 2000 },
      { step: "geospatial_analysis", label: "Geospatial Analysis", duration: 2500 },
      { step: "boundary_detection", label: "Boundary Detection", duration: 2000 },
      { step: "comparison", label: "Legal Boundary Comparison", duration: 1500 },
      { step: "report_generation", label: "Report Generation", duration: 1000 },
    ];

    const job: ProcessingJob = {
      id: crypto.randomUUID(),
      status: "processing",
      current_step: "data_intake",
      progress: 0,
      steps_completed: [],
    };

    onProcessingStart(job);

    let completedSteps: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      completedSteps = [...completedSteps, steps[i].step];
      
      onProcessingStart({
        ...job,
        current_step: steps[i + 1]?.step || "complete",
        progress: Math.round(((i + 1) / steps.length) * 100),
        steps_completed: completedSteps,
        status: i === steps.length - 1 ? "completed" : "processing",
      });
    }

    // Generate mock detection results for multiple dates
    const dates = [
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),  // 3 months ago
      new Date(),                                         // Today
    ];

    const results: DetectionResult[] = [];
    for (const date of dates) {
      const totalArea = 45 + Math.random() * 30;
      const legalArea = totalArea * (0.5 + Math.random() * 0.3);
      const illegalArea = totalArea - legalArea;

      const result: DetectionResult = {
        id: crypto.randomUUID(),
        mining_area_id: area.id,
        detection_date: date.toISOString().split("T")[0],
        detected_boundaries: generateMockBoundaries(area.center_lat, area.center_lng),
        total_detected_area: totalArea,
        legal_area: legalArea,
        illegal_area: illegalArea,
        illegal_zones: generateIllegalZones(area.center_lat, area.center_lng, illegalArea),
        confidence_score: 0.85 + Math.random() * 0.1,
        processing_status: "completed",
      };

      // Save to database
      await supabase.from("detection_results").insert({
        mining_area_id: result.mining_area_id,
        detection_date: result.detection_date,
        detected_boundaries: result.detected_boundaries,
        total_detected_area: result.total_detected_area,
        legal_area: result.legal_area,
        illegal_area: result.illegal_area,
        illegal_zones: result.illegal_zones,
        confidence_score: result.confidence_score,
        processing_status: result.processing_status,
      });

      results.push(result);
    }

    onDetectionComplete(results);

    // Check for illegal mining and create alert
    const latestResult = results[results.length - 1];
    if (latestResult.illegal_area > 0) {
      const alert: Alert = {
        id: crypto.randomUUID(),
        alert_type: "illegal_mining",
        severity: latestResult.illegal_area > 10 ? "critical" : "high",
        title: "⚠️ Illegal Mining Activity Detected",
        message: `Detected ${latestResult.illegal_area.toFixed(1)} km² of unauthorized mining activity in ${areaName}. ${latestResult.illegal_zones?.length || 0} illegal zones identified. SMS and email notifications have been simulated.`,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Save alert to database
      await supabase.from("alerts").insert({
        user_id: user.id,
        mining_area_id: area.id,
        alert_type: alert.alert_type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        location_description: locationName || areaName,
        email_sent: true,
        sms_sent: true,
      });

      onAlertCreated(alert);

      toast({
        title: "🚨 Alert: Illegal Mining Detected",
        description: `${latestResult.illegal_area.toFixed(1)} km² of unauthorized activity found`,
        variant: "destructive",
      });
    }

    setProcessing(false);
    setUploadedFile(null);
    setAreaName("");
    setLocationName("");

    toast({
      title: "Analysis Complete",
      description: "Mining detection results are ready for review",
    });
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Upload & Analyze
        </CardTitle>
        <CardDescription>
          Upload satellite imagery for mining detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
            dragActive 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
            uploadedFile && "border-success bg-success/10"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploadedFile ? (
            <div className="space-y-2">
              <Image className="w-10 h-10 mx-auto text-success" />
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">Click to change file</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop satellite imagery or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPEG, PNG, TIFF formats
              </p>
            </div>
          )}
        </div>

        {/* Area Details */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="areaName">Area Name</Label>
            <Input
              id="areaName"
              placeholder="e.g., Amazon Region Sector 7"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationName">Location Description</Label>
            <Input
              id="locationName"
              placeholder="e.g., Northern Brazil"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
        </div>

        {/* Process Button */}
        <Button
          className="w-full"
          disabled={!uploadedFile || !areaName || processing}
          onClick={simulateProcessing}
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Mock data generators
function generateMockBoundaries(centerLat: number, centerLng: number) {
  const boundaries = [];
  const numBoundaries = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numBoundaries; i++) {
    const offset = 0.05 + Math.random() * 0.1;
    boundaries.push({
      type: "Polygon",
      coordinates: [[
        [centerLng - offset, centerLat - offset],
        [centerLng + offset, centerLat - offset],
        [centerLng + offset, centerLat + offset],
        [centerLng - offset, centerLat + offset],
        [centerLng - offset, centerLat - offset],
      ]],
    });
  }
  
  return boundaries;
}

function generateIllegalZones(centerLat: number, centerLng: number, area: number) {
  const zones = [];
  const numZones = Math.ceil(area / 5);
  
  for (let i = 0; i < numZones; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.2;
    const offsetLng = (Math.random() - 0.5) * 0.2;
    
    zones.push({
      id: `illegal-${i}`,
      center: [centerLat + offsetLat, centerLng + offsetLng],
      area: 1 + Math.random() * 4,
      severity: Math.random() > 0.5 ? "high" : "medium",
    });
  }
  
  return zones;
}
