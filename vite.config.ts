import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "ICNS to ICO Converter",
        short_name: "ICNS TO ICO",
        description: "A client side app that lets you convert .icns to .ico",
        theme_color: "#4D59DD",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  base: "/icns-to-ico-converter/",
  build: {
    outDir: "./docs",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@heroui")) {
            return "heroui";
          } else if (id.includes("@fortawesome/free-solid-svg-icons")) {
            return "fortawesome-free-solid-svg-icons";
          } else if (id.includes("@fortawesome/free-brands-svg-icons")) {
            return "fortawesome-free-brands-svg-icons";
          }
        },
      },
    },
  },
});
