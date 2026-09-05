/* ΔΟΚΙΜΕΣ ΠΑΛΕΤΑΣ 2026 — εικόνα/βίντεο στο hero (dev μόνο).
   Διαβάζει το data-theme από το <script> και προσθέτει:
   (α) .tm-backdrop: βίντεο (δείγμα από το demo Λύρα) ή ζωντανό «φως» σε canvas
       με τα χρώματα του θέματος — σέβεται το prefers-reduced-motion,
   (β) .tm-media: mockup συσκευών (public/hero/pisma-phones.webp).
   Δεν αγγίζει τη δομή των υπόλοιπων ενοτήτων. */
(function () {
  var THEMES = {
    mesanyxta: { hero: 'video',  mockup: true },
    porselani: { hero: 'canvas', mockup: true },
    dasos:     { hero: 'canvas', mockup: true },
    aspro:     { hero: 'canvas', mockup: true },
    petra:     { hero: 'video',  mockup: true },
  };
  var me = document.currentScript;
  var name = me && me.getAttribute('data-theme');
  var cfg = name && THEMES[name];
  if (!cfg) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = getComputedStyle(document.documentElement);
  var v = function (n) { return css.getPropertyValue(n).trim(); };

  // theme-color της μπάρας του browser = φόντο του θέματος
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta && v('--bg')) meta.setAttribute('content', v('--bg'));

  function init() {
    var hero = document.querySelector('main .hero');
    if (!hero || hero.querySelector('.tm-backdrop')) return;

    var isHome = /^\/(en\/)?$/.test(location.pathname);
    /* ---- (α) Φόντο ---- */
    var bd = document.createElement('div');
    bd.className = 'tm-backdrop';
    bd.setAttribute('aria-hidden', 'true');
    if (cfg.hero === 'video') {
      var poster = '/site-demo/lyra/images/hero.jpg';
      if (reduce) {
        bd.classList.add('tm-backdrop--image');
        var im = document.createElement('img'); im.src = poster; im.alt = ''; bd.appendChild(im);
        hero.classList.add('tm-hero--image');
      } else {
        bd.classList.add('tm-backdrop--video');
        var vid = document.createElement('video');
        vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.setAttribute('playsinline', ''); vid.setAttribute('muted', '');
        vid.preload = 'auto'; vid.poster = poster;
        var src = document.createElement('source');
        src.src = '/site-demo/lyra/video/vineyard.mp4'; src.type = 'video/mp4';
        vid.appendChild(src); bd.appendChild(vid);
        hero.classList.add('tm-hero--video');
        // παύση όταν το hero βγει από την οθόνη
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (es) {
            es.forEach(function (e) { e.isIntersecting ? vid.play().catch(function () {}) : vid.pause(); });
          }).observe(hero);
        }
      }
    } else {
      bd.classList.add('tm-backdrop--canvas');
      var c = document.createElement('canvas');
      bd.appendChild(c);
      hero.classList.add('tm-hero--canvas');
      startAmbient(c, hero);
    }
    if (!isHome) bd.style.setProperty('--tm-h', '100%');
    hero.prepend(bd);

    /* ---- (β) Mockup συσκευών ---- */
    if (cfg.mockup && isHome) {
      var inner = hero.querySelector('.hero-inner');
      if (inner) {
        var fig = document.createElement('figure');
        fig.className = 'tm-media';
        fig.innerHTML =
          '<img src="/hero/pisma-phones.webp" width="1081" height="1122" alt="Η PISMA σε κινητό — αρχική σελίδα και ταμπλό μετρήσεων" decoding="async">' +
          '<figcaption>Δείγμα εικόνας προϊόντος — τα mockups ξαναβγαίνουν με το θέμα που θα επιλεγεί.</figcaption>';
        inner.insertAdjacentElement('afterend', fig);
      }
    }
  }

  /* Ζωντανό «φως»: 5 μεγάλες μαλακές κηλίδες στα χρώματα του θέματος,
     αργή κίνηση (περίοδοι 38–70s), blur από CSS. Παύση εκτός οθόνης. */
  function startAmbient(canvas, hero) {
    var W = 480, H = 270;
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');
    var rgb = function (n, fb) { var s = v(n); return s ? s.split(',').map(Number) : fb; };
    var hex = function (n, fb) {
      var s = v(n).replace('#', '');
      if (s.length === 3) s = s.replace(/./g, function (ch) { return ch + ch; });
      if (s.length !== 6) return fb;
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    var A = rgb('--orange-rgb', [255, 122, 80]);
    var B = rgb('--peach-rgb', [255, 170, 120]);
    var C = rgb('--cta-rgb', [238, 79, 39]);
    var D = hex('--blue', [160, 142, 126]);
    var E = hex('--purple', [176, 154, 140]);
    var alpha = parseFloat(v('--tm-blob-a')) || 0.42;
    var blobs = [
      { c: A, r: 150, x: .78, y: .18, ax: .10, ay: .14, px: 52, py: 61, ph: 0 },
      { c: C, r: 120, x: .18, y: .30, ax: .12, ay: .10, px: 44, py: 70, ph: 2 },
      { c: B, r: 170, x: .55, y: .72, ax: .14, ay: .08, px: 66, py: 48, ph: 4 },
      { c: D, r: 130, x: .90, y: .70, ax: .08, ay: .12, px: 58, py: 38, ph: 1 },
      { c: E, r: 110, x: .35, y: .90, ax: .11, ay: .07, px: 40, py: 56, ph: 3 },
    ];
    var running = true, visible = true, t0 = performance.now();
    function frame(now) {
      if (!running) return;
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b) {
        var x = (b.x + b.ax * Math.sin(t * 2 * Math.PI / b.px + b.ph)) * W;
        var y = (b.y + b.ay * Math.cos(t * 2 * Math.PI / b.py + b.ph)) * H;
        var g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, 'rgba(' + b.c.join(',') + ',' + alpha + ')');
        g.addColorStop(1, 'rgba(' + b.c.join(',') + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI * 2); ctx.fill();
      });
      if (!reduce && visible && !document.hidden) requestAnimationFrame(frame);
      else running = false;
    }
    function resume() { if (!running && !reduce && visible && !document.hidden) { running = true; requestAnimationFrame(frame); } }
    requestAnimationFrame(frame);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; resume(); }); }).observe(hero);
    }
    document.addEventListener('visibilitychange', resume);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
