@echo off
REM Quick Start Script for Nibi Birthday App
echo.
echo 🎂 Starting Nibi Birthday App...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo ✅ Everything is ready!
echo.
echo To start the app, run these commands in separate terminals:
echo.
echo Terminal 1 - Backend Server:
echo   npm run server
echo.
echo Terminal 2 - Frontend App:
echo   npm run dev
echo.
echo Then open: http://localhost:5173/
echo.
pause
