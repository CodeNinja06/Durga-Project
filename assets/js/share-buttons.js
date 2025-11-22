// Social Share Buttons
(function() {
  'use strict';

  const createShareButtons = () => {
    const shareHTML = `
      <div class="share-buttons">
        <button class="share-btn twitter" onclick="shareOnTwitter()" aria-label="Share on Twitter">
          <span>🐦</span> Twitter
        </button>
        <button class="share-btn facebook" onclick="shareOnFacebook()" aria-label="Share on Facebook">
          <span>📘</span> Facebook
        </button>
        <button class="share-btn linkedin" onclick="shareOnLinkedIn()" aria-label="Share on LinkedIn">
          <span>💼</span> LinkedIn
        </button>
        <button class="share-btn whatsapp" onclick="shareOnWhatsApp()" aria-label="Share on WhatsApp">
          <span>💬</span> WhatsApp
        </button>
      </div>
    `;

    // Add to CTA sections (fix for browsers that don't support :has())
    const ctaSections = document.querySelectorAll('.section--alt');
    ctaSections.forEach(section => {
      const btnPrimary = section.querySelector('.btn--primary');
      if (btnPrimary) {
        const container = section.querySelector('.container');
        if (container && !container.querySelector('.share-buttons')) {
          const lastDiv = container.querySelector('div:last-child');
          if (lastDiv) {
            lastDiv.insertAdjacentHTML('afterend', shareHTML);
          } else {
            container.insertAdjacentHTML('beforeend', shareHTML);
          }
        }
      }
    });
  };

  // Share functions
  window.shareOnTwitter = function() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  window.shareOnFacebook = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  window.shareOnLinkedIn = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  };

  window.shareOnWhatsApp = function() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out: ' + document.title);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // Native share API (mobile)
  const addNativeShare = () => {
    if (navigator.share) {
      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = '<span>📤</span> Share';
      shareBtn.onclick = async () => {
        try {
          await navigator.share({
            title: document.title,
            text: 'Durga Group of Companies',
            url: window.location.href
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      };

      const shareButtons = document.querySelector('.share-buttons');
      if (shareButtons) {
        shareButtons.appendChild(shareBtn);
      }
    }
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createShareButtons();
      addNativeShare();
    });
  } else {
    createShareButtons();
    addNativeShare();
  }

})();

