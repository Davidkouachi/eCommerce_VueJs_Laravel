import axios from "axios";
import { useAuthStore } from "@/function/stores/auth";
import { getSecureItem } from "@/function/stores/secureStorage";

// axios.defaults.baseURL = "http://192.168.1.64:8000";
// axios.defaults.baseURL = "http://192.168.1.65:8000";
// axios.defaults.baseURL = "http://192.168.1.66:8000";
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.common["Accept"] = "application/json";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 🔹 Intercepteur requête
axios.interceptors.request.use(config => {
  const token = getSecureItem("jwt_token"); // synchrone
  if (token) config.headers.Authorization = `Bearer ${token}`;

  try {
    const auth = useAuthStore();
    if (!config._isRefresh && auth?.resetInactivityTimer) auth.resetInactivityTimer();
  } catch (_) {}

  return config;
}, error => Promise.reject(error));

// 🔹 Intercepteur réponse
axios.interceptors.response.use(
  response => response,
  async error => { // <-- async ici
    const auth = useAuthStore();
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/api/refresh")) {
      auth.logoutLocal(true);
      return Promise.reject(error);
    }

    if (auth.isLoggingOut) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {

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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getSecureItem("refresh_token"); // synchrone
        if (!refreshToken) {
          auth.logoutLocal(true);
          return Promise.reject(error);
        }

        // ⚡ await pour récupérer le token rafraîchi
        const newToken = await auth.refreshAccessToken();

        if (!newToken) {
          auth.logoutLocal(true);
          return Promise.reject(error);
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        isRefreshing = false;

        return axios(originalRequest);

      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        const status = err.response?.status;
        const message = err.response?.data?.message || "";

        if (status === 401 || status === 422 || message.includes("invalid") || message.includes("expired")) {
          auth.logoutLocal(true);
          return Promise.reject(err);
        }

        auth.setExpired();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
