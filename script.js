/**
 * Lions Club of Eheliyagoda — Website JavaScript
 * Handles: loading screen, navbar scroll, mobile menu, scroll animations,
 * counter animations, smooth scrolling, form handling, back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enable scroll animations once JS is ready
  document.body.classList.add('js-ready');

  // ===== Intro Video Screen =====
  const introScreen = document.getElementById('introVideoScreen');
  const introVideo = document.getElementById('introVideo');
  const skipBtn = document.getElementById('introSkipBtn');
  const loadingScreen = document.getElementById('loadingScreen');

  const dismissIntro = () => {
    if (introScreen && !introScreen.classList.contains('hidden')) {
      introScreen.classList.add('hidden');
      // Hide loading screen right after intro (page is already loaded by then)
      if (loadingScreen) loadingScreen.classList.add('hidden');
    }
  };

  if (introVideo) {
    introVideo.addEventListener('ended', dismissIntro);
    // Fallback: dismiss after 30s max in case video is very long
    setTimeout(dismissIntro, 30000);
  } else {
    dismissIntro();
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (introVideo) introVideo.pause();
      dismissIntro();
    });
  }

  // ===== Loading Screen =====
  const hideLoader = () => {
    // Only hide loading screen if intro is already gone
    if (introScreen && !introScreen.classList.contains('hidden')) return;
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
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

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

      element.textContent = formatNumber(current);

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

  // ===== Gallery Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightbox) {
    const galleryItems = Array.from(document.querySelectorAll('[data-lightbox]'));
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const item = galleryItems[index];
      lightboxImg.src = item.dataset.lightbox;
      lightboxImg.alt = item.querySelector('img')?.alt || '';
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        openLightbox(currentIndex);
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        openLightbox(currentIndex);
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
    }, { passive: true });
  }

  console.log('%c🦁 Lions Club of Eheliyagoda Legacy — We Serve', 'color: #d4a843; font-size: 16px; font-weight: bold;');
});
