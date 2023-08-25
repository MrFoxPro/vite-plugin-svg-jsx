import solidPlugin from "vite-plugin-solid"
import ssr from "vite-plugin-ssr/plugin"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import { sharedViteConfig } from "../common/vite"
import ViteSvgJsx from "../../index.js"

export default defineConfig({
  ...sharedViteConfig,
  plugins: [Inspect(), solidPlugin({ ssr: true }), ssr(), ViteSvgJsx()],
  build: {
    polyfillDynamicImport: false,
  },
})
