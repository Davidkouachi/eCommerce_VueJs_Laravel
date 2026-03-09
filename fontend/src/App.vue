<template>
  <Toast /> 
  <router-view />
  <div 
    v-if="noTouche.loadingNoTouche"
    class="fixed inset-0 z-[9999]"
    style="pointer-events: all;"
    @touchmove.prevent
    @wheel.prevent
    @scroll.prevent
    @keydown.prevent
  >
  </div>
</template>

<style scoped>
.my-toast .p-toast {
  z-index: 9999;
}
</style>

<script setup>
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useNoTouche } from '@/function/stores/noTouche';
import { onPresetChange }  from '@/layout/composables/AppConfigurator.js';

onPresetChange();

const toast = useToast();
const router = useRouter();
const noTouche = useNoTouche();

// Supprimer tous les toasts quand on change de route
if (toast && toast.remove) toast.remove();
</script>
