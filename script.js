(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  addEventListener('scroll', setHeader, { passive: true });

  // Lazy background video loading. Only the hero has a source at first paint.
  // Lower videos are attached shortly before they enter the viewport and play only while visible.
  const videos = [...document.querySelectorAll('video[data-src-desktop]')];
  if (videos.length) {
    const mobile = matchMedia('(max-width: 900px)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;

    const sourceFor = video => mobile.matches ? video.dataset.srcMobile : video.dataset.srcDesktop;
    const loadVideo = video => {
      if (video.dataset.loaded === 'true' || reducedMotion || saveData) return;
      video.src = sourceFor(video);
      video.dataset.loaded = 'true';
      video.load();
    };

    const hero = videos.find(v => v.dataset.hero === 'true');
    if (hero && !reducedMotion && !saveData) {
      loadVideo(hero);
      hero.addEventListener('canplay', () => hero.play().catch(() => {}), { once: true });
    }

    const preloadObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) loadVideo(entry.target);
      });
    }, { rootMargin: '85% 0px 85% 0px', threshold: 0.01 });

    const playObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= .28) {
          loadVideo(video);
          if (!reducedMotion && !saveData) video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: [0, .28, .55] });

    videos.forEach(v => {
      preloadObserver.observe(v);
      playObserver.observe(v);
    });

    mobile.addEventListener?.('change', () => {
      videos.forEach(video => {
        if (video.dataset.loaded === 'true') {
          const wasPlaying = !video.paused;
          video.removeAttribute('src');
          video.dataset.loaded = 'false';
          loadVideo(video);
          if (wasPlaying) video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
        }
      });
    });
  }

  // Trail node highlighting. The trail itself is native SVG/HTML so it stays crisp at every screen size.
  const sections = [...document.querySelectorAll('.story-section[data-trail-node]')];
  const trailNodes = [...document.querySelectorAll('.trail-node[data-trail-label]')];

  if (sections.length && trailNodes.length) {
    let activeNumber = null;
    const activate = section => {
      const nextNumber = section.dataset.trailNode;
      if (nextNumber === activeNumber) return;
      activeNumber = nextNumber;
      trailNodes.forEach(node => {
        node.classList.toggle('active', node.dataset.trailLabel === activeNumber);
      });
    };

    // Use a stable viewport anchor rather than transient intersection events.
    // Whichever section contains this point stays active until the anchor crosses
    // into the next section, so the illuminated node remains lit for the full section.
    let trailTicking = false;
    const updateTrail = () => {
      const anchorY = window.innerHeight * 0.46;
      let current = sections[0];
      let nearestDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorY && rect.bottom > anchorY) {
          current = section;
          nearestDistance = -1;
          return;
        }
        if (nearestDistance >= 0) {
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - anchorY);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            current = section;
          }
        }
      });

      activate(current);
      trailTicking = false;
    };

    const requestTrailUpdate = () => {
      if (trailTicking) return;
      trailTicking = true;
      requestAnimationFrame(updateTrail);
    };

    updateTrail();
    addEventListener('scroll', requestTrailUpdate, { passive: true });
    addEventListener('resize', requestTrailUpdate, { passive: true });
  }

  // FAQ accordions.
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    });
  });

  // Static-site contact form: opens the visitor's mail app with the entered message.
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(data.get('subject') || 'Edgewood inquiry');
      const body = encodeURIComponent(`Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n\n${data.get('message') || ''}`);
      location.href = `mailto:stay@edgewoodcatskills.com?subject=${subject}&body=${body}`;
    });
  }
})();
