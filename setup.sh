#!/bin/bash

echo "🚀 Setting up AI Micro-Motivation Assistant..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB and start the service."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
fi

echo "📦 Setting up backend dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "📦 Setting up frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Creating environment file..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file. Please add your OpenAI API key and other configurations."
else
    echo "⚠️  .env file already exists. Skipping creation."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Start MongoDB service"
echo "3. Run the backend: cd backend && source venv/bin/activate && python app.py"
echo "4. Run the frontend: cd frontend && npm start"
echo ""
echo "🌐 The app will be available at http://localhost:3000"
echo ""
echo "💡 Don't forget to:"
echo "   - Get your OpenAI API key from https://platform.openai.com/api-keys"
echo "   - Start MongoDB: brew services start mongodb-community (on macOS)"
echo "   - Or: sudo systemctl start mongod (on Linux)"
