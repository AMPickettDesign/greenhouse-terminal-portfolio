# Greenhollow Research Facility

A psychological horror-themed portfolio site for Ashley Marie Pickett — Graphic Designer & Creative Technologist. Built with React, styled as an abandoned research facility terminal.

## Live Site

<https://AMPickettDesign.github.io/greenhouse-terminal-portfolio/>

## Features

- **Boot sequence** — typewriter terminal intro with pause/skip controls
- **Facility briefing** — first-visit onboarding with replay option
- **Filing cabinet projects** — case studies presented as stacked file folders with flip-open interaction
- **Sanity system** — global distortion slider that degrades the UI across all pages
- **Game UI demos** — HUD, Inventory, Dialogue, Journal, and Accessibility panel
- **Lore logs** — optional atmospheric narrative scattered across sections
- **Dev mode** — toggle to reveal design decision notes on every page
- **Mobile-first** — bottom tab bar, touch targets, performance guards on mobile
- **Accessible** — WCAG AA contrast, keyboard nav, screen reader support, reduced motion

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` — GitHub Actions handles the rest.

The workflow builds with Vite and deploys to GitHub Pages automatically. To enable it, go to your repo **Settings > Pages** and set Source to **GitHub Actions**.

## Customisation

| File | What to edit |
|------|-------------|
| `src/pages/Personnel.jsx` | Name, role, summary, disciplines, tools |
| `src/pages/ExperimentLogs.jsx` | Project titles, descriptions, tags, links |
| `src/pages/Equipment.jsx` | Skills and tool categories |
| `src/pages/Communications.jsx` | Email, GitHub, LinkedIn URLs |
| `src/data/loreLogs.js` | Lore text (optional, aesthetic only) |
| `vite.config.js` | Base path — must match exact GitHub repo name |

## Tech Stack

- **Vite 5** — build tool and dev server
- **React 18** — UI components and state
- **React Router 6** — client-side routing
- **CSS Modules** — scoped component styles
- **GitHub Pages** — free static hosting via Actions
