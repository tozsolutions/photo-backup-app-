#!/bin/bash

# PhotoBackup Deployment Script
echo "🚀 Starting PhotoBackup deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run type checking
echo "🔧 Running type checking..."
npm run typecheck

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build statistics:"
    du -sh dist/
    echo "📁 Files in dist:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

# If Netlify CLI is available, deploy
if command -v netlify &> /dev/null; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
else
    echo "ℹ️  Netlify CLI not found. Upload the 'dist' folder manually or connect to Git."
fi

echo "🎉 Deployment process completed!"
echo "📱 Your PWA is ready to be used!"