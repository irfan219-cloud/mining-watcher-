import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AlertPerformance() {
  const metrics = [
    {
      label: "SMS Delivery Rate",
      value: 98.5,
      delivered: 135,
      total: 137,
      icon: CheckCircle2,
      color: "text-green-600"
    },
    {
      label: "Email Delivery Rate",
      value: 99.2,
      delivered: 143,
      total: 144,
      icon: CheckCircle2,
      color: "text-blue-600"
    },
    {
      label: "Failed Alerts",
      value: 1.5,
      delivered: 3,
      total: 281,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      label: "Avg Response Time",
      value: 2.3,
      delivered: 0,
      total: 0,
      icon: Clock,
      color: "text-purple-600",
      unit: "seconds"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Performance Metrics</CardTitle>
        <CardDescription>Real-time notification delivery statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {metric.value}{metric.unit || "%"}
                  </span>
                </div>
                {metric.total > 0 && (
                  <>
                    <Progress value={metric.value} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {metric.delivered} of {metric.total} {metric.label.includes("Failed") ? "failed" : "delivered"}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
