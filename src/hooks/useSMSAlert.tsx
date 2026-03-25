/**
 * React Hook for SMS Alert Integration
 * Connects React frontend with Python SMS notification system
 */
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

const SMS_API_URL = import.meta.env.VITE_SMS_API_URL || 'http://localhost:5001';

interface DetectionData {
  confidence: number;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp?: string;
  detectionId?: string;
  imageUrl?: string;
}

interface SMSAlertResult {
  success: boolean;
  alert_sent: boolean;
  recipients?: string[];
  confidence: number;
  location: string;
  error?: string;
}

interface AlertHistory {
  timestamp: string;
  detection: DetectionData;
  alert_result: {
    success: boolean;
    delivered: string[];
    failed: string[];
    total_sent: number;
  };
}

export const useSMSAlert = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const { toast } = useToast();

  /**
   * Send SMS alert for detected mining activity
   */
  const sendAlert = useCallback(async (detection: DetectionData): Promise<SMSAlertResult> => {
    setLoading(true);
    
    try {
      const response = await fetch(`${SMS_API_URL}/api/sms/send-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detection),
      });

      const result = await response.json();

      if (result.success && result.alert_sent) {
        toast({
          title: "SMS Alert Sent",
          description: `Alert sent to ${result.recipients?.length || 0} recipient(s)`,
          variant: "default",
        });
      } else if (result.success && !result.alert_sent) {
        toast({
          title: "Alert Not Sent",
          description: "Confidence below threshold or duplicate alert",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      console.error('SMS Alert Error:', error);
      toast({
        title: "SMS Alert Failed",
        description: "Could not send SMS alert. Check if SMS API is running.",
        variant: "destructive",
      });
      
      return {
        success: false,
        alert_sent: false,
        confidence: detection.confidence,
        location: detection.location,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Get SMS alert history
   */
  const getHistory = useCallback(async (limit: number = 50) => {
    try {
      const response = await fetch(`${SMS_API_URL}/api/sms/history?limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        setHistory(result.alerts);
        return result.alerts;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch SMS history:', error);
      return [];
    }
  }, []);

  /**
   * Send test SMS
   */
  const sendTestSMS = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${SMS_API_URL}/api/sms/test`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Test SMS Sent",
          description: "Check your phone for the test message",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test SMS",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Get SMS configuration
   */
  const getConfig = useCallback(async () => {
    try {
      const response = await fetch(`${SMS_API_URL}/api/sms/config`);
      const result = await response.json();
      return result.success ? result.config : null;
    } catch (error) {
      console.error('Failed to fetch SMS config:', error);
      return null;
    }
  }, []);

  /**
   * Check if SMS API is available
   */
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${SMS_API_URL}/api/health`);
      const result = await response.json();
      return result.status === 'healthy';
    } catch (error) {
      return false;
    }
  }, []);

  return {
    sendAlert,
    getHistory,
    sendTestSMS,
    getConfig,
    checkHealth,
    loading,
    history,
  };
};
