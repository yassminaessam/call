import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
// Optional bundle analyzer (ensure rollup-plugin-visualizer installed when using ANALYZE=1)
let visualizer: any; // lazy require to avoid build crash if not installed
try {
  // @ts-ignore
  visualizer = require('rollup-plugin-visualizer').visualizer;
} catch {}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Added ./locales to allow direct JSON loading for i18n dynamic imports
      allow: ["./client", "./shared", "./locales"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: {
          // Group UI primitives
          radix: [
            '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress',
            '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select',
            '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot',
            '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip'
          ],
          charts: ['recharts'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  },
  plugins: [
    react(),
    expressPlugin(),
    ...(process.env.ANALYZE && visualizer ? [visualizer({ filename: 'dist/spa/stats.html', template: 'sunburst', gzipSize: true, brotliSize: true })] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
