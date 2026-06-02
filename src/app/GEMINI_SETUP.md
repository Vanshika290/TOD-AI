# Gemini AI Integration Guide

## 🎯 What's Integrated

Your Tod AI app now has **Gemini AI** integrated into:

1. **AI Doubt Clearing** - Ask any question and get intelligent answers
2. **Quiz Generator** - Generate quizzes from any text content

## 🔑 How to Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

## ⚙️ How to Add Your API Key

### Method 1: Through the UI (Recommended)
1. Click on **"AI Doubt Clearing"** or **"Quiz Generator"** from the dashboard
2. Click the **Settings icon (⚙️)** in the top right
3. Paste your API key in the input field
4. Click **"Save API Key"**
5. The key is saved to your browser's localStorage

### Method 2: Manually in Browser Console
```javascript
localStorage.setItem('gemini_api_key', 'YOUR_API_KEY_HERE');
```

## 🚀 How to Use

### AI Doubt Clearing
1. Navigate to "AI Doubt Clearing" from the dashboard
2. Type your question or use the microphone button
3. Gemini will respond with helpful answers
4. You can ask follow-up questions
5. Click "Listen" to hear the response

### Quiz Generator
1. Navigate to "Quiz Generator" from the dashboard
2. Paste any text, article, or lesson content
3. Click "Generate Quiz"
4. Gemini will create 5 multiple-choice questions
5. Answer the questions and see your score

## 🎤 Voice Features

- **Speech-to-Text**: Click the microphone button to speak your questions
- **Text-to-Speech**: Click "Listen" to hear AI responses read aloud
- Works in Chrome, Edge, and Safari

## 🔒 Privacy & Security

- Your API key is stored locally in your browser
- No data is sent to any server except Google's Gemini API
- You can delete your key anytime from localStorage

## 🆓 Free Tier Limits

Google's free tier includes:
- 60 requests per minute
- Up to 1500 requests per day
- Perfect for learning and testing

## 💡 Pro Tips

1. **Be specific** with your questions for better answers
2. **Provide context** when asking complex questions
3. **Use proper grammar** for quiz generation for better questions
4. The AI remembers context in Doubt Clearing sessions
5. Quiz questions are generated fresh each time

## ❓ Troubleshooting

**"Please add your API key"**
- Click the settings icon and add your Gemini API key

**"API error" or "Invalid response"**
- Check if your API key is correct
- Verify you have internet connection
- Make sure you haven't exceeded rate limits

**Demo mode (no API key)**
- Without an API key, you'll see sample responses
- Add a key to unlock full AI capabilities

## 🌟 Features

✅ Real-time AI responses  
✅ Context-aware conversations  
✅ Voice input and output  
✅ Automatic quiz generation  
✅ Persistent API key storage  
✅ Error handling and fallbacks  

Enjoy learning with Tod AI! 🎓
