import { watch, unref } from 'vue'
import { useLoadingStore } from '@/stores/loading'

export default {
  install(app) {

    const loadingStore = useLoadingStore()
    const activeLoadings = new Set()

    app.config.globalProperties.$syncLoadingStore = function(loadingRef) {
      const id = Symbol()  // id unique pour ce watcher

      const stop = watch(loadingRef, (val) => {
        if (val) {
          activeLoadings.add(id)
          loadingStore.startLoading()
        } else {
          activeLoadings.delete(id)
          if (activeLoadings.size === 0) {
            loadingStore.stopLoading()
          }
        }
      }, { immediate: true })

      return stop
    }
  }
}
