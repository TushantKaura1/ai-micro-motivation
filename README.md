# 🚀 AI Micro-Motivation & Focus Assistant

**Tagline:** "Your personal AI coach that keeps you moving, one micro-step at a time."

## 🎯 The Problem
People struggle with focus, productivity, and consistency. Existing tools are boring and people stop using them. Mental health apps are too generic and repetitive.

## 💡 The Solution
An AI Assistant that "lives with you" and keeps you focused, nudged, and rewarded throughout the day through:
- **Micro-Nudges**: Breaks your day into small doable steps with conversational check-ins
- **Gamified Motivation**: Streaks, progress points, and micro-celebrations
- **Adaptive Personality**: Learns your patterns and tailors nudges
- **Daily Digest**: AI-made "story" of your day every evening

## 🏗️ Tech Stack
- **Frontend**: React (mobile-first web app)
- **Backend**: Flask with MongoDB
- **AI**: GPT integration for conversational nudges
- **Gamification**: Points + streak system
- **Notifications**: Push notifications with personalized messages

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- OpenAI API Key

### Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Configure your environment:**
   - Copy `backend/env_example.txt` to `backend/.env`
   - Add your OpenAI API key to the `.env` file
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. **Start the application:**
   ```bash
   ./start.sh
   ```

### Manual Setup

1. **Backend Setup:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env_example.txt .env
   # Edit .env with your OpenAI API key
   python app.py
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Start MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

## 🎮 Features
- [x] **User Authentication** - Secure login/register with JWT tokens
- [x] **Task Management** - Create, track, and complete micro-tasks
- [x] **AI-Powered Nudges** - Personalized motivation messages using ChatGPT
- [x] **Gamification System** - Points, streaks, and achievement badges
- [x] **Daily Digest** - AI-generated daily summaries
- [x] **Mobile-Responsive UI** - Beautiful, modern interface that works on all devices
- [x] **Real-time Stats** - Track your progress and productivity
- [ ] **Push Notifications** - Coming soon!

## 🎯 How It Works

### 1. **Micro-Nudges**
- AI analyzes your current mood and tasks
- Generates personalized, encouraging messages
- Adapts to your productivity patterns

### 2. **Gamification**
- Earn points for completing tasks
- Build daily streaks for consistency
- Unlock achievement badges
- Visual progress tracking

### 3. **Smart Task Management**
- Break large goals into micro-steps
- Set priorities and time estimates
- Track completion rates
- Celebrate achievements

### 4. **Daily Digest**
- AI-generated summary of your day
- Celebrates wins and progress
- Motivates for tomorrow's success

## 🔮 Future Features
- Voice-first mode
- Predictive focus analysis
- Spotify integration
- Notion/Google Docs integration
