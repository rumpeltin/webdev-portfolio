// BUTTON to scroll back up
document.addEventListener('DOMContentLoaded', () => {
  const myButton = document.getElementById('myBtn');

  // If user scrolls down 20px from the top of the document, show the button
  function onScroll() {
    const show =
      document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    myButton.style.display = show ? 'block' : 'none';
  }

  function toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  window.addEventListener('scroll', onScroll);
  myButton.addEventListener('click', toTop);
  onScroll();
});

// Responsive menu (burger)
function burgerMenu() {
  const btn = document.querySelector('.nav-toggle');
  const icon = btn?.querySelector('.hamburger');
  const list = document.getElementById('primary-nav');
  const overlay = document.querySelector('.nav-overlay');
  if (!btn || !icon || !list || !overlay) return;

  function openMenu() {
    const nav = document.querySelector('.page-header');
    const y = nav.getBoundingClientRect().bottom + 8;
    document.documentElement.style.setProperty('--menu-top', `${y}px`);
    document.body.classList.add('menu-open');
    btn.classList.add('is-active');
    icon.classList.add('active'); // animate bars
    btn.setAttribute('aria-expanded', 'true');
    list.classList.add('open');
    list.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    btn.classList.remove('is-active');
    icon.classList.remove('active'); // reset bars
    btn.setAttribute('aria-expanded', 'false');
    list.classList.remove('open');
    list.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
  }

  function toggleMenu() {
    if (document.body.classList.contains('menu-open')) closeMenu();
    else openMenu();
  }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
}

// init after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  burgerMenu();
});

// Carousel
function makeCarousel(rootId, { interval = 4000 } = {}) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const track = root.querySelector('.carousel__track');
  const slides = [...track.children];
  // expand track and size slides
  track.style.width = `${slides.length * 100}%`;
  slides.forEach((s) => {
    s.style.flex = `0 0 ${100 / slides.length}%`;
  });
  const dotsWrap = root.querySelector('.carousel__dots');
  if (slides.length <= 1) return;

  // dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  let index = 0,
    timer = null,
    touchStartX = 0,
    touchDX = 0;

  function update() {
    const step = 100 / slides.length;
    track.style.transform = `translateX(${-index * step}%)`;
    dots.forEach((d, i) =>
      d.setAttribute('aria-selected', i === index ? 'true' : 'false')
    );
  }

  function go(i, user = false) {
    index = (i + slides.length) % slides.length;
    update();
    if (user) restart(); // pause-reset on user action
  }
  function next() {
    go(index + 1);
  }
  function restart() {
    stop();
    timer = setInterval(next, interval);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // autoplay only on mobile + tablet
  const mq = window.matchMedia('(max-width: 1023px)');
  function onMQ(e) {
    e.matches ? restart() : stop();
  }
  mq.addEventListener('change', onMQ);
  onMQ(mq);

  // pause on hover/focus
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', () => mq.matches && restart());
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', () => mq.matches && restart());

  // touch swipe
  track.addEventListener(
    'touchstart',
    (e) => {
      stop();
      touchStartX = e.touches[0].clientX;
      touchDX = 0;
    },
    { passive: true }
  );
  track.addEventListener(
    'touchmove',
    (e) => {
      touchDX = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );
  track.addEventListener('touchend', () => {
    const threshold = 40; // px
    if (Math.abs(touchDX) > threshold) go(index + (touchDX < 0 ? 1 : -1), true);
    if (mq.matches) restart();
  });

  update();
}

// init after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  makeCarousel('certs-carousel', { interval: 3500 });
  makeCarousel('projects-carousel', { interval: 4000 });
});

// Certifications modal
(function setupCertsModal() {
  const openBtn = document.querySelector('.certs-open-btn');
  const modal = document.getElementById('certs-modal');
  if (!modal || !openBtn) return;

  const dialog = modal.querySelector('.modal-dialog');
  const closers = modal.querySelectorAll('[data-close]');
  let lastFocus = null;

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const tabbables = dialog.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    if (!tabbables.length) return;
    const first = tabbables[0],
      last = tabbables[tabbables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }

  function open() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('body-no-scroll');
    dialog.setAttribute('tabindex', '-1');
    dialog.focus();
    document.addEventListener('keydown', onKey);
    dialog.addEventListener('keydown', trapFocus);
  }
  function close() {
    modal.hidden = true;
    document.body.classList.remove('body-no-scroll');
    document.removeEventListener('keydown', onKey);
    dialog.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  openBtn.addEventListener('click', open);
  closers.forEach((el) => el.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) close();
  });
})();
