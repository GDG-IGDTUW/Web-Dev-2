#!/bin/bash

# PixelPro - Backend Install Script
# This script installs dependencies for the backend server

echo "=========================================="
echo "🎨 PixelPro Backend Installation"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the server/ directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Backend installation complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Copy environment variables:"
    echo "   cp .env.example .env"
    echo ""
    echo "2. Start the server:"
    echo "   npm run dev"
    echo ""
    echo "3. Test the server:"
    echo "   curl http://localhost:3001/api/health"
    echo ""
else
    echo ""
    echo "❌ Installation failed"
    echo "Please check the error messages above"
    exit 1
fi
