/* ============================================================================
   Gamers Hub — product detail page
   Reads ?id= from the URL and renders the full PDP, tabs and related items.
   ============================================================================ */
(function () {
  'use strict';

  var product = null;
  var qty = 1;

  document.addEventListener('DOMContentLoaded', function () {
    var id = new URLSearchParams(window.location.search).get('id');
    product = window.GH.productById(id);

    if (!product) {
      renderNotFound();
      return;
    }

    document.title = product.name + ' — Gamers Hub';
    document.getElementById('crumbProduct').textContent = product.name;
    render();
    bindActions();
    renderRelated();
    window.GH.ui.bindAddButtons(document);
  });

  /* ---------- render ------------------------------------------------------ */

  function render() {
    var esc = window.GH.escape;
    var p = product;
    var soldOut = p.stock <= 0;
    var save = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    var wished = window.GH.wishlist().indexOf(p.id) !== -1;

    document.getElementById('pdpContent').innerHTML =
      '<div class="pdp">' +
        '<div class="pdp__gallery">' +
          (p.badge ? '<span class="tag tag--' + p.badge + '">' + esc(p.badge) + '</span>' : '') +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" width="800" height="800">' +
        '</div>' +

        '<div class="pdp__info">' +
          '<p class="pdp__brand">' + esc(p.brand) + '</p>' +
          '<h1>' + esc(p.name) + '</h1>' +

          '<div class="pdp__rating">' +
            window.GH.ui.stars(p.rating) +
            '<span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</span>' +
          '</div>' +

          '<div class="pdp__price">' +
            '<span class="now">' + window.GH.money(p.price) + '</span>' +
            (p.compareAt ? '<span class="was">' + window.GH.money(p.compareAt) + '</span>' : '') +
            (save > 0 ? '<span class="save">Save ' + save + '%</span>' : '') +
          '</div>' +

          '<p class="pdp__short">' + esc(p.short) + '</p>' +

          '<div class="pdp__chips">' +
            '<span class="chip chip--violet">' + esc(p.platform) + '</span>' +
            '<span class="chip">' + esc(window.GH.categoryName(p.category)) + '</span>' +
            (p.digital ? '<span class="chip chip--cyan">Instant code</span>' : '') +
            window.GH.ui.stockLabel(p) +
          '</div>' +

          '<div class="pdp__actions">' +
            '<div class="qty" role="group" aria-label="Quantity">' +
              '<button type="button" id="qtyDown" aria-label="Decrease quantity"' + (soldOut ? ' disabled' : '') + '>−</button>' +
              '<label class="sr-only" for="qtyInput">Quantity</label>' +
              '<input id="qtyInput" type="number" value="1" min="1" max="' + Math.max(p.stock, 1) + '"' + (soldOut ? ' disabled' : '') + '>' +
              '<button type="button" id="qtyUp" aria-label="Increase quantity"' + (soldOut ? ' disabled' : '') + '>+</button>' +
            '</div>' +
            '<button class="btn btn--primary" id="addToCartBtn" data-add="' + esc(p.id) + '"' + (soldOut ? ' disabled' : '') + '>' +
              (soldOut ? 'Out of stock' : 'Add to cart') +
            '</button>' +
            '<button class="btn btn--violet" id="buyNowBtn"' + (soldOut ? ' disabled' : '') + '>Buy now</button>' +
            '<button class="pdp__wish' + (wished ? ' is-on' : '') + '" id="wishBtn" aria-label="Save to wishlist" aria-pressed="' + wished + '">' +
              '<svg viewBox="0 0 24 24" fill="' + (wished ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z"/></svg>' +
            '</button>' +
          '</div>' +

          '<div class="pdp__assure">' +
            '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
              '<span>' + (p.digital
                ? 'Code delivered automatically within seconds of payment.'
                : 'Dispatched same day for orders placed before 4pm in Nairobi.') + '</span></div>' +
            '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
              '<span>7-day return window on faulty or wrongly supplied items.</span></div>' +
            '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
              '<span>Pay with M-Pesa, card or cash on delivery.</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="tabs">' +
        '<div class="tabs__nav" role="tablist">' +
          tabBtn('desc', 'Description', true) +
          tabBtn('specs', 'Specifications', false) +
          tabBtn('delivery', 'Delivery &amp; returns', false) +
        '</div>' +
        '<div class="tabs__panel is-active" id="panel-desc" role="tabpanel">' +
          '<p>' + esc(p.description) + '</p>' +
        '</div>' +
        '<div class="tabs__panel" id="panel-specs" role="tabpanel">' +
          '<table class="spec-table"><tbody>' +
            p.specs.map(function (s) {
              return '<tr><th scope="row">' + esc(s.label) + '</th><td>' + esc(s.value) + '</td></tr>';
            }).join('') +
          '</tbody></table>' +
        '</div>' +
        '<div class="tabs__panel" id="panel-delivery" role="tabpanel">' +
          '<h3>Delivery</h3>' +
          '<ul>' +
            '<li><strong>Nairobi CBD &amp; estates:</strong> same-day, KES 300.</li>' +
            '<li><strong>Rest of Kenya:</strong> 1–3 working days, KES 450.</li>' +
            '<li><strong>Free delivery</strong> on every order over KES 5,000.</li>' +
            (p.digital
              ? '<li><strong>Digital titles:</strong> no shipping — your code is emailed and shown on screen immediately.</li>'
              : '') +
          '</ul>' +
          '<h3>Returns</h3>' +
          '<p>Faulty or wrongly supplied items can be returned within 7 days in original condition. ' +
          'Opened physical games can be exchanged for the same title. Digital codes are non-refundable once revealed.</p>' +
        '</div>' +
      '</div>';
  }

  function tabBtn(key, label, active) {
    return '<button type="button" role="tab" class="' + (active ? 'is-active' : '') +
      '" data-tab="' + key + '" aria-selected="' + active + '">' + label + '</button>';
  }

  function renderNotFound() {
    document.getElementById('pdpContent').innerHTML =
      '<div class="empty">' +
        '<h3>We could not find that product</h3>' +
        '<p>The link may be broken or the item may have been removed.</p>' +
        '<a class="btn btn--primary btn--sm" href="shop.html">Back to the shop</a>' +
      '</div>';
  }

  function renderRelated() {
    var related = window.GH_DATA.products
      .filter(function (p) {
        return p.id !== product.id &&
          (p.category === product.category || p.platform === product.platform);
      })
      .slice(0, 4);

    if (!related.length) return;

    document.getElementById('relatedSection').hidden = false;
    document.getElementById('relatedGrid').innerHTML = related.map(window.GH.ui.card).join('');
    window.GH.ui.observeReveals(document.getElementById('relatedGrid'));
  }

  /* ---------- interactions ------------------------------------------------ */

  function bindActions() {
    var input = document.getElementById('qtyInput');

    var clamp = function (v) {
      v = parseInt(v, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > product.stock) v = product.stock;
      return v;
    };

    var setQty = function (v) {
      qty = clamp(v);
      input.value = qty;
    };

    document.getElementById('qtyDown').addEventListener('click', function () { setQty(qty - 1); });
    document.getElementById('qtyUp').addEventListener('click', function () { setQty(qty + 1); });
    input.addEventListener('change', function () { setQty(input.value); });

    document.getElementById('addToCartBtn').addEventListener('click', function () {
      var res = window.GH.addToCart(product.id, qty);
      window.GH.toast(res.message);
    });

    document.getElementById('buyNowBtn').addEventListener('click', function () {
      window.GH.addToCart(product.id, qty);
      window.location.href = 'cart.html';
    });

    document.getElementById('wishBtn').addEventListener('click', function () {
      var on = window.GH.toggleWish(product.id);
      this.classList.toggle('is-on', on);
      this.setAttribute('aria-pressed', String(on));
      this.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none');
      window.GH.toast(on ? 'Saved to wishlist.' : 'Removed from wishlist.');
    });

    /* Tabs */
    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-tab]').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tabs__panel').forEach(function (p) {
          p.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        document.getElementById('panel-' + btn.getAttribute('data-tab')).classList.add('is-active');
      });
    });
  }
})();
