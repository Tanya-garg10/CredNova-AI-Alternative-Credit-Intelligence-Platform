// vite.config.ts
import tailwindcss from "file:///C:/Users/arpan/Downloads/crednova%20ai/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/Users/arpan/Downloads/crednova%20ai/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { defineConfig } from "file:///C:/Users/arpan/Downloads/crednova%20ai/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), ".")
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {}
    },
    build: {
      // Use legacy Rollup instead of new Rolldown for better compatibility
      rollupOptions: {
        external: ["react-is"]
      },
      // Ensure assets are properly served
      assetsDir: "assets"
    },
    base: "/"
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnBhblxcXFxEb3dubG9hZHNcXFxcY3JlZG5vdmEgYWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFycGFuXFxcXERvd25sb2Fkc1xcXFxjcmVkbm92YSBhaVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYXJwYW4vRG93bmxvYWRzL2NyZWRub3ZhJTIwYWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLicpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgLy8gSE1SIGlzIGRpc2FibGVkIGluIEFJIFN0dWRpbyB2aWEgRElTQUJMRV9ITVIgZW52IHZhci5cbiAgICAgIC8vIERvIG5vdCBtb2RpZnlcdTIwMTRmaWxlIHdhdGNoaW5nIGlzIGRpc2FibGVkIHRvIHByZXZlbnQgZmxpY2tlcmluZyBkdXJpbmcgYWdlbnQgZWRpdHMuXG4gICAgICBobXI6IHByb2Nlc3MuZW52LkRJU0FCTEVfSE1SICE9PSAndHJ1ZScsXG4gICAgICAvLyBEaXNhYmxlIGZpbGUgd2F0Y2hpbmcgd2hlbiBESVNBQkxFX0hNUiBpcyB0cnVlIHRvIHNhdmUgQ1BVIGR1cmluZyBhZ2VudCBlZGl0cy5cbiAgICAgIHdhdGNoOiBwcm9jZXNzLmVudi5ESVNBQkxFX0hNUiA9PT0gJ3RydWUnID8gbnVsbCA6IHt9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIC8vIFVzZSBsZWdhY3kgUm9sbHVwIGluc3RlYWQgb2YgbmV3IFJvbGxkb3duIGZvciBiZXR0ZXIgY29tcGF0aWJpbGl0eVxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBleHRlcm5hbDogWydyZWFjdC1pcyddLFxuICAgICAgfSxcbiAgICAgIC8vIEVuc3VyZSBhc3NldHMgYXJlIHByb3Blcmx5IHNlcnZlZFxuICAgICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICB9LFxuICAgIGJhc2U6ICcvJyxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUyxPQUFPLGlCQUFpQjtBQUNsVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVEsb0JBQW1CO0FBRTNCLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQ2hDLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsSUFDaEMsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsR0FBRztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUE7QUFBQSxNQUdOLEtBQUssUUFBUSxJQUFJLGdCQUFnQjtBQUFBO0FBQUEsTUFFakMsT0FBTyxRQUFRLElBQUksZ0JBQWdCLFNBQVMsT0FBTyxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLE1BRUwsZUFBZTtBQUFBLFFBQ2IsVUFBVSxDQUFDLFVBQVU7QUFBQSxNQUN2QjtBQUFBO0FBQUEsTUFFQSxXQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
