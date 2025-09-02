#!/bin/bash

echo "🚀 Starting AI Micro-Motivation Assistant..."

# Check if .env file exists
if [ ! -f backend/.env ]; then
    echo "❌ Environment file not found!"
    echo "Please copy backend/env_example.txt to backend/.env and add your OpenAI API key."
    exit 1
fi

# Start MongoDB (if not running)
if ! pgrep -x "mongod" > /dev/null; then
    echo "🔄 Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    else
        echo "⚠️  Please start MongoDB manually"
    fi
fi

# Start backend
echo "🔄 Starting backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🔄 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 AI Micro-Motivation Assistant is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait
