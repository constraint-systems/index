import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { readFile } from "node:fs/promises";

const toolsPath = new URL("./src/assets/tools.json", import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
    {
      name: "tools-json",
      configureServer(server) {
        server.middlewares.use("/tools.json", async (_request, response) => {
          response.setHeader("Content-Type", "application/json");
          response.end(await readFile(toolsPath));
        });
      },
      async generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "tools.json",
          source: await readFile(toolsPath),
        });
      },
    },
  ],
  server: {
    port: 4111,
  },
});
