import { defineStore } from "pinia";
import axios from "@/function/services/axios";
import router from "@/router/index";
import { ref } from "vue";
import { setSecureItem, getSecureItem, removeSecureItem } from "@/function/stores/secureStorage";

let countdownInterval = null;
let inactivityMin = 1;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    expired: false,
    sessionExpire: null,
    tempsRestant: ref(0),
    token: null,
    refreshToken: null,
    inactivityRestant: ref(inactivityMin * 60),
    inactivityExpireAt: null,
    _refreshing: false,

    manualLogout: false,
    isLoggingOut: false,

    device_id: null,
    presite: true,
  }),

  getters: {
    isAuthenticated: (state) =>
      !!state.user && !!state.token && state.sessionExpire > Date.now(),
  },

  actions: {
    // ------------------------------------------------------
    setUserSession(user, expiresInSeconds, token, refreshToken, device_id) {
      const expireAt = Date.now() + expiresInSeconds * 1000;

      this.sessionExpire = expireAt;
      this.user = user;
      this.token = token;
      this.refreshToken = refreshToken;
      this.expired = false;
      this.manualLogout = false;
      this.device_id = device_id;

      setSecureItem("jwt_token", token);
      setSecureItem("refresh_token", refreshToken);
      setSecureItem("session_expire", expireAt);
      setSecureItem("session_expired", "false");
      setSecureItem("device_id", device_id);
      setSecureItem("aL", user.login);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      this.startCountdown();
      this.startInactivityTimer();
    },

    // ------------------------------------------------------
    setExpired() {
      this.expired = true;
      setSecureItem("session_expired", "true");
    },

    // ------------------------------------------------------
    async restoreSession() {
      const token = getSecureItem("jwt_token");
      const refreshToken = getSecureItem("refresh_token");
      const expireAt = getSecureItem("session_expire");
      const savedDeviceId = getSecureItem("device_id");

      if (!token || !refreshToken || !expireAt) return false;

      this.token = token;
      this.refreshToken = refreshToken;
      this.sessionExpire = Number(expireAt);
      this.device_id = savedDeviceId;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (getSecureItem("session_expired")) return false;

      try {
        const res = await axios.get("/api/me");
        this.user = res.data;
        setSecureItem("aL", res.data.login);
      } catch (err) {
        console.log("expired");
        this.user = null;
        this.setExpired();
        return false;
      }

      this.startCountdown();
      this.startInactivityTimer();
      return true;
    },

    // ------------------------------------------------------
    async refreshAccessToken() {
      if (!this.refreshToken) return null;

      const savedDeviceId = getSecureItem("device_id");
      this.device_id = savedDeviceId;

      console.log(this.device_id)

      try {
        const res = await axios.post("/api/refresh", {
          refresh_token: this.refreshToken,
          device_id: this.device_id
        }, { _isRefresh: true });

        const newToken = res.data.access_token;
        const newRefresh = res.data.refresh_token;
        const expiresIn = res.data.expires_in;

        this.token = newToken;
        this.refreshToken = newRefresh;
        this.sessionExpire = Date.now() + expiresIn * 1000;
        this.expired = false;

        setSecureItem("jwt_token", newToken);
        setSecureItem("refresh_token", newRefresh);
        setSecureItem("session_expire", this.sessionExpire);
        setSecureItem("session_expired", "false");

        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        this.startCountdown();
        console.log('refresh');

        return newToken; // <-- Très important pour les interceptors

      } catch (err) {
        this.setExpired();
        console.error("Refresh token ERROR :", err);
        return null;
      }
    },

    // async refreshAccessToken() {
    //   if (!this.refreshToken || this._refreshing) return null;

    //   this._refreshing = true;

    //   try {
    //     const res = await axios.post("/api/refresh", {
    //       refresh_token: this.refreshToken,
    //       device_id: this.device_id
    //     }, { _isRefresh: true });

    //     const { access_token, refresh_token, expires_in } = res.data;

    //     this.token = access_token;
    //     this.refreshToken = refresh_token;
    //     this.sessionExpire = Date.now() + expires_in * 1000;

    //     setSecureItem("jwt_token", access_token);
    //     setSecureItem("refresh_token", refresh_token);
    //     setSecureItem("session_expire", this.sessionExpire);

    //     axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    //     return access_token;

    //   } catch (err) {
    //     this.logoutLocal(true);
    //     return null;
    //   } finally {
    //     this._refreshing = false;
    //   }
    // },

    // ------------------------------------------------------
    startCountdown() {
      clearInterval(countdownInterval);
      if (!this.sessionExpire) return;

      // reset à chaque nouveau countdown
      this._refreshTriggered = false;

      countdownInterval = setInterval(async () => {
        const now = Date.now();
        const diff = Math.floor((this.sessionExpire - now) / 1000);
        this.tempsRestant = diff > 0 ? diff : 0;

        if (diff <= 0) {
          clearInterval(countdownInterval);
          this.setExpired();
          this.clearInactivityTimer();
          return;
        }

        // ✅ EXÉCUTÉ UNE SEULE FOIS à 1 min
        if (diff <= 60 && !this._refreshTriggered) {
          this._refreshTriggered = true; // 🔒 verrou immédiat

          const stillActive = this.inactivityExpireAt && now < this.inactivityExpireAt;

          if (stillActive) {
            console.log('⏳ Refresh déclenché à 1 minute');
            try {
              await this.refreshAccessToken();
            } catch (e) {
              console.error('Erreur refresh', e);
            }
          } else {
            console.log("⚠️ Token non rafraîchi car inactif");
            this.setExpired();
            this.clearInactivityTimer();
            clearInterval(countdownInterval);
          }
        }

      }, 1000);
    },

    // startCountdown() {
    //   clearInterval(countdownInterval);
    //   if (!this.sessionExpire) return;

    //   countdownInterval = setInterval(() => {
    //     const now = Date.now();
    //     const diff = Math.floor((this.sessionExpire - now) / 1000);
    //     this.tempsRestant = Math.max(diff, 0);

    //     if (diff <= 0) {
    //       clearInterval(countdownInterval);
    //       this.logoutLocal(true);
    //     }
    //   }, 1000);
    // },

    // ------------------------------------------------------
    startInactivityTimer() {
      this.clearInactivityTimer();
      this.inactivityRestant = inactivityMin * 60;
      this.inactivityExpireAt = Date.now() + this.inactivityRestant * 1000;

      const updateActivity = () => this.resetInactivityTimer();
      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach(evt => window.addEventListener(evt, updateActivity));

      this._inactivityInterval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((this.inactivityExpireAt - now) / 1000);
        this.inactivityRestant = diff > 0 ? diff : 0;

        if (diff <= 0) {
          console.log("🕓 Inactivité détectée — session expirée");
          this.setExpired();
          this.clearInactivityTimer();
          clearInterval(countdownInterval);
        }
      }, 1000);
    },

    resetInactivityTimer() {
      if (this.user && !this.expired) {
        this.inactivityExpireAt = Date.now() + inactivityMin * 60 * 1000;
        this.inactivityRestant = inactivityMin * 60;
      }
    },

    clearInactivityTimer() {
      clearInterval(this._inactivityInterval);
      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach(evt =>
        window.removeEventListener(evt, this.resetInactivityTimer)
      );
    },

    // ------------------------------------------------------
    logoutLocal(expired = false) {
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;

      this.clearInactivityTimer();
      clearInterval(countdownInterval);

      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.sessionExpire = null;
      this.tempsRestant = 0;
      this.expired = expired;
      this.device_id = null;

      removeSecureItem("jwt_token");
      removeSecureItem("refresh_token");
      removeSecureItem("session_expire");
      removeSecureItem("device_id");
      removeSecureItem("aL");

      delete axios.defaults.headers.common["Authorization"];

      axios.interceptors.request.use(config => {
        config.headers.Authorization = "";
        return config;
      });

      // if (expired === true) {
      //   removeSecureItem("me");
      //   router.push({ name: "Authentification" });
      // }

      this.isLoggingOut = false;
    },

    // ------------------------------------------------------
    async logoutServer(manuel = true) {
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;

      if (!this.refreshToken) {
        this.logoutLocal(true);
        return;
      }

      this.manualLogout = manuel;

      try {
        await axios.post("/api/logout", {
          refresh_token: this.refreshToken
        });

        this.expired = manuel;

        removeSecureItem("jwt_token");
        removeSecureItem("refresh_token");

        console.log("User déconnecté backend");
      } catch (error) {
        // erreur ignorée comme dans ton catch()
      } finally {
        this.isLoggingOut = false;

        if (manuel === true) {
          this.logoutLocal(true);
        }
      }
    },
  },
});
