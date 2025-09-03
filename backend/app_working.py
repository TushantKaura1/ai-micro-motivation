from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import uuid
import os
import openai
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
mongo = PyMongo(app)

# Initialize OpenAI with your API key
openai.api_key = Config.OPENAI_API_KEY

# Default user ID for single-user app
DEFAULT_USER_ID = "default_user_123"

def generate_ai_nudge(user_context):
    """Generate AI-powered nudge using ChatGPT with fallback"""
    try:
        prompt = f"""
        You are a supportive AI coach that helps people stay focused and motivated. 
        Generate a gentle, encouraging nudge to help them take the next small step.
        
        Context:
        - Current task: {user_context.get('current_task', 'No specific task')}
        - User mood: {user_context.get('mood', 'neutral')}
        - Streak: {user_context.get('streak', 0)} days
        - Last activity: {user_context.get('last_activity', 'None')}
        
        Keep the response under 100 words, make it personal and encouraging.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive AI coach that helps people stay focused and motivated. You provide gentle, encouraging nudges to help users take small steps toward their goals. Keep responses under 100 words and make them feel personal and conversational."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback motivational messages
        fallback_messages = [
            "Hey there! Ready to tackle your next micro-step? You've got this! 💪",
            "Time for a quick win! What's one small thing you can do right now? ⚡",
            "Your future self will thank you for taking action today! Let's go! 🚀",
            "Every expert was once a beginner. Every pro was once an amateur. Keep going! 🌟",
            "Success is the sum of small efforts repeated day in and day out. You're doing great! 💯"
        ]
        import random
        return random.choice(fallback_messages)

def generate_ai_celebration(achievement, streak_count):
    """Generate AI-powered celebration message with fallback"""
    try:
        prompt = f"Generate a short, enthusiastic celebration message for someone who just achieved: {achievement}. They have a {streak_count}-day streak. Make it feel exciting and motivating!"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an enthusiastic AI coach that celebrates user achievements. Create short, exciting celebration messages with emojis that make users feel proud and motivated to continue."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.9
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI Error: {e}")
        return f"🎉 Amazing work! You completed '{achievement}' and you're on fire with that {streak_count}-day streak! Keep it up! 🔥"

def generate_ai_digest(user_data):
    """Generate AI-powered daily digest with fallback"""
    try:
        prompt = f"""
        Create a daily digest story for a user with:
        - Completed tasks: {', '.join(user_data.get('completed_tasks', [])) if user_data.get('completed_tasks') else 'None'}
        - Current streak: {user_data.get('streak', 0)} days
        - Points earned today: {user_data.get('points_earned', 0)}
        - Mood trend: {user_data.get('mood_trend', 'stable')}
        
        Write an encouraging, story-like summary of their day that celebrates their progress and motivates them for tomorrow.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a friendly AI that creates engaging daily digest stories. Write a short, encouraging narrative about the user's day, highlighting their achievements and progress. Make it feel like a personal journal entry that celebrates their wins."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.8
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI Error: {e}")
        completed_count = len(user_data.get('completed_tasks', []))
        points = user_data.get('points_earned', 0)
        streak = user_data.get('streak', 0)
        return f"Today was another step forward in your journey! You completed {completed_count} tasks and earned {points} points. Your {streak}-day streak is building momentum. Keep going! 🌟"

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
    
    # Generate AI celebration message
    celebration = generate_ai_celebration(
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
        'productivity_level': 'medium'
    }
    
    # Generate AI nudge
    nudge = generate_ai_nudge(context)
    
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
    
    user_stats = mongo.db.user_stats.find_one({'user_id': DEFAULT_USER_ID})
    if not user_stats:
        user_stats = {'streak': 0, 'total_points': 0}
    
    user_data = {
        'completed_tasks': [task['title'] for task in completed_tasks],
        'streak': user_stats.get('streak', 0),
        'points_earned': sum(task.get('points_value', 10) for task in completed_tasks),
        'mood_trend': 'positive'
    }
    
    # Generate AI digest
    digest = generate_ai_digest(user_data)
    
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
    return jsonify({'status': 'healthy', 'message': 'AI Micro-Motivation Assistant is running with ChatGPT integration!'})

@app.route('/api/test-ai', methods=['GET'])
def test_ai():
    """Test endpoint to verify AI integration"""
    try:
        test_nudge = generate_ai_nudge({
            'current_task': 'Test task',
            'mood': 'positive',
            'streak': 5,
            'last_activity': 'Testing AI'
        })
        return jsonify({
            'status': 'success',
            'message': 'AI integration working!',
            'test_nudge': test_nudge
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'AI integration failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
