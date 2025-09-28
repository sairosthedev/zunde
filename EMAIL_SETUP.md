# 📧 Email Configuration Setup Guide

## 🎯 Overview
This guide will help you set up email functionality for the Zunde Registration System using Gmail SMTP.

## 🔧 Step 1: Gmail App Password Setup

### 1.1 Enable 2-Factor Authentication
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the prompts to enable 2FA if not already enabled

### 1.2 Generate App Password
1. In your Google Account settings, go to "Security"
2. Under "Signing in to Google", click "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" and enter "Zunde Registration System"
5. Click "Generate"
6. **Copy the 16-character password** (you won't see it again!)

## 🔧 Step 2: Update Environment Variables

Update your `.env.local` file with the following email configuration:

```env
# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Alternative: Generic SMTP (if not using Gmail)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
```

## 🔧 Step 3: Test Email Configuration

### 3.1 Start the Development Server
```bash
npm run dev
```

### 3.2 Test Email Functionality
1. Go to `http://localhost:3000/test-system`
2. Click "Test Email Sending"
3. Check the console for email sending logs
4. Check your email inbox for the test email

## 📋 Email Features

The system will send the following emails:

### ✅ Registration Confirmation
- **When**: Immediately after participant registration
- **Contains**: E-ticket with QR code, event details, instructions
- **Recipients**: Registered participants

### ✅ Event Reminders
- **When**: 24 hours before the event
- **Contains**: Event details, departure information, reminders
- **Recipients**: All registered participants

### ✅ Check-in Confirmations
- **When**: After successful check-in
- **Contains**: Bus assignment, confirmation details
- **Recipients**: Checked-in participants

## 🚨 Troubleshooting

### Common Issues:

#### 1. "Invalid login" error
- **Solution**: Make sure you're using the App Password, not your regular Gmail password
- **Check**: Verify 2FA is enabled on your Google account

#### 2. "Less secure app access" error
- **Solution**: Use App Passwords instead of enabling "less secure apps"
- **Note**: App Passwords are more secure than the deprecated "less secure apps" setting

#### 3. Emails not being sent
- **Check**: Console logs for error messages
- **Verify**: Environment variables are correctly set
- **Test**: Use the test system to verify configuration

#### 4. Emails going to spam
- **Solution**: Add the sender email to your contacts
- **Note**: This is normal for automated emails from new domains

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use App Passwords** instead of your main Gmail password
3. **Regularly rotate** your App Passwords
4. **Monitor** your Gmail account for suspicious activity
5. **Use a dedicated email** for the application if possible

## 📊 Email Templates

The system includes beautiful HTML email templates for:

- **Registration Confirmations**: Professional e-ticket with QR code
- **Event Reminders**: Friendly reminder with event details
- **Check-in Confirmations**: Bus assignment and confirmation

## 🎯 Expected Results

After setup, you should see:
- ✅ Emails being sent successfully
- ✅ Beautiful HTML templates
- ✅ QR codes in registration emails
- ✅ Professional branding
- ✅ Mobile-responsive design

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Double-check** your App Password (16 characters, no spaces)
2. **Verify** 2FA is enabled on your Google account
3. **Check** the console logs for specific error messages
4. **Test** with a different Gmail account
5. **Contact** support if issues persist

The email system is now ready to send professional, branded emails for your Zunde outreach events!
