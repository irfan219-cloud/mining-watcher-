import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, MapPin, Calendar, Activity } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import DetectionHeatmap from "@/components/analytics/DetectionHeatmap";
import AlertPerformance from "@/components/analytics/AlertPerformance";

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedArea, setSelectedArea] = useState(null);

  // Sample data - replace with real data from your backend
  const detectionTrends = [
    { date: "Week 1", detections: 12, illegal: 8, legal: 4 },
    { date: "Week 2", detections: 18, illegal: 14, legal: 4 },
    { date: "Week 3", detections: 15, illegal: 10, legal: 5 },
    { date: "Week 4", detections: 22, illegal: 18, legal: 4 },
  ];

  const areaDistribution = [
    { name: "Illegal Mining", value: 450, color: "#ef4444" },
    { name: "Legal Mining", value: 180, color: "#22c55e" },
    { name: "Monitored Area", value: 1200, color: "#3b82f6" },
  ];

  const confidenceData = [
    { range: "90-100%", count: 45 },
    { range: "80-90%", count: 32 },
    { range: "70-80%", count: 18 },
    { range: "60-70%", count: 8 },
  ];

  const locationHotspots = [
    { location: "Forest Zone A", detections: 28, severity: "high" },
    { location: "Protected Area B", detections: 19, severity: "high" },
    { location: "Sector C", detections: 15, severity: "medium" },
    { location: "Region D", detections: 8, severity: "low" },
  ];

  const alertStats = [
    { month: "Jan", sms: 45, email: 48, total: 93 },
    { month: "Feb", sms: 52, email: 55, total: 107 },
    { month: "Mar", sms: 38, email: 40, total: 78 },
  ];

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
          alerts={[]}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Comprehensive mining detection analysis and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Detections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">103</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Illegal Mining</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">67</div>
                  <div className="flex items-center text-sm text-red-600 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+8% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alerts Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">278</div>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <Activity className="w-4 h-4 mr-1" />
                    <span>SMS + Email combined</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">87.5%</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>High accuracy</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="trends" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trends">Detection Trends</TabsTrigger>
                <TabsTrigger value="distribution">Area Distribution</TabsTrigger>
                <TabsTrigger value="alerts">Alert Analytics</TabsTrigger>
                <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
              </TabsList>

              {/* Detection Trends */}
              <TabsContent value="trends" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detection Trends Over Time</CardTitle>
                      <CardDescription>Weekly detection patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={detectionTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="illegal" stackId="1" stroke="#ef4444" fill="#ef4444" name="Illegal" />
                          <Area type="monotone" dataKey="legal" stackId="1" stroke="#22c55e" fill="#22c55e" name="Legal" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Confidence Score Distribution</CardTitle>
                      <CardDescription>Detection accuracy breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={confidenceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Area Distribution */}
              <TabsContent value="distribution" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mining Area Distribution</CardTitle>
                      <CardDescription>Total area breakdown (hectares)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={areaDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {areaDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Area Statistics</CardTitle>
                      <CardDescription>Detailed breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {areaDistribution.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-2xl font-bold">{item.value} ha</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Alert Analytics */}
              <TabsContent value="alerts" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alert Delivery Statistics</CardTitle>
                      <CardDescription>SMS and Email alert performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={alertStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sms" stroke="#8b5cf6" strokeWidth={2} name="SMS Alerts" />
                          <Line type="monotone" dataKey="email" stroke="#3b82f6" strokeWidth={2} name="Email Alerts" />
                          <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total Alerts" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <AlertPerformance />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">SMS Delivery Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">98.5%</div>
                      <p className="text-sm text-muted-foreground mt-1">135 of 137 delivered</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Email Delivery Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">99.2%</div>
                      <p className="text-sm text-muted-foreground mt-1">143 of 144 delivered</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Avg Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">2.3s</div>
                      <p className="text-sm text-muted-foreground mt-1">Alert to delivery</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Hotspots */}
              <TabsContent value="hotspots" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detection Hotspots</CardTitle>
                    <CardDescription>Areas with highest illegal mining activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {locationHotspots.map((spot, index) => (
                        <div key={spot.location} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{spot.location}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{spot.detections} detections</span>
                            </div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              spot.severity === "high" ? "bg-red-100 text-red-700" :
                              spot.severity === "medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {spot.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Detection Comparison</CardTitle>
                      <CardDescription>Year-over-year analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[
                          { month: "Jan", current: 67, previous: 52 },
                          { month: "Feb", current: 78, previous: 61 },
                          { month: "Mar", current: 103, previous: 89 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="current" fill="#3b82f6" name="2026" />
                          <Bar dataKey="previous" fill="#94a3b8" name="2025" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detection by Time of Day</CardTitle>
                      <CardDescription>Activity patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={[
                          { time: "00-06", count: 5 },
                          { time: "06-12", count: 28 },
                          { time: "12-18", count: 45 },
                          { time: "18-24", count: 25 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
