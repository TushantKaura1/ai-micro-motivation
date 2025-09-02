from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
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

# Default user ID for single-user app
DEFAULT_USER_ID = "default_user_123"

# Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(mongo.db.tasks.find({
        'user_id': DEFAULT_USER_ID,
        'date': datetime.now().strftime('%Y-%m-%d')
    }))
    
    # Convert ObjectId to string for JSON serialization
    for task in tasks:
        task['_id'] = str(task['_id'])
    
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    task = {
        'task_id': str(uuid.uuid4()),
        'user_id': DEFAULT_USER_ID,
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
def complete_task(task_id):
    task = mongo.db.tasks.find_one({
        'task_id': task_id,
        'user_id': DEFAULT_USER_ID
    })
    
    if not task:
        return jsonify({'message': 'Task not found!'}), 404
    
    # Update task status
    mongo.db.tasks.update_one(
        {'task_id': task_id},
        {'$set': {'status': 'completed', 'completed_at': datetime.utcnow()}}
    )
    
    # Update user stats
    points_earned = task.get('points_value', 10)
    user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    if not user_stats:
        user_stats = {
            'user_id': DEFAULT_USER_ID,
            'total_points': 0,
            'streak': 0,
            'total_tasks': 0,
            'completed_tasks': 0
        }
        mongo.db.user_stats.insert_one(user_stats)
    
    # Update stats
    mongo.db.user_stats.update_one(
        {'user_id': DEFAULT_USER_ID},
        {'$inc': {
            'total_points': points_earned,
            'completed_tasks': 1
        }}
    )
    
    # Check for streak update
    update_streak()
    
    # Get updated stats for celebration
    updated_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    
    # Generate celebration message
    celebration = ai_service.generate_celebration_message(
        task['title'], 
        updated_stats.get('streak', 0)
    )
    
    return jsonify({
        'message': 'Task completed!',
        'points_earned': points_earned,
        'celebration': celebration
    })

@app.route('/api/nudge', methods=['POST'])
def get_nudge():
    # Get user context for personalized nudges
    today_tasks = list(mongo.db.tasks.find({
        'user_id': DEFAULT_USER_ID,
        'date': datetime.now().strftime('%Y-%m-%d'),
        'status': 'pending'
    }))
    
    last_activity = mongo.db.activities.find_one(
        {'user_id': DEFAULT_USER_ID},
        sort=[('timestamp', -1)]
    )
    
    user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    if not user_stats:
        user_stats = {'streak': 0, 'total_points': 0}
    
    context = {
        'current_task': today_tasks[0]['title'] if today_tasks else 'No tasks',
        'mood': request.json.get('mood', 'neutral') if request.is_json else 'neutral',
        'streak': user_stats.get('streak', 0),
        'last_activity': last_activity['activity'] if last_activity else 'None',
        'productivity_level': 'medium'  # Could be calculated from recent activity
    }
    
    nudge = ai_service.generate_micro_nudge(context)
    
    # Log the nudge activity
    activity = {
        'activity_id': str(uuid.uuid4()),
        'user_id': DEFAULT_USER_ID,
        'activity': 'nudge_generated',
        'timestamp': datetime.utcnow(),
        'data': {'nudge': nudge}
    }
    mongo.db.activities.insert_one(activity)
    
    return jsonify({'nudge': nudge})

@app.route('/api/daily-digest', methods=['GET'])
def get_daily_digest():
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Get today's data
    completed_tasks = list(mongo.db.tasks.find({
        'user_id': DEFAULT_USER_ID,
        'date': today,
        'status': 'completed'
    }))
    
    today_activities = list(mongo.db.activities.find({
        'user_id': DEFAULT_USER_ID,
        'timestamp': {'$gte': datetime.now().replace(hour=0, minute=0, second=0)}
    }))
    
    user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    if not user_stats:
        user_stats = {'streak': 0, 'total_points': 0}
    
    user_data = {
        'completed_tasks': [task['title'] for task in completed_tasks],
        'streak': user_stats.get('streak', 0),
        'points_earned': sum(task.get('points_value', 10) for task in completed_tasks),
        'mood_trend': 'positive'  # Could be calculated from activities
    }
    
    digest = ai_service.generate_daily_digest(user_data)
    
    return jsonify({'digest': digest})

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    # Get user statistics
    user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    if not user_stats:
        user_stats = {
            'user_id': DEFAULT_USER_ID,
            'total_points': 0,
            'streak': 0,
            'total_tasks': 0,
            'completed_tasks': 0
        }
        mongo.db.user_stats.insert_one(user_stats)
    
    total_tasks = mongo.db.tasks.count_documents({'user_id': DEFAULT_USER_ID})
    completed_tasks = mongo.db.tasks.count_documents({
        'user_id': DEFAULT_USER_ID,
        'status': 'completed'
    })
    
    # Get weekly progress
    week_ago = datetime.now() - timedelta(days=7)
    weekly_tasks = mongo.db.tasks.count_documents({
        'user_id': DEFAULT_USER_ID,
        'created_at': {'$gte': week_ago}
    })
    
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    return jsonify({
        'streak': user_stats.get('streak', 0),
        'total_points': user_stats.get('total_points', 0),
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'completion_rate': completion_rate,
        'weekly_tasks': weekly_tasks
    })

def update_streak():
    """Update user streak based on daily activity"""
    today = datetime.now().strftime('%Y-%m-%d')
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    # Check if user completed tasks today
    today_completed = mongo.db.tasks.count_documents({
        'user_id': DEFAULT_USER_ID,
        'date': today,
        'status': 'completed'
    })
    
    if today_completed > 0:
        # Check if user had activity yesterday
        yesterday_completed = mongo.db.tasks.count_documents({
            'user_id': DEFAULT_USER_ID,
            'date': yesterday,
            'status': 'completed'
        })
        
        user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
        if not user_stats:
            user_stats = {'user_id': DEFAULT_USER_ID, 'streak': 0}
            mongo.db.user_stats.insert_one(user_stats)
        
        if yesterday_completed > 0:
            # Increment streak
            mongo.db.user_stats.update_one(
                {'user_id': DEFAULT_USER_ID},
                {'$inc': {'streak': 1}}
            )
        else:
            # Reset streak to 1
            mongo.db.user_stats.update_one(
                {'user_id': DEFAULT_USER_ID},
                {'$set': {'streak': 1}}
            )

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'AI Micro-Motivation Assistant is running!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
