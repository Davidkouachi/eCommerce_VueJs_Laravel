import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBreadcrumbMenuStore = defineStore('breadcrumbMenu', () => {
    const items = ref([]);

    function set(newItems) {
        items.value = newItems;
    }

    return { items, set };
});
