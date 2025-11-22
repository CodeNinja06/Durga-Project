# Deployment Guide

Complete guide for deploying Durga Group website to various platforms.

## 🚀 Quick Deploy Options

### 1. Netlify (Easiest - Recommended)

**Steps:**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to [netlify.com](https://www.netlify.com)
3. Click "New site from Git"
4. Connect repository
5. Build settings:
   - Build command: `npm install` (or leave empty)
   - Publish directory: `.`
6. Add environment variables:
   - `CONTACT_EMAIL`: your-email@domain.com
   - `FROM_EMAIL`: noreply@domain.com
7. Deploy!

**Netlify Functions:**
- Functions are in `netlify/functions/`
- Automatically deployed
- Update contact form to use: `/api/contact`

### 2. Vercel

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in dashboard
5. Deploy!

### 3. Traditional VPS/Server

**Requirements:**
- Node.js 14+
- PM2 (process manager)
- Nginx/Apache
- SSL certificate

**Steps:**

1. **Server Setup:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Upload Files:**
   ```bash
   # Clone or upload files
   git clone your-repo-url
   cd durga-web
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your settings
   ```

4. **Start with PM2:**
   ```bash
   pm2 start server.js --name durga-group
   pm2 save
   pm2 startup  # Follow instructions
   ```

5. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## 📧 Email Service Setup

### Option A: Gmail (Free, Easy)

1. Enable 2FA on Gmail account
2. Generate App Password:
   - Google Account > Security > App passwords
   - Generate password for "Mail"
3. Use in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Option B: SendGrid (Recommended for Production)

1. Sign up: [sendgrid.com](https://sendgrid.com)
2. Create API Key
3. Verify sender email
4. Use in Netlify Functions or update server.js

### Option C: Mailgun

1. Sign up: [mailgun.com](https://mailgun.com)
2. Get SMTP credentials
3. Update `.env`:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=your-mailgun-user
   SMTP_PASS=your-mailgun-password
   ```

## 🔧 Post-Deployment Checklist

- [ ] Test contact form submission
- [ ] Verify email notifications work
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Verify SSL certificate (HTTPS)
- [ ] Set up domain DNS
- [ ] Configure backup strategy
- [ ] Set up monitoring (optional)
- [ ] Test file uploads (if enabled)
- [ ] Review security settings

## 🔒 Security Best Practices

1. **Never commit `.env` file**
2. **Use strong passwords**
3. **Enable HTTPS only**
4. **Set up rate limiting** (add to server.js)
5. **Regular updates**: `npm audit fix`
6. **Monitor logs** for suspicious activity
7. **Backup database/logs** regularly

## 📊 Monitoring (Optional)

### Uptime Monitoring
- UptimeRobot (free)
- Pingdom
- StatusCake

### Error Tracking
- Sentry
- LogRocket
- Rollbar

## 🆘 Troubleshooting

### Contact form not working
- Check browser console for errors
- Verify API endpoint URL
- Check server logs
- Verify email configuration

### Images not loading
- Check file paths
- Verify CORS settings
- Check CDN configuration

### Slow loading
- Enable gzip compression
- Use CDN for assets
- Optimize images
- Enable browser caching

## 📞 Need Help?

Check the main README.md or contact the development team.

