import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { type UserConfig } from "vite"

const __dirname = dirname(fileURLToPath(import.meta.url))
export const sharedViteConfig: UserConfig = {
  clearScreen: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
}
