document.addEventListener('DOMContentLoaded', () => {

  // ── Footer year ──
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ── Typewriter ──
  const words = [
    'Generative AI solutions.',
    'RAG pipelines.',
    'ML/DL models.',
    'AI agents.',
    'production-ready APIs.',
    'data-driven insights.',
  ];
  const tw = document.getElementById('typewriter');
  if (tw) {
    let wi = 0, ci = 0, deleting = false;
    function typeStep() {
      const word = words[wi];
      if (!deleting) {
        tw.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(typeStep, 1800); return; }
      } else {
        tw.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(typeStep, deleting ? 45 : 70);
    }
    setTimeout(typeStep, 900);
  }

  // ── Scroll reveal (Intersection Observer) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Hero fade-up (trigger on load) ──
  document.querySelectorAll('.fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 80 + i * 80);
  });

  // ── Mobile nav toggle ──
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Canvas neural-network background ──
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COUNT = 75;
  const MAX_DIST = 145;
  const COLORS = ['99,102,241', '6,182,212', '139,92,246'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      o: Math.random() * 0.45 + 0.4,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.o})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();

  // ── Contact form (Formspree AJAX) ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = 'Sending…';
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          contactForm.reset();
          formSuccess.style.display = 'block';
          formSubmitBtn.style.display = 'none';
        } else {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
          alert('Something went wrong. Please try again or email me directly.');
        }
      } catch {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        alert('Network error. Please try again.');
      }
    });
  }

  // ── Glowing border effect + tilt on project cards ──
  const cards = document.querySelectorAll('.project-card');
  const glowState = new Map();

  cards.forEach(card => {
    const glowEl = document.createElement('div');
    glowEl.className = 'glow-border';
    card.appendChild(glowEl);
    glowState.set(card, { current: 0, target: 0, active: false, rx: 0, ry: 0, txRx: 0, txRy: 0 });

    card.addEventListener('mouseleave', () => {
      const s = glowState.get(card);
      s.txRx = 0; s.txRy = 0;
    });
  });

  document.addEventListener('pointermove', e => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const s = glowState.get(card);

      // Tilt
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (inside) {
        const relX = (e.clientX - rect.left) / rect.width  - 0.5;
        const relY = (e.clientY - rect.top)  / rect.height - 0.5;
        s.txRy =  relX * 10;
        s.txRx = -relY * 8;
      }

      // Glow
      const proximity = 60;
      const near =
        e.clientX > rect.left - proximity && e.clientX < rect.right + proximity &&
        e.clientY > rect.top - proximity  && e.clientY < rect.bottom + proximity;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const inactiveR = 0.3 * Math.min(rect.width, rect.height);

      if (!near || dist < inactiveR) { s.active = false; return; }

      s.active = true;
      const angle = (180 * Math.atan2(e.clientY - cy, e.clientX - cx)) / Math.PI + 90;
      const diff = ((angle - s.current + 180) % 360) - 180;
      s.target = s.current + diff;
    });
  });

  (function glowTick() {
    cards.forEach(card => {
      const s = glowState.get(card);
      // Glow angle lerp
      s.current += (s.target - s.current) * 0.09;
      card.style.setProperty('--start', s.current.toFixed(2));
      card.style.setProperty('--glow-active', s.active ? '1' : '0');
      // Tilt lerp
      s.rx = (s.rx || 0) + ((s.txRx || 0) - (s.rx || 0)) * 0.1;
      s.ry = (s.ry || 0) + ((s.txRy || 0) - (s.ry || 0)) * 0.1;
      card.style.transform = `perspective(600px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) translateY(-4px)`;
    });
    requestAnimationFrame(glowTick);
  })();

});
