# Production Deployment Checklist

## Pre-Deployment Verification

- [x] `npm run build` succeeds without errors
- [x] `npm run lint` reports 0 errors
- [x] `npm test -- --run` passes
- [x] CSP configured correctly in `index.html` (verified with backend connectivity)
- [x] Security headers configured via `vercel.json`
- [x] Medusa 2.0 Backend compatibility (verified with header hacks and CSP)
- [x] E2E Tests pass (36/37 passed, 1 skipped)

## Deployment Targets

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages
1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Use `public/_redirects` for SPA routing

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APP_TITLE` | Application title | No |
| `VITE_MEDUSA_BACKEND_URL` | Medusa backend URL | Yes |
| `VITE_MEDUSA_PUBLISHABLE_KEY` | Medusa publishable API key | Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | Yes |

## Post-Deployment Verification

- [x] Test in Chrome (verified via Playwright)
- [x] Test on mobile (verified via Playwright mobile emulation)
- [ ] Verify Lighthouse accessibility score ≥ 90
- [ ] Verify Lighthouse performance score ≥ 90
- [x] Verify no console errors (verified during E2E runs)
- [x] Verify CSP works correctly
- [x] Test cart persistence across sessions (verified via E2E)
- [x] Test cross-tab cart sync

## Security Checklist

- [x] CSP meta tag in index.html
- [x] frame-ancestors 'none' in CSP
- [x] form-action 'self' in CSP
- [x] X-Frame-Options header (configured in vercel.json)
- [x] X-Content-Type-Options header (configured in vercel.json)
- [x] Strict-Transport-Security header (configured in vercel.json)
- [x] Referrer-Policy header (configured in vercel.json)

## Rollback Plan

If deployment fails:
1. Revert to previous deployment in Vercel/Netlify
2. Or push fix to `main` branch and redeploy
