import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # MongoDB Configuration
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/micro_motivation_db')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    
    # App Configuration
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # AI Configuration
    AI_MODEL = 'gpt-3.5-turbo'
    MAX_TOKENS = 150
    TEMPERATURE = 0.7
