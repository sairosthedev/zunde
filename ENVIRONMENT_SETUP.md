# 🔧 Environment Setup - Fix MongoDB Connection

## ❌ Current Issue
The system is showing: `{"success":false,"error":"MongoDB not configured"}`

This means the `MONGODB_URI` environment variable is not set.

## ✅ Quick Fix

### Step 1: Create `.env.local` file
Create a file named `.env.local` in the root directory of your project with this content:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://macdonald:macdonald24@zunde.3zjtuav.mongodb.net/zunde_registration?retryWrites=true&w=majority

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Configuration (Optional)
WHATSAPP_TOKEN=your-whatsapp-business-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# App Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Step 2: Restart the development server
After creating the `.env.local` file:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again
3. The MongoDB connection should now work

### Step 3: Test the connection
Visit `http://localhost:3000/test-system` to verify everything is working.

## 🔍 Verification Steps

1. **Check if `.env.local` exists** in your project root
2. **Verify the MONGODB_URI** is correctly set
3. **Restart the server** after creating the file
4. **Test the database connection** at `/test-system`

## 📝 File Location
The `.env.local` file should be in the same directory as your `package.json` file:

```
zunde-registration/
├── .env.local          ← Create this file
├── package.json
├── app/
├── components/
└── lib/
```

## 🚨 Important Notes

- **Never commit `.env.local`** to version control
- **Restart the server** after creating the file
- **Check the console** for connection messages
- **Use the test system** to verify everything works

## 🎯 Expected Result

After setting up the environment variables, you should see:
- ✅ MongoDB connection successful
- ✅ Events can be created
- ✅ Participants can be registered
- ✅ All API endpoints working
- ✅ Real data being stored and retrieved

## 🆘 Still Having Issues?

If you're still getting the MongoDB error:

1. **Double-check the file name**: Must be exactly `.env.local`
2. **Check the file location**: Must be in the project root
3. **Restart the server**: Stop and start `npm run dev`
4. **Check the console**: Look for connection messages
5. **Test the database**: Use the test system at `/test-system`

The MongoDB URI I provided should work immediately - it's already configured for the Zunde system!
