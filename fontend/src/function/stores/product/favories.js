import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {

    const favorites = ref(new Set())

    function toggle(itemId) {
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