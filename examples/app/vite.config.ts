import { defineConfig } from "vite"
import ViteSolid from "vite-plugin-solid"
import SvgJsx from "../../index.js"
import Inspect from "vite-plugin-inspect"
import { sharedViteConfig } from "../common/vite.js"

export default defineConfig({
  ...sharedViteConfig,
  plugins: [Inspect(), ViteSolid(), SvgJsx()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
})
