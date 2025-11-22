// Node.js/Express Backend Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Rate limiting (simple in-memory store)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // 5 requests per window

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (rateLimitStore.has(ip)) {
    const { count, resetTime } = rateLimitStore.get(ip);
    
    if (now > resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return next();
    }
    
    if (count >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }
    
    rateLimitStore.set(ip, { count: count + 1, resetTime });
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }
  
  next();
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 1000); // Every minute

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Durga Group Backend API'
  });
});

// Contact form submission endpoint
app.post('/api/contact', rateLimit, upload.single('file'), async (req, res) => {
  try {
    const { name, company, email, phone, branch, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@durgagroup.com',
      to: process.env.CONTACT_EMAIL || 'contact@durgagroup.com',
      subject: `New Contact Form Submission - ${branch || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A3D62;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone ? `<a href="tel:${phone}">${phone}</a>` : 'N/A'}</p>
            <p><strong>Business Area:</strong> ${branch || 'N/A'}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #0A3D62;">Message:</h3>
            <p style="white-space: pre-wrap; background: #fff; padding: 15px; border-left: 4px solid #F6B93B; border-radius: 4px;">${message}</p>
          </div>
          ${req.file ? `<p><strong>Attachment:</strong> ${req.file.filename}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Company: ${company || 'N/A'}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Business Area: ${branch || 'N/A'}
        
        Message:
        ${message}
        
        ${req.file ? `Attachment: ${req.file.filename}` : ''}
        
        Submitted on: ${new Date().toLocaleString()}
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    };

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Email not configured. Form submission:', {
        name, company, email, phone, branch,
        message: message.substring(0, 100) + '...'
      });
    }

    // Log submission
    const logEntry = {
      timestamp: new Date().toISOString(),
      name,
      company,
      email,
      phone,
      branch,
      message: message.substring(0, 100) + '...',
      file: req.file ? req.file.filename : null
    };

    // Save to log file (optional)
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(
      path.join(logDir, 'submissions.log'),
      JSON.stringify(logEntry) + '\n'
    );

    res.json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Get submissions log (protected endpoint - add authentication in production)
app.get('/api/submissions', (req, res) => {
  try {
    const logFile = path.join('logs', 'submissions.log');
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .reverse()
        .slice(0, 100); // Last 100 submissions
      
      res.json({ submissions: logs });
    } else {
      res.json({ submissions: [] });
    }
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({ error: 'Error reading submissions' });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Durga Group Backend Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.SMTP_USER ? 'Yes' : 'No (check .env file)'}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
});

