// Dark Mode Toggle with Persistence
(function() {
  'use strict';

  // Get theme from localStorage or system preference
  const getTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Set theme
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleIcon(theme);
  };

  // Update toggle icon
  const updateToggleIcon = (theme) => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const sun = toggle.querySelector('.icon.sun');
    const moon = toggle.querySelector('.icon.moon');
    
    if (theme === 'dark') {
      if (sun) sun.style.opacity = '0';
      if (moon) moon.style.opacity = '1';
    } else {
      if (sun) sun.style.opacity = '1';
      if (moon) moon.style.opacity = '0';
    }
  };

  // Initialize theme
  const initTheme = () => {
    const theme = getTheme();
    setTheme(theme);
  };

  // Create theme toggle button
  const createToggle = () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = `
      <span class="icon sun">☀️</span>
      <span class="icon moon">🌙</span>
    `;

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });

    // Insert before contact button or at end
    const contactBtn = nav.querySelector('.nav__link.btn--primary');
    if (contactBtn) {
      nav.insertBefore(toggle, contactBtn);
    } else {
      nav.appendChild(toggle);
    }
  };

  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      createToggle();
    });
  } else {
    initTheme();
    createToggle();
  }

})();

