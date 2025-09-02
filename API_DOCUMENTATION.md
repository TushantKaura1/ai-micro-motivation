# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully!",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "user_id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "streak": 0,
    "total_points": 0
  }
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful!",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "user_id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "streak": 5,
    "total_points": 150
  }
}
```

### Tasks

#### Get Today's Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "object_id",
    "task_id": "uuid",
    "user_id": "uuid",
    "title": "Write blog post",
    "description": "Write about AI productivity tools",
    "priority": "high",
    "estimated_duration": 60,
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z",
    "date": "2024-01-15",
    "points_value": 20
  }
]
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Write blog post",
  "description": "Write about AI productivity tools",
  "priority": "high",
  "estimated_duration": 60,
  "points_value": 20
}
```

**Response:**
```json
{
  "_id": "object_id",
  "task_id": "uuid",
  "user_id": "uuid",
  "title": "Write blog post",
  "description": "Write about AI productivity tools",
  "priority": "high",
  "estimated_duration": 60,
  "status": "pending",
  "created_at": "2024-01-15T10:00:00Z",
  "date": "2024-01-15",
  "points_value": 20
}
```

#### Complete Task
```http
POST /tasks/{task_id}/complete
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Task completed!",
  "points_earned": 20,
  "celebration": "🎉 Amazing work! You're on fire with that 6-day streak! Keep it up! 🔥"
}
```

### AI Features

#### Get Motivation Nudge
```http
POST /nudge
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "neutral"
}
```

**Response:**
```json
{
  "nudge": "Hey there! Ready to tackle your next micro-step? You've got this! 💪"
}
```

#### Get Daily Digest
```http
GET /daily-digest
Authorization: Bearer <token>
```

**Response:**
```json
{
  "digest": "Today was another step forward in your journey! You completed 3 tasks and earned 50 points. Your consistency is building momentum. Keep going! 🌟"
}
```

### User Statistics

#### Get User Stats
```http
GET /user/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "streak": 5,
  "total_points": 150,
  "total_tasks": 25,
  "completed_tasks": 20,
  "completion_rate": 80.0,
  "weekly_tasks": 8
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists!"
}
```

### 401 Unauthorized
```json
{
  "message": "Token is missing!"
}
```

### 404 Not Found
```json
{
  "message": "Task not found!"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to get nudge"
}
```

## Data Models

### User
```json
{
  "user_id": "string (UUID)",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "created_at": "datetime",
  "streak": "integer",
  "total_points": "integer",
  "preferences": {
    "nudge_frequency": "string",
    "work_hours": {
      "start": "string",
      "end": "string"
    },
    "break_reminders": "boolean"
  }
}
```

### Task
```json
{
  "task_id": "string (UUID)",
  "user_id": "string (UUID)",
  "title": "string",
  "description": "string",
  "priority": "string (low|medium|high)",
  "estimated_duration": "integer (minutes)",
  "status": "string (pending|completed)",
  "created_at": "datetime",
  "completed_at": "datetime",
  "date": "string (YYYY-MM-DD)",
  "points_value": "integer"
}
```

### Activity
```json
{
  "activity_id": "string (UUID)",
  "user_id": "string (UUID)",
  "activity": "string",
  "timestamp": "datetime",
  "data": "object"
}
```

## Rate Limiting
- No rate limiting currently implemented
- Consider implementing for production use

## CORS
- CORS is enabled for all origins in development
- Configure for specific domains in production
