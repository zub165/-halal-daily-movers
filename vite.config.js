import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "/-halal-daily-movers/",
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    proxy: {
      "/api/yahoo": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ""),
      },
      "/api": {
        target: "http://127.0.0.1:3851",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify("2.3.0"),
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dose: resolve(__dirname, "dose.html"),
        effluent: resolve(__dirname, "effluent.html"),
        filtration: resolve(__dirname, "filtration.html"),
        dilution: resolve(__dirname, "dilution.html"),
        citrate: resolve(__dirname, "citrate.html"),
        fluid: resolve(__dirname, "fluid.html"),
        history: resolve(__dirname, "history.html"),
        privacy: resolve(__dirname, "privacy.html"),
        halal: resolve(__dirname, "halal.html"),
      },
    },
  },
});
