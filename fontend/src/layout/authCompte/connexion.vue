<template>

    <form autocomplete="off">
        <div class="text-center mb-8">
            <div class="text-center">
                <Avatar icon="pi pi-user" class="block mx-auto mb-4 bg-primary" size="xlarge" shape="circle" style="background-image: radial-gradient(circle at left top, var(--p-primary-400), var(--p-primary-700)); color:white;"/>
            </div>
            <span class="text-muted-color font-medium">Plateforme de gestion santé</span>
        </div>
        <div class="flex flex-col gap-6 rounded-2xl">
            <FloatLabel variant="on">                                
                <InputText id="login1" type="text" v-model="login" size="large" class="w-full"/>
                <label for="login1" class="text-surface-900 dark:text-surface-0 font-medium text-xl">Login</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Password inputId="password1" v-model="password" :toggleMask="true" fluid :feedback="false" size="large"/>
                <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium text-xl">Mot de passe</label>
            </FloatLabel>
            <div class="flex items-center justify-between mt-2 mb-2 gap-8">
                <div class="flex items-center">
                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                    <label for="rememberme1">Se souvenir de moi</label>
                </div>
                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" @click="openMdp()" >Mot de passe oublié?</span>
            </div>
        </div>
    </form>

    <Dialog v-model:visible="visible" modal header="Mot de passe Oublié" :style="{ width: '35rem' }">
        <div class="card flex justify-center">
            <Stepper v-model:value="activeStep" class="basis-[40rem]">
                <StepList>
                    <Step v-slot="{ value, a11yAttrs }" asChild :value="1">
                        <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2">
                                <span
                                    :class="[
                                        'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                        { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                    ]"
                                >
                                    <i class="pi pi-user" />
                                </span>
                            </button>
                            <Divider />
                        </div>
                    </Step>
                    <Step v-slot="{ value, a11yAttrs }" asChild :value="2">
                        <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2">
                                <span
                                    :class="[
                                        'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                        { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                    ]"
                                >
                                    <i class="pi pi-id-card" />
                                </span>
                            </button>
                            <Divider />
                        </div>
                    </Step>
                    <Step v-slot="{ value, a11yAttrs }" asChild :value="3">
                        <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2">
                                <span
                                    :class="[
                                        'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                        { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                    ]"
                                >
                                    <i class="pi pi-key" />
                                </span>
                            </button>
                        </div>
                    </Step>
                </StepList>
                <StepPanels>
                    <StepPanel v-slot="{ activateCallback }" :value="1">
                        <div class="flex flex-col gap-2 mx-auto mb-15" style="max-width: 20rem">
                            <div class="text-center mb-4 text-xl font-semibold">
                                Verification du compte
                            </div>
                            <p class="text-surface-500 dark:text-surface-400 block mb-4">
                                Après vérification un code sera envoyer sur votre email
                            </p>
                            <div class="field">
                                <InputText id="email" v-model="email_Mdp" type="email" placeholder="Entrer votre email" fluid />
                            </div>
                        </div>
                        <div class="flex pt-0 justify-center mt-8">
                            <Button
                                icon="pi pi-check-circle" 
                                @click="verifMdp1(activateCallback)"
                                :loading="loadingstep1"
                                severity="success"
                                :disabled="loadingstep1"
                                :label="loadingstep1 ? 'Vérification en cours...' : 'Verification'"
                            />
                        </div>
                    </StepPanel>
                    <StepPanel v-slot="{ activateCallback }" :value="2">
                        <div class="flex justify-center mx-auto mb-10" style="max-width: 20rem">
                            <div class="flex flex-col items-center w-full">
                                <div class="font-bold text-xl mb-5">
                                    Vérification Code OTP
                                </div>
                                <InputMask id="basic" v-model="otp_Mdp" mask="999-999-999" placeholder="999-999-999" class="text-center w-full"/>
                                <div class="flex justify-between mt-5 self-stretch">
                                    <Button 
                                        link
                                        class="p-0"
                                        @click="resendCode"
                                        :disabled="!canResend"
                                        :label="loadingrenvoie ? `en cours d'envoi...` : `Renvoyer le code`"
                                    />
                                    <Chip 
                                        :label="formatTime(timeLeft)"
                                        icon="pi pi-clock"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex pt-0 justify-center">
                            <Button
                                severity="success" 
                                icon="pi pi-check-circle" 
                                iconPos="right" 
                                @click="verifMdp2(activateCallback)"
                                :loading="loadingstep2"
                                :disabled="loadingstep2"
                                :label="loadingstep2 ? 'Vérification en cours...' : 'Verification'"
                            />
                        </div>
                    </StepPanel>
                    <StepPanel v-slot="{ activateCallback }" :value="3">
                        <div class="flex justify-center mx-auto mb-5" style="max-width: 20rem">
                            <div class="flex flex-col gap-3 mx-auto mb-15 w-full">
                                <div class="font-bold text-xl mb-5 text-center">
                                    Mise à jour du mot de passe
                                </div>
                                <Password id="password" v-model="key_Mdp1" placeholder="Nouveau mot de passe" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez un mot de passe">
                                    <template #header>
                                        <div class="font-semibold text-xm mb-4">Conditions</div>
                                    </template>
                                    <template #footer>
                                        <Divider />
                                        <ul class="pl-2 my-0 leading-normal text-sm">
                                            <li>✔ 1 minuscule</li>
                                            <li>✔ 1 majuscule</li>
                                            <li>✔ 1 chiffre</li>
                                            <li>✔ 8 caractères minimum</li>
                                        </ul>
                                    </template>
                                </Password>
                                <Password placeholder="Confirmer le mot de passe" :feedback="false" fluid v-model="key_Mdp2" :toggleMask="true"/>
                            </div>
                        </div>
                        <div class="flex pt-0 justify-center">
                            <Button
                                severity="success" 
                                icon="pi pi-check-circle" 
                                iconPos="right" 
                                @click="verifMdp3"
                                :loading="loadingstep3"
                                :disabled="loadingstep3"
                                :label="loadingstep3 ? 'Opération en cours...' : 'Enregistrer'"
                            />
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </div>
    </Dialog>
