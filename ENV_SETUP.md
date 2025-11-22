# Environment Variables Setup Guide

## Quick Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings

3. Never commit `.env` to Git (already in .gitignore)

## Required Variables

### For Standalone Node.js Server

```env
# Server
PORT=3000
NODE_ENV=production

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Addresses
FROM_EMAIL=noreply@durgagroup.com
CONTACT_EMAIL=contact@durgagroup.com
```

### For Netlify Deployment

Set these in Netlify Dashboard:
- Site Settings > Environment Variables

```env
CONTACT_EMAIL=contact@durgagroup.com
FROM_EMAIL=noreply@durgagroup.com
SENDGRID_API_KEY=your-sendgrid-key  # Optional
```

## Email Service Configuration

### Gmail Setup

1. Enable 2-Factor Authentication
2. Go to: Google Account > Security > App passwords
3. Generate password for "Mail"
4. Use in `SMTP_PASS`

### SendGrid Setup

1. Sign up: https://sendgrid.com
2. Create API Key
3. Add to environment variables
4. Update Netlify function to use SendGrid

### Other Services

- **Mailgun**: Use SMTP settings
- **AWS SES**: Use AWS SDK
- **Custom SMTP**: Configure host/port/user/pass

## Security Notes

- Never share `.env` file
- Use strong passwords
- Rotate API keys regularly
- Use different credentials for dev/prod

