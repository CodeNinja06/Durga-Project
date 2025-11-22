// Contact Form Handler
(function() {
  'use strict';

  const form = document.querySelector('form[name="contact"]');
  if (!form) return;

  // Determine API endpoint
  const getApiEndpoint = () => {
    // Check if we're on Netlify
    if (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com')) {
      return '/.netlify/functions/submit-contact';
    }
    // Check if we're on localhost with backend server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api/contact';
    }
    // Production API endpoint (update with your domain)
    return '/api/contact';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');
    const originalBtnText = submitBtn.innerHTML;

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';

    try {
      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        branch: formData.get('branch'),
        message: formData.get('message')
      };

      // Handle file upload if present
      const fileInput = form.querySelector('input[type="file"]');
      let fileData = null;
      
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // For Netlify Functions, we'll send file name
        // For Express backend, we'll use FormData
        fileData = file;
      }

      // Try backend API first
      const apiEndpoint = getApiEndpoint();
      let response;

      if (fileData && !apiEndpoint.includes('netlify')) {
        // Use FormData for Express backend with file
        const uploadFormData = new FormData();
        Object.keys(data).forEach(key => {
          uploadFormData.append(key, data[key]);
        });
        uploadFormData.append('file', fileData);

        response = await fetch(apiEndpoint, {
          method: 'POST',
          body: uploadFormData
        });
      } else {
        // JSON for Netlify Functions or without file
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        if (successMsg) {
          successMsg.classList.add('visible');
          form.reset();
          
          // Scroll to success message
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset button after delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (successMsg) {
            successMsg.classList.remove('visible');
          }
        }, 5000);

      } else {
        // Error from API
        throw new Error(result.error || 'Failed to send message');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Fallback to Netlify Forms if available
      if (form.hasAttribute('data-netlify')) {
        console.log('Falling back to Netlify Forms...');
        // Let Netlify handle it
        form.submit();
        return;
      }

      // Show error message
      alert('Error: ' + (error.message || 'Failed to send message. Please try again.'));
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Real-time validation
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.setCustomValidity('Please enter a valid email address');
      } else {
        this.setCustomValidity('');
      }
    });
  }

  // Phone number formatting (optional)
  const phoneInput = form.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        value = '+' + value;
      }
      // You can add more formatting here
    });
  }

})();

