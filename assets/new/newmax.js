(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');

  /* Header shadow on scroll */
  var hdr = document.querySelector('.hdr');
  var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var setNav = function (open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* Active nav link */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav__cta)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

    /* Reveal */
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rev.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      rev.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Purifier carousel, built from the static model grid */
  (function () {
  if (!document.getElementById('carStage')) return;
  var grid = document.getElementById('modelGrid');
  var stage = document.getElementById('carStage');
  var info = document.getElementById('carInfo');
  var tabs = document.getElementById('carTabs');
  var models = Array.prototype.map.call(grid.querySelectorAll('.model'), function (li) {
    return {
      name: li.dataset.name, variant: li.dataset.variant, price: li.dataset.price,
      img: li.querySelector('img').getAttribute('src'), alt: li.querySelector('img').alt,
      wa: li.querySelector('a').href
    };
  });
  var start = models.findIndex(function (m) { return m.name === 'Aqua Jade'; });
  var cur = start < 0 ? 0 : start;
  var n = models.length;

  var items = models.map(function (m, i) {
    var d = document.createElement('div');
    d.className = 'car-item';
    d.setAttribute('role', 'group');
    d.setAttribute('aria-roledescription', 'slide');
    d.setAttribute('aria-label', (i + 1) + ' of ' + n + ': ' + m.name);
    var img = document.createElement('img');
    img.src = m.img; img.alt = m.alt; img.loading = 'lazy'; img.decoding = 'async';
    d.appendChild(img);
    d.addEventListener('click', function () { if (i !== cur) go(i); });
    stage.appendChild(d);

    var t = document.createElement('button');
    t.type = 'button'; t.className = 'car-tab'; t.setAttribute('role', 'tab');
    t.textContent = m.name + (m.variant ? ' · ' + m.variant : '');
    t.addEventListener('click', function () { go(i); });
    tabs.appendChild(t);
    return { el: d, tab: t };
  });

  var esc = function (s) { var e = document.createElement('span'); e.textContent = s || ''; return e.innerHTML; };

  function go(i) {
    cur = (i + n) % n;
    items.forEach(function (it, j) {
      var off = (j - cur + n) % n;
      if (off > n / 2) off -= n;
      it.el.className = 'car-item' +
        (off === 0 ? ' is-active' : off === -1 ? ' is-prev' : off === 1 ? ' is-next' : off === -2 ? ' is-prev2' : off === 2 ? ' is-next2' : '');
      it.el.setAttribute('aria-hidden', String(off !== 0));
      it.tab.setAttribute('aria-selected', String(off === 0));
      it.tab.tabIndex = off === 0 ? 0 : -1;
    });
    var m = models[cur];
    info.innerHTML = '<h3>' + esc(m.name) + '</h3><p>' + (m.variant ? esc(m.variant) + ' · ' : '') + '<b>' + esc(m.price) + '</b></p>' +
      '<a class="btn" target="_blank" rel="noopener" href="' + esc(m.wa) + '"><svg class="ic"><use href="#i-wa"/></svg> Enquire on WhatsApp</a>';
    var tab = items[cur].tab;
    tabs.scrollTo({ left: tab.offsetLeft - tabs.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' });
  }

  document.querySelector('.car-btn--prev').addEventListener('click', function () { go(cur - 1); });
  document.querySelector('.car-btn--next').addEventListener('click', function () { go(cur + 1); });
  tabs.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault(); go(cur + (e.key === 'ArrowRight' ? 1 : -1)); items[cur].tab.focus();
    }
  });
  var x0 = null;
  stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(cur);
  })();

  /* WhatsApp message box: open a chat with the typed text */
  var waForm = document.getElementById('waForm');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('waMsg').value.trim();
      if (!msg) return;
      window.open('https://wa.me/917306786132?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  // Footer accordion on phones: each column heading toggles its list.
  var ftrHeads = document.querySelectorAll('.ftr__cols h3');
  if (ftrHeads.length) {
    var mq = window.matchMedia('(max-width: 700px)');
    var acc = [];
    ftrHeads.forEach(function (h, i) {
      var panel = document.createElement('div');
      panel.className = 'ftr__panel';
      panel.id = 'ftr-panel-' + i;
      while (h.nextElementSibling) panel.appendChild(h.nextElementSibling);
      h.after(panel);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ftr__toggle';
      btn.setAttribute('aria-controls', panel.id);
      btn.innerHTML = '<span></span>';
      btn.firstChild.textContent = h.textContent;
      h.textContent = '';
      h.appendChild(btn);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
      });
      acc.push([btn, panel]);
    });
    var sync = function () {
      acc.forEach(function (a) {
        a[0].disabled = !mq.matches;
        a[0].setAttribute('aria-expanded', String(!mq.matches));
        a[1].hidden = mq.matches;
      });
    };
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
