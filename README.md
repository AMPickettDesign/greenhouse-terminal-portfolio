# Greenhollow Research Facility

A psychological horror-themed developer portfolio built with React.

## Live Site

<https://AMPickettDesign.github.io/greenhouse-terminal-portfolio/>

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` -- GitHub Actions handles the rest.

The workflow builds with Vite and deploys to GitHub Pages automatically. To enable it, go to your repo **Settings > Pages** and set Source to **GitHub Actions**.

## Customisation

These four files contain placeholder content that should be replaced with your real information:

| File | What to edit |
|------|-------------|
| `src/pages/Personnel.jsx` | Name, role, summary, skills |
| `src/pages/ExperimentLogs.jsx` | Your real projects / case studies |
| `src/pages/Equipment.jsx` | Your tools and skills |
| `src/pages/Communications.jsx` | Email, GitHub, LinkedIn URLs |

## Tech Stack

- **Vite 5** -- build tool and dev server
- **React 18** -- UI components and state
- **React Router 6** -- client-side routing
- **CSS Modules** -- scoped component styles
- **GitHub Pages** -- free static hosting via Actions
