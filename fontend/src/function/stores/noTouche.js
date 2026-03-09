import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNoTouche = defineStore('noTouche', () => {
  const loadingNoTouche = ref(false);

  function showNoTouche() {
    loadingNoTouche.value = true;
  }

  function hideNoTouche() {
    loadingNoTouche.value = false;
  }

  return {
    loadingNoTouche,
    showNoTouche,
    hideNoTouche,
  };
});
