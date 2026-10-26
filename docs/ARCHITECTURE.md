# Technical architecture

- `index.html`: app shell + metadata.
- `src/main.js`: minimal client-side router, page templates, lazy viewers, scroll progress, accessible interactions, form preparation.
- `src/style.css`: premium design tokens, rounded typography, layouts and responsive rules.
- `src/viewer.js`: renderer and camera controller, scroll-controlled animation, pointer drag and zoom, WebGL fallback.
- `src/watch3d.js`: custom procedural 3D watch geometry, physically based materials, independently animated movement, component transforms, three selectable finishes.
- `watch-fallback.svg`: original illustration used before Three.js loads and when WebGL is unavailable.
- `vercel.json`: static-site rewrite for deep linking.

## Motion coordinates

The model faces +Z. Multiple real 3D groups move on the Z-axis during explosion, while the parent rotates on X/Y/Z to reveal their spatial separation. The explosion opening and return are mapped to scroll progress in the sticky `#anatomy` section. During inspection the user can drag and adjust camera distance.

## Product considerations

There are no proprietary font/image files and no secrets. The watch, articles, materials and specifications are fictional prototype content. The page will remain usable if a CDN or browser GPU is unavailable, though the advanced 3D visuals will be replaced by a static illustration.
