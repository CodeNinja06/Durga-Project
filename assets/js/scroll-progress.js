// Scroll Progress Indicator
(function() {
  'use strict';

  // Create progress bar
  const createProgressBar = () => {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    return progress;
  };

  // Update progress
  const updateProgress = () => {
    const progress = document.querySelector('.scroll-progress') || createProgressBar();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const progressPercent = (scrollTop / scrollableHeight) * 100;
    
    progress.style.width = Math.min(100, Math.max(0, progressPercent)) + '%';
  };

  // Throttle scroll events
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Initialize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress(); // Initial update

})();

