# 🚀 Quick Start - Fix MongoDB Error

## ❌ Current Error
```
{"success":false,"error":"MongoDB not configured"}
```

## ✅ 2-Minute Fix

### Step 1: Create Environment File
Create a file named `.env.local` in your project root with this exact content:

```env
MONGODB_URI=mongodb+srv://macdonald:macdonald24@zunde.3zjtuav.mongodb.net/zunde_registration?retryWrites=true&w=majority
```

### Step 2: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 3: Test Everything
Visit: `http://localhost:3000/test-system`

## 🎯 What This Fixes

- ✅ MongoDB connection will work
- ✅ Events can be created
- ✅ Participants can register
- ✅ QR codes will generate
- ✅ Check-in system will work
- ✅ All real data will be stored

## 📁 File Structure
Make sure `.env.local` is in the right place:

```
zunde-registration/
├── .env.local          ← Create this file here
├── package.json
├── app/
└── components/
```

## 🔍 Verification
After creating the file and restarting:

1. **Check console** - should show "MongoDB client connected successfully"
2. **Visit test page** - `/test-system` should show all green checkmarks
3. **Try admin login** - `admin@zunde.com` / `admin123`
4. **Create an event** - should work without errors

## 🚨 Still Not Working?

1. **Double-check file name**: Must be exactly `.env.local`
2. **Check location**: Must be in project root (same folder as package.json)
3. **Restart server**: Stop and start `npm run dev` again
4. **Check console**: Look for MongoDB connection messages

The MongoDB URI I provided is already configured and should work immediately!
