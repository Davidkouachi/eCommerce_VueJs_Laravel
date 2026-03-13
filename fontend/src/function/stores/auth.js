    import { defineStore } from "pinia";
    import { useDeviceStore } from "@/function/stores/deviceStore";
    import axios from "@/function/services/axios";
    import router from "@/router/index";
    import { ref } from "vue";
    import { setSecureItem, getSecureItem, removeSecureItem } from "@/function/stores/secureStorage";

    let countdownInterval = null;

    export const useAuthStore = defineStore("auth", {

        state: () => ({
            user: null,
            expired: false,
            sessionExpire: null,
            tempsRestant: ref(0),
            token: null,
            refreshToken: null,
            inactivityRestant: ref(50 * 60),
            inactivityExpireAt: null,
            _refreshTriggered: false,

            manualLogout: false,
            isLoggingOut: false,
            device_id: null,
        }),

        getters: {
            isAuthenticated: (state) =>
                !!state.user && !!state.token && state.sessionExpire > Date.now(),
        },

        actions: {
            // ------------------------------------------------------
            setUserSession(user, expiresInSeconds, token, refreshToken, device_id) {
                const deviceStore = useDeviceStore();
                const expireAt = Date.now() + expiresInSeconds * 1000;

                this.sessionExpire = expireAt;
                this.user = user;
                this.token = token;
                this.refreshToken = refreshToken;
                this.expired = false;
                this.manualLogout = false;
                // this.device_id = device_id;
                this.device_id = deviceStore.getDeviceId();
                this._refreshTriggered = false;

                setSecureItem("jwt_token", token);
                setSecureItem("refresh_token", refreshToken);
                setSecureItem("session_expire", expireAt);
                setSecureItem("session_expired", "false");
                // setSecureItem("device_id", device_id);
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
                const deviceStore = useDeviceStore(); // ✅ ici aussi

                const token = getSecureItem("jwt_token");
                const refreshToken = getSecureItem("refresh_token");
                const expireAt = getSecureItem("session_expire");
                // const savedDeviceId = getSecureItem("device_id");
                const savedDeviceId = deviceStore.getDeviceId();

                if (!token || !refreshToken || !expireAt) return false;

                this.token = token;
                this.refreshToken = refreshToken;
                this.sessionExpire = Number(expireAt);
                this.device_id = savedDeviceId;

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                // Si le token est expiré → refresh automatique
                if (Date.now() > this.sessionExpire) {
                    const refreshed = await this.refreshAccessToken();
                    if (!refreshed) return false;
                }

                if (getSecureItem("session_expired") === "true") return false;

                try {
                    const res = await axios.get("/api/me");
                    this.user = res.data;
                    setSecureItem("aL", res.data.login);
                } catch (err) {
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

                const deviceStore = useDeviceStore();
                if (!this.device_id) this.device_id = deviceStore.getDeviceId();

                try {
                    const res = await axios.post("/api/refresh", {
                        refresh_token: this.refreshToken,
                        device_id: this.device_id,
                        user_id: this.user.id
                    }, { _isRefresh: true });

                    const newToken = res.data.access_token;
                    const newRefresh = res.data.refresh_token;
                    const expiresIn = res.data.expires_in;

                    this.token = newToken;
                    this.refreshToken = newRefresh;
                    this.sessionExpire = Date.now() + expiresIn * 1000;
                    this.expired = false;
                    this._refreshTriggered = false;

                    setSecureItem("jwt_token", newToken);
                    setSecureItem("refresh_token", newRefresh);
                    setSecureItem("session_expire", this.sessionExpire);
                    setSecureItem("session_expired", "false");

                    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

                    return newToken;

                } catch (err) {
                    this.setExpired();
                    console.error("Refresh token ERROR :", err);
                    return null;
                }
            },

            // ------------------------------------------------------
            startCountdown() {
                if (countdownInterval) return; // ✅ évite doublons

                countdownInterval = setInterval(async () => {
                    const now = Date.now();
                    const diff = Math.floor((this.sessionExpire - now) / 1000);
                    this.tempsRestant = diff > 0 ? diff : 0;

                    if (diff <= 0) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        this.setExpired();
                        this.clearInactivityTimer();
                        return;
                    }

                    // Refresh automatique 1-2 minutes avant expiration
                    if (diff <= 120 && !this._refreshTriggered) {
                        this._refreshTriggered = true;

                        const stillActive = this.inactivityExpireAt && now < this.inactivityExpireAt;

                        if (stillActive) {
                            await this.refreshAccessToken();
                        } else {
                            this.setExpired();
                            this.clearInactivityTimer();
                            clearInterval(countdownInterval);
                            countdownInterval = null;
                        }
                    }
                }, 1000);
            },

            // ------------------------------------------------------
            startInactivityTimer() {
                this.clearInactivityTimer();
                this.inactivityRestant = 50 * 60;
                this.inactivityExpireAt = Date.now() + this.inactivityRestant * 1000;

                const updateActivity = () => this.resetInactivityTimer();
                ["mousemove", "keydown", "scroll", "click"].forEach(evt => window.addEventListener(evt, updateActivity));

                this._inactivityInterval = setInterval(() => {
                    const now = Date.now();
                    const diff = Math.floor((this.inactivityExpireAt - now) / 1000);
                    this.inactivityRestant = diff > 0 ? diff : 0;

                    if (diff <= 0) {
                        this.setExpired();
                        this.clearInactivityTimer();
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                }, 1000);
            },

            resetInactivityTimer() {
                if (this.user && !this.expired) {
                    this.inactivityExpireAt = Date.now() + 50 * 60 * 1000;
                    this.inactivityRestant = 50 * 60;
                }
            },

            clearInactivityTimer() {
                clearInterval(this._inactivityInterval);
                ["mousemove", "keydown", "scroll", "click"].forEach(evt =>
                    window.removeEventListener(evt, this.resetInactivityTimer)
                );
            },

            // ------------------------------------------------------
            logoutLocal(expired = false) {
                if (this.isLoggingOut) return;
                this.isLoggingOut = true;

                this.clearInactivityTimer();
                clearInterval(countdownInterval);
                countdownInterval = null;

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
                // removeSecureItem("device_id");
                removeSecureItem("aL");

                delete axios.defaults.headers.common["Authorization"];

                this.isLoggingOut = false;
            },

            async logoutServer(manuel = true) {
                if (this.isLoggingOut) return;
                this.isLoggingOut = true;

                if (!this.refreshToken) {
                    this.logoutLocal(true);
                    return;
                }

                this.manualLogout = manuel;

                const deviceStore = useDeviceStore();

                try {
                    await axios.post("/api/logout", {
                        refresh_token: this.refreshToken,
                        user_id: this.user.id,
                        device_id: deviceStore.getDeviceId()
                    });
                } catch (error) {
                    // ignore
                } finally {
                    this.isLoggingOut = false;
                    if (manuel) this.logoutLocal(true);
                }
            },
        },
    });
