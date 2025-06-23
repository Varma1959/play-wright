import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testMatch: ["tests/*.spec.ts"],
  use: {
    // headless: false,
    screenshot: "on",
    video: "on",
  },
  reporter: [
    ["dot"],
    [
      "json",
      {
        outputFile: "jsonReports/jsonReport.json",
      },
    ],
    ["html", { open: "never" }],
  ],
};

export default config;
