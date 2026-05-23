# Implementation Plan: Security Hardening

This plan breaks down the security hardening into actionable steps.

## Phase 1: Environment & Dependency Audit
1.  **Dependency Audit:** Run `npm audit` on both `backend` and `silvia-tcherassi`. Fix high/critical vulnerabilities.
2.  **Env Validation (Backend):** Create `backend/src/lib/env-schema.ts` using Zod and integrate it into `medusa-config.ts`.
3.  **Env Validation (Storefront):** Create `silvia-tcherassi/src/lib/env-schema.ts` and integrate it into `vite.config.ts` or a startup script.

## Phase 2: API Security (Backend)
1.  **Security Headers:** Integrate `helmet` or equivalent middleware into the MedusaJS Express server.
2.  **Rate Limiting:** Implement `express-rate-limit` for `/admin/auth` and `/store/auth` routes.
3.  **CORS Policy:** Strict configuration of CORS in `medusa-config.ts`.

## Phase 3: Storefront Hardening
1.  **Validation Audit:** Review `ProductPage.tsx` and `CartDrawer.tsx` to ensure all actions are validated via Zod.
2.  **Content Security Policy:** Add a `<meta>` tag or header-based CSP to the storefront.
3.  **Sanitization:** Ensure no `dangerouslySetInnerHTML` is used without proper sanitization (DOMPurify).

## Phase 4: Verification
1.  **Automated Scans:** Use `lighthouse` or `security-worker` to check for missing headers.
2.  **Manual Penetration Test:** Attempt basic XSS and SQL injection on form fields.
3.  **Load Test Rate Limiting:** Verify that the rate limiter triggers correctly under high frequency requests.
