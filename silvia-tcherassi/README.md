# Silvia Tcherassi Collection

A React + TypeScript + Vite e-commerce application for the Silvia Tcherassi luxury fashion brand.

## Quick Start

```bash
cd silvia-tcherassi
npm install
npm run dev
```

The app will be available at **http://localhost:3003**

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3006) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test -- --run` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## Project Structure

```
silvia-tcherassi/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/         # Page components
│   ├── routes/        # React Router configuration
│   ├── store/         # Zustand state management
│   ├── lib/           # Utilities, constants, validations
│   ├── data/          # Static JSON data
│   └── types/         # TypeScript interfaces
├── tests/
│   ├── unit/          # Vitest unit tests
│   └── e2e/          # Playwright E2E tests
├── public/            # Static assets
└── dist/              # Production build output
```

## Development Workflow

1. **Start dev server:** `npm run dev`
2. **Make changes:** Edit files in `src/`
3. **View changes:** Save and see instant updates via HMR
4. **Run tests:** `npm test -- --run`
5. **Build:** `npm run build`

## Before Committing

```bash
npm run build    # Verify production build
npm run lint     # Check for errors
npm test -- --run   # Run tests
```

## Git Workflow

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## Deployment

The project is configured for Vercel deployment with security headers. See `vercel.json` for configuration.

For GitHub Pages, the `public/_redirects` file handles SPA routing.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Zustand (state management)
- TanStack Query (data fetching)
- React Router 6
- Tailwind CSS v4
- Zod (validation)
- Vitest + Playwright (testing)
