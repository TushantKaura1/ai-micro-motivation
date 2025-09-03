import openai
from config import Config

# Set up OpenAI
openai.api_key = Config.OPENAI_API_KEY

def test_ai():
    try:
        print("Testing AI integration with your API key...")
        print(f"API Key: {Config.OPENAI_API_KEY[:20]}...")
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive AI coach."},
                {"role": "user", "content": "Generate a short motivational message for someone working on their tasks."}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        message = response.choices[0].message.content.strip()
        print("✅ AI Integration Working!")
        print(f"Generated message: {message}")
        return True
        
    except Exception as e:
        print(f"❌ AI Integration Failed: {e}")
        return False

if __name__ == "__main__":
    test_ai()
