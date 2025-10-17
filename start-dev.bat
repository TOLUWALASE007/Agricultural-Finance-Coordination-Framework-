@echo off
echo Starting AFCF Development Environment...
echo.

echo [1/3] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Frontend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend dependency installation failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Starting Development Servers...
echo Starting Frontend on http://localhost:3000
echo Starting Backend on http://localhost:5000
echo.

start "AFCF Frontend" cmd /k "cd /d %~dp0 && npm start"
timeout /t 3 /nobreak > nul
start "AFCF Backend" cmd /k "cd /d %~dp0\backend && npm run dev"

echo.
echo Development servers are starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul
