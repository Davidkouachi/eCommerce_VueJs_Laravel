<template>
    <div class="relative h-[10rem] w-full rounded-[0.5rem] shadow-xl overflow-hidden mb-5">
        <img src="@/assets/img/background/bg3.jpg" class="w-full h-72 object-cover" />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 flex items-end">
            <div class="p-6 text-white">
                <h2 class="text-white font-semibold mb-1">
                    {{ breadcrumbMenu.items[breadcrumbMenu.items.length - 1]?.label }}
                </h2>
                <nav class="flex items-center text-sm text-white">
                    <span v-for="(item, i) in breadcrumbMenu.items" :key="i" class="flex items-center">
                        <span>{{ item.label }}</span>
                        <span class="mx-1" v-if="i < breadcrumbMenu.items.length - 1">
                            /
                        </span>
                    </span>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useBreadcrumbMenuStore } from '@/function/stores/breadcrumbMenu';

const breadcrumbMenu = useBreadcrumbMenuStore();

</script>
