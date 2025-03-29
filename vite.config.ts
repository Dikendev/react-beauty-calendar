import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), dts({ include: ["lib"] })],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./lib"),
            "@component": resolve(__dirname, "./lib/main"),
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, "lib/main.ts"),
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
                exports: "named",
                assetFileNames: "build/assets/[name][extname]",
                entryFileNames: "build/[name].[format].js",
            },
        },
    },
});
