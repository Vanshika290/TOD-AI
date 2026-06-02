# 🚨 QUOTA EXCEEDED - Quick Fix Guide

## What Happened?

You've reached the **free tier limit** for your Gemini API key. This is normal if you've been testing a lot!

### Your Error:
```
Failed with v1beta/models/gemini-2.5-pro-preview-03-25: QUOTA_EXCEEDED
```

### What This Means:
✅ Your API key is **valid**
✅ The API is **enabled and working**
✅ The models are **available**
❌ But you've **used up your free quota** for now

---

## ⚡ INSTANT FIX (2 Minutes)

### Create a New API Key in a New Project

Each Google Cloud project gets **separate quota limits**, so creating a new project = fresh quota!

### Steps:

1. **Go to:** https://aistudio.google.com/app/apikey

2. **Click:** "Create API Key" button

3. **IMPORTANT:** Select **"Create API key in new project"**
   - Don't select "existing project"
   - New project = fresh quota limits!

4. **Copy** the new API key immediately

5. **Enable the API:**
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Make sure you're in the **new project** (check top bar)
   - Click "ENABLE"
   - Wait 2 minutes

6. **Test** your new API key in Tod AI

### Result:
✅ Brand new quota limits
✅ Works immediately
✅ Can create multiple projects if needed

---

## 📊 Understanding Quotas

### Free Tier Limits:

Different models have different quotas. Common limits:

| Model | Requests per Minute | Requests per Day |
|-------|---------------------|------------------|
| gemini-1.0-pro | 15 | 1,500 |
| gemini-1.5-flash | 15 | 1,500 |
| gemini-1.5-pro | 2 | 50 |
| gemini-2.5-pro-preview | 2 | 50 |

**Preview/experimental models** (like gemini-2.5-pro-preview) have **lower quotas** because they're newer.

### What Triggers Quota:
- Each AI request (chat, summarize, quiz, etc.)
- Multiple rapid requests
- Testing repeatedly
- Using preview/experimental models

---

## 🎯 Smart Quota Management

### The app now tries multiple models automatically!

When one model hits quota, it tries others:

```
❌ gemini-2.5-pro-preview → Quota exceeded
✅ gemini-1.5-flash → Trying this instead...
✅ Success with gemini-1.5-flash!
```

This means you'll automatically fallback to models that still have quota!

### Tips to Avoid Quota Issues:

1. **Don't spam test requests**
   - Test once, then use normally
   - Don't click "Test Connection" repeatedly

2. **Create new project when needed**
   - Each project = separate quota
   - Free to create multiple projects

3. **Wait between requests**
   - The app handles this automatically
   - But manual testing can exhaust quota

4. **Use stable models**
   - `gemini-1.5-flash` has higher quota than preview models
   - Preview models are experimental and limited

---

## 🔍 Check Your Usage

### View Current Usage:

1. **Go to:** https://aistudio.google.com/app/apikey

2. **Find your API key** in the list

3. **Click** to expand details

4. You'll see:
   - Requests made today
   - Requests per minute
   - Quota remaining

### What to Look For:

```
Requests today: 1,489 / 1,500 ← Almost at daily limit
Requests per minute: 14 / 15 ← Near rate limit
```

If you're near limits, either:
- Wait for reset (next day)
- Create new API key in new project

---

## ⏰ When Do Quotas Reset?

### Per-Minute Quota:
- Resets every minute
- Example: If you hit 15 requests in 1 minute, wait 60 seconds

### Per-Day Quota:
- Resets at midnight UTC
- Example: If you hit 1,500 requests today, wait until tomorrow (UTC)

### Per-Project Quota:
- Never resets
- Create new project for fresh quota

---

## 💡 Multiple API Keys Strategy

You can create multiple API keys in different projects:

### Example Setup:

