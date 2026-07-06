import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    // Keep React plugin after TanStack Start plugin as recommended by TanStack.
    react(),
    tsconfigPaths(),
    tailwindcss(),
    // Generate Vercel-compatible Nitro output instead of generic local output.
    nitro({ preset: "vercel" }),
  ],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
