import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { DetectionResult } from "@/pages/Dashboard";

interface TimelineSliderProps {
  results: DetectionResult[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function TimelineSlider({ results, selectedDate, onDateSelect }: TimelineSliderProps) {
  const sortedResults = [...results].sort(
    (a, b) => new Date(a.detection_date).getTime() - new Date(b.detection_date).getTime()
  );

  const currentIndex = sortedResults.findIndex(r => r.detection_date === selectedDate);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onDateSelect(sortedResults[currentIndex - 1].detection_date);
    }
  };

  const goToNext = () => {
    if (currentIndex < sortedResults.length - 1) {
      onDateSelect(sortedResults[currentIndex + 1].detection_date);
    }
  };

  const selectedResult = sortedResults.find(r => r.detection_date === selectedDate);

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Timeline Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              disabled={currentIndex <= 0}
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              disabled={currentIndex >= sortedResults.length - 1}
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="relative">
          {/* Track line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          {/* Date points */}
          <div className="flex justify-between relative">
            {sortedResults.map((result, index) => {
              const isSelected = result.detection_date === selectedDate;
              const hasIllegalActivity = result.illegal_area > 0;

              return (
                <motion.button
                  key={result.id}
                  className="relative flex flex-col items-center"
                  onClick={() => onDateSelect(result.detection_date)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Point */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all z-10",
                      isSelected
                        ? "bg-primary border-primary scale-125"
                        : hasIllegalActivity
                        ? "bg-destructive/20 border-destructive"
                        : "bg-secondary border-border hover:border-primary"
                    )}
                  />
                  
                  {/* Date label */}
                  <span
                    className={cn(
                      "mt-2 text-xs whitespace-nowrap",
                      isSelected ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {format(parseISO(result.detection_date), "MMM d, yyyy")}
                  </span>

                  {/* Illegal indicator */}
                  {hasIllegalActivity && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected date stats */}
        {selectedResult && (
          <motion.div
            key={selectedResult.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 rounded-lg bg-secondary/50 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Area</p>
              <p className="text-sm font-mono font-bold">
                {selectedResult.total_detected_area.toFixed(1)} km²
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Legal</p>
              <p className="text-sm font-mono font-bold text-accent">
                {selectedResult.legal_area.toFixed(1)} km²
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Illegal</p>
              <p className={cn(
                "text-sm font-mono font-bold",
                selectedResult.illegal_area > 0 ? "text-destructive" : "text-success"
              )}>
                {selectedResult.illegal_area.toFixed(1)} km²
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
