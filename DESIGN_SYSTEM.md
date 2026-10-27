# Gamers Hub — Design System

Generated with [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
and implemented in [`home.css`](home.css) / [`Home.html`](Home.html).

Regenerate the recommendation with:

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
cd ui-ux-pro-max-skill
python3 src/ui-ux-pro-max/scripts/search.py \
  "gaming e-commerce storefront for game keys and gaming hardware, dark cyberpunk aesthetic" \
  --design-system --variance 8 --motion 6 --density 5
```

## Decisions

| Area | Choice | Source |
|---|---|---|
| Product type | Gaming | `products.csv` |
| Landing pattern | Feature-Rich Showcase | `landing.csv` |
| Visual style | **Cyberpunk UI** | `styles.csv` → `cyberpunk-ui` |
| Typography | Russo One / Chakra Petch ("Gaming Bold") | `typography.csv` |
| Motion | Stagger List — 400ms, `back.out(1.4)` | `motion.csv` |
| Icons | Inline SVG stroke icons | `icons.csv` (no emoji as icons) |

### Why Cyberpunk UI and not the generated pick

Running `--design-system --variance 8` returns **Brutalism**, because a high
variance dial biases selection toward bold/asymmetric styles. That was
overridden: the `products.csv` rule for *Gaming* recommends a vibrant, neon,
immersive palette, and `cyberpunk-ui` lists **"Best For: Gaming platforms"**
explicitly. Brutalism's "default fonts, plain text" direction fights the
typography the same tool recommends for gaming.

### Why the suggested palette was rejected

`colors.csv` has a *Gaming* entry built on `#7C3AED` (violet) + `#F43F5E`
(rose). It was **not** used. That combination is the "AI purple/pink gradient"
anti-pattern the skill's own rules warn against, and it would have discarded
the brand's existing neon-green identity — which the `cyberpunk-ui` style
tokens independently endorse (`--neon-green`, `--neon-cyan`, `--neon-magenta`
on `#0D0D0D`). The style's tokens were used instead.

## Tokens

Defined on `:root` in `home.css`. The style-specific variables
(`--scanline-opacity`, `--glitch-duration`, `--bg-dark`, `--neon-green`,
`--neon-cyan`, `--neon-magenta`) are taken verbatim from the `cyberpunk-ui`
"Design System Variables" field.

| Token | Value | Use |
|---|---|---|
| `--bg-dark` | `#0d0d0d` | Page background |
| `--bg-elevated` | `#141414` | Header, feature cards, CTA |
| `--card` | `#1a1a1a` | Product cards |
| `--neon-green` | `#00ffc3` | Primary accent, prices, focus ring |
| `--neon-cyan` | `#00ffff` | Secondary accent, statistics |
| `--neon-magenta` | `#ff00ff` | Section underlines, glitch, "Bestseller" |
| `--text-primary` | `#e8f6f3` | Body copy |
| `--text-muted` | `#a8c5be` | Secondary copy |
| `--scanline-opacity` | `0.1` | CRT overlay strength |
| `--radius` | `4px` | Angular, per the style spec |

## Accessibility

Verified against the skill's pre-delivery checklist.

- **Contrast** — every text/background pair is at or above 4.5:1 for normal
  text and 3:1 for large text and UI components. Body copy measures 17.5:1,
  muted copy 10.6:1, and the focus ring 14.9:1 against the page background
  (the 3:1 state-contrast requirement).
- **Focus appearance** — `outline: 2px solid` with a 3px offset, meeting the
  WCAG 2.2 AAA minimum perimeter rather than a thin low-contrast shadow.
- **Focus not obscured** — `scroll-padding-top` offsets the sticky header so
  anchor navigation never lands a focused element underneath it. The scanline
  overlay is `position: fixed; pointer-events: none`, so it cannot cover a
  focus ring or intercept clicks.
- **Reduced motion** — a `prefers-reduced-motion` block strips the glitch,
  scanlines, stagger and caret animations and renders final states
  immediately. `home.js` reads the same preference to skip the typewriter and
  carousel autoplay.
- **Heading available without JS** — the `<h1>` carries an
  `aria-label="Welcome to Gamers Hub Store"`. Because the element is empty
  until the typewriter fills it, assistive tech and crawlers would otherwise
  see no page heading for roughly six seconds.
- **Decorative duplication hidden** — the hero typewriter repeats copy from
  the trailer and is `aria-hidden="true"`.
- **Badge meaning** — every badge carries a text label; none rely on colour
  alone.
- **Icons** — inline SVG, `aria-hidden="true"` when beside visible text.

## Fonts

Self-hosted with `@fontsource/russo-one` and `@fontsource/chakra-petch`
instead of hot-linking `fonts.googleapis.com`. This removes a third-party
request per page view and keeps the design working offline.

Only the **latin** subset and the weights actually used (400, 600, 700) are
linked — the full `chakra-petch` package is 1.2 MB across all subsets and
weights. Both packages use `font-display: swap`.

Fallbacks in `--font-display` / `--font-body` keep the layout sane if the web
fonts fail to load.

## Motion

The Stagger List spec calls for GSAP:

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4,
  stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

This is implemented in **plain CSS** (`.stagger` in `home.css`) to avoid adding
a second runtime dependency to a site that has no build step. The timings match
the spec: 400ms duration, 60ms per-item stagger, opacity 0 → 1 with a 16px
rise.

One deliberate deviation: `back.out(1.4)` has a hard-coded overshoot that a CSS
easing function cannot reproduce exactly, so `--ease-back` uses
`cubic-bezier(0.34, 1.56, 0.64, 1)` as the closest approximation.

## Not implemented

- **`--stack html-tailwind`** was not applied. The site is hand-written CSS
  with no build step; introducing Tailwind would require one. The database's
  Tailwind guidance is worth adopting only if a build step is added.
- **Chart types** (`charts.csv`) — no data visualisation on this page yet.
