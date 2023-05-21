import XstoryPlugin from "./xstorymaker_web"
import type {App} from "vue"

const components = [
  XstoryPlugin
]
const install = ((app: App) => {
  components.forEach((component:any) => {
    app.use(component)
  })
})

export default install

export {
  XstoryPlugin
}