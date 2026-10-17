# ALDEN ROVELL | WEBSITE SOURCE OF TRUTH

**Document type:** Website requirements, UI/UX and engineering playbook  
**Project:** Alden Rovell multi-category e-commerce store  
**Primary market:** Pakistan | **Currency:** PKR | **Hosting:** Vercel  
**Status:** Working specification; not proof that the site, domain or integrations exist.

## 0. MANDATORY READ-BEFORE-WORK RULE

Before EVERY Alden Rovell website-related task (planning, UI, coding, debugging, redesign, animation, performance, SEO, testing or deployment):

1. **Read this entire file first**, alongside `ALDEN_ROVELL_PROJECT_MEMORY.md` and current code/files if accessible.
2. Apply its confirmed constraints and inspect the existing implementation before making changes.
3. Respect approved project decisions and the owner's latest explicit request. Never silently overwrite agreed designs or working code.
4. If this file is not accessible in the current chat/project, say so and ask for it. **Never pretend to have read an unavailable file.**
5. Start substantial website tasks with a short scope/plan. End with changed files, tests actually run, open issues and next action.
6. Update this document's decisions/status only when the owner confirms the change. Do not claim project files update automatically.

**Priority:** Latest explicit owner instructions > confirmed business decisions > this website source > unapproved design suggestions. All secrets, security rules and platform limits still apply.

## 1. WEBSITE VISION

Create a **premium, modern, polished, responsive and thoughtfully animated** online retail store that feels credible, fast and easy to shop. Use minimalist design and distinctive brand identity, not a generic template. Prioritize real usability over visual tricks.

- Brand: **ALDEN ROVELL** (final name, do not rename).
- Categories may include shoes, artificial jewellery, massagers, gadgets, accessories and future products.
- **Never position the site as fashion-only or jewellery-only.**
- Site copy should be polished English by default; discuss tasks with the owner in Roman Urdu + English.
- Show genuine product, pricing, shipping, availability and promotional details only after confirmation.

## 2. DESIGN SYSTEM (PROPOSED, NOT APPROVED)

**Look:** Editorial minimalism + contemporary e-commerce. Clean typography, thoughtful whitespace, coherent grids, excellent product images, crisp icons and purposeful details.

**Palette proposal:** Ink `#17212B`, ivory `#F7F5F0`, soft sand `#CDBDA5`, charcoal `#2A2A2A`. Confirm final colors with owner; use accessible contrast.

**Brand assets:** Full `ALDEN ROVELL` wordmark, optional `AR` monogram, favicon, light/dark versions, consistent social and website use. Avoid copying Calvin Klein, Sapphire, Zara or another brand's protected visual identity.

**Typography:** Pair a distinctive but readable heading font with a highly legible interface font; limit font families and weights. Define reusable tokens for color, type scale, spacing, shadows, radii, transitions and breakpoints.

**Layout:** Airy hero, compelling product imagery, neat category navigation, clear CTAs, logical hierarchy and consistent card treatments. Design for small screens FIRST and scale up. Avoid harsh neon, overwhelming gold, clutter or trendy effects that date quickly.

**Original imagery:** Never invent product features or replace supplied real product photos with misleading renders. Optimize permitted assets, preserving product accuracy.

## 3. RESPONSIVE UX (NON-NEGOTIABLE)

- Support mobile (~320px+), tablet, laptop and large desktop layouts; no horizontal overflow.
- All content, menus, forms, product grids, gallery images, filters and checkout must adapt smoothly.
- Header: readable identity, accessible navigation, search and cart; provide an easy mobile drawer.
- Product grids: roughly 2 columns on suitable phones, 3 on tablet, 4+ on large desktop where space allows; adapt when content gets cramped.
- Product details: mobile-first vertical layout; desktop may use an image gallery + purchasing panel.
- Provide usable touch targets, visible focus states, keyboard navigation and correct labels.
- Respect safe-area insets, reduced-motion settings, slow networks and low-powered phones.
- Product discovery, add-to-cart and checkout should stay obvious without unnecessary clicks.
- Consider a sticky mobile purchase CTA where genuinely useful, without obscuring content.

## 4. ANIMATION & MICRO-INTERACTIONS

The finished website should feel alive and elegant, **not distracting**. Add motion intentionally, not everywhere.

**Recommended motion:**
- Header/search/menu transitions and a smooth accessible mobile navigation drawer.
- Hero text and imagery with restrained initial entrance animation.
- Subtle section reveal on first scroll into view; avoid replaying every time.
- Product-card hover/focus feedback, tasteful image transitions and CTA feedback.
- Product gallery switching, variant selection, add-to-cart confirmation and cart drawer.
- Smooth accordion/FAQ expand and form loading/success/error feedback.
- Optional route/page transitions only if they do not interrupt shopping or navigation.

**Implementation rules:**
- Prefer CSS transitions for simple states; consider Motion for React only when complexity merits it.
- Prefer `transform` and `opacity`; avoid animating layout-heavy properties unnecessarily.
- Typical micro-interactions: ~150-250ms; entrance reveals ~300-500ms. Use subtle easing.
- Honor `prefers-reduced-motion`: disable or simplify nonessential motion.
- No forced auto-scrolling, scroll-jacking, flashing text, intrusive autoplay or perpetual animations.
- Never delay buttons/forms while animations finish. Menus, cart and checkout must remain usable.
- Test animation fluidity on real mobile devices; avoid layout shift and heavy JS bundles.

