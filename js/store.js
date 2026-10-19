/* ============================================================================
   Gamers Hub — shared store engine
   ----------------------------------------------------------------------------
   Cart + order persistence in localStorage, money formatting, stock lookups
   and a tiny toast helper. Loaded on every page before the page scripts.
   ============================================================================ */
(function () {
  'use strict';

  var CART_KEY = 'gh_cart_v1';
  var ORDER_KEY = 'gh_orders_v1';
  var WISH_KEY = 'gh_wishlist_v1';

  /* ---------- storage helpers -------------------------------------------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* private browsing / quota — the cart just will not persist */
    }
    document.dispatchEvent(new CustomEvent('gh:cart-change'));
  }

  /* ---------- catalogue lookups ------------------------------------------ */

  function productById(id) {
    var list = (window.GH_DATA && window.GH_DATA.products) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function categoryName(id) {
    var list = (window.GH_DATA && window.GH_DATA.categories) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i].name;
    }
    return id;
  }

  /* ---------- money ------------------------------------------------------- */

  function money(n) {
    return 'KES ' + Number(n).toLocaleString('en-KE', { maximumFractionDigits: 0 });
  }

  /* ---------- cart -------------------------------------------------------- */

  function cart() {
    return read(CART_KEY, []);
  }

  function saveCart(items) {
    write(CART_KEY, items);
  }

  function cartCount() {
    return cart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function cartSubtotal() {
    return cart().reduce(function (sum, item) {
      var p = productById(item.id);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    var p = productById(id);
    if (!p) return { ok: false, message: 'Product not found.' };
    if (p.stock <= 0) return { ok: false, message: p.name + ' is out of stock.' };

    var items = cart();
    var found = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { found = items[i]; break; }
    }

    if (found) {
      found.qty = Math.min(found.qty + qty, p.stock);
    } else {
      items.push({ id: id, qty: Math.min(qty, p.stock) });
    }
    saveCart(items);
    return { ok: true, message: p.name + ' added to cart.' };
  }

  function setQty(id, qty) {
    var p = productById(id);
    var items = cart();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        if (qty <= 0) { items.splice(i, 1); }
        else { items[i].qty = p ? Math.min(qty, p.stock) : qty; }
        break;
      }
    }
    saveCart(items);
  }

  function removeFromCart(id) {
    saveCart(cart().filter(function (item) { return item.id !== id; }));
  }

  function clearCart() {
    saveCart([]);
  }

  /* ---------- wishlist ---------------------------------------------------- */

  function wishlist() { return read(WISH_KEY, []); }

  function toggleWish(id) {
    var list = wishlist();
    var i = list.indexOf(id);
    var on;
    if (i === -1) { list.push(id); on = true; }
    else { list.splice(i, 1); on = false; }
    write(WISH_KEY, list);
    return on;
  }

  /* ---------- orders ------------------------------------------------------ */

  function saveOrder(order) {
    var all = read(ORDER_KEY, []);
    all.unshift(order);
    write(ORDER_KEY, all);
    return order;
  }

  function orders() { return read(ORDER_KEY, []); }

  /* ---------- toast ------------------------------------------------------- */

  var toastEl = null;
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      '<span></span>';
    toastEl.querySelector('span').textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- export ------------------------------------------------------ */

  window.GH = {
    productById: productById,
    categoryName: categoryName,
    money: money,
    cart: cart,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    wishlist: wishlist,
    toggleWish: toggleWish,
    saveOrder: saveOrder,
    orders: orders,
    toast: toast,
    escape: function (str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  };
})();
