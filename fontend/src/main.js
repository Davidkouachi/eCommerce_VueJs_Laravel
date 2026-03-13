import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';

import '@/assets/styles.scss';
import '@/assets/style.css';

import { useDeviceStore } from "@/function/stores/deviceStore";

const app = createApp(App);
const pinia = createPinia();

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

app.component('Toast', Toast);
app.component('ProgressSpinner', ProgressSpinner);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('Rating', Rating);

app.use(ToastService);
app.use(ConfirmationService);

// ✅ maintenant Pinia est actif
const deviceStore = useDeviceStore(pinia);
deviceStore.getDeviceId();

app.mount('#app');