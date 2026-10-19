/* ============================================================================
   Gamers Hub — product catalogue
   ----------------------------------------------------------------------------
   Single source of truth for the whole storefront. Every page reads from here.

   To scale up, delete this file and replace the GH_DATA global with a fetch()
   to your API / CMS / Google Sheet — the rest of the code does not care where
   the data comes from. See README.md → "Going live".
   ============================================================================ */
(function () {
  'use strict';

  var categories = [
    { id: 'games',       name: 'Games',             blurb: 'PS5, Xbox & PC titles' },
    { id: 'consoles',    name: 'Consoles',          blurb: 'Next-gen hardware' },
    { id: 'accessories', name: 'Accessories',       blurb: 'Pads, audio & input' },
    { id: 'phones',      name: 'Gaming Phones',     blurb: 'High-refresh flagships' },
    { id: 'tablets',     name: 'Tablets & Laptops', blurb: 'Portable power' }
  ];

  var platforms = ['PS5', 'Xbox Series X|S', 'PC', 'Cross-platform'];

  var products = [
    {
      id: 'cp2077',
      name: 'Cyberpunk 2077: Ultimate Edition',
      brand: 'CD PROJEKT RED',
      category: 'games',
      platform: 'PS5',
      price: 7900,
      compareAt: 9500,
      rating: 4.8,
      reviews: 214,
      stock: 12,
      badge: 'HOT',
      featured: true,
      digital: true,
      image: 'assets/cyber.jpeg',
      short: 'The complete Night City experience — base game plus the Phantom Liberty expansion, rebuilt for PS5.',
      description:
        'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cybernetically enhanced mercenary outlaw going all in to have a name etched among the elite. The Ultimate Edition bundles the acclaimed Phantom Liberty spy-thriller expansion and every previous patch, including the ray-traced Overdrive mode that re-lights the entire city. Create your character, choose your cyberware, and build a legend — every choice you make shapes the story and the city around you.',
      specs: [
        { label: 'Platform', value: 'PlayStation 5' },
        { label: 'Genre', value: 'Open-world RPG' },
        { label: 'Players', value: 'Single-player' },
        { label: 'Region', value: 'Region-free (EN)' },
        { label: 'Delivery', value: 'Instant digital code' }
      ]
    },
    {
      id: 'gta5',
      name: 'Grand Theft Auto V',
      brand: 'Rockstar Games',
      category: 'games',
      platform: 'PS5',
      price: 5500,
      compareAt: 6200,
      rating: 4.7,
      reviews: 486,
      stock: 30,
      badge: 'SALE',
      featured: true,
      digital: true,
      image: 'assets/eeab692d-f60b-4284-a7f8-140aaa57ca62.jpeg',
      short: 'Three criminals, one enormous open world. The most complete edition of GTA V ever released.',
      description:
        'Los Santos is a sprawling sun-soaked metropolis full of self-made gurus, starlets and fading celebrities, once the envy of the western world, now struggling to stay afloat in an era of economic uncertainty and cheap reality TV. Switch between Michael, Franklin and Trevor as they risk everything in a series of daring and dangerous heists that could set them up for life — or bury them. Includes all GTA Online progression updates.',
      specs: [
        { label: 'Platform', value: 'PlayStation 5' },
        { label: 'Genre', value: 'Action-adventure' },
        { label: 'Players', value: 'Single-player + Online' },
        { label: 'Region', value: 'Region-free (EN)' },
        { label: 'Delivery', value: 'Instant digital code' }
      ]
    },
    {
      id: 'gta5-premium',
      name: 'GTA V: Premium Online Edition',
      brand: 'Rockstar Games',
      category: 'games',
      platform: 'Xbox Series X|S',
      price: 5200,
      compareAt: null,
      rating: 4.5,
      reviews: 173,
      stock: 18,
      badge: '',
      featured: false,
      digital: true,
      image: 'assets/gta 5.jpeg',
      short: 'Grand Theft Auto V bundled with the Criminal Enterprise Starter Pack for GTA Online.',
      description:
        'The Premium Online Edition includes the complete Grand Theft Auto V story mode plus a bundle of in-game content worth over KES 15,000 to jump-start your GTA Online empire: properties, vehicles, weapons and clothing across Los Santos and Blaine County.',
      specs: [
        { label: 'Platform', value: 'Xbox Series X | S' },
        { label: 'Genre', value: 'Action-adventure' },
        { label: 'Players', value: 'Single-player + Online' },
        { label: 'Region', value: 'Region-free (EN)' },
        { label: 'Delivery', value: 'Instant digital code' }
      ]
    },
    {
      id: 'eldenring',
      name: 'Elden Ring: Shadow of the Erdtree',
      brand: 'FromSoftware',
      category: 'games',
      platform: 'PS5',
      price: 8400,
      compareAt: null,
      rating: 4.9,
      reviews: 302,
      stock: 6,
      badge: 'NEW',
      featured: true,
      digital: true,
      image: 'assets/img/game-cover-fantasy.jpg',
      short: 'The award-winning expansion to Elden Ring. Journey to the Land of Shadow.',
      description:
        'The Shadow of the Erdtree expansion features an entirely new story set in an unexplored land, packed with dungeons, new weapons, armour types and an expanded skill system. Winner of over 300 Game of the Year awards, Elden Ring is a vast fantasy world where you ride across the haunted grasslands, sprint through treacherous swamps and gallop through lush plains. Requires the base Elden Ring game to play.',
      specs: [
        { label: 'Platform', value: 'PlayStation 5' },
        { label: 'Genre', value: 'Action RPG' },
        { label: 'Players', value: 'Single-player + Co-op' },
        { label: 'Requires', value: 'Elden Ring base game' },
        { label: 'Delivery', value: 'Instant digital code' }
      ]
    },
    {
      id: 'fc26',
      name: 'EA SPORTS FC 26',
      brand: 'Electronic Arts',
      category: 'games',
      platform: 'PS5',
      price: 7200,
      compareAt: 8000,
      rating: 4.3,
      reviews: 158,
      stock: 22,
      badge: 'SALE',
      featured: false,
      digital: true,
      image: 'assets/img/game-cover-sports.jpg',
      short: 'The world\'s game, rebuilt. Authentic league licences and evolved gameplay.',
      description:
        'EA SPORTS FC 26 brings you closer to the real thing with more than 19,000 fully licensed players, 700+ teams and 30+ leagues. New gameplay intelligence makes teammates read the pitch like real footballers, while Clubs and Ultimate Team give you somewhere to build a legacy with your squad.',
      specs: [
        { label: 'Platform', value: 'PlayStation 5' },
        { label: 'Genre', value: 'Sports' },
        { label: 'Players', value: 'Single-player + Online' },
        { label: 'Region', value: 'Region-free (EN)' },
        { label: 'Delivery', value: 'Instant digital code' }
      ]
    },
    {
      id: 'nexus-5',
      name: 'Nexus 5 Next-Gen Console',
      brand: 'Nexus',
      category: 'consoles',
      platform: 'Cross-platform',
      price: 89000,
      compareAt: 99000,
      rating: 4.8,
      reviews: 96,
      stock: 7,
      badge: 'HOT',
      featured: true,
      digital: false,
      image: 'assets/img/console.jpg',
      short: '4K/120fps, ultra-high-speed SSD and ray-traced graphics in a slim vertical chassis.',
      description:
        'The Nexus 5 delivers lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback and adaptive triggers, and stunning 4K HDR visuals. Ships with one wireless controller and a 1TB expandable drive. 12-month local warranty handled in-store at our Nairobi shop — no international shipping.',
      specs: [
        { label: 'Resolution', value: 'Up to 4K @ 120Hz' },
        { label: 'Storage', value: '1 TB SSD (expandable)' },
        { label: 'In the box', value: 'Console, 1 controller, HDMI, power' },
        { label: 'Warranty', value: '12 months, local' },
        { label: 'Delivery', value: 'Same-day in Nairobi' }
      ]
    },
    {
      id: 'pro-pad',
      name: 'Nexus Pro Wireless Controller',
      brand: 'Nexus',
      category: 'accessories',
      platform: 'Cross-platform',
      price: 8900,
      compareAt: 11500,
      rating: 4.6,
      reviews: 241,
      stock: 40,
      badge: 'SALE',
      featured: true,
      digital: false,
      image: 'assets/img/controller.jpg',
      short: 'Low-latency 2.4GHz pad with hall-effect sticks, back paddles and RGB trim.',
      description:
        'Built for competitive play: hall-effect analogue sticks that never drift, remappable back paddles, a 1000Hz polling rate and a 15-hour battery. Works wirelessly on PC, console and Android over Bluetooth, or wired via USB-C. Includes a travel pouch and braided USB-C cable.',
      specs: [
        { label: 'Connectivity', value: '2.4GHz dongle / BT 5.2 / USB-C' },
        { label: 'Battery', value: '15 hours, 2-hour recharge' },
        { label: 'Compatibility', value: 'PC, console, Android' },
        { label: 'Warranty', value: '6 months' },
        { label: 'Delivery', value: 'Same-day in Nairobi' }
      ]
    },
    {
      id: 'vortex-7',
      name: 'Vortex 7.1 Gaming Headset',
      brand: 'Vortex',
      category: 'accessories',
      platform: 'Cross-platform',
      price: 12500,
      compareAt: null,
      rating: 4.4,
      reviews: 118,
      stock: 15,
      badge: '',
      featured: false,
      digital: false,
      image: 'assets/img/headset.jpg',
      short: 'Positional 7.1 surround, 50mm drivers and a noise-cancelling boom mic.',
      description:
        'Hear footsteps before you see them. The Vortex 7.1 uses 50mm neodymium drivers with virtual surround processing to place every sound precisely in 3D space. Memory-foam earcups stay comfortable through six-hour sessions, and the flip-up boom mic filters background noise so your callouts come through clean.',
      specs: [
        { label: 'Drivers', value: '50mm neodymium' },
        { label: 'Audio', value: 'Virtual 7.1 surround' },
        { label: 'Microphone', value: 'Noise-cancelling, flip-up' },
        { label: 'Connection', value: '3.5mm + USB DAC' },
        { label: 'Warranty', value: '6 months' }
      ]
    },
    {
      id: 'rgb-kb',
      name: 'Tactile RGB Mechanical Keyboard',
      brand: 'Nexus',
      category: 'accessories',
      platform: 'PC',
      price: 9800,
      compareAt: 12500,
      rating: 4.5,
      reviews: 87,
      stock: 25,
      badge: 'SALE',
      featured: false,
      digital: false,
      image: 'assets/img/keyboard.jpg',
      short: 'Tenkeyless hot-swap board with optical switches and per-key RGB.',
      description:
        'A compact 87-key tenkeyless layout that gives your mouse all the room it needs. Hot-swappable optical switches mean you can change feel without soldering, and the per-key RGB is fully programmable. N-key rollover and a 1000Hz report rate keep every input registered, even in the middle of a fight.',
      specs: [
        { label: 'Layout', value: '87-key tenkeyless' },
        { label: 'Switches', value: 'Hot-swap optical, linear' },
        { label: 'Lighting', value: 'Per-key RGB, programmable' },
        { label: 'Connection', value: 'USB-C, braided' },
        { label: 'Warranty', value: '12 months' }
      ]
    },
    {
      id: 'legion-tab',
      name: 'Lenovo Legion Tab',
      brand: 'Lenovo',
      category: 'tablets',
      platform: 'Android',
      price: 62000,
      compareAt: 69000,
      rating: 4.6,
      reviews: 64,
      stock: 9,
      badge: 'HOT',
      featured: true,
      digital: false,
      image: 'assets/legion tablet.jpeg',
      short: '8.8-inch 144Hz gaming tablet with a flagship Snapdragon chip and active cooling.',
      description:
        'A tablet built for games rather than spreadsheets. The 8.8-inch 2.5K display runs at 144Hz for buttery-smooth frame rates, the cooling system keeps sustained performance high, and the dual USB-C ports let you charge while you play. Twin speakers tuned for games and a 6550mAh battery round out a genuinely portable powerhouse.',
      specs: [
        { label: 'Display', value: '8.8" 2.5K, 144Hz' },
        { label: 'Chipset', value: 'Flagship Snapdragon' },
        { label: 'Battery', value: '6550 mAh, dual-port charging' },
        { label: 'Audio', value: 'Dual stereo speakers' },
        { label: 'Warranty', value: '12 months, local' }
      ]
    },
    {
      id: 'titan-5g',
      name: 'Titan 5G Gaming Phone',
      brand: 'Titan',
      category: 'phones',
      platform: 'iOS',
      price: 145000,
      compareAt: null,
      rating: 4.7,
      reviews: 132,
      stock: 5,
      badge: 'NEW',
      featured: false,
      digital: false,
      image: 'assets/iphone.jpeg',
      short: '120Hz OLED, triple camera and a chip that runs every heavy title on mobile.',
      description:
        'A flagship built for gaming and content: a 6.7-inch 120Hz OLED display, sustained-performance thermals that do not throttle after twenty minutes, and all-day battery with fast charging. Comes with a 12-month Kenyan warranty and our trade-in programme if you are upgrading from an older device.',
      specs: [
        { label: 'Display', value: '6.7" OLED, 120Hz' },
        { label: 'Storage', value: '256 GB' },
        { label: 'Camera', value: 'Triple 48MP + 12MP' },
        { label: 'Battery', value: 'All-day, fast charge' },
        { label: 'Warranty', value: '12 months, local' }
      ]
    }
  ];

  window.GH_DATA = {
    categories: categories,
    platforms: platforms,
    products: products,
    currency: 'KES'
  };
})();
