// Accordion behavior and minor enhancements
(function(){
  const panels = document.querySelectorAll('.accordion');
  panels.forEach((btn)=>{
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if(!panel) return;
    // initialize
    panel.style.maxHeight = '0px';

    const toggle = ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }else{
        panel.style.maxHeight = '0px';
      }
    };

    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggle();
      }
    });
  });

  // Year in footer
  const y = document.getElementById('year');
  if(y){ y.textContent = String(new Date().getFullYear()); }

  const counters = document.querySelectorAll('.counter');
  if(counters.length){
    const animate = (el)=>{
      const target = Number(el.getAttribute('data-target') || '0');
      const duration = 1200;
      const start = performance.now();
      const step = (now)=>{
        const p = Math.min(1, (now - start)/duration);
        const val = Math.floor(target * (0.5 - Math.cos(Math.PI*p)/2));
        el.textContent = String(val);
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach((e)=>{
        if(e.isIntersecting){
          const el = e.target;
          animate(el);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el)=> io.observe(el));
  }
})();
