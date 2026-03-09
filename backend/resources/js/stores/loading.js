import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loadingCount = ref(0)

  function startLoading() {
    loadingCount.value++
  }

  function stopLoading() {
    if (loadingCount.value > 0) loadingCount.value--
  }

  const isLoading = computed(() => loadingCount.value > 0)

  return { loadingCount, startLoading, stopLoading, isLoading }
})