import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, Scan } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DetectionResult, ProcessingJob } from "@/pages/Dashboard";

interface StatsCardsProps {
  detectionResult?: DetectionResult;
  processingJob: ProcessingJob | null;
}

export default function StatsCards({ detectionResult, processingJob }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Detected Area",
      value: detectionResult?.total_detected_area 
        ? `${detectionResult.total_detected_area.toFixed(1)} km²` 
        : "—",
      icon: Scan,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Legal Mining Area",
      value: detectionResult?.legal_area 
        ? `${detectionResult.legal_area.toFixed(1)} km²` 
        : "—",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Illegal Mining Area",
      value: detectionResult?.illegal_area 
        ? `${detectionResult.illegal_area.toFixed(1)} km²` 
        : "—",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      highlight: (detectionResult?.illegal_area || 0) > 0,
    },
    {
      label: "Detection Confidence",
      value: detectionResult?.confidence_score 
        ? `${(detectionResult.confidence_score * 100).toFixed(0)}%` 
        : "—",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`glass border-border/50 ${stat.highlight ? 'glow-danger' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold font-mono ${stat.highlight ? 'text-destructive' : ''}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
