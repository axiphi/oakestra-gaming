import { reactRouter } from "@react-router/dev/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    devtoolsJson(),
    envOnlyMacros(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
