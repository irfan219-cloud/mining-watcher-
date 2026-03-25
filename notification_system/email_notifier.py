"""Email notification via Gmail SMTP."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from datetime import datetime

class EmailNotifier:
    """Send email alerts via Gmail SMTP."""
    
    def __init__(self, smtp_server: str, smtp_port: int, 
                 sender_email: str, sender_password: str):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password
    
    def send_alert(self, recipients: List[str], location: str, 
                   detection_time: datetime) -> bool:
        """Send mining alert email."""
        if not recipients or not self.sender_email or not self.sender_password:
            print("Email configuration incomplete")
            return False
        
        subject = "⚠️ ILLEGAL MINING ACTIVITY DETECTED"
        body = self._create_email_body(location, detection_time)
        
        try:
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = ", ".join(recipients)
            message["Subject"] = subject
            message.attach(MIMEText(body, "html"))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"Email sent to {len(recipients)} recipient(s)")
            return True
            
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def _create_email_body(self, location: str, detection_time: datetime) -> str:
        """Create HTML email body."""
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #d32f2f;">⚠️ Illegal Mining Activity Detected</h2>
                <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">
                    <p><strong>Location:</strong> {location}</p>
                    <p><strong>Detection Time:</strong> {detection_time.strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
                <p style="margin-top: 20px;">
                    Immediate action is required. Please verify and respond accordingly.
                </p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">
                    This is an automated alert from the Mining Watcher System.
                </p>
            </body>
        </html>
        """
