# DESIGN

## Direction: "Leaderboard" with a 3D crowd and medal vault

Chosen by Iveno on 2026-10-31 from two prototypes (A: dark full-3D "Vault", B: light 2D "Leaderboard"). The build is B's light base and charts, plus two WebGL moments taken from A and reshaped by his feedback:

1. **The crowd** (proof): every entrant in his eight medal-winning Zindi competitions as a block, 2,214 in total, one lane per competition, first place in the front row. Each wheel scroll moves the camera to the next competition and a card with the result swishes into the top-left corner. One more scroll after the last card moves on.
2. **The medal vault**: eight 3D coins engraved with rank and field size. Golds sway, silvers stir, bronzes rest. Picking a coin flips it and raises a translucent card with the competition brief and his numbers.

**Why it fits a data scientist.** The site is itself a piece of data work. Each result is shown against its field (a dot on a leaderboard, a block in a crowd), not as a bare percentage. Every chart has axes or labelled ends, real values, a caption and a hidden table. The career timeline is a Gantt chart at the resolution the data actually has (whole years), and it says so in its caption instead of inventing months.

**What stays quiet.** One typeface (Schibsted Grotesk), a slate and ultramarine palette, medal metals used only for medals, sentence-case headings, and no icon grids, skill bars or glow.

## Tokens (`app/globals.css`)

Three layers, mapped to shadcn variable names. Components use Tailwind classes generated from the semantic and component layers and never use raw hex.

| Layer | Token | Value | Use |
|---|---|---|---|
| Primitive | `--slate-50` | `#f4f6f8` | page |
| | `--slate-100` | `#e8ecf1` | muted surfaces, 3D stage |
| | `--slate-200` | `#d5dbe2` | borders |
| | `--slate-300` | `#b9c2cd` | ticks, crowd blocks |
| | `--slate-600` | `#4a5868` | secondary text (6.9:1 on page) |
| | `--slate-950` | `#0f1b2d` | ink, vault band |
| | `--ultramarine-700` | `#2536c4` | links, employed-role bars, focus ring |
| | `--gold-600` / `--gold-200` | `#a87a12` / `#f3dc9a` | gold medal and tint |
| | `--silver-600` / `--silver-200` | `#5a7393` / `#d3deea` | silver medal and tint |
| | `--bronze-600` / `--bronze-200` | `#9a4f25` / `#ecc3a5` | bronze medal and tint |
| Semantic | `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--muted-foreground`, `--border`, `--ring`, … | primitives above | shadcn contract |
| | `--medal-gold`, `--medal-silver`, `--medal-bronze` (+ `-tint`) | gold/silver/bronze primitives | marks only, never text |
| Component | `--tick`, `--stage`, `--crowd-block` | slate | field strips, 3D crowd |
| | `--role-employed`, `--role-freelance` | primary / muted-foreground | career bars |
| | `--vault`, `--vault-foreground`, `--vault-muted`, `--vault-glass`, `--vault-edge` | slate-950 / 50 / 300, mixes | dark vault band and glass card |

The medal palette passes the dataviz validator's colour-blind separation (worst adjacent ΔE 15.0), normal-vision (17.2) and 3:1 contrast checks. Silver sits below the chroma floor because silver is grey, so every medal is also named in text.

The OG image (`app/og.png/route.tsx`) restates a few token values as `rgb()`, because Satori can't read CSS variables.

## Typography

Schibsted Grotesk, variable, loaded with `next/font` (one woff2, Latin subset, wght axis only). Display sizes run 800 weight with tight tracking; body is 400. Tabular figures appear only where numbers align in columns.

## Component sources

