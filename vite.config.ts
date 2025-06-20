import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    devtoolsJson(),
    envOnlyMacros(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  build: isSsrBuild ? { target: "esnext" } : undefined,
}));
