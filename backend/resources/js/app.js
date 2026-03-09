import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import 'primeicons/primeicons.css';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate'

import initPlugin from '@/plugins/init'
import router from '@/route/index';
import App from '@/App.vue';
import { createApp } from 'vue';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
});
app.use(ToastService);
app.component('Toast', Toast);
app.use(ConfirmationService);
app.use(initPlugin);
app.mount('#app');
