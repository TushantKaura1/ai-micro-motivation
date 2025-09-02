import openai
from config import Config
import json
from datetime import datetime
from typing import Dict, List, Optional

class AIService:
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
    
    def generate_micro_nudge(self, user_context: Dict) -> str:
        """
        Generate a personalized micro-nudge based on user context
        """
        prompt = self._build_nudge_prompt(user_context)
        
        try:
            response = self.client.chat.completions.create(
                model=Config.AI_MODEL,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a supportive AI coach that helps people stay focused and motivated. You provide gentle, encouraging nudges to help users take small steps toward their goals. Keep responses under 100 words and make them feel personal and conversational."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=Config.MAX_TOKENS,
                temperature=Config.TEMPERATURE
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Hey there! Ready to tackle your next micro-step? You've got this! 💪"
    
    def generate_daily_digest(self, user_data: Dict) -> str:
        """
        Generate a personalized daily digest story
        """
        prompt = self._build_digest_prompt(user_data)
        
        try:
            response = self.client.chat.completions.create(
                model=Config.AI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a friendly AI that creates engaging daily digest stories. Write a short, encouraging narrative about the user's day, highlighting their achievements and progress. Make it feel like a personal journal entry that celebrates their wins."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return "Today was another step forward in your journey! Every small action counts. Keep going! 🌟"
    
    def generate_celebration_message(self, achievement: str, streak_count: int) -> str:
        """
        Generate a celebration message for achievements
        """
        prompt = f"Generate a short, enthusiastic celebration message for someone who just achieved: {achievement}. They have a {streak_count}-day streak. Make it feel exciting and motivating!"
        
        try:
            response = self.client.chat.completions.create(
                model=Config.AI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an enthusiastic AI coach that celebrates user achievements. Create short, exciting celebration messages with emojis that make users feel proud and motivated to continue."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=100,
                temperature=0.9
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"🎉 Amazing work! You're on fire with that {streak_count}-day streak! Keep it up! 🔥"
    
    def _build_nudge_prompt(self, context: Dict) -> str:
        """Build context-aware prompt for nudges"""
        current_time = datetime.now().strftime("%H:%M")
        day_of_week = datetime.now().strftime("%A")
        
        prompt = f"""
        Current time: {current_time} on {day_of_week}
        User's current task: {context.get('current_task', 'No specific task')}
        User's mood: {context.get('mood', 'neutral')}
        Streak: {context.get('streak', 0)} days
        Last activity: {context.get('last_activity', 'None')}
        Productivity level: {context.get('productivity_level', 'medium')}
        
        Generate a gentle, encouraging nudge to help them take the next small step. Consider their current context and time of day.
        """
        
        return prompt
    
    def _build_digest_prompt(self, user_data: Dict) -> str:
        """Build prompt for daily digest"""
        completed_tasks = user_data.get('completed_tasks', [])
        streak = user_data.get('streak', 0)
        points_earned = user_data.get('points_earned', 0)
        mood_trend = user_data.get('mood_trend', 'stable')
        
        prompt = f"""
        Create a daily digest story for a user with:
        - Completed tasks: {', '.join(completed_tasks) if completed_tasks else 'None'}
        - Current streak: {streak} days
        - Points earned today: {points_earned}
        - Mood trend: {mood_trend}
        
        Write an encouraging, story-like summary of their day that celebrates their progress and motivates them for tomorrow.
        """
        
        return prompt
    
    def analyze_mood_from_text(self, text: str) -> str:
        """
        Analyze mood from user input text
        """
        prompt = f"""
        Analyze the mood/emotion in this text: "{text}"
        
        Respond with just one word: positive, negative, or neutral
        """
        
        try:
            response = self.client.chat.completions.create(
                model=Config.AI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a mood analyzer. Respond with only one word: positive, negative, or neutral."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=10,
                temperature=0.1
            )
            
            mood = response.choices[0].message.content.strip().lower()
            return mood if mood in ['positive', 'negative', 'neutral'] else 'neutral'
        except Exception as e:
            return 'neutral'
