# 🔑 API Key Troubleshooting Guide

## "Invalid API Key" Error - Solutions

If you're getting an "Invalid API Key" error even after enabling the API, try these steps:

### ✅ Step 1: Check Your API Key Format

Your API key should:
- Start with `AIza`
- Be exactly **39 characters** long
- Have NO spaces before or after
- Look like: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Common mistakes:**
- ❌ Copied extra spaces
- ❌ Didn't copy the entire key
- ❌ Mixed up different keys

### ✅ Step 2: Verify API is Enabled

1. **Go to:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. **Make sure it says:** "API enabled" (green checkmark)
3. **If it says "ENABLE":** Click it and wait 1-2 minutes
4. **Important:** After enabling, you MUST wait at least 2 minutes before testing

### ✅ Step 3: Create a Fresh API Key

Sometimes old keys don't work. Create a new one:

1. **Go to:** https://aistudio.google.com/app/apikey
2. **Click:** "Create API Key"
3. **Select:** "Create API key in new project" (easier)
4. **Copy:** The entire key immediately
5. **Paste:** Into Tod AI and test

### ✅ Step 4: Remove API Key Restrictions

Your key might have restrictions:

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Find your API key** in the list
3. **Click the edit icon** (pencil)
4. **Under "API restrictions":**
   - Select "Don't restrict key" OR
   - Make sure "Generative Language API" is checked
5. **Under "Application restrictions":**
   - Select "None"
6. **Save** and wait 1 minute

### ✅ Step 5: Check Your Google Account

Make sure:
- ✅ You're signed into the correct Google account
- ✅ Your account is verified (check email)
- ✅ You haven't exceeded the free tier limits

### ✅ Step 6: Test in Browser Console

Open your browser's Developer Tools (F12) and check the Console tab when testing. Look for:

```
🔍 Testing API connection...
📝 API Key format: AIzaSyDxxx...
📏 API Key length: 39
Trying v1/models/gemini-1.5-flash...
```

**If you see:**
- `API key not valid` → Your key is wrong or restricted
- `quota exceeded` → Wait or create new key
- `API has not been used` → API not enabled yet, wait longer
- `403 Forbidden` → Check restrictions on your key

## 🆕 Quick Fix: Start Fresh

If nothing works, do this clean start:

### Method 1: New Project (Recommended)

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. **Choose: "Create API key in new project"**
4. This creates everything fresh with no restrictions
5. Copy the key and test immediately

### Method 2: Different Google Account

Try using a different Google account:
1. Sign out of your current account
2. Sign in with a different Google account
3. Follow the setup steps again

## 📊 Check Your Usage

Visit: https://ai.dev/usage

This shows:
- How many requests you've made
- If you've hit any limits
- Your quota status

**Free Tier Limits:**
- 15 requests per minute
- 1,500 requests per day
- Should be plenty for normal use!

## 🔍 Common Error Messages Explained

### "API key not valid"
- **Cause:** Key is wrong, expired, or restricted
- **Fix:** Create a new key in a new project

### "Quota exceeded"
- **Cause:** Too many requests
- **Fix:** Wait 10 minutes, or create new key

### "API has not been used in project before"
- **Cause:** API not enabled OR just enabled
- **Fix:** Wait 2-5 minutes after enabling

### "403 Forbidden"
- **Cause:** Key has restrictions
- **Fix:** Remove all restrictions from key

### "Model not available"
- **Cause:** Using wrong model name
- **Fix:** Tod AI handles this automatically, shouldn't see this

## 💡 Pro Tips

### Tip 1: Wait After Enabling
After enabling the API, **close and reopen** Tod AI. This ensures a fresh start.

### Tip 2: Use Incognito/Private Mode
Sometimes browser cache causes issues. Try:
1. Open incognito/private window
2. Go to your Tod AI app
3. Enter the API key fresh

### Tip 3: Check Browser Console
Press F12 to open Developer Tools. The Console tab shows detailed error messages that help diagnose the problem.

### Tip 4: Try Different Models
Tod AI automatically tries multiple models:
- gemini-1.5-flash (fastest)
- gemini-1.5-pro (smarter)
- gemini-pro (fallback)

If one fails, it tries the next.

## 🆘 Still Not Working?

### Double-Check These:

1. **API Key starts with `AIza`** ✓
2. **API Key is 39 characters** ✓
3. **No spaces in the key** ✓
4. **Generative Language API is enabled** ✓
5. **Waited 2+ minutes after enabling** ✓
6. **No restrictions on the key** ✓
7. **Using the correct Google account** ✓

### Try This Sequence:

```
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy the ENTIRE key (should start with AIza)
5. Wait 30 seconds
6. Paste into Tod AI
7. Click "Test Connection"
```

### Last Resort:

1. **Clear browser cache**
2. **Restart browser**
3. **Try a different browser** (Chrome, Firefox, Edge)
4. **Use a different device** (phone, tablet)

## 📝 Example: What Working Looks Like

When it works, you'll see:

```
In Tod AI:
✓ Connection Successful! 🎉
Your API key is working perfectly.
Using model: gemini-1.5-flash
Redirecting to dashboard...

In Browser Console:
🔍 Testing API connection...
📝 API Key format: AIzaSyDxxx...
📏 API Key length: 39
Trying v1/models/gemini-1.5-flash...
✅ Success with v1/models/gemini-1.5-flash
📤 Response received: Hello! I am Tod AI...
```

## 🎯 Prevention for Next Time

Once it's working:
- ✅ Save your API key somewhere safe
- ✅ Don't add restrictions to the key
- ✅ Keep track of which Google account you used
- ✅ Note the project name in Google Cloud Console

## 📞 Additional Resources

- **Google AI Studio:** https://aistudio.google.com
- **API Docs:** https://ai.google.dev/docs
- **Usage Dashboard:** https://ai.dev/usage
- **Cloud Console:** https://console.cloud.google.com

---

## 🎓 Understanding the Issue

The "Invalid API Key" error usually means one of these:

1. **Wrong key format** - You didn't copy the full key
2. **API not enabled** - Needs to be activated in Google Cloud
3. **Too new** - Just created, needs a couple minutes to propagate
4. **Restrictions** - Key has IP/referrer/API restrictions
5. **Wrong project** - Key from different project than where API is enabled

**Most common cause:** API is enabled, but you need to **wait 2-3 minutes** for it to fully activate. Google's systems need time to sync.

---

**Need more help? Check the browser console (F12) for detailed error messages!**
