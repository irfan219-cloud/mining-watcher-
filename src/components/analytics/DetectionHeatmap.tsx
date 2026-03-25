import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";

const heatmapData = [
  { x: 12.34, y: 78.90, detections: 25, severity: "high" },
  { x: 12.45, y: 78.85, detections: 18, severity: "high" },
  { x: 12.38, y: 78.95, detections: 12, severity: "medium" },
  { x: 12.42, y: 78.88, detections: 8, severity: "medium" },
  { x: 12.36, y: 78.92, detections: 5, severity: "low" },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#22c55e";
    default: return "#3b82f6";
  }
};

export default function DetectionHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Detection Heatmap</CardTitle>
        <CardDescription>Detection intensity by coordinates</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="Latitude" />
            <YAxis type="number" dataKey="y" name="Longitude" />
            <ZAxis type="number" dataKey="detections" range={[100, 1000]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={heatmapData} fill="#8884d8">
              {heatmapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
