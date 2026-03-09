<template>
    <TitrePage />
    <Fluid>
        <div class="flex">
            <form @submit.prevent="userForm" class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Formulaire</div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex flex-col grow basis-0 gap-2">
                        <label for="name">Nom et Prénoms</label>
                        <InputText id="name" v-model="name" type="text" />
                    </div>
                    <div class="flex flex-col grow basis-0 gap-2">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="email" type="email" />
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex flex-col grow basis-0 gap-2">
                        <label for="login">Login</label>
                        <InputText id="login" v-model="login" type="text" />
                    </div>
                    <div class="flex flex-col grow basis-0 gap-2">
                        <label for="password">Mot de passe</label>
                        <Password id="password" v-model="password" placeholder="Mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez un mot de passe">
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
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex items-center">
                        <Checkbox v-model="checked" id="checked" binary class="mr-2"></Checkbox>
                        <label for="checked">Je confirme que toutes les informations renseignées sont exactes.</label>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    <div class="col-12">
                        <Button
                            icon="pi pi-check-circle"
                            size="large"
                            type="Enregistrer"
                            class="w-full"
                            :loading="loading"
                            severity="success"
                            :label="loading ? 'Connexion en cours...' : 'Connexion'"
                            :fluid="false"
                        />
                    </div>
                </div>
            </form>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToastAlert } from '@/function/function/ToastAlert';
import axios from '@/function/services/axios';
import TitrePage from '@/layout/elements/TitrePage.vue';

const { showToast } = useToastAlert();

const login = ref('')
const name = ref('')
const email = ref('')
const password = ref('')
const checked = ref(false)
const loading = ref(false);

const passwordValid = computed(() => {
    const pw = password.value;

    return (
        pw.length >= 8 &&
        /[a-z]/.test(pw) &&       // minuscule
        /[A-Z]/.test(pw) &&       // majuscule
        /\d/.test(pw)             // chiffre
    );
});

const userForm = async () => {

    if (!name.value || !email.value || !login.value || !password.value) {
      showToast('warn', 'Alerte', 'Formulaire incomplet');
      return;
    }

    if (!passwordValid.value) {
        showToast('warn', 'Mot de passe invalide', 'Veuillez respecter les conditions du mot de passe');
        return;
    }

    if (!checked.value) {
      showToast('warn', 'Alerte', 'Veuillez vérifier les informations saisies et cochez la case');
      return;
    }

    loading.value = true;

    try {
        const res = await axios.post('/api/register', {
            login: login.value,
            password: password.value,
            email: email.value,
            name: name.value,
        });

        const data = res.data;

        if (data.success) {
            showToast('success', 'Succès', data.message);
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
        fn_resetFrom();
        loading.value = false;
    }
};

function fn_resetFrom() {
  name.value = '';
  email.value = '';
  login.value = '';
  password.value = '';
  checked.value = false;
}

</script>
