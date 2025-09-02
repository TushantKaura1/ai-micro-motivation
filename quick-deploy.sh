#!/bin/bash

echo "🚀 Quick Deploy Script for AI Micro-Motivation Assistant"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: AI Micro-Motivation Assistant"
    echo "✅ Git repository initialized"
    echo ""
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Setting up GitHub remote..."
    echo "Please run these commands:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Name: ai-micro-motivation"
    echo "   - Make it Public"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Add the remote:"
    echo "   git remote add origin https://github.com/efop77392/ai-micro-motivation.git"
    echo ""
    echo "3. Run this script again"
    exit 1
fi

echo "📤 Pushing code to GitHub..."
git add .
git commit -m "Deploy: AI Micro-Motivation Assistant v1.0 - Ready for production"
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps for Deployment:"
echo ""
echo "1. 🎨 DEPLOY FRONTEND TO NETLIFY:"
echo "   - Go to https://netlify.com"
echo "   - Sign in with GitHub"
echo "   - Click 'New site from Git'"
echo "   - Select your repository"
echo "   - Build command: cd frontend && npm run build"
echo "   - Publish directory: frontend/build"
echo "   - Add environment variable:"
echo "     REACT_APP_API_URL = https://your-backend-url.herokuapp.com/api"
echo ""
echo "2. ⚙️ DEPLOY BACKEND TO HEROKU:"
echo "   - Go to https://heroku.com"
echo "   - Create new app: ai-micro-motivation-backend"
echo "   - Connect GitHub repository"
echo "   - Set environment variables:"
echo "     OPENAI_API_KEY = your_openai_api_key"
echo "     MONGODB_URI = your_mongodb_connection_string"
echo "     FLASK_SECRET_KEY = random_secret_key"
echo "     JWT_SECRET_KEY = random_jwt_secret"
echo ""
echo "3. 🗄️ SETUP MONGODB:"
echo "   - Go to https://cloud.mongodb.com"
echo "   - Create free cluster"
echo "   - Get connection string"
echo "   - Add to Heroku environment variables"
echo ""
echo "4. 🔑 GET OPENAI API KEY:"
echo "   - Go to https://platform.openai.com/api-keys"
echo "   - Create new secret key"
echo "   - Add to Heroku environment variables"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - TEAM_SETUP.md"
echo ""
echo "🎉 Your AI Micro-Motivation Assistant is ready to deploy!"
