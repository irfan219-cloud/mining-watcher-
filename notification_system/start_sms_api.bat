@echo off
echo ============================================================
echo Starting Mining Alert SMS Bridge API
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Checking dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting SMS API server...
echo The API will run on http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

python bridge_api.py

pause
