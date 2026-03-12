<template>
    <div class="layout-sidebar">
        <div class="layoutSidebar">
            <app-menu></app-menu>
            <div class="card mt-6 border border-3 border-primary !bg-surface-800 mx-4" >
                <div class="grid grid-cols-12 gap-2 -mb-3 -mt-3" >
                    <div class="col-span-12 flex items-center justify-center" >
                        <img src="@/assets/img/version.png" class="w-[5rem] shrink-0" alt="Logo">
                    </div>
                    <div class="col-span-12 flex items-center justify-center" >
                        <span class="text-base font-bold break-words text-center text-white">
                            Espace Santé
                        </span>
                    </div>
                    <div class="col-span-12 flex items-center justify-center" >
                        <Chip label="Version 1.0.0" icon="pi pi-cog" size="small"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppMenu from './AppMenu.vue';
</script>

// <style lang="scss">
// .layout-sidebar {
//     background-color: #6366f1 !important;
// }
// </style>

