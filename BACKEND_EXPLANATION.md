# How the Backend Works

## 🏗️ Architecture Overview

Your Durga Group website has **two backend options** that work seamlessly:

### Option 1: Netlify Functions (Serverless) - Currently Active
**Location:** `netlify/functions/submit-contact.js`

**How it works:**
1. When a user submits the contact form, JavaScript (`assets/js/contact-form.js`) intercepts the submission
2. The form data is sent as JSON to `/api/contact` endpoint
3. Netlify automatically routes this to `/.netlify/functions/submit-contact`
4. The serverless function:
   - Validates the input (name, email, message required)
   - Checks email format
   - Logs the submission
   - Returns success/error response
5. Frontend displays success message or error

**Flow:**
```
User fills form → JavaScript sends POST request → Netlify Function processes → Returns JSON response → Frontend shows result
```

**Advantages:**
- ✅ No server to manage
- ✅ Auto-scales with traffic
- ✅ Free tier available
- ✅ Integrated with Netlify hosting

### Option 2: Node.js/Express Server (Standalone)
**Location:** `server.js`

**How it works:**
1. Express server runs on port 3000 (or configured port)
2. Serves static files (HTML, CSS, JS)
3. Has API endpoints:
   - `POST /api/contact` - Handles form submissions
   - `GET /api/health` - Health check
   - `GET /api/submissions` - View submissions (optional)
4. When form is submitted:
   - Validates input
   - Saves file uploads to `uploads/` directory
   - Sends email via SMTP (Nodemailer)
   - Logs to `logs/submissions.log`
   - Returns JSON response

**Flow:**
```
User fills form → POST /api/contact → Express validates → Sends email → Saves log → Returns response
```

**Advantages:**
- ✅ Full control
- ✅ File upload support
- ✅ Email notifications
- ✅ Can add database
- ✅ Custom features

## 📧 Email System

### Current Setup
- **Netlify Functions:** Logs submissions (email integration ready)
- **Express Server:** Sends emails via SMTP

### Email Configuration
Uses environment variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@durgagroup.com
FROM_EMAIL=noreply@durgagroup.com
```

### How Email Works
1. Form submission received
2. Email content formatted (HTML + text)
3. Nodemailer connects to SMTP server
4. Email sent to `CONTACT_EMAIL`
5. User receives confirmation

## 🔒 Security Features

### Rate Limiting
- **5 requests per 15 minutes** per IP address
- Prevents spam/abuse
- In-memory store (resets on server restart)

### Input Validation
- Required fields checked
- Email format validated
- File type restrictions
- File size limits (10MB)

### CORS Protection
- Configurable allowed origins
- Prevents unauthorized access

## 📁 File Structure

```
Backend Files:
├── server.js                    # Express server
├── package.json                 # Dependencies
├── netlify/
│   └── functions/
│       └── submit-contact.js    # Serverless function
└── assets/js/
    └── contact-form.js          # Frontend handler
```

## 🔄 Request Flow

### Contact Form Submission

1. **Frontend (contact-form.js):**
   ```javascript
   - User clicks "Send Request"
   - Form data collected
   - POST request to /api/contact
   - Shows loading state
   ```

2. **Backend Processing:**
   ```javascript
   - Receives POST request
   - Validates data
   - Checks rate limit
   - Processes file (if any)
   - Sends email
   - Logs submission
   ```

3. **Response:**
   ```javascript
   - Success: { success: true, message: "..." }
   - Error: { error: "Error message" }
   ```

4. **Frontend Display:**
   ```javascript
   - Shows success message
   - Resets form
   - Re-enables button
   ```

## 🚀 Deployment

### Netlify (Current)
- Functions auto-deploy with site
- No server management needed
- Environment variables in Netlify dashboard

### Express Server
- Deploy to: Heroku, Railway, DigitalOcean, AWS, etc.
- Use PM2 for process management
- Configure environment variables
- Set up reverse proxy (Nginx)

## 📊 Monitoring

### Logs
- **Netlify:** View in Functions dashboard
- **Express:** Check `logs/submissions.log`
- **Console:** Server logs show all activity

### Health Check
- Endpoint: `GET /api/health`
- Returns: Status, timestamp, service name
- Use for monitoring/uptime checks

## 🔧 Customization

### Add Database
```javascript
// In server.js, add:
const mongoose = require('mongoose');
// Connect to MongoDB
// Save submissions to database
```

### Add Authentication
```javascript
// Protect /api/submissions endpoint
const jwt = require('jsonwebtoken');
// Verify token before allowing access
```

### Add More Endpoints
```javascript
app.post('/api/newsletter', ...);
app.get('/api/projects', ...);
app.post('/api/quote', ...);
```

## 🐛 Troubleshooting

### Form not submitting?
- Check browser console (F12)
- Verify API endpoint URL
- Check network tab for errors

### Email not sending?
- Verify SMTP credentials in `.env`
- Check spam folder
- Review server logs

### Rate limit errors?
- Wait 15 minutes
- Or increase limit in `server.js`

## 📚 Next Steps

1. **Add Email Service:** Integrate SendGrid for Netlify Functions
2. **Add Database:** Store submissions in MongoDB/PostgreSQL
3. **Add Authentication:** Protect admin endpoints
4. **Add Analytics:** Track form submissions
5. **Add Notifications:** Slack/Discord webhooks

## 🔗 Related Files

- `server.js` - Express backend
- `netlify/functions/submit-contact.js` - Serverless function
- `assets/js/contact-form.js` - Frontend handler
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide

