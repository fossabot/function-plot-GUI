import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

import "dotenv/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("s-"),
        },
      },
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "chunk-analysis.html",
    }),
    vueJsx(),
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          "function-plot": [
            "function-plot",
            "built-in-math-eval",
            "d3-axis",
            "d3-color",
            "d3-format",
            "d3-interpolate",
            "d3-scale",
            "d3-selection",
            "d3-shape",
            "d3-zoom",
            "events",
            "interval-arithmetic-eval",
          ],
          prettier: [
            "prettier",
            "prettier/plugins/babel",
            "prettier/plugins/estree",
          ],
          vender: ["vue", "pinia", "vue-i18n", "vue-draggable-plus"],
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  server: {
    allowedHosts: [process.env.DEVHOST ?? "localhost"],
  },
});
