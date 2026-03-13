// src/stores/deviceStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { getSecureItem, setSecureItem } from "@/function/stores/secureStorage";

export const useDeviceStore = defineStore("device", () => {
    const deviceId = ref(getSecureItem("device_id") || null);

    function generateDeviceId() {
        if (!deviceId.value) {
            let id;
            if (crypto.randomUUID) {
                id = crypto.randomUUID();
            } else {
                // Polyfill
                id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                    const r = (Math.random() * 16) | 0;
                    const v = c === 'x' ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                });
            }

            deviceId.value = id;
            setSecureItem("device_id", id);
        }

        console.log("Device ID:", deviceId);

        return deviceId.value;
    }

    // récupère l'ID actuel (ou le génère s'il n'existe pas)
    function getDeviceId() {
        return deviceId.value || generateDeviceId();
    }

    return {
        deviceId,
        getDeviceId,
        generateDeviceId,
    };
});