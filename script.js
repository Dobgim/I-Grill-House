/**
 * I GRILL HOUSE – script.js
 * Author: I Grill House Web Team
 * Version: 1.0
 * Description: Complete interactive functionality for the restaurant website
 *
 * Sections:
 *  1. Navbar – sticky scroll, hamburger toggle, active link tracking
 *  2. Menu Tabs – category switching
 *  3. Gallery Modal – open/close/navigate
 *  4. Testimonial Slider – auto-play, dots, prev/next
 *  5. Reservation Form – client-side validation & success message
 *  6. Scroll Reveal – IntersectionObserver animations
 *  7. Footer – dynamic year
 *  8. Smooth Scroll – native anchor override for offset
 */

'use strict';

/* ============================================================
   1. NAVBAR – Sticky + Hamburger + Active Link Tracking
============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  /* --- Sticky scroll style --- */
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  /* --- Active link based on scroll position --- */
  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let current = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* --- Hamburger toggle --- */
  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /* --- Close menu on nav link click (mobile) --- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  /* --- Close menu on outside click --- */
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  hamburger.addEventListener('click', toggleMenu);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on init
})();


/* ============================================================
   2. SMOOTH SCROLL – with navbar offset
============================================================ */
(function initSmoothScroll() {
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '70'
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   3. MENU TABS – Category Filter
============================================================ */
(function initMenuTabs() {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const panels   = document.querySelectorAll('.menu-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panel visibility
      panels.forEach(panel => {
        if (panel.id === 'panel-' + targetTab) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
})();


/* ============================================================
   4. GALLERY MODAL – Open / Close / Navigate
============================================================ */
(function initGalleryModal() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal        = document.getElementById('gallery-modal');
  const modalImg     = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeBtn     = document.getElementById('modal-close');
  const prevBtn      = document.getElementById('modal-prev');
  const nextBtn      = document.getElementById('modal-next');

  // Build gallery data from DOM
  const galleryData = [];
  galleryItems.forEach(item => {
    const imgEl = item.querySelector('.gallery-img');
    const bg    = imgEl ? window.getComputedStyle(imgEl).backgroundImage : '';
    const cls   = imgEl ? imgEl.className : '';
    galleryData.push({
      bg,
      cls,
      caption: item.getAttribute('data-caption') || ''
    });
  });

  let currentIndex = 0;

  function openModal(index) {
    currentIndex = ((index % galleryData.length) + galleryData.length) % galleryData.length;
    updateModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateModal() {
    const data = galleryData[currentIndex];
    // Reset classes and set background
    modalImg.style.backgroundImage = data.bg;
    modalImg.className = 'modal-img';
    if (data.cls) {
      // Copy placeholder classes if no real bg image
      const extras = data.cls.replace('gallery-img', '').trim();
      if (extras) modalImg.className += ' ' + extras;
    }
    modalCaption.textContent = data.caption;
  }

  function navigate(dir) {
    currentIndex = ((currentIndex + dir) + galleryData.length) % galleryData.length;
    updateModal();
  }

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(index);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View ' + (item.getAttribute('data-caption') || 'image'));
  });

  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click',  () => navigate(-1));
  nextBtn.addEventListener('click',  () => navigate( 1));

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate( 1);
  });
})();


/* ============================================================
   5. TESTIMONIAL SLIDER – Auto-play + Dots + Prev/Next
============================================================ */
(function initTestimonialSlider() {
  const track       = document.getElementById('testimonial-track');
  const prevBtn     = document.getElementById('testimonial-prev');
  const nextBtn     = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (!track) return;

  const cards     = track.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  let   current   = 0;
  let   autoTimer = null;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
    dot.setAttribute('type', 'button');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() {
    return dotsContainer.querySelectorAll('.dot');
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 8}px))`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      diff > 0 ? next() : prev();
      startAuto();
    }
  });

  startAuto();
})();


/* ============================================================
   6. RESERVATION FORM – Client-side Validation
============================================================ */
(function initReservationForm() {
  const form    = document.getElementById('reservation-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('btn-reserve');

  if (!form) return;

  const fields = {
    name:   { el: document.getElementById('guest-name'),       err: document.getElementById('error-name'),    validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    phone:  { el: document.getElementById('guest-phone'),      err: document.getElementById('error-phone'),   validate: v => /^[\+\d\s\-\(\)]{7,15}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.' },
    guests: { el: document.getElementById('guest-count'),      err: document.getElementById('error-guests'),  validate: v => v >= 1 && v <= 50 ? '' : 'Please enter 1–50 guests.' },
    time:   { el: document.getElementById('preferred-time'),   err: document.getElementById('error-time'),    validate: v => v ? '' : 'Please select a preferred time.' }
  };

  function validateField(key) {
    const { el, err, validate } = fields[key];
    const message = validate(el.value);
    err.textContent = message;
    if (message) {
      el.classList.add('error');
    } else {
      el.classList.remove('error');
    }
    return message === '';
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(key);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const allValid = Object.keys(fields).map(key => validateField(key)).every(Boolean);

    if (!allValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate submission
    btn.textContent = '⏳ Sending...';
    btn.disabled = true;

    setTimeout(() => {
      // Hide form fields, show success
      const formFields = form.querySelectorAll('.form-group, .form-row, #btn-reserve');
      formFields.forEach(el => { el.style.display = 'none'; });
      success.classList.add('show');

      // Reset form after 8 seconds
      setTimeout(() => {
        form.reset();
        success.classList.remove('show');
        formFields.forEach(el => { el.style.display = ''; });
        btn.textContent = '🍽️ Reserve My Table';
        btn.disabled = false;
      }, 8000);

    }, 1200);
  });
})();


/* ============================================================
   7. SCROLL REVEAL – IntersectionObserver
============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   8. ORDER BUTTONS – WhatsApp redirect
============================================================ */
(function initOrderButtons() {
  const orderBtns = document.querySelectorAll('.order-btn');
  const WA_NUMBER = '237670000000';

  orderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Find parent card and get item name + price
      const card  = btn.closest('.menu-card');
      const title = card ? card.querySelector('h3')?.textContent?.trim() : 'an item';
      const price = card ? card.querySelector('.price')?.textContent?.trim() : '';

      const message = encodeURIComponent(
        `Hello I Grill House! 👋\nI'd like to order: *${title}* (${price})\nCould you please confirm availability? Thank you!`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
    });
  });
})();


/* ============================================================
   9. FOOTER – Dynamic Year
============================================================ */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ============================================================
   10. PAGE LOAD – Remove loading flicker
============================================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
