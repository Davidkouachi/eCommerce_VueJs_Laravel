<script setup>
import { ref } from 'vue';

import { computed } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { model, filterMenuByRole } from '@/layout/composables/menuUtils';
import { useAuthStore } from '@/function/stores/auth';

const auth = useAuthStore();

const userRole = computed(() => auth.user?.role);

console.log(userRole.value);

const menuModel = computed(() => {
    // if (!auth.user || !auth.user.role || !userRole) return [];
    return filterMenuByRole(model.value, userRole.value || 'client');
});

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in menuModel" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>