import { motion } from "framer-motion";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ProcessingJob } from "@/pages/Dashboard";

interface ProcessingStatusProps {
  job: ProcessingJob | null;
}

const PROCESSING_STEPS = [
  { id: "data_intake", label: "Data Intake", description: "Receiving satellite imagery" },
  { id: "preprocessing", label: "Pre-processing", description: "Image enhancement & calibration" },
  { id: "geospatial_analysis", label: "Geospatial Analysis", description: "Coordinate mapping & projection" },
  { id: "boundary_detection", label: "Boundary Detection", description: "AI-powered mining area detection" },
  { id: "comparison", label: "Legal Comparison", description: "Comparing with approved boundaries" },
  { id: "report_generation", label: "Report Generation", description: "Generating analysis report" },
];

export default function ProcessingStatus({ job }: ProcessingStatusProps) {
  if (!job) {
    return (
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Processing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
              <Circle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No active processing job. Upload imagery to begin.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStepIndex = PROCESSING_STEPS.findIndex(s => s.id === job.current_step);

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Processing Status</CardTitle>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            job.status === "completed" 
              ? "bg-success/20 text-success" 
              : job.status === "processing"
              ? "bg-processing/20 text-processing"
              : "bg-muted text-muted-foreground"
          )}>
            {job.status === "completed" ? "Complete" : job.status === "processing" ? "Processing" : "Queued"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-mono font-bold text-primary">{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-2" />
        </div>

        {/* Step List */}
        <div className="space-y-2">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted = job.steps_completed.includes(step.id);
            const isCurrent = step.id === job.current_step && job.status === "processing";
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  isCurrent && "bg-processing/10",
                  isCompleted && "bg-success/5"
                )}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-processing animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    isCompleted && "text-success",
                    isCurrent && "text-processing",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
