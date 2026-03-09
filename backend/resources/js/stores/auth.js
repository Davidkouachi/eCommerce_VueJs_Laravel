import { defineStore } from "pinia";
import axios from "@/services/axios";
import router from "@/route/index";
import { ref } from "vue";
import { setSecureItem, getSecureItem, removeSecureItem } from "@/stores/secureStorage";

let countdownInterval = null;
let inactivityMin = 60;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    expired: false,
    sessionExpire: null,
    tempsRestant: ref(0),
    token: null,
    refreshToken: null,
    manualLogout: false,
    inactivityRestant: ref(inactivityMin * 60),
    inactivityExpireAt: null, // 🕒 nouvel ajout
    _refreshing: false,
  }),

  getters: {
    isAuthenticated: (state) =>
      !!state.user && !!state.token && state.sessionExpire > Date.now(),
  },

  actions: {
    // -------------------------------------
    setUserSession(user, expiresInSeconds, token, refreshToken) {
      const expireAt = Date.now() + expiresInSeconds * 1000;

      this.sessionExpire = expireAt;
      this.user = user;
      this.token = token;
      this.refreshToken = refreshToken;
      this.expired = false;
      this.manualLogout = false;

      setSecureItem("jwt_token", token);
      setSecureItem("refresh_token", refreshToken);
      setSecureItem("session_expire", expireAt);
      setSecureItem("session_expired", "false");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      this.startCountdown();
      this.startInactivityTimer();
    },

    setExpired() {
      this.expired = true;
      setSecureItem("session_expired", "true");
    },

    // -------------------------------------
    async restoreSession() {
      const token = getSecureItem("jwt_token");
      const refreshToken = getSecureItem("refresh_token");
      const expireAt = getSecureItem("session_expire");

      if (!token || !refreshToken || !expireAt) return false;

      this.token = token;
      this.refreshToken = refreshToken;
      this.sessionExpire = Number(expireAt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (this.expired) return false;

      try {
        const res = await axios.get("/api/me");
        this.user = res.data;
      } catch {
        this.user = null;
        this.setExpired();
        return false;
      }

      this.startCountdown();
      this.startInactivityTimer();
      return true;
    },

    // -------------------------------------
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logoutLocal();
        router.push({ name: "Login" });
      }
      console.log("⏳ Refresh token automatique lancé");

      try {
        const res = await axios.post(
          "/api/refresh",
          { refresh_token: this.refreshToken },
          { _isRefresh: true }
        );

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
        console.log("✅ Token rafraîchi automatiquement");

        this.startCountdown();
      } catch (err) {
        console.error("❌ Erreur refresh token :", err);
        this.setExpired();
      }
    },

    // -------------------------------------
    startCountdown() {
      clearInterval(countdownInterval);
      if (!this.sessionExpire) return;

      countdownInterval = setInterval(async () => {
        // 🔹 Toujours basé sur le temps réel, pas sur le tick
        const now = Date.now();
        const diff = Math.floor((this.sessionExpire - now) / 1000);
        this.tempsRestant = diff > 0 ? diff : 0;

        if (diff <= 0) {
          clearInterval(countdownInterval);
          this.setExpired();
          this.clearInactivityTimer();
          return;
        }

        // 🔹 Refresh automatique si < 5 min
        if (diff <= 300 && !this._refreshing) {
          const stillActive = this.inactivityExpireAt && now < this.inactivityExpireAt;
          if (stillActive) {
            this._refreshing = true;
            await this.refreshAccessToken();
            this._refreshing = false;
          } else {
            console.log("⚠️ Token non rafraîchi car inactif");
            this.setExpired();
            this.clearInactivityTimer();
            clearInterval(countdownInterval);
          }
        }
      }, 1000);
    },

    // -------------------------------------
    startInactivityTimer() {
      this.clearInactivityTimer();
      this.inactivityRestant = inactivityMin * 60;
      this.inactivityExpireAt = Date.now() + this.inactivityRestant * 1000;

      const updateActivity = () => this.resetInactivityTimer();
      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach((evt) => window.addEventListener(evt, updateActivity));

      // 🔹 Vérifie le temps réel, pas un simple tick
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
      events.forEach((evt) =>
        window.removeEventListener(evt, this.resetInactivityTimer)
      );
    },

    logoutLocal(expired = false) {
      this.clearInactivityTimer();
      clearInterval(countdownInterval);

      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.sessionExpire = null;
      this.tempsRestant = 0;
      this.expired = expired;

      removeSecureItem("jwt_token");
      removeSecureItem("refresh_token");
      removeSecureItem("session_expire");
      setSecureItem("session_expired", "false");

      delete axios.defaults.headers.common["Authorization"];

      if (expired === true) {
        router.push({ name: "Login" });
      }
    },

    async logoutServer(manuel = true) {
      if (!this.refreshToken) return this.logoutLocal();
      try {
        this.manualLogout = manuel;
        await axios.post("/api/logout", { refresh_token: this.refreshToken });
        removeSecureItem("jwt_token");
        removeSecureItem("refresh_token");
        console.log("User déconnecté automatiquement côté backend");
      } catch (_) {}

      if (manuel === true) {
        this.logoutLocal();
        router.push({ name: "Login" });
      }
    },
  },
});
