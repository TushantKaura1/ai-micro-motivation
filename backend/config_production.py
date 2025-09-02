import os
from dotenv import load_dotenv

load_dotenv()

class ProductionConfig:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # MongoDB Configuration
    MONGODB_URI = os.getenv('MONGODB_URI')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # App Configuration
    DEBUG = False
    
    # AI Configuration
    AI_MODEL = 'gpt-3.5-turbo'
    MAX_TOKENS = 150
    TEMPERATURE = 0.7
    
    # CORS Configuration
    CORS_ORIGINS = [
        'https://your-netlify-site.netlify.app',
        'https://ai-micro-motivation.netlify.app',
        'http://localhost:3000'  # For development
    ]
