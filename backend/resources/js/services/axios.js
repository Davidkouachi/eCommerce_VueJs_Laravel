import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { getSecureItem } from "@/stores/secureStorage";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.common["Accept"] = "application/json";

let isRefreshing = false;
let failedQueue = [];

// 🔁 File d’attente pour les requêtes bloquées pendant le refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 🔹 Intercepteur requête
axios.interceptors.request.use(config => {
  const token = getSecureItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  try {
    const auth = useAuthStore();

    // ⚠️ Ne pas réinitialiser le timer d’inactivité pendant un refresh
    if (!config._isRefresh && auth?.resetInactivityTimer) {
      auth.resetInactivityTimer();
    }
  } catch (_) {}

  return config;
});

// 🔹 Intercepteur réponse
axios.interceptors.response.use(
  response => response,

  async error => {
    const auth = useAuthStore();
    const originalRequest = error.config;

    // 🚫 Si la requête échouée est déjà le refresh → logout direct
    if (originalRequest?.url?.includes("/api/refresh")) {
      console.warn("⛔ Échec direct du refresh — logout immédiat");
      auth.logoutLocal(true);
      return Promise.reject(error);
    }

    // --- Cas 1️⃣ : accès non autorisé ---
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Si on est déjà en cours de refresh → on attend
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // 🔄 Marquer la requête comme déjà tentée
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🟡 Rafraîchir le token
        const res = await auth.refreshAccessToken();

        // ✅ Si le refresh s'est bien passé
        const newToken = auth.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        isRefreshing = false;

        // 🔁 Relancer la requête d’origine
        return axios(originalRequest);

      } catch (err) {
        console.error("❌ Échec du refresh token :", err);
        processQueue(err, null);
        isRefreshing = false;

        // 🚨 Vérification spécifique : refresh_token invalide
        const status = err.response?.status;
        const message = err.response?.data?.message || "";

        if (status === 401 || status === 422 || message.includes("invalid") || message.includes("expired")) {
          console.warn("⚠️ Refresh token invalide — déconnexion forcée");
          auth.logoutLocal(true);
          return Promise.reject(err);
        }

        // Sinon, on marque juste la session expirée
        auth.setExpired();
        return Promise.reject(err);
      }
    }

    // --- Autres erreurs ---
    return Promise.reject(error);
  }
);

export default axios;