```
Project 1: "tod-ai-main"
API Key 1: AIzaSyD... (for production use)

Project 2: "tod-ai-testing"  
API Key 2: AIzaSyE... (for testing/development)

Project 3: "tod-ai-backup"
API Key 3: AIzaSyF... (backup when others hit quota)
```

### Benefits:
✅ 3x the quota
✅ Separate testing from production
✅ Always have a backup

### How to Switch:
Just paste a different API key in Tod AI settings!

---

## 🚀 What The Fix Does

### Before (Old Behavior):
```
❌ Model hit quota → Stop and show error
❌ User has to manually fix it
```

### After (New Behavior):
```
⚠️ Model A hit quota → Try Model B
⚠️ Model B hit quota → Try Model C
✅ Model C works → Use it!
💾 Cache Model C for future requests
```

### Smart Features:

1. **Automatic Fallback**
   - Tries all available models
   - Uses first one that works
   - Caches it for speed

2. **Helpful Errors**
   - If ALL models hit quota, shows clear fix
   - Step-by-step instructions
   - Direct links to create new key

3. **Quota Reporting**
   - Shows which models hit quota
   - Tells you how many models failed
   - Suggests best solution

---

## 🆘 Troubleshooting

### Q: I created a new key but still get quota error

**A:** Make sure you created the key in a **NEW PROJECT**, not existing project.

Steps:
1. When creating API key, look for dropdown
2. Select "Create API key in new project"
3. Don't select your existing project

---

### Q: How many projects can I create?

**A:** Google allows many projects (dozens+). Each gets separate quota.

---

### Q: Will this cost money?

**A:** No! The free tier is generous:
- 1,500 requests per day per project
- Multiple projects allowed
- No credit card required

---

### Q: What if I need more quota?

**A:** Options:
1. Create more projects (free)
2. Wait for daily reset (free)
3. Upgrade to paid tier (costs money, but gets much higher limits)

For a learning app, free tier is usually enough!

---

### Q: Why did preview models hit quota faster?

**A:** Preview/experimental models have lower quotas:
- `gemini-2.5-pro-preview`: Only 2 requests per minute, 50 per day
- `gemini-1.5-flash`: 15 requests per minute, 1,500 per day

The app now automatically tries stable models when preview hits quota!

---

## 📋 Quick Reference

### Instant Fix:
```
1. https://aistudio.google.com/app/apikey
2. "Create API Key" → "in new project"
3. Enable API in new project
4. Test in Tod AI
```

### Check Usage:
```
1. https://aistudio.google.com/app/apikey
2. View your API key details
3. See quota usage
```

### Enable API:
```
1. https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure you're in the right project (top bar)
3. Click "ENABLE"
```

---

## ✅ Summary

### What You Learned:
- ✅ Quota limits are normal on free tier
- ✅ Each project gets separate quota
- ✅ Creating new projects is free and easy
- ✅ The app now tries multiple models automatically
- ✅ Preview models have lower quotas

### What To Do:
1. Create new API key in new project (2 minutes)
2. Use it in Tod AI
3. Create more projects if needed
4. Enjoy unlimited learning!

### What's Changed:
- ✅ Smart quota handling
- ✅ Automatic model fallback
- ✅ Better error messages
- ✅ Direct links to fixes

---

**Bottom line: Create a new API key in a new project and you're good to go! Takes 2 minutes.** 🚀

---

## 🎓 Pro Tips

### Tip 1: Use Stable Models
The app will automatically prefer `gemini-1.5-flash` over preview models because it has higher quota.

### Tip 2: Create Projects Proactively
Create 2-3 projects with API keys ready to go. Switch between them as needed.

### Tip 3: Name Your Projects
Use descriptive names like "tod-ai-main", "tod-ai-backup" so you know which is which.

### Tip 4: Monitor Usage
Check your usage occasionally at https://aistudio.google.com/app/apikey

### Tip 5: Don't Test Excessively
Each test counts toward quota. Test once, then use normally.

---

**Happy Learning with Tod AI!** 🎉
