import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, Check, Mail, Phone, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { Alert } from "@/pages/Dashboard";

interface AlertsPanelProps {
  alerts: Alert[];
  onMarkRead: (id: string) => void;
}

export default function AlertsPanel({ alerts, onMarkRead }: AlertsPanelProps) {
  const unreadCount = alerts.filter(a => !a.is_read).length;

  if (alerts.length === 0) {
    return (
      <Card className="glass border-border/50 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">
              No alerts at this time. System is monitoring for illegal activities.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50 mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alerts & Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "p-4 rounded-lg border transition-all",
                !alert.is_read
                  ? "bg-destructive/10 border-destructive/50 glow-danger"
                  : "bg-secondary/50 border-border"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    alert.severity === "critical"
                      ? "bg-destructive text-destructive-foreground"
                      : alert.severity === "high"
                      ? "bg-destructive/80 text-destructive-foreground"
                      : "bg-warning text-warning-foreground"
                  )}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          alert.severity === "critical" && "border-destructive text-destructive",
                          alert.severity === "high" && "border-destructive/70 text-destructive",
                        )}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {format(parseISO(alert.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email sent
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          SMS sent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {!alert.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 flex-shrink-0 hover:bg-success/20 hover:text-success"
                    onClick={() => onMarkRead(alert.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Notification Settings Note */}
        <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-dashed border-border">
          <p className="text-xs text-muted-foreground text-center">
            📱 Notifications are simulated for this prototype. In production, alerts would be sent to registered mobile numbers and email addresses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
