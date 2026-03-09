// securePersist.js
import { setSecureItem, getSecureItem, removeSecureItem } from "@/function/stores/secureStorage";

export function piniaSecurePersist(options = {}) {
  const { key = "pinia", paths = [] } = options;

  return ({ store }) => {
    // --- Restore state depuis SecureStorage au démarrage
    (async () => {
      const savedState = {};
      for (const path of paths) {
        const value = await getSecureItem(`${key}_${store.$id}_${path}`);
        if (value !== null) savedState[path] = value;
      }
      store.$patch(savedState);
    })();

    // --- Écoute les changements du store
    store.$subscribe(async (mutation, state) => {
      for (const path of paths) {
        await setSecureItem(`${key}_${store.$id}_${path}`, state[path]);
      }
    });
  };
}
