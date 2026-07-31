# xxjordan.com

Marketing site for xxjordan — a software development company offering custom
software, cloud, and AI solutions, plus professional developer training.

Static site. No build step, no package manager, no framework. Open
`index.html` in a browser and it runs.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Getting started](#getting-started)
4. [Architecture](#architecture)
5. [Design tokens](#design-tokens)
6. [Configuration](#configuration)
7. [Customization guide](#customization-guide)
8. [Browser support](#browser-support)
9. [Deployment](#deployment)
10. [Known limitations](#known-limitations)

---

## Tech stack

| Layer      | Choice                                  |
|------------|------------------------------------------|
| Markup     | Semantic HTML5, single page              |
| Styling    | Plain CSS3, custom properties (no preprocessor, no framework) |
| Behavior   | Vanilla JavaScript (ES2017+), no dependencies |
| Fonts      | Space Grotesk (display), Inter (body), JetBrains Mono (code/labels) — loaded via Google Fonts CDN |
| Forms      | [Formspree](https://formspree.io) (static-site-compatible form backend) |
| Hosting    | GitHub Pages (or any static file host) |

No `npm install`, no bundler, no transpilation. This is intentional — it
keeps the site trivially deployable to any static host and avoids a build
pipeline for a project of this size.

---

## Project structure

```
xxjordan/
├── index.html          # All page markup and section content
├── styles.css           # All styling — design tokens, layout, components
├── script.js             # All behavior — nav, terminal effect, scroll reveal, form
├── README.md             # This file
└── assets/
    ├── logo.png                  # Brand mark, transparent background
    ├── course-python.png         # Python Bootcamp 2026 card image
    ├── course-sql.png              # SQL Bootcamp 2026 card image
    ├── course-kubernetes.png       # Kubernetes Bootcamp 2026 card image
    ├── course-sql-analytics.png    # SQL for Data Analytics card image
    ├── course-datascience.png    # Data Science Bootcamp 2026 card image
    ├── course-fullstack.png      # Full Stack Web Dev Bootcamp card image
    └── course-excel.png          # Microsoft Excel Bootcamp 2026 card image
```

There is no `src/` vs `dist/` split — the three root files are what ships.
Edit them directly.

---

## Getting started

Clone or download the repo, then either:

```bash
# Option 1 — just open it
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux

# Option 2 — serve it locally (recommended, avoids any file:// quirks
# with relative asset paths)
python3 -m http.server 8000
# then visit http://localhost:8000
```

No install step, no environment variables, no `.env` file.

---

## Architecture

Single HTML file, six sections, in document order:

| Section id  | Purpose                                   |
|-------------|--------------------------------------------|
| `#home`     | Hero — eyebrow line, typed-tagline terminal, primary CTAs |
| `#about`    | Story, mission, vision, core values grid   |
| `#services` | Five service offering cards                |
| `#courses`  | Seven course cards (one live/linked, six "coming soon") |
| `#contact`  | Lead-capture form (posts to Formspree)      |
| footer      | Sitemap-style links, social                |

`script.js` is organized as independent, self-contained blocks inside a
single `DOMContentLoaded` listener — each block owns one behavior and can be
deleted independently without breaking the others:

- **Footer year** — sets copyright year programmatically.
- **Mobile nav** — toggles the burger menu open state.
- **Terminal typewriter** — types/deletes through the tagline list in
  `taglines[]`. Respects `prefers-reduced-motion` (renders the first
  tagline statically instead of animating).
- **Scroll reveal** — `IntersectionObserver`-based fade-in for elements
  tagged `.reveal`. Falls back to showing everything immediately if
  `IntersectionObserver` is unsupported or motion is reduced.
- **Nav scroll shadow** — adds a drop shadow to the nav once the page is
  scrolled, for depth against page content.
- **Contact form** — intercepts submit, posts to Formspree via `fetch`,
  shows an inline success/error message instead of a page redirect. See
  [Configuration](#configuration) — this does nothing useful until wired up.

---

## Design tokens

All colors, type, spacing primitives, and easing live as CSS custom
properties at the top of `styles.css` (`:root`). Change a value once, it
propagates everywhere.

```css
--purple-700   #4C2CB3   /* primary brand purple — buttons, links, "xx" mark */
--purple-600   #5D3FD3   /* brighter accent purple */
--purple-300   #9C86E8   /* light purple accent */
--purple-100   #EEEAFB   /* faint purple tint */
--white        #FFFFFF
--grey-50      #F8F7FB   /* dominant light-grey surface */
--grey-100     #F0EEF7
--grey-300     #E2DFEE
--ink          #1B1230   /* primary text color */
--gray-600     #5A5470   /* secondary/muted text */
--gray-400     #8C86A0   /* tertiary text, placeholders */
--gold-deep    #9A6A1E   /* nav/hero separator — royal gold accent */
--gold-light   #F4D585

--font-display  'Space Grotesk'   /* headings, wordmark */
--font-body     'Inter'           /* body copy */
--font-mono     'JetBrains Mono'  /* labels, terminal, status tags */

--radius   14px                        /* standard corner radius */
--ease     cubic-bezier(.19,1,.22,1)   /* standard motion easing */
```

Design intent: white/light-grey dominant surfaces, royal purple reserved
for accents (buttons, links, icons, the brand mark) rather than large
solid fills, with a single saturated-purple CTA section as the one bold
color moment on the page.

---

## Configuration

### Contact form → Formspree (required before launch)

GitHub Pages serves static files only — it cannot run backend code — so
the "Get in touch" form posts to Formspree instead of a server you'd
otherwise have to host yourself.

**Setup:**

1. Create a free account at https://formspree.io.
2. Create a new form; copy the endpoint it gives you
   (`https://formspree.io/f/xxxxxxxx`).
3. In `index.html`, find the form (search for `YOUR_FORM_ID`) and replace
   the placeholder with your real endpoint:

   ```html
   <form class="cta__form" id="ctaForm"
         action="https://formspree.io/f/xxxxxxxx" method="POST">
   ```
4. Deploy. Submit a test entry to confirm delivery.

**Accessing submissions:** Formspree emails you a copy of every submission
as it arrives, and the full history is viewable (and exportable as CSV)
under your form's *Submissions* tab at formspree.io.

Until step 3 is done, the form displays an inline "not connected yet"
message instead of silently discarding input — check `script.js` →
`CTA form` block if you need to change that fallback behavior.

### Course links

Each course card in `#courses` is independent markup — to point a course
at a live purchase/enrollment URL, add an `.course__link` anchor inside
that card's `.course__body` (see the SQL Bootcamp card for a working
example) and, optionally, move `.course--live` onto that `<article>` to
apply the highlighted-card treatment.

---

## Customization guide

**Change brand colors** — edit the `--purple-*` and `--gold-*` custom
properties in `styles.css`; every button, link, and accent references
them, nothing is hardcoded downstream.

**Add or edit a course card** — duplicate a `<article class="course">`
block in the `#courses` section of `index.html`; each needs a
`.course__media` image, a status badge (`Coming soon` or
`course__status--live` + "Enrolling now"), a title, and a one-line
description.

**Add or edit a service card** — same pattern under `#services`, using
`.card` instead of `.course`.

**Change the rotating hero tagline** — edit the `taglines` array at the
top of the "Terminal typewriter" block in `script.js`.

**Swap the logo** — replace `assets/logo.png`. Keep it as a transparent
PNG (no background fill) — the mark is displayed with no container box
around it, so any opaque background on the source image will show as a
visible square.

---

## Browser support

Targets evergreen browsers (current Chrome, Firefox, Safari, Edge).
Uses `IntersectionObserver`, CSS custom properties, `backdrop-filter`,
and `fetch` — all have been baseline-supported across major browsers for
several years. No polyfills included. `prefers-reduced-motion` is
respected throughout (typewriter and scroll-reveal animations disable
themselves).

---

## Deployment

**GitHub Pages:**

1. Commit `index.html`, `styles.css`, `script.js`, and `assets/` to the
   repo (root, or `/docs` if that's what Pages is configured to serve).
2. Repo → Settings → Pages → set the source branch/folder.
3. Point your domain's DNS at GitHub Pages (or use the default
   `*.github.io` URL) if not already configured.

**Any other static host** (Netlify, Vercel, S3, etc.): upload the same
four items — no build command required.

---

## Known limitations

- Contact form requires the one-time Formspree setup above; it is not
  functional out of the box.
- No CMS — all copy lives directly in `index.html`. Fine for a site this
  size; would need a rework (or a headless CMS) if content updates become
  frequent or non-technical staff need to edit copy.
- No automated tests (there's no application logic complex enough to
  warrant them at this stage).
