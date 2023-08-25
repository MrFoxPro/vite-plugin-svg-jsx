import { readFile } from "node:fs/promises"
import { type Plugin } from "vite"
import type { Config as SvgoConfig } from "svgo"
import { join } from "path/posix"

export type SolidSVGPluginOptions = {
  svgoOptions?: {
    enabled?: boolean
    config?: SvgoConfig
  }
  defaultAsJsx?: boolean
  specifier?: string
  passChildren?: boolean
}

export default function (options: SolidSVGPluginOptions = {}) {
  options = Object.assign(
    {
      svgoOptions: { enabled: true },
      specifier: "svg-jsx",
      defaultAsJsx: true,
    },
    options
  )
  const svgoOptions = options.svgoOptions

  const SVG_JSX_VIRTUAL_PREFIX = "/@svg-jsx/"

  let svgo: typeof import("svgo")

  return {
    name: "jsx-svg",
    enforce: "pre",
    async configResolved(cfg) {
      if (svgoOptions.enabled) {
        svgo = await import("svgo")
      }
    },
    resolveId: {
      // order: 'pre', // important not to set order here
      async handler(url, importer, opts) {
        const [id, qs] = url.split("?")

        if (id.startsWith(SVG_JSX_VIRTUAL_PREFIX)) {
          return id
        }
        if (!id.endsWith(".svg")) return

        if (!options.defaultAsJsx && !qs?.includes(options.specifier)) return

        if (!qs?.includes(options.specifier) && qs?.length > 0) return

        const resolved = await this.resolve(id, importer, { ...opts, skipSelf: true })
        if (!resolved) {
          return
        }
        return join(SVG_JSX_VIRTUAL_PREFIX, resolved.id + ".jsx")
      },
    },
    load: {
      async handler(url, opts) {
        const [id, qs] = url.split("?")

        if (!id.startsWith(SVG_JSX_VIRTUAL_PREFIX)) {
          return
        }
        const realPath = id.replace(SVG_JSX_VIRTUAL_PREFIX, "/").replace(".jsx", "")

        if (!svgoOptions.config) {
          svgoOptions.config = await svgo.loadConfig()
        }

        let code = await readFile(realPath, { encoding: "utf-8" })
        if (options.svgoOptions.enabled) {
          const { data } = svgo.optimize(code, { path: id, ...options.svgoOptions })
          code = data
        }

        let svgWithProps = code
          .replace(/([{}])/g, "{'$1'}")
          .replace(/<!--\s*([\s\S]*?)\s*-->/g, "{/* $1 */}")
          .replace(/(?<=<svg.*?)(>)/i, "{...props}>")
        if (options.passChildren) {
          svgWithProps = svgWithProps.replace(/\{'\{'\}\s*(props\.children)\s*\{'\}'\}/g, "{$1}")
        }
        return { code: `export default (props = {}) => (${svgWithProps})` }
      },
    },
  } satisfies Plugin
}
