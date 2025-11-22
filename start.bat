@echo off
REM Startup script for Durga Group Website Backend (Windows)

echo 🚀 Starting Durga Group Backend Server...

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file. Please edit it with your settings.
        echo 📧 Don't forget to configure your email settings!
    ) else (
        echo ❌ .env.example not found. Please create .env manually.
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
)

REM Create necessary directories
if not exist uploads mkdir uploads
if not exist logs mkdir logs

REM Start server
echo ✅ Starting server...
call npm start

pause

