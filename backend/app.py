from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import bcrypt
import jwt
from functools import wraps
import uuid
import os
from ai_service import AIService
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
mongo = PyMongo(app)
ai_service = AIService()

# JWT token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = mongo.db.users.find_one({'user_id': data['user_id']})
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if mongo.db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 400
    
    # Hash password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user_id = str(uuid.uuid4())
    user = {
        'user_id': user_id,
        'email': data['email'],
        'password': hashed_password,
        'name': data.get('name', ''),
        'created_at': datetime.utcnow(),
        'streak': 0,
        'total_points': 0,
        'preferences': {
            'nudge_frequency': 'medium',
            'work_hours': {'start': '09:00', 'end': '17:00'},
            'break_reminders': True
        }
    }
    
    mongo.db.users.insert_one(user)
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'User created successfully!',
        'token': token,
        'user': {
            'user_id': user_id,
            'email': user['email'],
            'name': user['name'],
            'streak': user['streak'],
            'total_points': user['total_points']
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = mongo.db.users.find_one({'email': data['email']})
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user['user_id'],
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'user_id': user['user_id'],
            'email': user['email'],
            'name': user['name'],
            'streak': user['streak'],
            'total_points': user['total_points']
        }
    })

@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = list(mongo.db.tasks.find({
        'user_id': current_user['user_id'],
        'date': datetime.now().strftime('%Y-%m-%d')
    }))
    
    # Convert ObjectId to string for JSON serialization
    for task in tasks:
        task['_id'] = str(task['_id'])
    
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json()
    
    task = {
        'task_id': str(uuid.uuid4()),
        'user_id': current_user['user_id'],
        'title': data['title'],
        'description': data.get('description', ''),
        'priority': data.get('priority', 'medium'),
        'estimated_duration': data.get('estimated_duration', 30),  # minutes
        'status': 'pending',
        'created_at': datetime.utcnow(),
        'date': datetime.now().strftime('%Y-%m-%d'),
        'micro_steps': data.get('micro_steps', []),
        'points_value': data.get('points_value', 10)
    }
    
    mongo.db.tasks.insert_one(task)
    task['_id'] = str(task['_id'])
    
    return jsonify(task), 201

@app.route('/api/tasks/<task_id>/complete', methods=['POST'])
@token_required
def complete_task(current_user, task_id):
    task = mongo.db.tasks.find_one({
        'task_id': task_id,
        'user_id': current_user['user_id']
    })
    
    if not task:
        return jsonify({'message': 'Task not found!'}), 404
    
    # Update task status
    mongo.db.tasks.update_one(
        {'task_id': task_id},
        {'$set': {'status': 'completed', 'completed_at': datetime.utcnow()}}
    )
    
    # Update user points and streak
    points_earned = task.get('points_value', 10)
    mongo.db.users.update_one(
        {'user_id': current_user['user_id']},
        {'$inc': {'total_points': points_earned}}
    )
    
    # Check for streak update
    update_streak(current_user['user_id'])
    
    # Generate celebration message
    celebration = ai_service.generate_celebration_message(
        task['title'], 
        current_user['streak'] + 1
    )
    
    return jsonify({
        'message': 'Task completed!',
        'points_earned': points_earned,
        'celebration': celebration
    })

@app.route('/api/nudge', methods=['POST'])
@token_required
def get_nudge(current_user):
    # Get user context for personalized nudges
    today_tasks = list(mongo.db.tasks.find({
        'user_id': current_user['user_id'],
        'date': datetime.now().strftime('%Y-%m-%d'),
        'status': 'pending'
    }))
    
    last_activity = mongo.db.activities.find_one(
        {'user_id': current_user['user_id']},
        sort=[('timestamp', -1)]
    )
    
    context = {
        'current_task': today_tasks[0]['title'] if today_tasks else 'No tasks',
        'mood': request.json.get('mood', 'neutral') if request.is_json else 'neutral',
        'streak': current_user['streak'],
        'last_activity': last_activity['activity'] if last_activity else 'None',
        'productivity_level': 'medium'  # Could be calculated from recent activity
    }
    
    nudge = ai_service.generate_micro_nudge(context)
    
    # Log the nudge activity
    activity = {
        'activity_id': str(uuid.uuid4()),
        'user_id': current_user['user_id'],
        'activity': 'nudge_generated',
        'timestamp': datetime.utcnow(),
        'data': {'nudge': nudge}
    }
    mongo.db.activities.insert_one(activity)
    
    return jsonify({'nudge': nudge})

@app.route('/api/daily-digest', methods=['GET'])
@token_required
def get_daily_digest(current_user):
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Get today's data
    completed_tasks = list(mongo.db.tasks.find({
        'user_id': current_user['user_id'],
        'date': today,
        'status': 'completed'
    }))
    
    today_activities = list(mongo.db.activities.find({
        'user_id': current_user['user_id'],
        'timestamp': {'$gte': datetime.now().replace(hour=0, minute=0, second=0)}
    }))
    
    user_data = {
        'completed_tasks': [task['title'] for task in completed_tasks],
        'streak': current_user['streak'],
        'points_earned': sum(task.get('points_value', 10) for task in completed_tasks),
        'mood_trend': 'positive'  # Could be calculated from activities
    }
    
    digest = ai_service.generate_daily_digest(user_data)
    
    return jsonify({'digest': digest})

@app.route('/api/user/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    # Get user statistics
    total_tasks = mongo.db.tasks.count_documents({'user_id': current_user['user_id']})
    completed_tasks = mongo.db.tasks.count_documents({
        'user_id': current_user['user_id'],
        'status': 'completed'
    })
    
    # Get weekly progress
    week_ago = datetime.now() - timedelta(days=7)
    weekly_tasks = mongo.db.tasks.count_documents({
        'user_id': current_user['user_id'],
        'created_at': {'$gte': week_ago}
    })
    
    return jsonify({
        'streak': current_user['streak'],
        'total_points': current_user['total_points'],
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        'weekly_tasks': weekly_tasks
    })

def update_streak(user_id):
    """Update user streak based on daily activity"""
    today = datetime.now().strftime('%Y-%m-%d')
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    # Check if user completed tasks today
    today_completed = mongo.db.tasks.count_documents({
        'user_id': user_id,
        'date': today,
        'status': 'completed'
    })
    
    if today_completed > 0:
        # Check if user had activity yesterday
        yesterday_completed = mongo.db.tasks.count_documents({
            'user_id': user_id,
            'date': yesterday,
            'status': 'completed'
        })
        
        if yesterday_completed > 0:
            # Increment streak
            mongo.db.users.update_one(
                {'user_id': user_id},
                {'$inc': {'streak': 1}}
            )
        else:
            # Reset streak to 1
            mongo.db.users.update_one(
                {'user_id': user_id},
                {'$set': {'streak': 1}}
            )

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
