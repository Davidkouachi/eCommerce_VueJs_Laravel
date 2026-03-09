import { defineStore } from 'pinia'; 
import { ref } from 'vue';

export const usePreloaderSpinner = defineStore('preloaderSpinner', () => {
  const loadingSpiner = ref(false);
  const messageSpiner = ref('');
  const backgroundColor = ref('white'); // ← couleur par défaut

  /**
   * showSpiner(msg: string, callback: function, bg: string)
   * @param msg : message à afficher
   * @param callback : fonction à exécuter pendant le preloader
   * @param bg : couleur de fond du overlay (optionnel)
   */
  function showSpiner(msg = 'Chargement...', callback, bg = 'white') {
    messageSpiner.value = msg;
    backgroundColor.value = bg;
    loadingSpiner.value = true;
    callback();
  }

  function hideSpiner() {
    loadingSpiner.value = false;
    messageSpiner.value = '';
    backgroundColor.value = 'white';
  }

  return { loadingSpiner, messageSpiner, backgroundColor, showSpiner, hideSpiner };
});
