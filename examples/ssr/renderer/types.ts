import { Component } from "solid-js"
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types"
export type PageProps = {}
export type PageContext = PageContextBuiltInClientWithClientRouting & {
  Page: (pageProps: PageProps) => Component
  pageProps: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
}
