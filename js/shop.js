/* ============================================================================
   Gamers Hub — shop page
   Client-side filtering, sorting and search. Reads ?category= and ?q= so the
   homepage links and footer links land pre-filtered.
   ============================================================================ */
(function () {
  'use strict';

  var state = {
    categories: [],
    platforms: [],
    min: null,
    max: null,
    inStock: false,
    deals: false,
    q: '',
    sort: 'featured'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('category');
    var q = params.get('q');

    if (cat && window.GH_DATA.categories.some(function (c) { return c.id === cat; })) {
      state.categories = [cat];
    }
    if (q) {
      state.q = q;
      document.getElementById('searchInput').value = q;
    }

    buildFilterControls();
    syncControlsFromState();
    bindEvents();
    render();
    window.GH.ui.bindAddButtons(document);
  });

  /* ---------- build filter UI -------------------------------------------- */

  function buildFilterControls() {
    var products = window.GH_DATA.products;

    document.getElementById('categoryFilters').innerHTML = window.GH_DATA.categories
      .map(function (c) {
        var count = products.filter(function (p) { return p.category === c.id; }).length;
        return (
          '<label class="check">' +
            '<input type="checkbox" name="category" value="' + c.id + '">' +
            '<span>' + window.GH.escape(c.name) + '</span>' +
            '<span class="count">' + count + '</span>' +
          '</label>'
        );
      }).join('');

    document.getElementById('platformFilters').innerHTML = window.GH_DATA.platforms
      .map(function (p) {
        var count = products.filter(function (prod) { return prod.platform === p; }).length;
        return (
          '<label class="check">' +
            '<input type="checkbox" name="platform" value="' + window.GH.escape(p) + '">' +
            '<span>' + window.GH.escape(p) + '</span>' +
            '<span class="count">' + count + '</span>' +
          '</label>'
        );
      }).join('');
  }

  /* ---------- events ------------------------------------------------------ */

  function bindEvents() {
    var debounce;

    document.getElementById('searchInput').addEventListener('input', function (e) {
      clearTimeout(debounce);
      var value = e.target.value;
      debounce = setTimeout(function () {
        state.q = value.trim().toLowerCase();
        render();
      }, 180);
    });

    document.getElementById('categoryFilters').addEventListener('change', function (e) {
      if (e.target.name !== 'category') return;
      toggle(state.categories, e.target.value, e.target.checked);
      render();
    });

    document.getElementById('platformFilters').addEventListener('change', function (e) {
      if (e.target.name !== 'platform') return;
      toggle(state.platforms, e.target.value, e.target.checked);
      render();
    });

    ['minPrice', 'maxPrice'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function (e) {
        var v = parseInt(e.target.value, 10);
        state[id === 'minPrice' ? 'min' : 'max'] = isNaN(v) ? null : v;
        render();
      });
    });

    document.getElementById('inStockOnly').addEventListener('change', function (e) {
      state.inStock = e.target.checked;
      render();
    });

    document.getElementById('dealsOnly').addEventListener('change', function (e) {
      state.deals = e.target.checked;
      render();
    });

    document.getElementById('sortSelect').addEventListener('change', function (e) {
      state.sort = e.target.value;
      render();
    });

    document.getElementById('clearFilters').addEventListener('click', clearAll);
    document.getElementById('emptyClear').addEventListener('click', clearAll);

    /* Mobile filter drawer */
    var filters = document.getElementById('filters');
    document.getElementById('filtersHead').addEventListener('click', function () {
      if (window.matchMedia('(min-width: 960px)').matches) return;
      filters.classList.toggle('is-open');
    });
  }

  function toggle(arr, value, on) {
    var i = arr.indexOf(value);
    if (on && i === -1) arr.push(value);
    if (!on && i !== -1) arr.splice(i, 1);
  }

  function clearAll() {
    state.categories = [];
    state.platforms = [];
    state.min = null;
    state.max = null;
    state.inStock = false;
    state.deals = false;
    state.q = '';
    state.sort = 'featured';

    document.getElementById('searchInput').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'featured';

    syncControlsFromState();
    render();
  }

  /* Push state back into the form controls (used on load and after clear). */
  function syncControlsFromState() {
    document.querySelectorAll('#categoryFilters input').forEach(function (cb) {
      cb.checked = state.categories.indexOf(cb.value) !== -1;
    });
    document.querySelectorAll('#platformFilters input').forEach(function (cb) {
      cb.checked = state.platforms.indexOf(cb.value) !== -1;
    });
    document.getElementById('inStockOnly').checked = state.inStock;
    document.getElementById('dealsOnly').checked = state.deals;
    if (state.min !== null) document.getElementById('minPrice').value = state.min;
    if (state.max !== null) document.getElementById('maxPrice').value = state.max;
  }

  /* ---------- filtering + sorting ---------------------------------------- */

  function filtered() {
    var list = window.GH_DATA.products.filter(function (p) {
      if (state.categories.length && state.categories.indexOf(p.category) === -1) return false;
      if (state.platforms.length && state.platforms.indexOf(p.platform) === -1) return false;
      if (state.min !== null && p.price < state.min) return false;
      if (state.max !== null && p.price > state.max) return false;
      if (state.inStock && p.stock <= 0) return false;
      if (state.deals && !p.compareAt) return false;
      if (state.q) {
        var hay = (p.name + ' ' + p.brand + ' ' + p.platform + ' ' + p.category).toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    });

    var sorters = {
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      rating: function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
      name: function (a, b) { return a.name.localeCompare(b.name); },
      featured: function (a, b) {
        return (b.featured - a.featured) || (b.rating - a.rating);
      }
    };

    return list.sort(sorters[state.sort] || sorters.featured);
  }

  /* ---------- render ------------------------------------------------------ */

  function render() {
    var list = filtered();
    var grid = document.getElementById('shopGrid');
    var empty = document.getElementById('emptyState');

    grid.innerHTML = list.map(window.GH.ui.card).join('');
    empty.hidden = list.length !== 0;
    window.GH.ui.observeReveals(grid);

    document.getElementById('resultCount').textContent =
      list.length === 1 ? '1 product' : list.length + ' products';

    renderActiveFilters();
    renderHeading();
  }

  function renderHeading() {
    var title = document.getElementById('shopTitle');
    var blurb = document.getElementById('shopBlurb');
    var crumb = document.getElementById('crumbCategory');

    if (state.categories.length === 1) {
      var c = window.GH_DATA.categories.filter(function (x) {
        return x.id === state.categories[0];
      })[0];
      title.textContent = c.name;
      blurb.textContent = c.blurb + ' — in stock and ready to ship.';
      crumb.textContent = c.name;
    } else if (state.q) {
      title.textContent = 'Search: "' + state.q + '"';
      blurb.textContent = 'Results matching your search across the whole catalogue.';
      crumb.textContent = 'Search';
    } else {
      title.textContent = 'All products';
      blurb.textContent = 'Everything in stock right now. Filter down to what you actually need.';
      crumb.textContent = 'All products';
    }
  }

  function renderActiveFilters() {
    var box = document.getElementById('activeFilters');
    var pills = [];

    state.categories.forEach(function (id) {
      var c = window.GH_DATA.categories.filter(function (x) { return x.id === id; })[0];
      pills.push(pill(c ? c.name : id, 'category', id));
    });
    state.platforms.forEach(function (p) { pills.push(pill(p, 'platform', p)); });
    if (state.min !== null) pills.push(pill('Min KES ' + state.min.toLocaleString('en-KE'), 'min', null));
    if (state.max !== null) pills.push(pill('Max KES ' + state.max.toLocaleString('en-KE'), 'max', null));
    if (state.inStock) pills.push(pill('In stock', 'inStock', null));
    if (state.deals) pills.push(pill('On sale', 'deals', null));
    if (state.q) pills.push(pill('"' + state.q + '"', 'q', null));

    box.innerHTML = pills.join('');
  }

  function pill(label, type, value) {
    return (
      '<span class="filter-pill">' + window.GH.escape(label) +
        '<button type="button" data-clear="' + type + '" data-value="' + window.GH.escape(value || '') +
        '" aria-label="Remove filter ' + window.GH.escape(label) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</span>'
    );
  }

  /* Delegate the little × on each active-filter pill. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-clear]');
    if (!btn) return;
    var type = btn.getAttribute('data-clear');
    var value = btn.getAttribute('data-value');

    if (type === 'category') toggle(state.categories, value, false);
    else if (type === 'platform') toggle(state.platforms, value, false);
    else if (type === 'min') { state.min = null; document.getElementById('minPrice').value = ''; }
    else if (type === 'max') { state.max = null; document.getElementById('maxPrice').value = ''; }
    else if (type === 'inStock') { state.inStock = false; document.getElementById('inStockOnly').checked = false; }
    else if (type === 'deals') { state.deals = false; document.getElementById('dealsOnly').checked = false; }
    else if (type === 'q') { state.q = ''; document.getElementById('searchInput').value = ''; }

    syncControlsFromState();
    render();
  });
})();
