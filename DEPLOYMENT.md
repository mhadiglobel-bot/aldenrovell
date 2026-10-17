# ALDEN ROVELL - GitHub + Vercel Deployment Guide

## Phase A: Preview website (NO backend, NO live orders)

1. Download the supplied ZIP and **extract it locally**. Do not upload the ZIP itself as your code. The `package.json` must be at the repository root.
2. Create a new private repository in [GitHub](https://github.com/new), e.g. `alden-rovell-store`. Use **Add file → Upload files**, and upload the extracted project contents including `src`, `public`, `supabase`, `package.json`, etc. Git command line is equally valid. GitHub web upload may be inconvenient for many files; GitHub Desktop also works.
3. Login to [Vercel](https://vercel.com). Click **Add New → Project**, import the GitHub repository and authorize access. The GitHub and Vercel account email addresses do **not** have to match.
4. Framework Preset should auto-detect **Next.js**. Keep **Root Directory:** `./`; Build Command: `npm run build`; Install Command: `npm install`; Output Directory: **leave blank/default**. Do not use `out` because this store needs server routes for orders.
5. Deploy preview. With no environment variables, the store should render its catalog **but cannot accept orders**. Verify image paths, mobile/desktop layout, category tabs, and product gallery.
6. Subsequent GitHub pushes should trigger Vercel deployments automatically once the repository is linked.

## Phase B: Supabase order database + admin

1. Create your own project at https://supabase.com/dashboard. In its **SQL Editor**, paste and run the full `supabase/schema.sql` script. Run it on a clean database only, or carefully review migrations first.
2. Under **Authentication → Users**, create a unique administrator user with **email/password**. Disable public signups if not needed. Set the exact authorized email as `ADMIN_EMAIL` in Vercel.
3. In **Project Settings → API / API Keys**, collect URL, anon/publishable key (supported legacy `anon` key) and **service_role** secret. No public clients should receive service_role.
4. In **Vercel → Project Settings → Environment Variables**, add:

   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase service_role secret (**server only!**)
   - `ADMIN_EMAIL` = exact admin login email

5. Redeploy in Vercel after changing environment variables. Visit `/admin`, sign in and verify dashboard access. Confirm non-admin users are rejected from API routes.
6. In the dashboard, verify the real product images and physical stock, final sellable quantity/variant, real PKR price and stock number; save. **Do not approve or publish unverified products.** The current simple catalog supports one sellable SKU per draft group. Before selling rings and sandals in multiple sizes/variants, extend the backend with variant-level stock.
7. Set an **approved flat shipping fee** in the admin dashboard; activate COD only when operational readiness is confirmed. Test with a safe internal order and verify `/admin` shows the correct record and stock change; cancel it and verify stock restoration. Avoid collecting real customer orders while policies are unfinished.

## Phase C: Optional Gmail notifications from Resend

The notification recipient may be an existing Gmail address, even if ChatGPT/Vercel uses a different Gmail. A random Gmail address must **not** be invented.

1. Register at https://resend.com, configure a real verified sending domain (or other approved verified sender).
2. In Vercel variables set `RESEND_API_KEY`, `ORDER_NOTIFY_EMAIL` = your receiving Gmail, and `ORDER_FROM_EMAIL` = your verified sender address.
3. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the **owner-confirmed public support Gmail** only when ready. Until then website displays **Coming soon**.
4. Redeploy and make an internal order. Verify the request exists in the database and notification is delivered to the recipient's inbox. Email notifications are best effort: the order admin dashboard is authoritative.
5. If notifications fail, inspect secure Vercel Function logs (avoid logging sensitive customer addresses/numbers). An absent notification does **not** roll back a saved order.

## Launch configuration & checks

- `NEXT_PUBLIC_SITE_URL=https://your-verified-domain` after domain ownership, or the assigned Vercel preview URL.
- `NEXT_PUBLIC_STORE_LIVE=true` **only after launch approval** to permit search indexing. Leave unset otherwise.
- Run local commands (requires Node.js 20.9+):

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```

- Check `/`, `/shop`, `/product/multi-head-massage-gun`, `/cart`, `/checkout`, `/about`, `/contact`, `/faq`, `/returns`, `/privacy`, `/terms`, `/admin`.
- Check 320px phone, tablet, and desktop; keyboard/focus and reduced motion; 404; invalid inputs, out-of-stock, duplicates, shipping and confirmed statuses.
- **Production protection not yet implemented:** anti-bot/captcha, full checkout integration tests, variant inventory, automated recovery of abandoned pending COD orders, approved policies and real courier notifications. Do not advertise the shop as fully operational until these are resolved.

## Troubleshooting

- `Missing module`: the npm dependencies did not install; run `npm install` and inspect Vercel build output.
- `Admin backend is not configured`: check all Supabase + `ADMIN_EMAIL` variables and redeploy.
- `Not authorized`: login user email must exactly equal `ADMIN_EMAIL` and must be present in Supabase Auth.
- `Could not place order`: verify a published product's approved flags and stock, COD settings, SQL function grants, and SQL Editor migration.
- `Notification not configured`: complete Resend setup; keep using dashboard while it is missing.
- Site intentionally `noindex`: leave until approved production launch, then configure domain and `NEXT_PUBLIC_STORE_LIVE=true`.

## V1.1 TypeScript validation build fix (October 2026)

The original V1 checkout validation produced Vercel's `src/lib/validate.ts`
TypeScript error (`t.quantity is of type unknown`) during `next build`.
V1.1 fixes this by checking JSON input types before comparing quantities.

If your GitHub repository is already linked to Vercel, **do not make another
repository or Vercel project**. In GitHub open `src/lib/validate.ts`,
choose Edit (pencil), replace its contents with this package's corrected file,
and commit to the linked production branch (usually `main`). Vercel should
start a new deployment automatically. Alternatively update your repository
with the contents of this ZIP (not the ZIP file itself).

You can deploy the store preview with no Supabase environment variables;
checkout intentionally does not accept real orders until Supabase, accurate
product settings, shipping fee and COD have been configured. Empty API keys
are not usable secrets. Add real keys only to Vercel's Environment Variables;
redeploy after modifying them.
