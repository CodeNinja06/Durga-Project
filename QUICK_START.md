# Quick Start Guide

Get your Durga Group website backend running in 5 minutes!

## 🚀 Option 1: Netlify (Easiest - No Server Needed)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Build settings: Leave default (or `npm install`)
   - Publish directory: `.`
   - Deploy!

3. **Configure Environment Variables:**
   - Site Settings > Environment Variables
   - Add: `CONTACT_EMAIL` = your-email@domain.com
   - Add: `FROM_EMAIL` = noreply@domain.com

4. **Done!** Your site is live with serverless backend.

## 🖥️ Option 2: Local Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   CONTACT_EMAIL=contact@durgagroup.com
   FROM_EMAIL=noreply@durgagroup.com
   ```

4. **Start server:**
   ```bash
   # Windows
   start.bat
   
   # Mac/Linux
   chmod +x start.sh
   ./start.sh
   
   # Or directly
   npm start
   ```

5. **Open browser:**
   - http://localhost:3000

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Go to: Google Account > Security > App passwords
3. Generate password for "Mail"
4. Use that password in `SMTP_PASS`

## ✅ Test It

1. Open http://localhost:3000/contact.html
2. Fill out the contact form
3. Submit
4. Check your email inbox!

## 🐛 Troubleshooting

**Email not sending?**
- Check `.env` file has correct SMTP settings
- Verify Gmail app password is correct
- Check server console for errors

**Port already in use?**
- Change `PORT=3001` in `.env`
- Or kill process using port 3000

**Form not submitting?**
- Check browser console (F12)
- Verify API endpoint is correct
- Check server is running

## 📚 Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Read [README.md](README.md) for full documentation
- Read [ENV_SETUP.md](ENV_SETUP.md) for environment variables

## 🆘 Need Help?

Check the main README.md or contact support.

