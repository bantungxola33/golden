document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Terminal typewriter ---------- */
  const taglines = [
    'Build. Learn. Innovate.',
    'Building the Future with Software.',
    'Software. Education. Innovation.',
    'Empowering Developers Worldwide.',
    'Code. Create. Succeed.',
    'Learn Today. Build Tomorrow.',
    'Engineering Digital Excellence.'
  ];

  const typedEl = document.getElementById('typedText');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = taglines[0];
    } else {
      let taglineIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 55;
      const DELETE_SPEED = 28;
      const HOLD_TIME = 1600;

      function tick() {
        const current = taglines[taglineIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            taglineIndex = (taglineIndex + 1) % taglines.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }
      tick();
    }
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 12) {
      nav.style.boxShadow = '0 8px 30px -12px rgba(27,14,61,0.4)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- CTA form ---------- */
  /* Posts to Formspree so you actually receive submissions.
     Set up your endpoint first — see README.md. */
  const form = document.getElementById('ctaForm');
  const note = document.getElementById('ctaNote');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      if (!email) return;

      const isConfigured = !form.action.includes('YOUR_FORM_ID');

      if (!isConfigured) {
        note.textContent = `Form not connected yet — see README.md to set up Formspree. (Would have sent: ${email})`;
        return;
      }

      note.textContent = 'Sending…';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          note.textContent = `Thanks — we'll be in touch at ${email}.`;
          form.reset();
        } else {
          note.textContent = "Something went wrong — please try again or email us directly.";
        }
      } catch (err) {
        note.textContent = "Something went wrong — please try again or email us directly.";
      }
    });
  }

});
