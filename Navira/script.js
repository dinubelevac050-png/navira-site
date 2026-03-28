(() => {
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  // =========================
  // Mobile menu (hamburger)
  // =========================
  const menuBtn = $('[data-menu-toggle]');
  const navPanel = $('[data-nav-panel]');

  if (menuBtn && navPanel) {
    const closeMenu = () => {
      navPanel.removeAttribute('data-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isOpen = navPanel.getAttribute('data-open') === 'true';
      navPanel.setAttribute('data-open', String(!isOpen));
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
      const inside = navPanel.contains(e.target) || menuBtn.contains(e.target);
      if (!inside) closeMenu();
    });

    // close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // =========================
  // Dropdowns (Tiles / Bathrooms)
  // =========================
  const dropdownWraps = $$('[data-dropdown]');

  const closeAllDropdowns = () => {
    dropdownWraps.forEach((wrap) => {
      wrap.removeAttribute('data-open');
      const btn = $('[data-dropdown-btn]', wrap);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  dropdownWraps.forEach((wrap) => {
    const btn = $('[data-dropdown-btn]', wrap);
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = wrap.getAttribute('data-open') === 'true';
      closeAllDropdowns();

      wrap.setAttribute('data-open', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // close dropdowns outside click
  document.addEventListener('click', () => closeAllDropdowns());

  // prevent closing when clicking inside dropdown links area
  dropdownWraps.forEach((wrap) => {
    const dd = $('.dropdown', wrap);
    if (dd) dd.addEventListener('click', (e) => e.stopPropagation());
  });

  // =========================
  // Modal (Quick enquiry)
  // =========================
  const modal = $('[data-modal]');
  const openModalBtns = $$('[data-open-modal]');
  const closeModalBtns = $$('[data-close-modal]');
  const enquiryForm = $('[data-enquiry-form]');

  const openModal = () => {
    if (!modal) return;
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.removeAttribute('data-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  openModalBtns.forEach((b) => b.addEventListener('click', openModal));
  closeModalBtns.forEach((b) => b.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // =========================
  // Form -> mailto: (no backend)
  // =========================
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fd = new FormData(enquiryForm);
      const name = String(fd.get('name') || '').trim();
      const phone = String(fd.get('phone') || '').trim();
      const subject = String(fd.get('subject') || 'Website enquiry').trim();
      const message = String(fd.get('message') || '').trim();

      const bodyLines = [
        `Name: ${name || '-'}`,
        `Phone: ${phone || '-'}`,
        '',
        message || '-'
      ];

      const mailto =
        `mailto:info@naviratiles.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      window.location.href = mailto;

      closeModal();
      enquiryForm.reset();
    });
  }
})();