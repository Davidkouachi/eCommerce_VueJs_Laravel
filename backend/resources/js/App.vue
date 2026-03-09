<script setup>
import Toast from 'primevue/toast';   // ✅ composant par défaut
import { useToast } from 'primevue/usetoast'; // ✅ hook
import { useLoadingStore } from '@/stores/loading';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const loadingStore = useLoadingStore();

// Supprimer tous les toasts quand on change de route
if (toast && toast.remove) toast.remove();
</script>

<template>
  <!-- ✅ composant Toast doit être rendu -->
  <Toast position="top-center" class="my-toast" /> 

  <router-view />

  <div v-if="loadingStore.isLoading"
    class="loading-overlay"
    aria-hidden="true"
  ></div>
</template>

<style>
.my-toast .p-toast {
  z-index: 9999;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 9999;
  cursor: wait;
  pointer-events: all;
}
</style>
