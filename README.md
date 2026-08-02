# Luthfi — 自己紹介 (Jikoshoukai)

Interactive scrollytelling self-introduction site for live office presentation and QR/link sharing afterward.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Presentation mode (default):** keyboard Next/Prev HUD for live talks  
- **Explore mode:** [http://localhost:3000/?explore=1](http://localhost:3000/?explore=1) — free scroll + scroll-triggered animations

### Presenter controls (default)

| Key | Action |
|-----|--------|
| `→` / `Space` / `↓` | Next beat or sub-step |
| `←` / `↑` | Previous |
| `F` | Toggle fullscreen |
| `1`–`9` | Jump to beat |

## Stack

Next.js (App Router) · Tailwind CSS v4 · GSAP ScrollTrigger · Framer Motion · JA/EN dictionaries · SVG map · QR via `qrcode.react`

## Replace photos

1. Drop real images into `public/photos/` using the IDs in `public/photos/manifest.json` (e.g. `fuji-3.jpg`).
2. Update `src` in the manifest to the new file path.
3. Prefer WebP; keep long edge ≥ 1600px for landscapes.

Priority photos: `hero-portrait`, `osaka-1`, `fuji-3`.

## Edit copy

All on-screen text lives in:

- `src/locales/ja.json` (default)
- `src/locales/en.json`

Keys are grouped by beat (`hero`, `explorer`, `world`, …). Language toggle persists in `localStorage`.

## Recommendations form

Submissions currently save to `localStorage` and show as a wall of chips. To send to Google Sheets, point the form submit handler in `ClosingBeat.tsx` at a webhook URL.

## Deploy

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) (recommended) or Netlify. After you have a final URL, regenerate the QR by opening the live site (QR reads `window.location`).

## Plans

Source briefs (also in repo):

- `01-concept-and-tech-plan.md`
- `02-storyteller-script.md`
- `03-asset-checklist.md`
