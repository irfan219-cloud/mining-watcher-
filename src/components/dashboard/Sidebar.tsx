import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MapPin, Plus, Trash2, Folder, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { MiningArea } from "@/pages/Dashboard";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedArea: MiningArea | null;
  onSelectArea: (area: MiningArea | null) => void;
}

export default function Sidebar({ isOpen, onToggle, selectedArea, onSelectArea }: SidebarProps) {
  const { user } = useAuth();
  const [areas, setAreas] = useState<MiningArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAreas();
    }
  }, [user]);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("mining_areas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from("mining_areas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setAreas(prev => prev.filter(a => a.id !== id));
      if (selectedArea?.id === id) {
        onSelectArea(null);
      }
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-r border-border bg-sidebar h-screen overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <h2 className="font-semibold text-sidebar-foreground flex items-center gap-2">
              <Folder className="w-4 h-4 text-primary" />
              Mining Areas
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-8 h-8 hover:bg-sidebar-accent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : areas.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No mining areas yet. Upload satellite imagery to create one.
                  </p>
                </div>
              ) : (
                areas.map((area) => (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "group p-3 rounded-lg cursor-pointer transition-all",
                      "hover:bg-sidebar-accent",
                      selectedArea?.id === area.id 
                        ? "bg-sidebar-accent border border-primary/50" 
                        : "border border-transparent"
                    )}
                    onClick={() => onSelectArea(area)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                          selectedArea?.id === area.id 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary text-muted-foreground"
                        )}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate text-sidebar-foreground">
                            {area.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {area.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteArea(area.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              {areas.length} area{areas.length !== 1 ? "s" : ""} monitored
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