## 5. SITE MAP & REAL STORE FUNCTIONS

**Core pages:** Home; Shop/All Products; category and filtered listing; product detail; cart; checkout; order confirmation; About; Contact; FAQ; Shipping; Returns/Refunds; Privacy; Terms; 404 and appropriate error states.

**Home:** Elegant responsive hero, authentic category tiles, curated featured products, concise value proposition, trust information ONLY if verified, and clear CTAs.

**Catalog:** Reliable search, filters, sorting, responsive cards, accurate PKR pricing, meaningful empty/loading/error states and pagination or efficient loading.

**Product page:** Optimized gallery with zoom if useful, accurate variants, SKU/specs, real inventory, clear pricing, shipping information, quantity, add-to-cart and support details.

**Cart:** Add/update/remove, quantities and totals, persistent cart, stock checks and clear failure handling.

**Checkout:** Name, verified Pakistani phone/address formatting, shipping, COD only if operational, order review, server-side totals, durable order persistence and confirmation. Do not pretend a demo order is real.

**Admin:** Authenticated and authorized interface for products, prices, stock, orders and order status. No public admin access.

**Policies & support:** Must reflect owner-approved real policies, contact channels and shipping partners. Never invent guarantees, contact details or timelines.

## 6. ENGINEERING APPROACH

**Preferred stack:** Next.js App Router, React, TypeScript, Tailwind CSS, GitHub, Vercel. Pick backend, database, image storage, authentication and email based on verified feature needs, budget and Pakistan availability; explain any added service.

- Organize code by routes/features and shared components; use typed reusable UI primitives.
- Use server components where appropriate, client components only when interaction is needed.
- Separate mock/demo data from production inventory and clearly label it.
- Define product and order data models before implementing checkout.
- Always validate prices, stock, discounts and order totals on the server; never trust the browser.
- Protect secrets in environment variables; include `.env.example` with placeholder names, never credentials.
- Enforce authentication and authorization for administrative actions; protect user data and orders.
- Handle server failures, retries, duplicate submissions and pending-order states safely.
- Never collect/store raw payment-card data in the app; use a suitable approved provider.
- Use well-maintained dependencies and current recommended framework patterns; avoid feature bloat.
- Maintain a useful README, clear scripts and sane error/loading states.

## 7. PERFORMANCE, SEO & ACCESSIBILITY

- Optimize for Core Web Vitals, especially mobile LCP, INP and CLS; measure rather than guess.
- Use responsive optimized images, suitable lazy loading, font optimization and code splitting.
- Minimize third-party scripts, large animation libraries and unnecessary client-side JavaScript.
- Set unique metadata, canonical URLs, Open Graph images, sitemap and robots.txt.
- Add relevant product structured data only when backed by accurate product information.
- Create semantic headings, alt text, labeled inputs, focus handling and readable contrast.
- Aim for WCAG 2.2 AA practices where practical, including reduced-motion support.
- Test navigation, keyboard access and screen-reader semantics for complex UI.

## 8. TESTING & ACCEPTANCE

Before marking a website feature 'Done', verify what is actually possible:

1. Desktop, tablet and small-phone layouts; no overflow or clipped controls.
2. Menu, search, filters, product gallery, cart and checkout interactions.
3. Keyboard focus, labels, reduced motion and form errors.
4. Product variants, sold-out states, stock changes and incorrect inputs.
5. Server-side pricing, duplicate orders, failure states and admin protections.
6. Production build, lint/type checks and available automated tests.
7. Actual Vercel preview and real-order flow before public launch.

Report **Passed**, **Failed**, or **Not Tested** truthfully, with the exact checks run. A screenshot or mockup does not prove functionality.

## 9. VERCEL RELEASE PROCESS

1. Maintain source in GitHub and connect the repository to Vercel.
2. Configure build command, environment variables, runtime needs and database access.
3. Deploy to a preview URL; test functionality on multiple screen sizes.
4. Confirm owned domain and DNS, HTTPS, SEO settings and redirects.
5. Connect legitimate order notifications, support and analytics only when approved.
6. Launch after products, inventory, policies, shipping, COD/payment and real orders are operational.
7. Monitor errors and improve performance after launch.

**Domain note:** Initial registration budget around **PKR 2,000**. Domain, renewal pricing and account/social handle availability remain unverified; never assume ownership or promise an exact price.

## 10. TASK RESPONSE FORMAT

For each meaningful website request, use this concise structure when appropriate:

- **Goal / current state:** What the user wants; what existing project files reveal.
- **Implementation:** The actual design, code or fix, not just an idea.
- **Files changed:** New/edited paths and key decisions.
- **Verification:** Tests performed and results; list what could not be tested.
- **Next action:** One practical next step, including any required owner input.

If no source code or design assets are attached, state this and create a sensible scaffold only when requested. Do not claim to have inspected a repository without access.

## 11. OPEN DECISIONS & CHANGE LOG

**Confirmed:** ALDEN ROVELL; multi-category; Pakistan market/PKR; responsive and animated premium store objective; ChatGPT-assisted build; Vercel hosting.

**Unconfirmed:** Final logo and palette; site code/repository; owned domain; accounts/handles; products; payment and courier integrations; database choice; business contact/policies; public launch date.

**Change log:** 2026-10-16: Added website-specific source-of-truth requirement covering responsive design, refined animation, secure e-commerce functions and Vercel deployment. This is a planning specification, not a completed site.
