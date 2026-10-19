/* ============================================================================
   Gamers Hub — homepage
   Renders the category tiles and the featured product grid.
   ============================================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    renderCategories();
    renderFeatured();
    window.GH.ui.bindAddButtons(document);
  });

  var ICONS = {
    games: '<path d="M6 11h4M8 9v4M15.5 11h.01M18 13h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/>',
    consoles: '<rect x="2" y="4" width="20" height="13" rx="3"/><path d="M8 21h8M12 17v4"/>',
    accessories: '<path d="M4 8a8 8 0 0116 0v5a4 4 0 01-4 4h-1V9H9v8H8a4 4 0 01-4-4V8z"/>',
    phones: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    tablets: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M9 21h6M12 18v3"/>'
  };

  function renderCategories() {
    var grid = document.getElementById('categoryGrid');
    if (!grid) return;

    var products = window.GH_DATA.products;
    var html = window.GH_DATA.categories.map(function (c) {
      var count = products.filter(function (p) { return p.category === c.id; }).length;
      return (
        '<a class="cat-tile reveal" href="shop.html?category=' + encodeURIComponent(c.id) + '">' +
          '<span class="cat-tile__icon">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            (ICONS[c.id] || ICONS.games) + '</svg>' +
          '</span>' +
          '<strong>' + window.GH.escape(c.name) + '</strong>' +
          '<span>' + window.GH.escape(c.blurb) + ' · ' + count + ' items</span>' +
        '</a>'
      );
    }).join('');

    grid.innerHTML = html;
    window.GH.ui.observeReveals(grid);
  }

  function renderFeatured() {
    var grid = document.getElementById('featuredGrid');
    if (!grid) return;

    var featured = window.GH_DATA.products.filter(function (p) { return p.featured; });
    grid.innerHTML = featured.map(window.GH.ui.card).join('');
    window.GH.ui.observeReveals(grid);
  }
})();
