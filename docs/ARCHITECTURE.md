# ORBIT — Architecture and QA Guide

## Design direction

Dark, editorial, restrained luxury: navy-black backgrounds, rounded sans-serif display lettering, lavender and peach undertones, large spatial whitespace and polished pill-shaped controls. Rounded cards, forms and navigation are deliberate user requirements. Space is not a backdrop only; the persistent WebGL scene and 3D-implied radial graphics create narrative continuity.

## Architecture

The project is dependency-free and runs as static ES modules. `index.html` is the single HTML shell; `assets/js/app.js` is the client-side router and event coordinator. Page templates live under `assets/js/pages/`. `vercel.json` handles deep-link SPA rewrites while preserving real static assets.

`scene.js` runs a WebGL fragment shader to create real-time 3D sphere normals, surface patterns, directional lighting, atmosphere edge glow and elliptical orbit rings. It interpolates the camera's screen position and apparent sphere radius based on route, scroll position, viewport and immersive viewing mode. No external 3D models are needed. Mobile DPR is capped to reduce GPU work; non-WebGL browsers receive a static fallback image.

`stars.js` draws a separate parallax starfield layer with a lightweight 2D canvas. `audio.js` implements optional low-volume synthetic ambient sound, started only after a user click. Both are independent of the primary WebGL view.

`app.js` provides History API routing, keyboard search, mobile menu, scroll progress, IntersectionObserver reveals, category filters, mission accordion, technology selector, world viewer, contact clipboard composer, and fallback navigation. Component and page content use local files only.

## Route map

`/` main immersive experience; `/worlds` filterable archive; `/worlds/:slug` five custom planet detail views; `/missions` expedition log; `/technology` interactive system visualization; `/about` concept manifesto; `/contact` local clipboard message composer; any unknown path shows a custom 404 screen.

## Accessibility

Includes `aria-pressed` on filters and view modes, `aria-expanded` on mission accordion, accessible form labels, keyboard focus rings, accessible mobile navigation, reduced motion styling, semantic headings and optional sound off by default.

## Performance and security

- No API keys or secrets in source.
- No app runtime dependency on npm or remote APIs.
- Two small canvases avoid shipping large video or complex GLTF files.
- WebGL DPR capped at 1.5 desktop / 1.2 mobile.
- Generated WebP planets for static fallback and cards.
- No personal data sent to a server; clipboard composition remains local.
- Website has a simple content security surface; outbound fonts are optional.

## Manual QA after deployment

1. Visit the root and verify animated planet, menu, scroll and world cards.
2. Visit `/worlds`, click each filter, and open every world.
3. In a world detail page, switch `Surface`, `Atmosphere`, and `Orbit`, then open `Enter immersive view` and drag the planet; exit via X or Escape.
4. Open Missions and check that all accordion rows expand.
5. Open Technology and switch all three systems.
6. On Contact enter valid values and click `Copy transmission`; verify clipboard; confirm no message claims to be sent.
7. Refresh direct URL `/worlds/ignis` to verify rewrite configuration.
8. Test 375px mobile and 1440px desktop; test reduced motion and keyboard shortcuts.

## Future extensions

A production business website can add a server-side contact form, structured CMS, localization, advanced 3D asset pipelines (Blender/GLTF), real analytics with consent, and performance dashboards. These are not represented as present in the demo.
