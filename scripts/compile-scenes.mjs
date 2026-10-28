import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Reuse the CSS compiler already shipped with the installed Next.js build.
// No browser library or additional package is introduced.
const cssnano = require("next/dist/compiled/cssnano-simple");
const source = new URL("../styles/scenes.css", import.meta.url);
const output = new URL("../public/scenes.css", import.meta.url);
const result = await cssnano().process(readFileSync(source, "utf8"), {
  from: source.pathname, to: output.pathname, map: false,
});
writeFileSync(output, result.css + "\n");
console.log(`Compiled scene CSS: ${Buffer.byteLength(result.css)} bytes.`);

// Embed the immutable original vector in the critical CSS image layer. It has
// no extra request, document SVG layout or client-side geometry computation.
const artwork = readFileSync(new URL("../styles/signal-aperture.svg", import.meta.url), "utf8").trim();
const imageURI = artwork.replace(/%/g, "%25").replace(/"/g, "%22").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\r?\n/g, " ");
writeFileSync(new URL("../app/artwork.css", import.meta.url),
  `.aperture-canvas::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,${imageURI}");background-size:cover;background-position:center}
`);
