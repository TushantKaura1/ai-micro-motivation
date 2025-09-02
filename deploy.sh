#!/bin/bash

echo "🚀 Deploying AI Micro-Motivation Assistant..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: AI Micro-Motivation Assistant"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/efop77392/ai-micro-motivation.git"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: AI Micro-Motivation Assistant v1.0"
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://netlify.com and sign in"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub repository"
echo "4. Set build command: cd frontend && npm run build"
echo "5. Set publish directory: frontend/build"
echo "6. Add environment variable: REACT_APP_API_URL = https://your-backend-url.herokuapp.com/api"
echo ""
echo "🔧 For backend deployment:"
echo "1. Go to https://heroku.com and create a new app"
echo "2. Connect your GitHub repository"
echo "3. Set environment variables (see DEPLOYMENT_GUIDE.md)"
echo "4. Deploy!"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
