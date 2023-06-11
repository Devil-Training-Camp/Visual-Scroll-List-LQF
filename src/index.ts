import { App } from 'vue'
import VisualScrollList from './VisualScrollList'
import DynamicVisualScrollList from './DynamicVisualScrollList'

export default {
  install: (app: App) => {
    app.component('VisualScrollList', VisualScrollList)
    app.component('DynamicVisualScrollList', DynamicVisualScrollList)
  },
}

// export { VisualScrollList, DynamicVisualScrollList }
