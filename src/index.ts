import { App } from 'vue'
import VisualScrollList from './VisualScrollList'

export default {
  install: (app: App) => {
    app.component('VisualScrollList', VisualScrollList)
  },
}
