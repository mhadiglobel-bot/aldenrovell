# ORBIT — Beyond the Known

**An original, interactive, multi-page cinematic space website.**

A self-contained static project designed for direct deployment on Vercel through GitHub. It uses real WebGL planet shaders, procedural illustration assets, animated starfields, responsive page layouts and accessible interactive controls. No Node modules, API keys, environment variables, databases or external hosting services are needed for the website to work.

## Pages

| Page | Route | Interaction |
| --- | --- | --- |
| Experience | `/` | WebGL rotating planet, animated entry, scroll-driven movement, interactive editorial sections |
| Worlds | `/worlds` | Filterable five-world catalog |
| Aurelia | `/worlds/aurelia` | 3D gas giant, view modes, immersive drag-to-rotate |
| Pelagia | `/worlds/pelagia` | 3D ocean world, view modes, immersive drag-to-rotate |
| Vespera | `/worlds/vespera` | 3D ice world, view modes, immersive drag-to-rotate |
| Ignis | `/worlds/ignis` | 3D volcanic world, view modes, immersive drag-to-rotate |
| Noctis | `/worlds/noctis` | 3D dark giant, view modes, immersive drag-to-rotate |
| Missions | `/missions` | Expandable mission log |
| Technology | `/technology` | Switchable visualization systems |
| About | `/about` | Editorial brand story |
| Contact | `/contact` | Validated local transmission composer (copies text, NO backend) |

## Deploy from ZIP to GitHub to Vercel

1. **Unzip** `ORBIT_CINEMATIC_WEBSITE.zip` on your computer.
2. Create a new **GitHub repository**, for example `orbit-cinematic`.
3. On GitHub, click **Add file → Upload files**. Upload **all the contents inside** the extracted `ORBIT_CINEMATIC_WEBSITE` folder (not the parent folder). Make sure `index.html` and `vercel.json` are visible at repository root. Do not upload the ZIP itself.
4. Commit the files to the `main` branch.
5. In **Vercel → Add New → Project**, import that GitHub repository.
6. Settings: **Framework Preset = Other**, **Root Directory = `./`**, **Build Command = blank**, **Output Directory = `.`**. (The included `vercel.json` also sets these static-site defaults.)
7. Click **Deploy**. Open the resulting `.vercel.app` URL. Test direct routes such as `/worlds/pelagia` as well as the homepage.

You do **not** need `npm install` or a `package.json`. This is intentional: the project is a compact, dependency-free native WebGL and ES modules website, so there is no missing npm package to block deployment. **A network connection is only used to optionally retrieve Google Fonts; a rounded system-font stack is provided as fallback.**

## Run locally

Use a development server so ES modules load normally; opening `index.html` directly from `file://` is not recommended.

```bash
cd ORBIT_CINEMATIC_WEBSITE
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Features

- Original WebGL fragment shader with procedural sphere shading, animated banding, atmosphere and multiple ring passes.
- Interactive planet rotation in fullscreen explorer mode; world-specific palettes, atmosphere and orbit views.
- Animated Canvas2D starfields, pointer parallax, scroll interpolation, responsive navigation and optional synthesised ambient sound (off by default).
- Responsive rounded-radius components throughout, rounded typography (Outfit / Manrope with local system fallbacks).
- Prefers-reduced-motion support, keyboard shortcuts (**Ctrl/⌘ + K**) for quick navigation, focus-visible styles, semantic headings and accessible interactive controls.
- No third-party analytics, trackers, external API or invented functional backend.

## Important information

- **This is a fictional ORBIT brand and speculative sci-fi concept.** Planet names, world descriptions, statistics, mission dates and lore are invented for the artistic experience—not factual astronomy data or real missions.
- **Contact:** The form validates fields and copies the composed message to the clipboard; it does not send or store messages. Connect your own secure form backend before using this as a real contact channel.
- **Fonts:** Google Fonts are optional. The visual experience remains functional without them.
- **Graphics:** WebGL is required for animated shader planets. Static illustrated planet fallback is included for devices without WebGL.
- **No licensing issue with bundled planet illustrations:** They were generated programmatically for this project. The logo, writing, layouts and shader code are original for ORBIT.

## Customize

- Brand name, links and navigation: `assets/js/app.js`
- Worlds, colors, data and mission lore: `assets/js/data.js`
- Page content: `assets/js/pages/`
- Responsive visuals, radii, typography: `assets/css/style.css`
- WebGL rendering, camera behavior: `assets/js/scene.js`
- Star particles: `assets/js/stars.js`
- Optional sound: `assets/js/audio.js`

See `docs/ARCHITECTURE.md` for implementation details.
