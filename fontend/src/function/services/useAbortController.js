import { onUnmounted } from 'vue'

export function useAbortController() {

    const controller = new AbortController()

    onUnmounted(() => {
        controller.abort()
    })

    return controller
}
