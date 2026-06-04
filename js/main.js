/* ============================================================
   萱大厨 · Xuan Chef · Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- PRELOADER ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 500);
    });
  }

  // ---------- NAV SCROLL + TOGGLE ----------
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
    });
  });

  // Highlight current page in nav
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---------- SCROLL ANIMATIONS ----------
  const animEls = document.querySelectorAll('[data-animate]');
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animEls.forEach(el => animObserver.observe(el));

  // ---------- MENU FILTERING ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (filterBtns.length && menuCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        menuCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---------- LIGHTBOX ----------
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lb-img');
    const lbName = lightbox.querySelector('.lb-dish-name');
    const lbCat = lightbox.querySelector('.lb-dish-cat');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-nav.prev');
    const lbNext = lightbox.querySelector('.lightbox-nav.next');

    let currentCards = [];
    let currentIndex = 0;

    function openLightbox(index, cards) {
      currentCards = cards;
      currentIndex = index;
      showImage();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function showImage() {
      const card = currentCards[currentIndex];
      const img = card.querySelector('img');
      const name = card.querySelector('.dish-name')?.textContent ||
                   card.closest('.dish-card')?.querySelector('.dish-name')?.textContent ||
                   '';
      const cat = card.querySelector('.dish-cat')?.textContent ||
                  card.closest('.dish-card')?.querySelector('.dish-cat')?.textContent ||
                  '';
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbName.textContent = name;
      lbCat.textContent = cat;
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
      showImage();
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % currentCards.length;
      showImage();
    }

    // Click handlers for menu cards
    document.querySelectorAll('.menu-card, .dish-card').forEach((card, i, all) => {
      card.addEventListener('click', () => {
        const visible = [...all].filter(c => !c.classList.contains('hidden'));
        const idx = visible.indexOf(card);
        openLightbox(idx >= 0 ? idx : 0, visible);
      });
    });

    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', prevImage);
    lbNext?.addEventListener('click', nextImage);

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // Click outside
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // ---------- SMOOTH SCROLL for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