| Component | Source | What changed |
|---|---|---|
| `components.json`, `lib/utils.ts`, theme variable names | shadcn/ui CLI 4.23; `cn` is shadcn's [`cn`](https://github.com/shadcn-ui/cn) package | the generated Button was unused, so it was removed with its deps; add components with `npx shadcn add` when needed |
| `components/ui/border-beam.tsx` | Magic UI [border-beam](https://magicui.design/r/border-beam.json) | Original animates `offset-distance` with Motion. Rebuilt as a rotating conic gradient under a border mask, so only `transform` animates; CSS only, gold tokens |
| `components/ui/shine-border.tsx` | Magic UI [shine-border](https://magicui.design/r/shine-border.json) | Original animates `background-position`. Rebuilt as a rotating two-lobed gradient; silver tokens |
| Coin flip and tilt idea | Aceternity [3d-card](https://ui.aceternity.com/registry/3d-card.json) | Read for the pointer-tilt maths in prototype B; the build flips coins in three.js instead |
| Rejected | Aceternity [card-spotlight](https://ui.aceternity.com/registry/card-spotlight.json) (pulls in three.js + R3F); Magic UI [number-ticker](https://magicui.design/r/number-ticker.json) (spring-based) | |
| Work drawings, skills stack | Written by hand: `work-art.tsx` (schematic SVGs, no data implied), `skills.tsx` (CSS 3D, radio inputs; "where it shows up" is a text match against the roles, projects and the current-role tools Iveno named) | |
| Charts | Written by hand: `career-chart.tsx` (HTML/CSS Gantt), `field-strip.tsx` (SVG ticks + HTML marker), `crowd/crowd-scene.ts`, `vault/medal-scene.ts` (three.js 0.187) | |

21st.dev's registry returned 403 without an API key on 2026-10-31, so nothing is taken from it directly.

## Motion inventory

| Moment | Where | Technique | Reduced motion |
|---|---|---|---|
| Name rises into place | Hero `h1` | CSS keyframes, `transform` only, plays before hydration | instant |
| Career bars draw in | Hero chart | CSS keyframes, `scaleX` | instant |
| Camera flies field to field | Crowd | three.js lerp per frame, one step per wheel gesture, CSS scroll snap for touch and keys | camera cuts |
| Result card swish | Crowd | `useAnimate` from `motion/react-mini` (WAAPI), `transform` from an offset, never from hidden | none |
| Medal blocks rise | Crowd | three.js scale | final height |
| Camera frames each whole field in the space the card leaves free (first place bottom-left); "1st" and "Iveno, nth" labels track the blocks | Crowd | three.js `setViewOffset` + fit search | camera cuts |
| Coins drop in, sway by rarity, flip on pick; one row you can swipe on narrow stages, first medal turned over on load | Vault | three.js (lathe-turned body, raised rim, stamped faces with bump maps, laurel, loop) | placed, still, flip instant |
| Project drawings draw in with the figure's scroll position; packets flow along links | Work | CSS scroll-driven animations (`view-timeline`, `stroke-dashoffset`, `transform`), no JS | finished drawing, no flow |
| 1,400,000 URLs counts up | Work (Cavell) | `requestAnimationFrame` | static |
| Skill layer slides out of the stack | Skills | CSS 3D transforms + radio inputs, no JS | instant |
| Glass card in/out | Vault | `m.article` + `AnimatePresence initial={false}`, `transform` + `clip-path` | instant (`MotionConfig reducedMotion="user"`) |
| Gold beam / silver sheen | Vault card | CSS `rotate` | off |
| Role unfolds on a top hinge | Experience | `m.div` `rotateX` + `clip-path`, `AnimatePresence initial={false}` | instant |

Motion setup: `LazyMotion strict` with features loaded by `import("./motion-features")`, `m.*` from `motion/react-m`, `MotionConfig reducedMotion="user"`, all inside lazy islands. No Motion code is in the first load.

## Performance budget

- **First-load JS:** 138.5 KB gzipped (re-measured after the mobile pass) (module scripts referenced by `out/index.html`, gzip -9, measured 2026-10-31). The 38.6 KB core-js polyfill chunk is `noModule`, so modern browsers never download it.
- **Lazy:** three.js (~132 KB gz) loads when the crowd or vault comes within 600 px. Vault and experience interactivity, and all of Motion, load the same way (`components/lazy-island.tsx`).
- `next/image` isn't used: with static export it can't optimise, and it would add client JS. The portrait is a static import (basePath-safe) with `fetchPriority="high"`.

## Lighthouse

Measured on the deployed host with the PageSpeed Insights web UI (the anonymous API was over its daily quota), mobile, a single run on commit `bd89324`:

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| 98 | 100 | 100 | 100 |

Conditions: https://vinodaanimal.github.io/iveno-carolus/, 2026-10-31 19:50 SAST, Lighthouse 13.6.0, emulated Moto G Power, Slow 4G throttling, HeadlessChromium 153. Report: https://pagespeed.web.dev/analysis/https-vinodaanimal-github-io-iveno-carolus/10400to51c?form_factor=mobile

| Metric | Value |
|---|---|
| First Contentful Paint | 1.1 s |
| Largest Contentful Paint | 1.1 s |
| Total Blocking Time | 90 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 4.1 s |

Notes, honestly:

- This is one run. Expect a few points of variance.
- Speed Index is the weakest metric. On a phone the crowd section starts within 600px of the fold, so three.js and the WebGL scene load during the test. That's also most of the 134 KiB "unused JavaScript" PSI reports.
- GitHub Pages sets a 10-minute cache lifetime that the repo can't change (PSI's "efficient cache lifetimes" item).
- The site has no `robots.txt` at the domain root (`vinodaanimal.github.io/robots.txt` is 404). It's a project site, so its own `/iveno-carolus/robots.txt` only documents the sitemap.

## Accessibility notes

- Skip link, 3px focus ring on everything, 44px targets for coin picks, role toggles and the card's Close.
- Every chart has a caption and a visually hidden table of the real values.
- The 3D canvases are `aria-hidden`; the same data is in the step cards, the coin list and the tables. If WebGL fails, the cards and lists still work.
- Scroll snapping is switched on only while the crowd is on screen.

## Remaining TODOs

All questions in `content/questions.md` are answered (2026-10-31). Deferred by Iveno for later:

- Dates for the newer competitions, if they should sit on the career chart
- Project links (repos, live apps, leaderboards)
- What the Olympics "85-90% accuracy" measures (not shown on the site)
