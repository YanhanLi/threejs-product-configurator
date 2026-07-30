import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// base: "./" keeps asset paths relative so the build works both locally
// and when served from a GitHub Pages project subpath.
export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
});
