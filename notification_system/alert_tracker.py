"""Track alerts to prevent duplicates."""
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Optional
from pathlib import Path

class AlertTracker:
    """Tracks sent alerts to prevent duplicates."""
    
    def __init__(self, storage_path: str = "alert_history.json"):
        self.storage_path = Path(storage_path)
        self.alerts: Dict[str, datetime] = {}
        self._load()
    
    def _load(self):
        """Load alert history from file."""
        if self.storage_path.exists():
            try:
                with open(self.storage_path, 'r') as f:
                    data = json.load(f)
                    self.alerts = {
                        k: datetime.fromisoformat(v) 
                        for k, v in data.items()
                    }
            except Exception as e:
                print(f"Error loading alert history: {e}")
                self.alerts = {}
    
    def _save(self):
        """Save alert history to file."""
        try:
            with open(self.storage_path, 'w') as f:
                data = {
                    k: v.isoformat() 
                    for k, v in self.alerts.items()
                }
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving alert history: {e}")
    
    def should_send_alert(self, location: str, cooldown_minutes: int) -> bool:
        """Check if alert should be sent for this location."""
        alert_key = self._get_alert_key(location)
        
        if alert_key not in self.alerts:
            return True
        
        last_alert_time = self.alerts[alert_key]
        time_since_alert = datetime.now() - last_alert_time
        
        return time_since_alert > timedelta(minutes=cooldown_minutes)
    
    def record_alert(self, location: str):
        """Record that an alert was sent."""
        alert_key = self._get_alert_key(location)
        self.alerts[alert_key] = datetime.now()
        self._save()
    
    def _get_alert_key(self, location: str) -> str:
        """Generate unique key for location."""
        return location.strip().lower().replace(" ", "_")
    
    def cleanup_old_alerts(self, days: int = 7):
        """Remove alerts older than specified days."""
        cutoff = datetime.now() - timedelta(days=days)
        self.alerts = {
            k: v for k, v in self.alerts.items() 
            if v > cutoff
        }
        self._save()
