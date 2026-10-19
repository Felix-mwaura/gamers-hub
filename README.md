# Gamers Hub 🎮

A gaming e-commerce storefront built for a Nairobi-based shop: PS5/Xbox games, consoles,
controllers, headsets, gaming phones and tablets. Pay with M-Pesa, card or cash on delivery.

Plain HTML, CSS and JavaScript — **no build step, no framework, no dependencies**.
Open `index.html` and it works.

---

## Quick start

Any static file server will do:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

> Opening `index.html` directly from the file system mostly works, but a local
> server is recommended so `localStorage` and URL query strings behave normally.

---

## What's in here

```
gamers-hub/
├── index.html          Home — hero, categories, featured products
├── shop.html           Shop — filters, search, sorting
├── product.html        Product detail — gallery, specs, tabs, related items
├── cart.html           Cart + checkout — delivery, payment, validation, confirmation
├── about.html          Our story, stats, values
├── contact.html        Contact form, info cards, FAQ
│
├── css/
│   └── styles.css      Everything, mobile-first, organised by section (see header comment)
│
├── js/
│   ├── data.js         ★ The product catalogue — start here to add products
│   ├── store.js        Cart, wishlist, orders, money formatting, toasts (localStorage)
│   ├── main.js         Header, mobile nav, cart badge, scroll reveal, shared UI helpers
│   ├── home.js         Homepage rendering
│   ├── shop.js         Filtering / search / sorting
│   ├── product.js      Product detail rendering
│   ├── cart.js         Cart maths, validation, checkout, order creation
│   └── contact.js      Contact form validation
│
├── assets/
│   ├── favicon.svg
│   ├── *.jpeg          Your original images
│   └── img/            AI-generated placeholder product shots
└── videos/
    └── cyberpunk-e3-2018-trailer.mp4
```

---

## Adding or changing products

Everything lives in **`js/data.js`**. Add an object to the `products` array:

```js
{
  id: 'spiderman2',            // unique, used in URLs (?id=spiderman2)
  name: "Marvel's Spider-Man 2",
  brand: 'Insomniac Games',
  category: 'games',           // must match a category id below
  platform: 'PS5',
  price: 7800,                 // KES
  compareAt: null,             // set a number to show a "was" price + save %
  rating: 4.8,
  reviews: 91,
  stock: 14,                   // 8 or fewer shows "Only N left"; 0 disables buying
  badge: 'HOT',                // 'HOT' | 'NEW' | 'SALE' | ''
  featured: true,              // shows on the homepage
  digital: true,               // true = instant code, no shipping fee
  image: 'assets/img/my-image.jpg',
  short: 'One line shown on cards.',
  description: 'Longer copy shown in the Description tab.',
  specs: [
    { label: 'Platform', value: 'PlayStation 5' },
    { label: 'Genre',    value: 'Action-adventure' }
  ]
}
```

The shop page, homepage, related products and search all update automatically.

---

## Customising

| What | Where |
|---|---|
| Colours, spacing, fonts | `css/styles.css` → the `:root` block at the top |
| Store name | Search for `Gamers` in every `.html` file (header + footer) |
| Phone / WhatsApp | Search for `254700000000` |
| Email / address / hours | Search for `hello@gamershub.co.ke` and `Kimathi Street` |
| Delivery prices | `js/cart.js` → the `DELIVERY` object |
| Free-delivery threshold | `js/cart.js` → `FREE_DELIVERY_THRESHOLD` |
| Hero video | `index.html` → `.hero__video` (and the poster in `css/styles.css`) |

The hero video is ~6 MB and only loads on screens 900px+ and wider, where visitors are
usually on Wi-Fi. On mobile a static poster image is shown instead, so phones never
download it. **Compress the video before going live** — 1–2 MB is plenty for a background.

---

## Taking real payments

Checkout currently validates everything and creates an order in `localStorage`, but
**no money moves**. The hooks are marked with `REAL PAYMENT HOOK` comments in
`js/cart.js`.

### M-Pesa (recommended for Kenya)

You cannot do M-Pesa from the browser alone — the STK push must be triggered from a
server holding your API secret. The flow:

1. Create an account at [paystack.com](https://paystack.com) (or Flutterwave / Daraja).
2. Build a tiny backend endpoint:

   ```js
   // POST /api/pay/mpesa  { order }
   // → paystack.charge({ email, amount, currency: 'KES', mobile_money: { phone } })
   ```

3. In `js/cart.js`, replace the demo `setTimeout` with a `fetch` to that endpoint,
   then poll for the charge status before showing the confirmation panel.

Paystack's [M-Pesa docs](https://paystack.com/docs/payments/mobile-money/) cover the
exact request shape. Never put your secret key in front-end code.

### Cards

Paystack and Flutterwave both offer an inline JS popup — drop their script tag in and
call `paystack.popup.newTransaction({ ... })` in `placeOrder()`.

### Going live checklist

- [ ] HTTPS (every payment provider requires it — Netlify and GitHub Pages both give it free)
- [ ] Real product photos and real stock counts
- [ ] Terms of service + privacy policy + refund policy pages (required by Paystack)
- [ ] A server endpoint for payments and order emails
- [ ] Replace the placeholder phone number, email and address

---

## Deploying

It's a static site, so anything works:

- **Netlify** — drag the folder onto <https://app.netlify.com/drop>. Free, HTTPS, instant.
- **GitHub Pages** — push to `main`, then Settings → Pages → deploy from branch.
- **Vercel** — `npx vercel`.

---

## Known placeholders

- Product images in `assets/img/` are AI-generated stand-ins — swap them for real photos.
- The contact form and newsletter do not send anywhere yet (see the `REAL SEND HOOK`
  comment in `js/contact.js`). Formspree or Web3Forms takes about five minutes to wire up.
- "Gamers Hub" details (address, phone, email, the story on the About page) are examples —
  replace them with your real details.
- Game titles and prices are illustrative.

---

## Suggested next steps

1. **Product reviews** — a simple star-rating + text form stored in `localStorage`.
2. **Order lookup** — "Track my order" using the `GH-` reference and the saved orders.
3. **Stock in a real database** — move `js/data.js` to a Google Sheet or Supabase table
   and `fetch()` it instead.
4. **Pre-orders** — a `preorder` flag with a deposit amount.
5. **Blog / guides** — "Best budget gaming phone in Kenya 2026" style content drives
   most of the organic traffic a store like this will get.
