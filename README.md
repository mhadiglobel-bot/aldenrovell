# CHRONOS — The Art of Time (V2 / 3D Edition)

**A multi-page, dark-luxury watch website with true browser-rendered 3D, scroll-linked exploded watch engineering, rounded Sora + Nunito Sans typography and a live finish configurator.**

This is a creative demo featuring a **fictional watch brand and original procedural model**, not a store selling actual products.

## Routes

| Route | Content |
|---|---|
| `/` | Cinematic 3D hero, 4-chapter mechanical scroll story, collection, craft and journal sections |
| `/timepiece` | Interactive real-time 3D watch inspector, rotate, zoom, explode/reassemble and finish changes |
| `/collections` | Three watch finishes with functional navigation into the inspector |
| `/craft` | Accordion-based craft story and technical detail |
| `/journal` | Editorial index |
| `/journal/the-weight-of-a-second` | Full article |
| `/journal/under-the-crystal` | Full article |
| `/journal/objects-that-remain` | Full article |
| `/contact` | Form that prepares a copyable brief (no network submission) |

## What makes the model 3D?

The watch is created at runtime from actual Three.js geometry: independent extruded straps, case, bezel, sapphire study, textured dial, physical hands, crown and individual animated gear wheels. Scrolling through the homepage moves the components into 3D depth and returns them to their original positions. This is not a sequence of static images or a 2D Canvas drawing.

## Rounded typography

The design uses `Sora` for editorial headings and `Nunito Sans` for body/UI. Both use geometric and softly rounded letterforms. Locally installed rounded/system fonts are used as backups if Google Fonts cannot load.

## GitHub + Vercel deployment (no build command)

1. Unzip the archive on your computer.
2. Open the `CHRONOS_V2_3D` folder and upload **everything inside it** to the root of a new GitHub repository. Keep `index.html` at the repo root, not inside an extra nested folder.
3. On Vercel: **Add New > Project > Import Git Repository**.
4. Framework Preset: **Other**.
5. Build Command: **empty**. Output Directory: **`.` (project root)** if the UI requests a directory; otherwise leave default.
6. Deploy. The `vercel.json` rewrite handles direct visits to nested routes.

### External dependencies

- Three.js module version **0.180.0** from jsDelivr, with unpkg as fallback. Both are public CDNs.
- Sora and Nunito Sans from Google Fonts, with local font fallbacks.

A live internet connection is needed for the WebGL dependency. If the library or device WebGL is unavailable, an original local SVG watch illustration remains visible; text and navigation still function.

## Accessibility & performance

- Mobile navigation, keyboard focus indicators and semantic page headings.
- Reduced motion preferences are respected.
- WebGL render loops skip offscreen content. DPR is capped to reduce GPU load.
- No logins, API keys, database or paid service required.
- Only a small collection of source files, suitable for GitHub browser uploads.

## Important demonstration limits

- The watch collection, reference codes and material specifications are fictional concepts. Do not present them as manufactured product claims.
- The contact form **does not send email**. It prepares a brief for manual copy/sharing.
- Automated browser-based visual QA may be restricted by local security policy; verify WebGL behavior and mobile scroll on your deployed Vercel URL before treating it as production-ready.
