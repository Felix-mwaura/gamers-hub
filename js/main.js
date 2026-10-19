/* ============================================================================
   Gamers Hub — site behaviour (every page)
   ----------------------------------------------------------------------------
   Header state, mobile drawer, cart badge, typewriter hero, scroll reveal,
   FAQ accordion, newsletter form, footer year.
   ============================================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initDrawer();
    initCartBadge();
    initReveal();
    initFaq();
    initNewsletter();
    initYear();
    initHero();
  });

  /* ---------- header shadow on scroll ------------------------------------ */

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav drawer ------------------------------------------ */

  function initDrawer() {
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    if (!toggle || !drawer) return;

    var setOpen = function (open) {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) setOpen(false);
    });

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------- cart badge -------------------------------------------------- */

  function initCartBadge() {
    var badge = document.getElementById('cartBadge');
    if (!badge) return;

    var render = function () {
      var n = window.GH.cartCount();
      badge.textContent = n > 99 ? '99+' : String(n);
      badge.hidden = n === 0;
    };

    render();
    document.addEventListener('gh:cart-change', render);
  }

  /* ---------- scroll reveal ----------------------------------------------
     One shared observer. Elements injected later (product cards, category
     tiles) must be re-submitted via GH.ui.observeReveals() after render,
     otherwise they would stay stuck at opacity 0.
     ---------------------------------------------------------------------- */

  var revealIO = null;

  function observeReveals(root) {
    var targets = (root || document).querySelectorAll('.reveal:not(.is-in)');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries, io) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    }

    targets.forEach(function (el) { revealIO.observe(el); });
  }

  function initReveal() {
    observeReveals(document);
  }

  /* ---------- FAQ accordion ---------------------------------------------- */

  function initFaq() {
    document.querySelectorAll('.faq__item').forEach(function (item) {
      var q = item.querySelector('.faq__q');
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        item.closest('.faq').querySelectorAll('.faq__item').forEach(function (other) {
          other.classList.remove('is-open');
        });
        if (!open) item.classList.add('is-open');
      });
    });
  }

  /* ---------- newsletter -------------------------------------------------- */

  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var note = document.getElementById('newsletterNote');
      if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        if (note) note.textContent = 'Please enter a valid email address.';
        return;
      }
      /* TODO: POST to your mailing list provider (Mailchimp, Buttondown…) */
      form.innerHTML =
        '<p class="mb-0" style="color:var(--cyan);font-weight:700;">' +
        'You are in. Watch your inbox for drop alerts.</p>';
    });
  }

  /* ---------- footer year ------------------------------------------------- */

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- hero typewriter -------------------------------------------- */

  function initHero() {
    var el = document.getElementById('type-text');
    if (!el) return;

    var lines = [
      'Level up your setup. Pay with M-Pesa.',
      'Game keys delivered the second you pay.',
      'Night City is waiting, V.',
      'Free Nairobi delivery over KES 5,000.'
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = lines[0];
      return;
    }

    var li = 0, ci = 0, deleting = false;

    function tick() {
      var line = lines[li];
      el.textContent = line.substring(0, ci);
      if (!deleting && ci < line.length) {
        ci++;
        setTimeout(tick, 55);
      } else if (!deleting) {
        deleting = true;
        setTimeout(tick, 1900);
      } else if (ci > 0) {
        ci--;
        setTimeout(tick, 26);
      } else {
        deleting = false;
        li = (li + 1) % lines.length;
        setTimeout(tick, 350);
      }
    }
    tick();
  }

  /* ---------- shared UI helpers ------------------------------------------ */

  window.GH.ui = {
    /* Rounded-to-nearest-half star row. */
    stars: function (rating) {
      var full = Math.floor(rating);
      var half = rating - full >= 0.5 ? 1 : 0;
      var out = '';
      for (var i = 0; i < 5; i++) {
        var cls = i < full ? '' : (i === full && half ? '' : ' class="is-off"');
        out += '<svg class="' + cls.trim() + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
               '<path d="M12 2l2.9 6.3 6.9.8-5 4.7 1.3 6.8L12 17.3 5.9 20.6 7.2 13.8l-5-4.7 6.9-.8z"/></svg>';
      }
      return '<span class="stars" role="img" aria-label="' + rating + ' out of 5 stars">' + out + '</span>';
    },

    stockLabel: function (p) {
      if (p.stock <= 0) return '<span class="pcard__stock out">Out of stock</span>';
      if (p.stock <= 8) return '<span class="pcard__stock low">Only ' + p.stock + ' left</span>';
      return '<span class="pcard__stock in">In stock</span>';
    },

    /* One product card. Used on home, shop and related-products. */
    card: function (p) {
      var esc = window.GH.escape;
      var compare = p.compareAt
        ? '<span class="was">' + window.GH.money(p.compareAt) + '</span>'
        : '';
      var tag = p.badge ? '<span class="tag tag--' + p.badge + '">' + esc(p.badge) + '</span>' : '';
      var digital = p.digital ? '<span class="pcard__digital">Instant code</span>' : '';
      var soldOut = p.stock <= 0;

      return (
        '<article class="pcard reveal">' +
          tag +
          '<a class="pcard__media" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" width="600" height="600">' +
          '</a>' +
          digital +
          '<div class="pcard__body">' +
            '<div class="pcard__brand">' + esc(p.brand) + '</div>' +
            '<h3 class="pcard__title"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
            '<div class="pcard__meta">' + window.GH.ui.stars(p.rating) +
              '<span>' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span></div>' +
            '<div class="pcard__price"><span class="now">' + window.GH.money(p.price) + '</span>' + compare + '</div>' +
            window.GH.ui.stockLabel(p) +
            '<div class="pcard__foot">' +
              '<button class="btn btn--primary" data-add="' + esc(p.id) + '"' + (soldOut ? ' disabled' : '') + '>' +
                (soldOut ? 'Sold out' : 'Add to cart') +
              '</button>' +
              '<a class="btn btn--ghost" href="product.html?id=' + encodeURIComponent(p.id) + '">View</a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    },

    /* Delegated "add to cart" for any [data-add] button on the page. */
    bindAddButtons: function (root) {
      (root || document).addEventListener('click', function (e) {
        var btn = e.target.closest('[data-add]');
        if (!btn || btn.disabled) return;
        var res = window.GH.addToCart(btn.getAttribute('data-add'), 1);
        window.GH.toast(res.message);
        if (res.ok) {
          btn.textContent = 'Added';
          setTimeout(function () { btn.textContent = 'Add to cart'; }, 1400);
        }
      });
    },

    /* Re-arm the scroll-reveal animation on freshly injected markup. */
    observeReveals: observeReveals
  };
})();
