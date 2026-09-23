@echo off
title VersoLyn Native Host Companion Agent
color 0A
cd /d "%~dp0"

echo ========================================================
echo   VersoLyn Native Host Companion Agent
echo   OS-Level Remote Mouse & Keyboard Driver
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org to run the agent.
    pause
    exit /b 1
)

:: Check dependencies
if not exist "node_modules\ws" (
    echo [INFO] Installing required websocket dependency (ws)...
    call npm install ws --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo [INFO] Starting Host Agent on ws://127.0.0.1:48123...
node server.mjs
pause
