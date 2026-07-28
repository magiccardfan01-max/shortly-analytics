# Shortly Analytics

**Cool URL shortener with click tracking, device analytics, QR codes, custom slugs & expiring links.**

Inspired by popular project ideas shared on X (Twitter) — specifically the "URL shortener with analytics" suggestion from developer portfolio project lists.

## Features

- ✂️ Create short links with optional custom slugs
- 📊 Full click analytics: devices, browsers, referrers, time series
- 📱 QR code generation for every link
- ⏳ Optional expiration dates
- 🏷️ Optional titles / campaign names
- 🔒 Privacy-first: all data stored in your browser (localStorage)
- 🎨 Beautiful dark UI with Tailwind CSS
- ⚡ Built with Next.js App Router + TypeScript

## Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- Client-side storage (localStorage) — no backend/database required

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

1. Paste a long URL → get a short `/slug` link
2. Share the short link (works in the same browser where it was created)
3. Every click is recorded with device, browser & referrer
4. View rich analytics + QR code on the analytics page

> **Note:** Because data lives in localStorage, short links resolve only in the browser that created them. Perfect for personal use, demos, and portfolio projects. For multi-user production, swap the store for a real database (Postgres / Redis / etc.).

## Deploy

Deploy instantly on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/magiccardfan01-max/shortly-analytics)

Or:

```bash
npx vercel
```

## License

MIT
