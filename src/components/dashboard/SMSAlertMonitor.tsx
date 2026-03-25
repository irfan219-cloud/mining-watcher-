/**
 * SMS Alert Monitoring Dashboard Component
 * Shows alert history and allows testing
 */
import { useEffect, useState } from 'react';
import { useSMSAlert } from '@/hooks/useSMSAlert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

export const SMSAlertMonitor = () => {
  const { getHistory, sendTestSMS, getConfig, checkHealth, loading, history } = useSMSAlert();
  const [config, setConfig] = useState<any>(null);
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [historyData, configData, health] = await Promise.all([
      getHistory(10),
      getConfig(),
      checkHealth(),
    ]);
    
    setConfig(configData);
    setIsHealthy(health);
  };

  const handleTestSMS = async () => {
    await sendTestSMS();
    await loadData();
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                SMS Alert System
              </CardTitle>
              <CardDescription>Real-time notification status</CardDescription>
            </div>
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Min Confidence</p>
              <p className="text-2xl font-bold">
                {config ? `${(config.min_confidence * 100).toFixed(0)}%` : '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Recipients</p>
              <p className="text-2xl font-bold">
                {config?.recipients_count || '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cooldown</p>
              <p className="text-2xl font-bold">
                {config ? `${config.alert_cooldown_minutes}m` : '-'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleTestSMS} 
            disabled={loading || !isHealthy}
            className="w-full mt-4"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Test SMS
          </Button>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Last 10 SMS notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No alerts sent yet
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="mt-1">
                    {alert.alert_result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {alert.detection.location}
                      </p>
                      <Badge variant="outline">
                        {(alert.detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                    
                    {alert.alert_result.delivered.length > 0 && (
                      <p className="text-sm text-green-600">
                        Sent to {alert.alert_result.delivered.length} recipient(s)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
