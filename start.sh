#!/bin/bash
# Startup script for Durga Group Website Backend

echo "🚀 Starting Durga Group Backend Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please edit it with your settings."
        echo "📧 Don't forget to configure your email settings!"
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create necessary directories
mkdir -p uploads logs

# Start server
echo "✅ Starting server..."
npm start

