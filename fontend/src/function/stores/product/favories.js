import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthDialogStore } from '@/function/stores/auth/authDialog'

export const useFavoriteStore = defineStore('favorite', () => {

    const authDialog = useAuthDialogStore()
    const favorites = ref(new Set())

    async function toggle(itemId) {

        const logged = await authDialog.requireLogin()

        if (!logged) {
            return
        }

        if (favorites.value.has(itemId)) {
            favorites.value.delete(itemId)
        } else {
            favorites.value.add(itemId)
        }
    }

    function add(itemId) {
        favorites.value.add(itemId)
    }

    function remove(itemId) {
        favorites.value.delete(itemId)
    }

    function check(itemId) {
        return favorites.value.has(itemId)
    }

    const all = computed(() => Array.from(favorites.value))

    const count = computed(() => favorites.value.size)

    return {
        favorites,
        toggle,
        add,
        remove,
        check,
        all,
        count
    }
})