</template>

<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, onUnmounted, getCurrentInstance, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import axios from '@/function/services/axios';
import { useToastAlert } from '@/function/function/ToastAlert';
import { useAuthStore } from '@/function/stores/auth';
import { useRouter } from 'vue-router';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { setSecureItem, getSecureItem, removeSecureItem } from "@/function/stores/secureStorage";
import { useAuthCompteStore } from '@/function/stores/auth/compte';
import { isValidEmail } from '@/function/services/format';

const auth = useAuthStore();
const authComptes = useAuthCompteStore();
const preloaderSpinner = usePreloaderSpinner();
const { showToast, removeAllToasts, removeAllExcept } = useToastAlert();

const activeStep = ref(1);
const email_Mdp = ref();
const otp_Mdp = ref(null);
const key_Mdp1 = ref(null);
const key_Mdp2 = ref(null);

const canResend = ref(false);
const timeLeft = ref(60);
let intervalId = null;
// Compteur du nombre de renvois
const resendCount = ref(0);
// Intervalles : 30s, 1min, 2min, 5min, 15min, 1h
const resendIntervals = [30, 60, 120, 300, 900, 3600];

const login = ref('')
const password = ref('')
const checked = ref(false)
const loading = ref(false);
const router = useRouter();

const loadingstep1 = ref(false);
const loadingstep2 = ref(false);
const loadingstep3 = ref(false);
const loadingrenvoie = ref(false)

const visible = ref(false);

const backgroundImage = new URL('@/assets/img/plan2.jpg', import.meta.url).href

let submitting = false;

function getCurrentInterval() {
    return resendIntervals[Math.min(resendCount.value, resendIntervals.length - 1)];
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0');

    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0');

    const s = (seconds % 60)
        .toString()
        .padStart(2, '0');

    // Si il y a au moins 1 heure → afficher HH:MM:SS
    // Sinon → afficher MM:SS
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function startTimer() {
    canResend.value = false;
    timeLeft.value = getCurrentInterval();

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            canResend.value = true;
            clearInterval(intervalId);
        }
    }, 1000);
}

function openMdp() {

    activeStep.value = 1;
    visible.value = true;
    email_Mdp.value = '';
    otp_Mdp.value = null;
    key_Mdp1.value = null;
    key_Mdp2.value = null;
    loadingstep1.value = false;
    loadingstep2.value = false;
    loadingstep3.value = false;
    loadingrenvoie.value = false;
    canResend.value = false;
    timeLeft.value = 60;
    intervalId = null;
    resendCount.value = 0;
}

function verifMdp1(Callback) {

    if (!email_Mdp.value) {
        showToast('info', 'Alerte', 'Veuillez saisir votre email');
        return;
    }

    if (!isValidEmail(email_Mdp.value)) {
        showToast('warn', 'Alerte', 'Format de l’email invalide');
        return;
    }

    loadingstep1.value = true;

    setTimeout(() => {
        Callback(2);
        loadingstep1.value = false;
        showToast('success', 'Succès', 'Un code de vérification a été envoyé à :' + email_Mdp.value);
        resendCode();
    }, 5000);
  
}

