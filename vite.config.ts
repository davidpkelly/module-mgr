import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import fs from "fs";
import os from "os";

const homeDir = os.homedir();
const certsPath = `${homeDir}/certs`;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      server: {
        https: {
          key: fs.readFileSync(`${certsPath}/mistadmin.key`),
          cert: fs.readFileSync(`${certsPath}/mistadmin.crt`),
        },
      },
      plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
    };
  } else {
    return {
      plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
    };
  }
});
