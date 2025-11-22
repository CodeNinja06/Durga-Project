// Netlify Serverless Function for Contact Form Submission
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    const { name, company, email, phone, branch, message, file } = formData;

    // Validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Prepare email content
    const emailContent = {
      to: process.env.CONTACT_EMAIL || 'contact@durgagroup.com',
      from: process.env.FROM_EMAIL || 'noreply@durgagroup.com',
      subject: `New Contact Form Submission - ${branch || 'General'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Business Area:</strong> ${branch || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ${file ? `<p><strong>Attachment:</strong> ${file}</p>` : ''}
        <hr>
        <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
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
        
        ${file ? `Attachment: ${file}` : ''}
        
        Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Log submission (for debugging)
    console.log('Contact form submission:', {
      name,
      company,
      email,
      phone,
      branch,
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // TODO: Integrate with email service
    // Option 1: SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailContent);

    // Option 2: Use Netlify's built-in email (if configured)
    // This requires additional setup in Netlify dashboard

    // For now, we'll return success and log the submission
    // You can view logs in Netlify Functions dashboard

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Thank you! Your message has been received. We will get back to you soon.' 
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error. Please try again later.' 
      })
    };
  }
};
