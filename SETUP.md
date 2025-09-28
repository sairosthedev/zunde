# 🚀 Zunde Registration System - Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (Atlas or local instance)
3. **Email Service** (Gmail, SendGrid, etc.)
4. **SMS Service** (Twilio recommended)
5. **WhatsApp Business API** (optional)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zunde_registration?retryWrites=true&w=majority

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Configuration (optional)
WHATSAPP_TOKEN=your-whatsapp-business-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# App Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up Environment Variables**
   - Copy the example above to `.env.local`
   - Fill in your actual credentials

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Admin login: admin@zunde.com / admin123

## Database Setup

The system will automatically create the following collections:
- `events` - Store event information
- `participants` - Store participant registrations
- `checkins` - Store check-in records
- `users` - Store admin users (optional)

## Features Overview

### ✅ Already Implemented
- User authentication (admin login)
- Event creation and management
- Participant registration with QR codes
- QR code generation
- Email/SMS/WhatsApp notifications
- Admin dashboard with statistics
- Check-in system
- Attendance tracking

### 🔧 Configuration Required
1. **Email Service**: Set up Gmail or SendGrid
2. **SMS Service**: Configure Twilio
3. **Database**: Ensure MongoDB connection
4. **WhatsApp**: Optional for enhanced notifications

## Testing the System

1. **Create an Event**
   - Login as admin
   - Go to Dashboard → Event Management
   - Create a new event

2. **Register Participants**
   - Go to home page
   - Click "Register for Events"
   - Fill out registration form

3. **Check-in Process**
   - Use admin dashboard
   - Go to Check-ins tab
   - Scan QR codes or enter ticket IDs

## Production Deployment

1. **Environment Variables**
   - Set all production credentials
   - Use secure passwords and tokens

2. **Database**
   - Use MongoDB Atlas for production
   - Set up proper security rules

3. **Email/SMS Services**
   - Use production-grade services
   - Set up proper rate limiting

## Support

For issues or questions:
- Check the console for error messages
- Verify environment variables are set correctly
- Ensure MongoDB connection is working
- Test email/SMS services individually

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for all services
- Enable MongoDB authentication
- Set up proper CORS policies for production
