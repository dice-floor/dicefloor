# Dice Floor — CMS & Publishing Architecture
**Date:** 2026-03-15
**Status:** Approved, ready for implementation

---

## Goal

Convert the current static `index.html` into a fully managed editorial site where new articles can be written in Markdown, uploaded via a browser interface with no command line, and published automatically with a consistent design applied to every article.

---

## Chosen Stack

| Layer | Tool | Cost |
|---|---|---|
| Static site generator | Jekyll | Free |
| Hosting | GitHub Pages (existing) | Free |
| CMS / editor interface | Decap CMS | Free |
| Audio generation | NotebookLM (single narrator) | Free |
| Domain | dicefloor.com (existing CNAME) | Existing |

**Total monthly cost: £0**

---

## How Publishing Works (end to end)

1. Write article in Bear (or any Markdown app), export as `.md`
2. Paste article text into NotebookLM, export audio as MP3
3. Open `dicefloor.com/admin` in browser, log in with GitHub account
4. Click **New Article** — fill in: Title, Category, Date, Body (Markdown), upload MP3
5. Click **Publish** — Decap CMS commits files to GitHub invisibly
6. GitHub Pages triggers Jekyll build (~30 seconds)
7. Article is live with full Dice Floor design applied. Homepage updates automatically.

No terminal. No git. No FTP. No manual HTML editing.

---

## Article Template Layout

Every article page uses a single Jekyll layout (`_layouts/article.html`). Structure top to bottom:

```
[Site header — same as homepage: Dice Floor logo, separator lines, nav]

[Category tag]  e.g. CRUISE LINES
[Article headline]  — Cormorant Garamond, large
[By Author · Date]  — DM Sans, small, grey

[─── Audio Player ──────────────────────────────────────────]
[▶] 0:00  ════════════════════════════════○════  8:35
[────────────────────────────────────────────────────────────]

[Full article body — Markdown rendered, DM Sans body text]

[← Back to Home]

[Site footer — same as homepage]
```

### Audio Player Specification

- Transparent background
- Flat rectangular border, `1px solid #cccccc`, `border-radius: 6px`
- Padding: `10px 14px`
- **Left:** rounded-square play/pause button (`border-radius: 6px`), black `▶` / `❚❚` icon
- **Center-left:** current time (e.g. `0:00`) — DM Sans, 12px, grey
- **Center:** slim horizontal progress track, draggable thumb
- **Right:** total duration (e.g. `8:35`) — DM Sans, 12px, grey
- Custom-built in JavaScript — no browser-default audio controls

---

## Homepage Auto-Update

Once converted to Jekyll, `index.html` becomes a template. When a new article is published:

- It automatically appears at the top of the homepage feed
- Older articles move down
- When the feed exceeds 8 articles, older ones move to `/articles` (archive page, same style)
- No manual editing of the homepage ever required

---

## Article Metadata (front matter)

Each Markdown file will have a small header block that Decap CMS fills in automatically:

```yaml
---
layout: article
title: "Inside the Dealer Shortage Reshaping Casino Cruise Operations"
category: Cruise Lines
date: 2026-03-15
author: Staff Writer
audio: /assets/audio/2026-03-15-dealer-shortage.mp3
image: /assets/images/2026-03-15-dealer-shortage.jpg
---
```

The rest of the file is the article body in plain Markdown.

---

## Audio Workflow

- Audio generated via **NotebookLM**, single narrator voice
- Exported as MP3, uploaded through Decap CMS at publish time
- Stored in `/assets/audio/` in the GitHub repo
- Future: two-host podcast format via NotebookLM (separate feature, later date)

---

## Content Categories

Matches existing homepage navigation:

- `Cruise Lines`
- `Land Casinos`
- `Jobs`
- `Articles` (general)
- `Learning` (future)

---

## Row 1 Hero — Planned Conversion to Agency Banner

The current Row 1 hero article ("Inside the Dealer Shortage Reshaping Casino Cruise Operations Worldwide") will at some point be permanently replaced by a **job agency banner** — a fixed promotional placement for the cruise line and casino crew agency service.

- **For now:** treat it as a normal article, part of the rotating homepage feed
- **When the time comes:** Row 1 will be hardcoded as a permanent banner (outside the Jekyll article loop), and the rotating feed will begin at Row 2
- **Trigger:** when agency partnerships with cruise lines and casinos are confirmed
- This will require a separate design conversation and a dedicated banner layout

No action needed now. Build Row 1 as a standard article slot initially.

---

## Future Pages (not in scope for initial build)

These are permanent product pages, not blog posts. Same header/footer/fonts as the rest of the site.

| Page | Path | Status |
|---|---|---|
| Poker Tournament Director | `/poker-director` | Future |
| Marine Crew Document Verification | `/marine-crew` | Future |

---

## Implementation Steps (in order)

1. **Convert site to Jekyll** — Add `_config.yml`, move `index.html` to `_layouts/`, create `_posts/` folder, test locally
2. **Create article layout** — `_layouts/article.html` with the custom audio player
3. **Configure Decap CMS** — Add `admin/` folder with `config.yml` and `index.html`, connect to GitHub repo
4. **Convert existing homepage** — Replace placeholder article content with Jekyll Liquid template tags that pull from `_posts/`
5. **Add articles archive page** — `/articles/index.html` listing all posts
6. **Test full publish flow** — Write a test article via `dicefloor.com/admin`, confirm it appears correctly
7. **Go live** — Push to `main` branch, GitHub Pages serves the Jekyll build

---

## Decisions Made

| Question | Decision |
|---|---|
| Content format | Markdown (Bear App export) |
| Authors | Solo (site owner only) |
| Audio | NotebookLM TTS, MP3 upload |
| Publishing interface | Browser only, no command line |
| CMS | Decap CMS (free, open-source) |
| Hosting | GitHub Pages (existing, free) |
| Audio player style | Custom — flat rectangle, 6px radius, transparent bg |
