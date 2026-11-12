/**
 * Lions Club of Eheliyagoda — Website JavaScript
 * Handles: loading screen, navbar scroll, mobile menu, scroll animations,
 * counter animations, smooth scrolling, form handling, back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enable scroll animations once JS is ready
  document.body.classList.add('js-ready');

  // ===== Loading Screen =====
  const loadingScreen = document.getElementById('loadingScreen');

  const hideLoader = () => {
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 400);
    });
  }

  // Fallback: hide loader after 2s max (only if intro is done)
  setTimeout(hideLoader, 2000);

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call

  // ===== Back to Top =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Mobile Menu =====
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Active Nav Link =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = navLinks.querySelectorAll('a:not(.nav-cta)');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // ===== Scroll Animations (Intersection Observer) =====
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for grid items
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(c =>
            c.classList.contains('animate-on-scroll')
          );
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.1}s`;
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ===== Counter Animation =====
  const counterElements = document.querySelectorAll('[data-count]');
  let countersAnimated = new Set();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const plain = element.hasAttribute('data-plain');
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.round(easedProgress * target);

      element.textContent = plain ? current.toString() : formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  }

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Validate
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Simulate submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="material-icons-round" style="font-size:1.1rem;animation:rotate-slow 1s linear infinite">autorenew</span> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('Thank you! Your message has been sent successfully.');
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // ===== Toast Notification =====
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    const icon = toast.querySelector('.material-icons-round');

    if (type === 'error') {
      icon.textContent = 'error';
      icon.style.color = 'var(--accent-rose)';
      toast.style.borderLeftColor = 'var(--accent-rose)';
    } else {
      icon.textContent = 'check_circle';
      icon.style.color = 'var(--accent-emerald)';
      toast.style.borderLeftColor = 'var(--accent-emerald)';
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== Hero Background Slideshow =====
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  // ===== Typed Effect for Hero (subtle) =====
  const heroDescription = document.querySelector('.hero-description');
  if (heroDescription) {
    heroDescription.style.opacity = '0';
    setTimeout(() => {
      heroDescription.style.transition = 'opacity 1s ease';
      heroDescription.style.opacity = '1';
    }, 600);
  }

  // ===== Keyboard Accessibility: Close mobile menu on Escape =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== Lightbox (Gallery + Per-Project Galleries) =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightbox) {
    let currentSet = [];   // array of { src, caption }
    let currentIndex = 0;

    function render() {
      const item = currentSet[currentIndex];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption || '';
      lightboxCaption.textContent = item.caption || '';
    }

    function openLightbox(set, index) {
      currentSet = set;
      currentIndex = index || 0;
      render();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    function step(dir) {
      if (currentSet.length < 2) return;
      currentIndex = (currentIndex + dir + currentSet.length) % currentSet.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => { render(); lightboxImg.style.opacity = '1'; }, 150);
    }

    // --- Gallery section (existing [data-lightbox] items) ---
    const galleryItems = Array.from(document.querySelectorAll('[data-lightbox]'));
    const gallerySet = galleryItems.map(el => ({
      src: el.dataset.lightbox,
      caption: el.dataset.caption || (el.querySelector('img')?.alt || '')
    }));
    galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(gallerySet, i)));

    // --- Per-project galleries (indexed by card order) ---
    const projectGalleries = [
      ["images/projects/p01/1.jpg","images/projects/p01/2.jpg","images/projects/p01/3.jpg","images/projects/p01/4.jpg","images/projects/p01/5.jpg","images/projects/p01/6.jpg","images/projects/p01/7.jpg","images/projects/p01/8.jpg"],
      ["images/projects/p02/1.jpg","images/projects/p02/2.jpg","images/projects/p02/3.jpg","images/projects/p02/4.jpg","images/projects/p02/5.jpg"],
      ["images/projects/p03/1.jpg","images/projects/p03/2.jpg","images/projects/p03/3.jpg","images/projects/p03/4.jpg","images/projects/p03/5.jpg"],
      ["images/projects/p04/1.jpg","images/projects/p04/2.jpg","images/projects/p04/3.jpg","images/projects/p04/4.jpg","images/projects/p04/5.jpg","images/projects/p04/6.jpg","images/projects/p04/7.jpg"],
      ["images/projects/p05/1.jpg","images/projects/p05/2.jpg","images/projects/p05/3.jpg","images/projects/p05/4.jpg","images/projects/p05/5.jpg","images/projects/p05/6.jpg"],
      ["images/projects/p06/1.jpg","images/projects/p06/2.jpg"],
      ["images/projects/p07/1.jpg","images/projects/p07/2.jpg","images/projects/p07/3.jpg","images/projects/p07/4.jpg","images/projects/p07/5.jpg","images/projects/p07/6.jpg","images/projects/p07/7.jpg","images/projects/p07/8.jpg","images/projects/p07/9.jpg","images/projects/p07/10.jpg"],
      ["images/projects/p08/1.jpg","images/projects/p08/2.jpg","images/projects/p08/3.jpg","images/projects/p08/4.jpg","images/projects/p08/5.jpg","images/projects/p08/6.jpg"],
      ["images/projects/p09/1.jpg","images/projects/p09/2.jpg","images/projects/p09/3.jpg","images/projects/p09/4.jpg","images/projects/p09/5.jpg","images/projects/p09/6.jpg","images/projects/p09/7.jpg"],
      ["images/projects/p10/1.jpg","images/projects/p10/2.jpg","images/projects/p10/3.jpg","images/projects/p10/4.jpg","images/projects/p10/5.jpg","images/projects/p10/6.jpg","images/projects/p10/7.jpg","images/projects/p10/8.jpg","images/projects/p10/9.jpg","images/projects/p10/10.jpg","images/projects/p10/11.jpg","images/projects/p10/12.jpg"],
      ["images/projects/p11/1.jpg","images/projects/p11/2.jpg","images/projects/p11/3.jpg","images/projects/p11/4.jpg","images/projects/p11/5.jpg","images/projects/p11/6.jpg","images/projects/p11/7.jpg","images/projects/p11/8.jpg"],
      ["images/projects/p12/1.jpg","images/projects/p12/2.jpg","images/projects/p12/3.jpg","images/projects/p12/4.jpg","images/projects/p12/5.jpg","images/projects/p12/6.jpg","images/projects/p12/7.jpg","images/projects/p12/8.jpg","images/projects/p12/9.jpg","images/projects/p12/10.jpg","images/projects/p12/11.jpg","images/projects/p12/12.jpg","images/projects/p12/13.jpg","images/projects/p12/14.jpg","images/projects/p12/15.jpg"],
      ["images/projects/p13/1.jpg","images/projects/p13/2.jpg","images/projects/p13/3.jpg"],
      ["images/projects/p14/1.jpg","images/projects/p14/2.jpg","images/projects/p14/3.jpg","images/projects/p14/4.jpg","images/projects/p14/5.jpg","images/projects/p14/6.jpg","images/projects/p14/7.jpg"],
      ["images/projects/p15/1.jpg","images/projects/p15/2.jpg","images/projects/p15/3.jpg","images/projects/p15/4.jpg","images/projects/p15/5.jpg","images/projects/p15/6.jpg","images/projects/p15/7.jpg","images/projects/p15/8.jpg","images/projects/p15/9.jpg","images/projects/p15/10.jpg","images/projects/p15/11.jpg","images/projects/p15/12.jpg"],
      ["images/projects/p16/1.jpg","images/projects/p16/2.jpg","images/projects/p16/3.jpg","images/projects/p16/4.jpg"],
      ["images/projects/p17/1.jpg","images/projects/p17/2.jpg","images/projects/p17/3.jpg","images/projects/p17/4.jpg","images/projects/p17/5.jpg","images/projects/p17/6.jpg","images/projects/p17/7.jpg","images/projects/p17/8.jpg","images/projects/p17/9.jpg","images/projects/p17/10.jpg","images/projects/p17/11.jpg","images/projects/p17/12.jpg","images/projects/p17/13.jpg","images/projects/p17/14.jpg","images/projects/p17/15.jpg","images/projects/p17/16.jpg","images/projects/p17/17.jpg","images/projects/p17/18.jpg","images/projects/p17/19.jpg","images/projects/p17/20.jpg"]
    ];
    const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));
    projectCards.forEach((card, i) => {
      const imgs = projectGalleries[i];
      if (!imgs || !imgs.length) return;
      const title = (card.querySelector('h3')?.textContent || 'Project').trim();
      const imgWrap = card.querySelector('.project-card-image');
      if (imgWrap) {
        const badge = document.createElement('span');
        badge.className = 'project-photo-count';
        badge.innerHTML = '<span class="material-icons-round">photo_library</span> ' + imgs.length;
        imgWrap.appendChild(badge);
      }
      card.classList.add('project-card--clickable');
      card.addEventListener('click', () => {
        const set = imgs.map((src, idx) => ({ src, caption: title + '  ·  ' + (idx + 1) + ' / ' + imgs.length }));
        openLightbox(set, 0);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => step(-1));
    lightboxNext.addEventListener('click', () => step(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) step(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  console.log('%c🦁 Lions Club of Eheliyagoda Legacy — Our Service Today, Our Legacy Tomorrow', 'color: #d4a843; font-size: 16px; font-weight: bold;');
});
