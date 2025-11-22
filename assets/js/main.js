(function(){
  'use strict';
  
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (navToggle && links) {
    navToggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? 'Close' : 'Menu';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = 'Menu';
      }
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }
  
  // Back to Top Button
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Animated Counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animate = (el) => {
      const target = Number(el.getAttribute('data-counter') || '0');
      const dur = 1500;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const val = Math.floor(target * (0.5 - Math.cos(Math.PI * p) / 2));
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    
    const io = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    
    counters.forEach(el => io.observe(el));
  }
  
  // Testimonials Slider
  const slider = document.querySelector('.slider');
  if (slider) {
    const track = slider.querySelector('.slides');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.slider__dots');
    let i = 0;
    let autoplayInterval;
    
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, di) => {
        d.classList.toggle('is-active', di === i);
      });
    };
    
    slides.forEach((_, idx) => {
      const d = document.createElement('button');
      d.className = 'dot' + (idx === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      d.addEventListener('click', () => {
        go(idx);
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => go(i + 1), 5000);
      });
      dotsWrap.appendChild(d);
    });
    
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => go(i + 1), 5000);
    };
    
    startAutoplay();
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', startAutoplay);
  }
  
  // Project Filters
  const filterWrap = document.querySelector('[data-filters]');
  if (filterWrap) {
    const buttons = filterWrap.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('[data-project]');
    
    const apply = (cat) => {
      items.forEach(it => {
        const tags = it.getAttribute('data-project') || '';
        const shouldShow = cat === 'all' || tags.includes(cat);
        it.style.opacity = '0';
        it.style.transform = 'translateY(20px)';
        it.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
          it.style.display = shouldShow ? 'block' : 'none';
          if (shouldShow) {
            setTimeout(() => {
              it.style.opacity = '1';
              it.style.transform = 'translateY(0)';
            }, 50);
          }
        }, 200);
      });
    };
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        apply(btn.getAttribute('data-cat') || 'all');
      });
    });
    
    apply('all');
  }
  
  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe sections and cards
  document.querySelectorAll('.section, .card, .project').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Lazy Loading Images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    // Observe lazy-loaded images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    // Mark regular lazy images as loaded when they load
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
      }
    });
  }
  
  // Form Validation Enhancement
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      const successMsg = form.querySelector('#form-success');
      
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        
        // Check if form submission is successful (Netlify forms)
        setTimeout(() => {
          // Show success message if available
          if (successMsg) {
            successMsg.classList.add('visible');
            form.reset();
            window.scrollTo({
              top: successMsg.offsetTop - 100,
              behavior: 'smooth'
            });
          }
          
          // Re-enable after 5 seconds
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            if (successMsg) {
              successMsg.classList.remove('visible');
            }
          }, 5000);
        }, 1000);
      }
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Year in footer
  const y = document.getElementById('year');
  if (y) {
    y.textContent = String(new Date().getFullYear());
  }
  
  // Close mobile menu on link click
  if (links) {
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.textContent = 'Menu';
        }
      });
    });
  }
})();
