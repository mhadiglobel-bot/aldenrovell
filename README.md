# ALDEN ROVELL | Premium Multi-Category Store

A mobile-first Next.js / TypeScript / Tailwind store starter prepared from the owner's October 2026 logo and product handoff PDFs. Built for GitHub + Vercel and a Pakistan-focused Cash on Delivery (COD) workflow.

**IMPORTANT: This package is a staging-ready source project, NOT a verified live store.** The four imported product groups and their visual concepts are unapproved drafts. COD checkout intentionally stays disabled until products are verified and the owner configures Supabase + shipping. We do not invent prices, stock, delivery fees, Gmail addresses, courier arrangements, or product claims.

## What's inside

- Premium home page, collection and category filters, product detail galleries, cart, checkout and receipt QR design.
- Search and alphabetical sorting, responsive mobile navigation and image grids, subtle CSS motion with reduced-motion support.
- About, Contact, FAQ, Shipping, 7-Day Returns, preliminary Terms and Privacy pages.
- **Secure server-backed COD order requests** (activation requires Supabase) with server-calculated totals, order references, idempotency, stock reservations, status updates and stock-restoring cancellations.
- Protected admin dashboard: verify images and sellable units, enter price/stock, publish, manage shipping/COD, read orders, change status.
- Optional Resend-to-Gmail **owner order notifications**, if configured; the orders database remains the source of truth.
- Customer order-reference QR shown on success. This is **not a payment, shipping, or WhatsApp QR**.
- Product images: 20 optimized WebP images from the embedded PDF asset ZIP, plus 7 extracted brand PNGs. The full original draft catalog and reference-image previews live under `assets-review/`.

## 1. Local quick start

Requires **Node.js 20.9+** (Node 22 is recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without any environment variables, the 4-item catalog displays in **preview mode**, and protected order/admin backend functions are OFF. That is intentional. `npm run build` works only after dependencies are installed. The product images and logos are packaged locally.

Quality commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See `DEPLOYMENT.md` for step-by-step GitHub/Vercel and Supabase setup. See `OWNER_APPROVAL_CHECKLIST.md` for launch blockers.

## 2. Operating model

**Customer checkout:** Customer chooses a published product, adds it to the persistent bag, enters Pakistani mobile number and address, acknowledges confirmation policy, and submits a COD request. The server revalidates input, and a protected PostgreSQL SQL function checks store settings, prices, availability and stock while writing the order. The response contains only the reference, total, shipping fee and confirmation status. A QR receipt is generated in the browser. The owner must personally confirm and fulfill requests.

**No database = no order:** The endpoint returns an explicit 503. The app does not pretend to accept orders, send WhatsApp messages, or permanently store orders in browser local storage.

**Notifications:** After successful order creation, a best-effort Resend email can notify `ORDER_NOTIFY_EMAIL` (this can be the owner's actual Gmail). Resend requires its own account/API key and verified sender. Notifications cannot be guaranteed, so **review the admin order dashboard** even if email is configured. Never store secrets in client source.

**Order stock:** Units are reserved when an order is created; an admin cancellation restores them. Check stale pending orders regularly and decide how to handle abandoned order requests. No automatic expiry in this version.

**Product approval:** Four products all start `is_published=false`, `images_approved=false` and `sales_unit_verified=false`, with null prices/stock. Confirm real sample photos, contents, variants, sellable quantity and public copy before enabling controls. Current admin models only **one sellable SKU per product**, so size-dependent sandals and ring variants require a variant inventory upgrade before selling those as separate options.

## 3. Key files

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Editorial home and categories |
| `src/app/shop/page.tsx` | Shop listing |
| `src/components/shop-explorer.tsx` | Search/filter/sort |
| `src/components/product-detail.tsx` | Image gallery and product details |
| `src/components/cart-provider.tsx` | Browser cart persistence |
| `src/components/checkout-view.tsx` | COD request UX and reference QR |
| `src/app/api/orders/route.ts` | Server-side checkout/notifications |
| `src/components/admin-console.tsx` | Admin interface |
| `src/app/api/admin/` | Protected admin endpoints |
| `src/lib/store.ts` | Service role / Auth / catalog access |
| `supabase/schema.sql` | PostgreSQL schema and atomic procedures |
| `src/data/catalog.json` | Four provisional products from the PDF |
| `public/products/` | 20 optimized concept images |
| `public/brand/` | Supplied 7 logo assets |
| `assets-review/` | Original catalog data and review references |
| `.env.example` | Required and optional configuration variable names |

## 4. Design and source integrity

The selected starting colors come from the logo guide: red/oxblood with charcoal and warm neutral backgrounds. This is a **proposed working theme**, not proof of final approval. Product source PDF makes clear that the 20 images are AI-assisted concept renderings requiring sample review. Do not make unsupported material, performance or medical claims.

Logo mapping:
- Header: `primary-logo.png`
- Loading state and favicon: `symbol-transparent.png`
- Home editorial brand panel: `profile-dark.png`
- About: `stacked-logo.png`
- Footer: `monochrome-logo.png`
- Supplied optional campaign assets: `wide-banner.png`, `landscape-cover.png`

## 5. Safety before public launch

- Approve final legal policies and business contact Gmail/number.
- Verify product photography, stock, prices, variants and specifications.
- Verify actual COD/courier coverage and fees; test checkout with an authorized noncustomer test order first.
- Install protections against automated spam/orders (e.g. managed WAF and CAPTCHA with server verification) before a widely promoted public launch. Current order endpoint performs strict validation but is **not rate-limited**.
- Do not include service-role secrets in public GitHub, `NEXT_PUBLIC_` variables, screenshots, or chat.
- Evaluate order retention, cancellation/refund, privacy and legal compliance with local advisors.
- Enable live indexing only when the site is approved by setting `NEXT_PUBLIC_STORE_LIVE=true`; until then the app sets noindex/robots disallow.

## Verified here (2026-10-17)

- Source PDFs parsed and embedded catalog assets extracted.
- 7 logo resources and 20 product WebP resources written to source.
- `npm test`: 7 / 7 input validation unit tests passed (Node 22).
- TypeScript syntax parsing: 0 parse errors across source files.
- **Not tested:** `npm install`, `npm run build`, `npm run typecheck`, `npm run lint`, browser/mobile screenshots and actual Supabase/Resend/deployment integration. External npm registry could not be accessed in this build environment. Run checks above on a connected machine or Vercel.

Copyright: Use only owner-authorized logo and product artwork. Commercial usage rights for external supplier/source content must be confirmed.
