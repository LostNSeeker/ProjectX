#!/bin/bash

# Installation script for JobFormAutoFiller Chrome Extension

echo "🚀 Installing JobFormAutoFiller Chrome Extension..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "🔨 Building extension..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build extension."
    exit 1
fi

echo "✅ Extension built successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder from this directory"
echo "5. The extension should now appear in your extensions list"
echo ""
echo "🎉 Installation complete! Happy job hunting!"
