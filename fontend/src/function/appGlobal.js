import Swal from 'sweetalert2';
import { useAuthStore } from '@/function/stores/auth';
import { setSecureItem, getSecureItem, removeSecureItem } from "@/function/stores/secureStorage";

const auth = useAuthStore();
// 🛠 Supprime le préloader de déconnexion s'il existe
export function removeLogoutPreloaderAndToast(showToast) {
  
    const user = getSecureItem('nu');
    if (user) {
      showToast('info', 'Compte déconnecté', `Merci de votre visite ${user} à bientôt 👋`);
      removeSecureItem('nu'); // nettoyage
    } else{
      showToast('info', 'Compte déconnecté', `Merci de votre visite, à bientôt 👋`);
    }
    auth.manualLogout = false
}
