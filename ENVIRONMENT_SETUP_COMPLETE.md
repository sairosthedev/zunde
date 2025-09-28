# 🔧 Complete Environment Setup Guide

## 📋 Your `.env.local` File

Create a file named `.env.local` in your project root directory with this content:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://macdonald:macdonald24@zunde.3zjtuav.mongodb.net/zunde_registration?retryWrites=true&w=majority

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# SMS Configuration (Twilio) - Optional
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

## 🎯 Quick Setup Steps

### 1. Create the `.env.local` file
- Copy the content above into a new file named `.env.local`
- Place it in your project root (same directory as `package.json`)

### 2. Set up Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication if not already enabled
3. Go to "Security" → "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Replace `your-16-character-app-password` in your `.env.local` file

### 3. Update your email address
- Replace `your-email@gmail.com` with your actual Gmail address

### 4. Restart the development server
```bash
npm run dev
```

## ✅ What's Now Working

After setup, your system will have:

- ✅ **MongoDB Connection**: Real database storage
- ✅ **Event Registration**: Open registration for all events
- ✅ **Email Notifications**: Professional HTML emails with QR codes
- ✅ **SMS Notifications**: Text message confirmations (if Twilio configured)
- ✅ **WhatsApp Notifications**: WhatsApp messages (if configured)
- ✅ **QR Code Generation**: Unique tickets for each participant
- ✅ **Check-in System**: QR code scanning for attendance

## 🧪 Test Your Setup

1. **Database Test**: Visit `http://localhost:3000/test-system`
2. **Registration Test**: Go to `http://localhost:3000/register`
3. **Email Test**: Register a participant and check your email
4. **Admin Test**: Visit `http://localhost:3000/admin` to manage events

## 📧 Email Features

Your system now sends:
- **Registration Confirmations**: Beautiful e-tickets with QR codes
- **Event Reminders**: 24-hour advance notifications
- **Check-in Confirmations**: Bus assignments and confirmations

## 🎉 You're All Set!

Your Zunde Registration System is now fully functional with:
- Real database storage
- Professional email notifications
- QR code ticketing system
- Event management
- Participant tracking
- Check-in system

Start registering participants and managing your outreach events!
