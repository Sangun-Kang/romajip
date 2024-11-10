import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: "romajip",
      formats: ["es"],
    },
    minify: true,
    target: "esnext",
    sourcemap: false,
    reportCompressedSize: false,
    cssCodeSplit: false,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
      output: {
        inlineDynamicImports: true,
        preserveModules: false,
      },
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    }),
  ],
  optimize: {
    exclude: [],
    include: [/\.ts$/],
  },
})
