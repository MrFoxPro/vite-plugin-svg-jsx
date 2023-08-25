declare module "*.svg?svg-jsx" {
  import type { Component, ComponentProps } from "solid-js"
  const c: Component<ComponentProps<"svg">>
  export default c
}
