/* ============================================================================
   Gamers Hub — cart & checkout
   ----------------------------------------------------------------------------
   Cart rendering, quantity edits, delivery/payment selection, live totals,
   form validation and order creation.

   NOTE: no real money moves here. See README.md → "Taking real payments" for
   the Paystack M-Pesa STK push wiring.
   ============================================================================ */
(function () {
  'use strict';

  var DELIVERY = {
    nairobi:   { label: 'Nairobi — same day',      cost: 300 },
    nationwide:{ label: 'Nationwide courier',      cost: 450 },
    pickup:    { label: 'Pickup in store',         cost: 0 }
  };

  var FREE_DELIVERY_THRESHOLD = 5000;

  var PAY_NOTES = {
    mpesa: 'You will get an M-Pesa prompt on 0712 345 678. Enter your PIN to complete payment — no card needed.',
    card:  'You will be redirected to a secure 3-D Secure page to authorise your Visa or Mastercard.',
    cod:   'Pay the rider in cash on arrival. Available for Nairobi deliveries only — have the exact amount ready.'
  };

  document.addEventListener('DOMContentLoaded', function () {
    render();
    bindEvents();
    document.addEventListener('gh:cart-change', render);
  });

  /* ---------- state helpers ---------------------------------------------- */

  function deliveryKey() {
    var checked = document.querySelector('input[name="delivery"]:checked');
    return checked ? checked.value : 'nairobi';
  }

  function paymentKey() {
    var checked = document.querySelector('input[name="payment"]:checked');
    return checked ? checked.value : 'mpesa';
  }

  function hasPhysical() {
    return window.GH.cart().some(function (item) {
      var p = window.GH.productById(item.id);
      return p && !p.digital;
    });
  }

  function deliveryCost() {
    if (!hasPhysical()) return 0;                       // digital-only orders ship free
    var opt = DELIVERY[deliveryKey()];
    if (window.GH.cartSubtotal() >= FREE_DELIVERY_THRESHOLD && opt.cost > 0) return 0;
    return opt.cost;
  }

  /* ---------- render ------------------------------------------------------ */

  function render() {
    var items = window.GH.cart();
    var layout = document.getElementById('cartLayout');
    var empty = document.getElementById('cartEmpty');
    var done = document.getElementById('orderDone');

    if (!items.length) {
      layout.hidden = true;
      empty.hidden = false;
      done.hidden = true;
      return;
    }

    empty.hidden = true;
    done.hidden = true;
    layout.hidden = false;

    document.getElementById('cartLines').innerHTML = items.map(function (item) {
      var p = window.GH.productById(item.id);
      if (!p) return '';
      var esc = window.GH.escape;
      var lineTotal = p.price * item.qty;

      return (
        '<article class="cart-line">' +
          '<a class="cart-line__media" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(p.image) + '" alt="" loading="lazy" width="200" height="200">' +
          '</a>' +
          '<div>' +
            '<h3 class="cart-line__title"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
            '<p class="cart-line__meta">' + esc(p.brand) + ' · ' + esc(p.platform) + '</p>' +
            '<div class="cart-line__controls">' +
              '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
                '<button type="button" data-qty-down="' + esc(p.id) + '" aria-label="Decrease quantity">−</button>' +
                '<label class="sr-only" for="qty-' + esc(p.id) + '">Quantity</label>' +
                '<input id="qty-' + esc(p.id) + '" type="number" value="' + item.qty + '" min="0" max="' + p.stock +
                  '" data-qty-input="' + esc(p.id) + '">' +
                '<button type="button" data-qty-up="' + esc(p.id) + '" aria-label="Increase quantity">+</button>' +
              '</div>' +
              '<button class="link-btn" type="button" data-remove="' + esc(p.id) + '">Remove</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-line__price">' +
            '<span class="now">' + window.GH.money(lineTotal) + '</span>' +
            '<span class="each">' + window.GH.money(p.price) + ' each</span>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    renderSummary();
  }

  function renderSummary() {
    var subtotal = window.GH.cartSubtotal();
    var shipping = deliveryCost();
    var total = subtotal + shipping;
    var opt = DELIVERY[deliveryKey()];
    var digitalOnly = !hasPhysical();

    var shippingLabel;
    if (digitalOnly) shippingLabel = '<span class="summary__free">No shipping — digital delivery</span>';
    else if (shipping === 0 && opt.cost > 0) shippingLabel = '<span class="summary__free">Free</span>';
    else shippingLabel = window.GH.money(shipping);

    var toFree = FREE_DELIVERY_THRESHOLD - subtotal;
    var hint = (!digitalOnly && toFree > 0)
      ? '<p class="form-note" style="margin-top:10px">Add ' + window.GH.money(toFree) +
        ' more for free Nairobi delivery.</p>'
      : '';

    document.getElementById('summaryRows').innerHTML =
      '<div class="summary__row"><span>Subtotal (' + window.GH.cartCount() + ' items)</span>' +
        '<span class="val">' + window.GH.money(subtotal) + '</span></div>' +
      '<div class="summary__row"><span>Delivery — ' + window.GH.escape(opt.label) + '</span>' +
        '<span class="val">' + shippingLabel + '</span></div>' +
      '<div class="summary__row summary__row--total"><span>Total</span>' +
        '<span class="val">' + window.GH.money(total) + '</span></div>' + hint;

    document.getElementById('payNote').textContent = PAY_NOTES[paymentKey()];

    /* Cash on delivery only makes sense for local physical deliveries. */
    var cod = document.querySelector('input[name="payment"][value="cod"]');
    var codLabel = cod.closest('.radio-card');
    var codAllowed = hasPhysical() && deliveryKey() !== 'nationwide';
    cod.disabled = !codAllowed;
    codLabel.style.opacity = codAllowed ? '1' : '.45';
    if (!codAllowed && paymentKey() === 'cod') {
      document.querySelector('input[name="payment"][value="mpesa"]').checked = true;
      document.getElementById('payNote').textContent = PAY_NOTES.mpesa;
    }

    /* Hide the address box when collecting in store. */
    document.getElementById('addressField').style.display = deliveryKey() === 'pickup' ? 'none' : '';
  }

  /* ---------- events ------------------------------------------------------ */

  function bindEvents() {
    var lines = document.getElementById('cartLines');

    lines.addEventListener('click', function (e) {
      var up = e.target.closest('[data-qty-up]');
      var down = e.target.closest('[data-qty-down]');
      var remove = e.target.closest('[data-remove]');

      if (up) bump(up.getAttribute('data-qty-up'), 1);
      else if (down) bump(down.getAttribute('data-qty-down'), -1);
      else if (remove) {
        window.GH.removeFromCart(remove.getAttribute('data-remove'));
        window.GH.toast('Item removed from cart.');
      }
    });

    lines.addEventListener('change', function (e) {
      var input = e.target.closest('[data-qty-input]');
      if (!input) return;
      window.GH.setQty(input.getAttribute('data-qty-input'), parseInt(input.value, 10));
    });

    document.getElementById('deliveryOpts').addEventListener('change', function () {
      renderSummary();
    });

    document.getElementById('payOpts').addEventListener('change', function () {
      renderSummary();
    });

    document.getElementById('checkoutForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (validate()) placeOrder();
    });
  }

  function bump(id, delta) {
    var item = window.GH.cart().filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    window.GH.setQty(id, item.qty + delta);
  }

  /* ---------- validation -------------------------------------------------- */

  function setError(field, message) {
    var input = document.getElementById(field);
    var err = document.getElementById('err-' + field);
    if (err) err.textContent = message || '';
    input.closest('.field').classList.toggle('has-err', Boolean(message));
  }

  function validate() {
    var ok = true;
    var name = document.getElementById('fullName').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim().replace(/[\s-]/g, '');
    var needsAddress = deliveryKey() !== 'pickup';
    var address = document.getElementById('address').value.trim();

    if (name.length < 2) { setError('fullName', 'Please enter your full name.'); ok = false; }
    else setError('fullName', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('email', 'Please enter a valid email address.'); ok = false;
    } else setError('email', '');

    /* Accepts 07xx xxx xxx, 01xx xxx xxx, 2547xx xxx xxx or +2547xx xxx xxx */
    if (!/^(\+?254|0)[17]\d{8}$/.test(phone)) {
      setError('phone', 'Enter a valid Safaricom/Airtel number, e.g. 0712345678.'); ok = false;
    } else setError('phone', '');

    if (needsAddress && address.length < 10) {
      setError('address', 'Please enter a full delivery address.'); ok = false;
    } else setError('address', '');

    return ok;
  }

  /* ---------- place order ------------------------------------------------- */

  function placeOrder() {
    var btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Processing…';

    var subtotal = window.GH.cartSubtotal();
    var shipping = deliveryCost();
    var payment = paymentKey();
    var ref = 'GH-' + String(Date.now()).slice(-6);

    var order = {
      ref: ref,
      createdAt: new Date().toISOString(),
      customer: {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim()
      },
      delivery: {
        method: deliveryKey(),
        label: DELIVERY[deliveryKey()].label,
        address: deliveryKey() === 'pickup'
          ? 'Pickup — Kimathi Street, Nairobi CBD'
          : document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim()
      },
      payment: payment,
      items: window.GH.cart().map(function (item) {
        var p = window.GH.productById(item.id);
        return { id: item.id, name: p.name, qty: item.qty, price: p.price, digital: p.digital };
      }),
      totals: { subtotal: subtotal, shipping: shipping, total: subtotal + shipping }
    };

    /* Persist locally so the confirmation survives a refresh. */
    window.GH.saveOrder(order);

    /* ----------------------------------------------------------------
       REAL PAYMENT HOOK
       ----------------------------------------------------------------
       For M-Pesa (recommended), call your backend to start an STK push:

         fetch('/api/pay/mpesa', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ order: order })
         })
         .then(r => r.json())
         .then(({ checkoutRequestID }) => pollForStatus(checkoutRequestID))

       Or drop in Paystack's inline JS and charge the card/total here.
       Until then, this demo simply confirms the order locally.
       ---------------------------------------------------------------- */

    setTimeout(function () {
      window.GH.clearCart();
      showConfirmation(order);
    }, 700);
  }

  function showConfirmation(order) {
    document.getElementById('cartLayout').hidden = true;
    document.getElementById('cartEmpty').hidden = true;

    var done = document.getElementById('orderDone');
    done.hidden = false;
    document.getElementById('doneName').textContent = order.customer.name.split(' ')[0];
    document.getElementById('doneRef').textContent = order.ref;

    var steps = [];
    if (order.payment === 'mpesa') {
      steps.push('Check your phone for the M-Pesa prompt and enter your PIN.');
      steps.push('Once payment is received, your order moves to packing.');
    } else if (order.payment === 'card') {
      steps.push('Complete the card authorisation on the secure page.');
      steps.push('You will receive an email receipt once the charge clears.');
    } else {
      steps.push('Have the exact amount ready — our rider cannot give change.');
    }

    var digitalItems = order.items.filter(function (i) { return i.digital; });
    if (digitalItems.length) {
      steps.push('Your game code' + (digitalItems.length > 1 ? 's are' : ' is') +
        ' on its way to ' + order.customer.email + ' within a minute of payment.');
    } else {
      steps.push('We will WhatsApp you a tracking link once your parcel leaves the shop.');
    }
    steps.push('Questions? Reply to this order on WhatsApp: +254 700 000 000.');

    document.getElementById('doneNext').innerHTML = steps
      .map(function (s) { return '<li>' + window.GH.escape(s) + '</li>'; }).join('');

    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
