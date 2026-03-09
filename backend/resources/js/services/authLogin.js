import { ref } from 'vue';
import axios from '@/services/axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';

export function useLoginForm(login, password, remember_me = false, showToast, removeAllToasts, removeAllExcept) {
  const router = useRouter();
  const auth = useAuthStore();
  const loadingStore = useLoadingStore();
  const loading = ref(false);

  const loginUser = async () => {
    if (!login.value || !password.value) {
      showToast('warn', 'Alerte', 'Login et mot de passe sont obligatoires');
      return;
    }

    loading.value = true;

    try {
      const res = await axios.post('/api/login', {
        login: login.value,
        password: password.value
      });

      if (res.data.success) {

        const { access_token, refresh_token, user, expires_in } = res.data;
        auth.setUserSession(user, expires_in, access_token, refresh_token);

        const mainId = showToast(
          'success',
          'Compte connecté',
          `Bienvenue ${user.name}, nous sommes heureux de vous revoir 🤝!`,
          5000,
          '1'
        );
        
        router.push({ name: 'Home' });

      } else if (data.info) {
        showToast('info', 'Informations', data.message);
      } else if (data.warn) {
        showToast('warn', 'Alerte', data.message);
      } else {
        showToast('error', 'Erreur', data.message || 'Erreur inconnue');
      }
    } catch (err) {
      showToast('error', 'Erreur', err.message || 'Erreur inattendue');
    } finally {
      loading.value = false;
      // loadingStore.stopLoading();
    }
  };

  return { loading, loginUser };
}
