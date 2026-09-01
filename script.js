/* ═══════════════════════════════════════════
   JYOTI PORTFOLIO — SCRIPT.JS
   All animations, effects, and interactions
═══════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────
// 1. LOADING SCREEN
// ──────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  const pct    = document.getElementById('loaderPct');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 300);
    }
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

// ──────────────────────────────────────────
// 2. MAIN INIT (after loader)
// ──────────────────────────────────────────
function initAll() {
  initCursor();
  initScrollProgress();
  initNavbar();
  initTheme();
  initHero3D();
  initTyping();
  initMouseGlow();
  initReveal();
  initSkillBars();
  initCounters();
  initTilt();
  initMagnetic();
  initCarousel();
  initLightbox();
  initContactForm();
  initBackToTop();
  initMobileMenu();
}

// ──────────────────────────────────────────
// 3. CURSOR
// ──────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects
  document.querySelectorAll('a, button, .tilt-card, .gallery-card, .carousel-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '14px';
      dot.style.height = '14px';
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(124,58,237,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '8px';
      dot.style.height = '8px';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0,212,255,0.6)';
    });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

// ──────────────────────────────────────────
// 4. SCROLL PROGRESS
// ──────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

// ──────────────────────────────────────────
// 5. NAVBAR
// ──────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }, { passive: true });
}

// ──────────────────────────────────────────
// 6. THEME TOGGLE
// ──────────────────────────────────────────
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// ──────────────────────────────────────────
// 7. THREE.JS HERO BACKGROUND
// ──────────────────────────────────────────
function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particles
  const count = 1200;
  const geo   = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const c1 = new THREE.Color('#00D4FF');
  const c2 = new THREE.Color('#7C3AED');

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const mix = Math.random();
    const col = new THREE.Color().lerpColors(c1, c2, mix);
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Animate
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.001;
    points.rotation.y = frame + mouseX;
    points.rotation.x = frame * 0.5 + mouseY;
    renderer.render(scene, camera);
  }
  animate();
}

// ──────────────────────────────────────────
// 8. TYPING EFFECT
// ──────────────────────────────────────────
function initTyping() {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  const texts = [
    'Data Analyst',
    'Python Developer',
    'Power BI Enthusiast',
    
    'BI Developer',
  ];
  let i = 0, j = 0, deleting = false;

  function type() {
    const current = texts[i];
    if (!deleting) {
      el.textContent = current.slice(0, j + 1);
      j++;
      if (j === current.length) {
        setTimeout(() => { deleting = true; }, 1800);
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

// ──────────────────────────────────────────
// 9. MOUSE GLOW
// ──────────────────────────────────────────
function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  if (!glow) return;

  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
  });
}

// ──────────────────────────────────────────
// 10. SCROLL REVEAL
// ──────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────
// 11. SKILL BARS
// ──────────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.pct;
        entry.target.style.width = pct + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

// ──────────────────────────────────────────
// 12. ANIMATED COUNTERS
// ──────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };
      update();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ──────────────────────────────────────────
// 13. TILT EFFECT
// ──────────────────────────────────────────
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

// ──────────────────────────────────────────
// 14. MAGNETIC BUTTONS
// ──────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

// ──────────────────────────────────────────
// 15. TESTIMONIAL CAROUSEL
// ──────────────────────────────────────────
function initCarousel() {
  const track = document.getElementById('testTrack');
  if (!track) return;

  const cards    = track.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  let current = 0;
  let autoPlay;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function startAuto() {
    autoPlay = setInterval(() => goTo(current + 1), 4500);
  }
  function resetAuto() {
    clearInterval(autoPlay);
    startAuto();
  }
  startAuto();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => goTo(current));
}

// ──────────────────────────────────────────
// 16. LIGHTBOX
// ──────────────────────────────────────────
const galleryData = [
  { title: 'Sales Analytics Dashboard', desc: 'Real-time sales KPIs with regional breakdown and YoY comparison', color: 'linear-gradient(135deg,#1e3a5f,#00D4FF22)', icon: 'fa-chart-bar' },
  { title: 'HR Insights Dashboard',     desc: 'Employee attrition, performance and workforce demographics',      color: 'linear-gradient(135deg,#3b1563,#7C3AED22)', icon: 'fa-users' },
  { title: 'Healthcare KPIs',           desc: 'Patient outcomes, bed occupancy and readmission tracking',        color: 'linear-gradient(135deg,#063520,#22c55e22)', icon: 'fa-heartbeat' },
  { title: 'Retail Dashboard',          desc: 'Product performance, inventory and customer segment analysis',    color: 'linear-gradient(135deg,#5c1a1a,#ec489922)', icon: 'fa-shopping-bag' },
  { title: 'Marketing ROI Dashboard',   desc: 'Campaign performance, channel attribution and lead funnel',      color: 'linear-gradient(135deg,#3d1a00,#f59e0b22)', icon: 'fa-globe' },
  { title: 'Finance Overview',          desc: 'P&L statements, budget variance and cash flow visualizations',   color: 'linear-gradient(135deg,#1a1a3d,#6366f122)', icon: 'fa-coins' },
];

function openLightbox(idx) {
  const lb = document.getElementById('lightbox');
  const inner = document.getElementById('lightboxInner');
  const d = galleryData[idx];

  inner.innerHTML = `
    <div style="background:${d.color};border-radius:12px;padding:3rem;margin-bottom:1.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem;">
      <i class="fas ${d.icon}" style="font-size:4rem;color:#fff;opacity:0.8"></i>
    </div>
    <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:0.75rem;">${d.title}</h3>
    <p style="color:var(--text-secondary);font-size:0.95rem;">${d.desc}</p>
    <div style="display:flex;gap:1rem;margin-top:1.5rem;justify-content:center;">
      <a href="#" class="btn-primary"><i class="fab fa-github"></i> View on GitHub</a>
      <a href="#" class="btn-secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>
    </div>
  `;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// Keyboard close
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// ──────────────────────────────────────────
// 17. CONTACT FORM
// ──────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name    = form.querySelector('#cname');
    const email   = form.querySelector('#cemail');
    const subject = form.querySelector('#csubject');
    const message = form.querySelector('#cmessage');

    // Reset errors
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));

    if (!name.value.trim()) { document.getElementById('nameError').classList.add('show'); valid = false; }
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { document.getElementById('emailError').classList.add('show'); valid = false; }
    if (!subject.value.trim()) { document.getElementById('subjectError').classList.add('show'); valid = false; }
    if (!message.value.trim()) { document.getElementById('messageError').classList.add('show'); valid = false; }

    if (!valid) return;

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      document.getElementById('formSuccess').classList.add('show');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        document.getElementById('formSuccess').classList.remove('show');
      }, 4000);
    }, 1500);
  });

  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      const errId = el.id.replace('c', '') + 'Error';
      const err = document.getElementById(errId);
      if (err && el.value.trim()) err.classList.remove('show');
    });
  });
}

// ──────────────────────────────────────────
// 18. BACK TO TOP
// ──────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ──────────────────────────────────────────
// 19. MOBILE MENU
// ──────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    drawer.style.display = open ? 'block' : 'none';
    if (open) {
      requestAnimationFrame(() => {
        drawer.style.opacity = '1';
        drawer.style.transform = 'translateY(0)';
      });
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');
  if (!hamburger || !drawer) return;
  drawer.classList.remove('open');
  hamburger.classList.remove('open');
  drawer.style.display = 'none';
}

// ──────────────────────────────────────────
// 20. GSAP ENHANCED ANIMATIONS (if available)
// ──────────────────────────────────────────
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge',      { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out' });
  gsap.from('.hero-name',       { opacity: 0, y: 30, duration: 0.7, delay: 0.35, ease: 'power3.out' });
  gsap.from('.hero-typing-wrap',{ opacity: 0, y: 20, duration: 0.6, delay: 0.5,  ease: 'power3.out' });
  gsap.from('.hero-desc',       { opacity: 0, y: 20, duration: 0.6, delay: 0.65, ease: 'power3.out' });
  gsap.from('.hero-btns',       { opacity: 0, y: 20, duration: 0.6, delay: 0.8,  ease: 'power3.out' });
  gsap.from('.hero-socials',    { opacity: 0, y: 20, duration: 0.6, delay: 0.95, ease: 'power3.out' });
  gsap.from('.profile-frame',   { opacity: 0, scale: 0.85, duration: 0.8, delay: 0.4, ease: 'back.out(1.2)' });

  // Staggered project cards
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '#projects', start: 'top 75%' },
    opacity: 0, y: 40, stagger: 0.12, duration: 0.6, ease: 'power3.out'
  });

  // Achievement cards
  gsap.from('.achievement-card', {
    scrollTrigger: { trigger: '#achievements', start: 'top 75%' },
    opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.5, ease: 'back.out(1.3)'
  });

  // Blog cards
  gsap.from('.blog-card', {
    scrollTrigger: { trigger: '#blog', start: 'top 75%' },
    opacity: 0, y: 30, stagger: 0.15, duration: 0.6, ease: 'power3.out'
  });

  // Cert track scroll animation
  gsap.to('.cert-track', {
    scrollTrigger: { trigger: '#certifications', start: 'top 80%', end: 'bottom 20%', scrub: 1 },
    x: -200
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el.children, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, y: 25, stagger: 0.12, duration: 0.5, ease: 'power2.out'
    });
  });
}
