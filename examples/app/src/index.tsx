import { render } from "solid-js/web"

import "./index.css"
import { lazy, For } from "solid-js"
import type { Component, JSX } from "solid-js"
import CircleIcon from "@/circle.svg?svg-jsx"
import rectIconUrl from "@/rect.svg?url"

const modules = import.meta.glob<{ default: Component<JSX.SvgSVGAttributes<SVGSVGElement>> }>("@/*.svg", {
  as: "svg-jsx",
})
const icons = Object.entries(modules).map(([key, value]) => {
  return { name: key, SvgComponent: lazy(value) }
})

function App() {
  return (
    <div>
      <ul>
        <li>
          svg as component: <CircleIcon fill="blue" />
        </li>
        <li>
          svg as url: <img src={rectIconUrl} />
        </li>
        <li>
          load directory:
          <ul>
            <For each={icons}>
              {({ name, SvgComponent }) => (
                <li>
                  {name}: <SvgComponent />
                </li>
              )}
            </For>
          </ul>
        </li>
      </ul>
    </div>
  )
}
render(() => <App />, document.getElementById("root") as HTMLElement)
