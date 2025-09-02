# 🚀 Deployment Guide

## Deploy to Netlify (Frontend)

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Micro-Motivation Assistant"
   git branch -M main
   git remote add origin https://github.com/efop77392/ai-micro-motivation.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Sign in with your GitHub account
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - **Build command:** `cd frontend && npm run build`
     - **Publish directory:** `frontend/build`
     - **Node version:** 18

3. **Set Environment Variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.herokuapp.com/api`

### Option 2: Manual Deploy

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `frontend/build` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=frontend/build`

## Deploy Backend to Heroku

### 1. Prepare Backend for Heroku

```bash
cd backend
```

### 2. Create Heroku App

```bash
# Install Heroku CLI first: https://devcenter.heroku.com/articles/heroku-cli
heroku login
heroku create ai-micro-motivation-backend
```

### 3. Configure Heroku

Create `backend/Procfile`:
```
web: gunicorn app:app
```

Update `backend/requirements.txt`:
```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-PyMongo==2.3.0
pymongo==4.5.0
python-dotenv==1.0.0
openai==1.3.0
requests==2.31.0
datetime
uuid
bcrypt==4.0.1
PyJWT==2.8.0
gunicorn==21.2.0
```

### 4. Set Environment Variables

```bash
heroku config:set OPENAI_API_KEY=your_openai_api_key
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set FLASK_SECRET_KEY=your_secret_key
heroku config:set JWT_SECRET_KEY=your_jwt_secret_key
```

### 5. Deploy to Heroku

```bash
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

## Alternative Backend Deployment (Railway)

### 1. Create Railway Account
- Go to [Railway](https://railway.app)
- Sign up with GitHub

### 2. Deploy Backend
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Select your repository
- Railway will auto-detect Python and deploy

### 3. Set Environment Variables
- Go to your project settings
- Add all environment variables from `backend/env_example.txt`

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in your deployment

### Option 2: Railway MongoDB
1. Add MongoDB service in Railway
2. Use the provided connection string

## Complete Deployment Steps

### 1. Backend Deployment
```bash
# Choose one backend option above
# Get your backend URL (e.g., https://ai-micro-motivation-backend.herokuapp.com)
```

### 2. Update Frontend Configuration
```bash
# Update netlify.toml with your actual backend URL
# Update frontend/.env.production with your backend URL
```

### 3. Deploy Frontend
```bash
# Push to GitHub and connect to Netlify
# Or build and deploy manually
```

### 4. Test Deployment
- Visit your Netlify URL
- Test user registration/login
- Test task creation and AI nudges

## Environment Variables Summary

### Backend (Heroku/Railway)
- `OPENAI_API_KEY` - Your OpenAI API key
- `MONGODB_URI` - MongoDB connection string
- `FLASK_SECRET_KEY` - Random secret key
- `JWT_SECRET_KEY` - Random JWT secret

### Frontend (Netlify)
- `REACT_APP_API_URL` - Your backend URL + `/api`

## Troubleshooting

### Common Issues:
1. **CORS errors:** Make sure backend URL is correct in frontend
2. **API not found:** Check backend deployment and environment variables
3. **Build failures:** Check Node.js version and dependencies

### Support:
- Check deployment logs in Netlify/Heroku
- Verify environment variables are set correctly
- Test API endpoints directly

## Team Access

### Netlify Team Setup:
1. Go to your Netlify site settings
2. Click "Members" tab
3. Invite team members by email
4. Set appropriate permissions

### GitHub Team Setup:
1. Go to your GitHub repository
2. Settings → Manage access
3. Invite collaborators
4. Set team permissions
