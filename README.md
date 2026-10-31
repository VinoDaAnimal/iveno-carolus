# Iveno Carolus

Personal site: <https://vinodaanimal.github.io/iveno-carolus/>

Next.js (App Router) static export, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```bash
npm install
npm run dev        # http://localhost:3000/iveno-carolus/
npm run build      # static site in out/
npm test           # rank → percentile maths behind the charts
```

- Copy and open questions: `content/` (`content/questions.md`)
- Every fact on the page comes from `lib/data.ts`
- Design decisions, tokens, component sources, motion and measured Lighthouse numbers: `DESIGN.md`
- Zindi banner: drop `public/images/zindi-on-the-leaderboard.png` (1584×396) in and it appears above the medal vault on the next build
