# 🚨 READ THIS FIRST - API Key Not Working?

## You're seeing: "Model not available" for all models

### This means: **The API is NOT enabled or NOT ready**

---

## ✅ THE FIX (Do this EXACTLY):

### 1️⃣ Enable the API
Click: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

Click the blue **"ENABLE"** button

### 2️⃣ WAIT 5 MINUTES ⏰
**This is the most important step!**

❌ DON'T test immediately
✅ DO wait the full 5 minutes

Close your browser and come back in 5 minutes.

### 3️⃣ Test Your Key

**Option A:** Open `/test-api-simple.html` in your browser
- Paste your API key
- Click "List Models" to see available models
- Click "Test Connection" to verify it works

**Option B:** Test in Tod AI
- Paste your API key
- Click "Test Connection"

---

## 🎯 That's It!

**99% of the time, the issue is:**
- The API was just enabled and you didn't wait long enough
- Solution: Wait 5 full minutes after enabling

---

## 🆘 If it STILL doesn't work:

### Create a fresh API key in a NEW project:

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select **"Create API key in new project"** ← Important!
4. Copy the key
5. Enable the API (link above)
6. **WAIT 5 MINUTES**
7. Test with `/test-api-simple.html`

---

## 📚 More Help

- **Detailed guide:** See `/FIX_INSTRUCTIONS.md`
- **Troubleshooting:** See `/API_KEY_HELP.md`
- **Test page:** Open `/test-api-simple.html` in browser

---

## ✅ When It Works

You'll see:
```
✅ Connection Successful! 🎉
Your API key is working perfectly.
Using model: gemini-1.5-flash
```

Then you can use all the AI features in Tod AI!

---

**TL;DR: Enable API → Wait 5 minutes → Test. That's it!** ⏰
