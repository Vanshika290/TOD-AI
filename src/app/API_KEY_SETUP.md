# 🔑 Quick API Key Setup

## Your API Key
```
AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI
```

---

## ⚡ Fastest Setup Method (30 seconds)

### Step 1: Open Browser Console
- Press `F12` on Windows/Linux
- Or `Cmd + Option + J` on Mac
- Or Right-click → "Inspect" → "Console" tab

### Step 2: Paste & Run This Code
```javascript
localStorage.setItem('gemini_api_key', 'AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI');
alert('✅ API Key Saved! Refresh the page.');
```

### Step 3: Refresh Page
- Press `F5` or `Ctrl+R` (Windows/Linux)
- Or `Cmd+R` (Mac)

### Step 4: Test It
1. Go to "AI Doubt Clearing"
2. You should see **"✓ AI Active"** badge (green) instead of "Demo Mode"
3. Type: `what is javascript?`
4. You should get a real AI response!

---

## 🎯 Visual Verification

### ✅ Success Indicators:
- **Top right badge shows**: "✓ AI Active" (green)
- **Responses are**: Detailed, intelligent, personalized
- **NO messages saying**: "To use the AI chatbot, please add your API key..."

### ❌ If Still Demo Mode:
- **Badge shows**: "Demo Mode" (yellow)
- **Responses are**: Generic demo messages
- **Messages say**: "To use the AI chatbot, please add your API key..."

**If still in demo mode:**
1. Open console (F12)
2. Type: `localStorage.getItem('gemini_api_key')`
3. Press Enter
4. **Should show**: `"AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI"`
5. **If null or different**: Run the setup code again

---

## 🧪 Test Each Feature

### 1. AI Doubt Clearing (Primary Test)
```
✓ Open "AI Doubt Clearing" from dashboard
✓ Check for "✓ AI Active" badge
✓ Type: "explain photosynthesis"
✓ Should get detailed AI response
✓ NOT a demo message
```

### 2. Text Summarizer
```
✓ Open "Text Summarizer"
✓ Click "Use Sample Text"
✓ Click "Summarize"
✓ Should get intelligent summary
✓ NOT just first/last sentences
```

### 3. Quiz Generator
```
✓ Open "Quiz Generator"
✓ Click "Use Sample Text"
✓ Click "Generate Quiz"
✓ Should get 5 relevant questions
✓ NOT generic demo questions
```

---

## 🔧 Troubleshooting

### Problem: Still showing demo responses

**Solution 1: Clear cache and reload**
```javascript
localStorage.clear();
localStorage.setItem('gemini_api_key', 'AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI');
location.reload();
```

**Solution 2: Hard refresh**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Solution 3: Check API key in console**
```javascript
// Check if saved
console.log('API Key:', localStorage.getItem('gemini_api_key'));

// Should output: AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI
```

### Problem: "API error" message

**Possible causes:**
1. Internet connection issue
2. API rate limit exceeded (60 requests/min)
3. Invalid API key

**Check in console:**
```javascript
// Test if key is correct
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA2UuRudE2NW0bQ4wOiquVoQ4I_2koQ4uI', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }]
  })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

---

## ✨ Expected Behavior After Setup

### AI Doubt Clearing:
```
You: "what is javascript?"

AI: "Great question! 🌟 JavaScript is a programming 
language that makes websites interactive and fun! 
Think of it like the magic that makes games, 
animations, and buttons work on websites..."
```

### Text Summarizer:
```
Input: 500-word article
Output: 150-word intelligent summary
✓ Maintains main ideas
✓ Readable and coherent
✓ NOT just extracted sentences
```

### Quiz Generator:
```
Input: Study material about photosynthesis
Output: 5 multiple-choice questions like:

Q1: Where does photosynthesis occur in plants?
A) Roots  B) Chloroplasts ✓  C) Stem  D) Flowers

[Questions are relevant to the content]
```

---

## 🎓 All Features Using AI

Once the API key is set, these features use Gemini:

| Feature | AI Function | Status |
|---------|-------------|---------|
| 💬 AI Doubt Clearing | Full chatbot | ✅ Active |
| 📝 Text Summarizer | Smart summaries | ✅ Active |
| 🎯 Quiz Generator | Content-based questions | ✅ Active |
| 🧩 Pattern Detective | AI hints | ✅ Active |
| 🃏 Memory Master | AI coaching | ✅ Active |
| 📚 Lesson View | AI explanations | ✅ Active |

---

## 🔐 Security Notes

- ✅ Your API key is saved in browser localStorage
- ✅ Only sent to Google Gemini API
- ✅ Never sent to any other server
- ⚠️ Note: This key is now visible in our chat
- 💡 Consider regenerating at [Google AI Studio](https://makersuite.google.com/app/apikey) later

---

## 📊 Free Tier Limits

Google Gemini Free Tier:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Free forever

More than enough for learning and daily use!

---

## ✅ Checklist

- [ ] Opened browser console (F12)
- [ ] Pasted API key setup code
- [ ] Saw success alert
- [ ] Refreshed page (F5)
- [ ] Opened AI Doubt Clearing
- [ ] Saw "✓ AI Active" badge (green)
- [ ] Typed test question
- [ ] Got real AI response (not demo)
- [ ] Tested Text Summarizer
- [ ] Tested Quiz Generator

---

## 🎉 You're All Set!

Your Tod AI app is now **fully AI-powered**!

Try asking:
- "Explain quantum physics simply"
- "How do I solve quadratic equations?"
- "What's the difference between mitosis and meiosis?"

The AI will give detailed, educational, and encouraging responses! 🚀
