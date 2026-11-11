import { defineConfig } from "vite";

// BASE_PATH is set in CI to the GitHub Pages path (/tally/).
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  server: { port: 4007, strictPort: true },
  preview: { port: 4007, strictPort: true },
});
