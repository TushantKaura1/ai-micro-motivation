# 👥 Team Setup Guide

## For efop77392@gmail.com and Team

### 1. GitHub Repository Setup

#### Create Repository
1. Go to [GitHub](https://github.com)
2. Sign in with efop77392@gmail.com
3. Click "New repository"
4. Name: `ai-micro-motivation`
5. Make it **Public** (for free Netlify deployment)
6. Initialize with README

#### Add Team Members
1. Go to repository → Settings → Manage access
2. Click "Invite a collaborator"
3. Add team member emails
4. Set permissions:
   - **Admin**: Full access (efop77392@gmail.com)
   - **Write**: Can push code and manage issues
   - **Read**: Can view and clone

### 2. Netlify Deployment

#### Deploy Frontend
1. Go to [Netlify](https://netlify.com)
2. Sign in with GitHub account
3. Click "New site from Git"
4. Choose "GitHub" and authorize
5. Select your repository
6. Configure build settings:
   ```
   Build command: cd frontend && npm run build
   Publish directory: frontend/build
   ```
7. Click "Deploy site"

#### Set Environment Variables
1. Go to Site settings → Environment variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.herokuapp.com/api`
3. Redeploy site

### 3. Backend Deployment (Heroku)

#### Create Heroku App
1. Go to [Heroku](https://heroku.com)
2. Sign in with efop77392@gmail.com
3. Click "New" → "Create new app"
4. App name: `ai-micro-motivation-backend`
5. Choose region
6. Click "Create app"

#### Connect GitHub
1. Go to Deploy tab
2. Choose "GitHub" as deployment method
3. Connect your repository
4. Enable automatic deploys from main branch

#### Set Environment Variables
1. Go to Settings tab
2. Click "Reveal Config Vars"
3. Add these variables:
   ```
   OPENAI_API_KEY = your_openai_api_key
   MONGODB_URI = your_mongodb_connection_string
   FLASK_SECRET_KEY = random_secret_key
   JWT_SECRET_KEY = random_jwt_secret
   ```

#### Deploy
1. Go to Deploy tab
2. Click "Deploy branch"
3. Wait for deployment to complete

### 4. MongoDB Setup (MongoDB Atlas)

#### Create Free Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up with efop77392@gmail.com
3. Create a free cluster (M0 Sandbox)
4. Choose region closest to your users
5. Create database user
6. Whitelist IP addresses (0.0.0.0/0 for all)

#### Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password
5. Use this as `MONGODB_URI` in Heroku

### 5. Team Access Setup

#### Netlify Team
1. Go to your Netlify site
2. Site settings → Members
3. Invite team members by email
4. Set roles:
   - **Owner**: Full control (efop77392@gmail.com)
   - **Admin**: Can manage site settings
   - **Editor**: Can manage content

#### Heroku Team
1. Go to your Heroku app
2. Access tab → Add team member
3. Enter email addresses
4. Set permissions:
   - **Owner**: Full access (efop77392@gmail.com)
   - **Admin**: Can manage app settings
   - **Collaborator**: Can view logs and deploy

### 6. OpenAI API Key Setup

#### Get API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in with efop77392@gmail.com
3. Go to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

#### Add to Heroku
1. Go to Heroku app settings
2. Add `OPENAI_API_KEY` with your key value

### 7. Testing Deployment

#### Test Frontend
1. Visit your Netlify URL
2. Try user registration
3. Test task creation
4. Test AI nudges

#### Test Backend
1. Check Heroku logs: `heroku logs --tail`
2. Test API endpoints directly
3. Verify database connections

### 8. Domain Setup (Optional)

#### Custom Domain
1. In Netlify: Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. Enable HTTPS

### 9. Monitoring & Analytics

#### Netlify Analytics
1. Enable Netlify Analytics in site settings
2. Monitor site performance
3. Track user visits

#### Heroku Monitoring
1. Use Heroku metrics dashboard
2. Monitor app performance
3. Set up alerts for errors

### 10. Team Communication

#### GitHub Issues
1. Create issues for bugs and features
2. Assign to team members
3. Use labels and milestones

#### Project Management
1. Use GitHub Projects for task tracking
2. Create boards for different phases
3. Assign tasks to team members

## Quick Start Commands

```bash
# Clone repository
git clone https://github.com/efop77392/ai-micro-motivation.git
cd ai-micro-motivation

# Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Run locally
cd backend && python app.py
cd frontend && npm start

# Deploy
./deploy.sh
```

## Support & Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Local Setup**: See `README.md`

## Team Roles

### efop77392@gmail.com (Owner)
- Full access to all services
- Manages environment variables
- Handles production deployments
- Manages team permissions

### Team Members
- Can push code to GitHub
- Can view deployment logs
- Can manage issues and features
- Can test and provide feedback
