import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 4,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