function verifMdp2(Callback) {

    const otp = otp_Mdp.value?.trim() || '';
    const otpRegex = /^\d{3}-\d{3}-\d{3}$/;

    // Vérifie le format exact
    if (!otpRegex.test(otp)) {
        showToast('info', 'Alerte', 'Veuillez saisir un code OTP valide (ex: 123-456-789)');
        return;
    }

    loadingstep2.value = true;

    // 🔥 Ici on supprime les tirets
    const otpClean = otp.replace(/-/g, '');

    console.log("OTP nettoyé :", otpClean);  // → 123456789

    setTimeout(() => {
        loadingstep2.value = false;
        showToast('success', 'Succès', 'Code validé');
        Callback(3);
    }, 5000);

}

const passwordValid = computed(() => {
    const pw = key_Mdp1.value;

    return (
        pw.length >= 8 &&
        /[a-z]/.test(pw) &&       // minuscule
        /[A-Z]/.test(pw) &&       // majuscule
        /\d/.test(pw)             // chiffre
    );
});

function verifMdp3() {

    if (!key_Mdp1.value || !key_Mdp2.value) {
      showToast('warn', 'Alerte', 'Veuillez saisir le mot de passe incorrect');
      return;
    }

    if (key_Mdp1.value !== key_Mdp2.value) {
      showToast('warn', 'Alerte', 'Mot de passe incorrect');
      return;
    }

    if (!passwordValid.value) {
        showToast('warn', 'Mot de passe invalide', 'Veuillez respecter les conditions du mot de passe');
        return;
    }

    loadingstep3.value = true;

    setTimeout(() => {
        loadingstep3.value = false;
        visible.value = false;
        showToast('success', 'Succès', 'Mise à jour du mot de passe effectuée');
    }, 5000);
}

async function resendCode() {
    if (!canResend.value) return;

    loadingrenvoie.value = true;

    setTimeout(() => {
        // Incrémenter le compteur de renvois
        loadingrenvoie.value = false;
        resendCount.value++;
        showToast('success', 'Envoyé', 'Un nouveau code a été envoyé.');
        startTimer();
    }, 2000);
  
}

function getDeviceId() {
    let id = getSecureItem("device_id");

    if (!id) {
        if (crypto.randomUUID) {
            id = crypto.randomUUID();
        } else {
            // Polyfill compatible
            id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
        setSecureItem("device_id", id);
    }

    return id;
}

// usage
const deviceId = getDeviceId();

const connectLoginForm = async () => {
    if (submitting) return;   // 🔥 empêche 100% des doubles appels
    submitting = true;

    if (!login.value || !password.value) {
        showToast('warn', 'Alerte', 'Login et mot de passe sont obligatoires');
        submitting = false;
        return;
    }

    // loading.value = true;
    authComptes.setFooterLoading('connect')

    try {

        const res = await axios.post('/api/login', {
            login: login.value,
            password: password.value,
            device_id: deviceId
        });

        if (res.data.success) {

            const { access_token, refresh_token, user, expires_in } = res.data;

            // auth.setUserSession(user, expires_in, access_token, refresh_token);
            auth.setUserSession(user, expires_in, access_token, refresh_token, deviceId);

            const mainId = showToast(
                'success',
                'Compte connecté',
                `Bienvenue ${user.name}, nous sommes heureux de vous revoir 🤝!`,
                5000,
                '1'
            );

            setSecureItem('nu', user.name);
            setSecureItem('me', checked.value ? 'true' : 'false');
        
            // router.push({ name: 'dashboard' });
            authComptes.hide()

        } else if (res.data.info) {
            showToast('info', 'Informations', res.data.message);
        } else if (res.data.warn) {
            showToast('warn', 'Alerte', res.data.message);
        } else {
            showToast('error', 'Erreur', res.data.message || 'Erreur inconnue');
        }
    } 
    catch (err) {
        // loading.value = false;
        authComptes.clearFooterLoading()
        showToast('error', 'Erreur', err.message);
    } finally {
        submitting = false;
        authComptes.clearFooterLoading()
   }
};

onMounted(() => {

    removeSecureItem("jwt_token");
    removeSecureItem("refresh_token");
    removeSecureItem("session_expire");
    removeSecureItem("session_expired");
    removeSecureItem("device_id");
    removeSecureItem("aL");
    removeSecureItem("nu");
    removeSecureItem("me");
})

watch(() => activeStep.value, (newStep) => {
    if (newStep === 2) {
        startTimer();
    }
});

defineExpose(
    { 
        submit: connectLoginForm
    }
)

</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}




.custom-otp-input {
    width: 48px;
    height: 48px;
    font-size: 24px;
    appearance: none;
    text-align: center;
    transition: all 0.2s;
    border-radius: 0;
    border: 1px solid var(--p-inputtext-border-color);
    background: transparent;
    outline-offset: -2px;
    outline-color: transparent;
    border-right: 0 none;
    transition: outline-color 0.3s;
    color: var(--p-inputtext-color);
}

.custom-otp-input:focus {
    outline: 2px solid var(--p-focus-ring-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border-right-width: 1px;
    border-right-style: solid;
    border-color: var(--p-inputtext-border-color);
}
</style>
