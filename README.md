# Durga Group of Companies Website

Professional website for Durga Group of Companies - Industrial, Civil & Railway Projects execution.

## 🚀 Features

- **Modern Frontend**: Responsive, animated, and user-friendly UI
- **Backend API**: Node.js/Express server with email notifications
- **Contact Form**: Fully functional with file upload support
- **Netlify Functions**: Serverless backend option
- **SEO Optimized**: Meta tags, structured data ready
- **Performance**: Lazy loading, optimized assets

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Email service (Gmail, SendGrid, Mailgun, etc.) for contact form

## 🛠️ Installation

### Option 1: Standalone Node.js Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your email configuration:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=contact@durgagroup.com
   FROM_EMAIL=noreply@durgagroup.com
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the website:**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health
   - Contact API: http://localhost:3000/api/contact

### Option 2: Netlify Deployment (Serverless)

1. **Push to Git repository** (GitHub, GitLab, Bitbucket)

2. **Connect to Netlify:**
   - Go to [Netlify](https://www.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Build settings:
     - Build command: `npm install`
     - Publish directory: `.`

3. **Configure Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add:
     - `CONTACT_EMAIL`: Your contact email
     - `FROM_EMAIL`: Sender email
     - `SENDGRID_API_KEY`: (Optional) For SendGrid email service

4. **Deploy:**
   - Netlify will automatically deploy on git push
   - Or trigger manual deploy from dashboard

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account > Security
   - App passwords > Generate
   - Use this password in `SMTP_PASS`

### SendGrid Setup (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API Key
3. Add to environment variables:
   ```env
   SENDGRID_API_KEY=your-api-key
   ```

### Other SMTP Services

Update `.env` with your SMTP provider settings:
- **Mailgun**: `smtp.mailgun.org`
- **AWS SES**: Use AWS SDK instead
- **Custom SMTP**: Configure host, port, user, pass

## 🔧 API Endpoints

### POST /api/contact
Submit contact form.

**Request:**
```json
{
  "name": "John Doe",
  "company": "ABC Corp",
  "email": "john@example.com",
  "phone": "+1234567890",
  "branch": "Industrial",
  "message": "Project inquiry..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been received."
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Durga Group Backend API"
}
```

## 📁 Project Structure

```
durga-web/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── clients.css
│   └── js/
│       ├── main.js
│       └── clients.js
├── netlify/
│   └── functions/
│       └── submit-contact.js
├── uploads/          # File uploads (gitignored)
├── logs/            # Submission logs (gitignored)
├── index.html
├── about.html
├── services.html
├── projects.html
├── clients.html
├── contact.html
├── server.js         # Express backend
├── package.json
├── netlify.toml      # Netlify configuration
├── .env.example      # Environment template
└── README.md
```

## 🚢 Deployment

### Netlify (Recommended)

1. Connect Git repository
2. Configure build settings
3. Add environment variables
4. Deploy automatically

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in dashboard

### Traditional Hosting

1. Upload all files to server
2. Install Node.js dependencies
3. Configure PM2 or similar process manager
4. Set up reverse proxy (nginx/Apache)
5. Configure SSL certificate

### PM2 Setup (Production)

```bash
npm install -g pm2
pm2 start server.js --name durga-group
pm2 save
pm2 startup
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **Rate Limiting**: Add rate limiting for production
3. **Input Validation**: Already implemented, but review regularly
4. **File Upload**: Currently limited to 10MB, adjust as needed
5. **CORS**: Configure allowed origins in production
6. **HTTPS**: Always use HTTPS in production

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `SMTP_HOST` | SMTP server host | Yes (for email) |
| `SMTP_PORT` | SMTP server port | Yes (for email) |
| `SMTP_USER` | SMTP username | Yes (for email) |
| `SMTP_PASS` | SMTP password | Yes (for email) |
| `CONTACT_EMAIL` | Email to receive submissions | Yes |
| `FROM_EMAIL` | Sender email address | Yes |

## 🐛 Troubleshooting

### Email not sending
- Check SMTP credentials
- Verify firewall/port access
- Check spam folder
- Review server logs

### File upload issues
- Check `uploads/` directory permissions
- Verify file size limits
- Check allowed file types

### Netlify Functions not working
- Verify function path in `netlify.toml`
- Check Netlify function logs
- Verify environment variables

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

© 2024 Durga Group of Companies. All rights reserved.

