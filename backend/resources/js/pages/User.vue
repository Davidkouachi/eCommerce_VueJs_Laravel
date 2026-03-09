<template>
    <Layout>
        <div class="content pb-0 align-items-center justify-content-center">
            <div class="card rounded-0 div_matricule">
                <div class="card-header text-center">
                    <h5 class="mb-0">Page about</h5>
                </div>
                <form id="form_login" @submit.prevent="fn_verifier" class="row g-3 card-body mb-3">
                  <!-- Champ de saisie -->
                  <div class="col-lg-6">
                    <div class="form-floating">
                        <input type="text" class="form-control form-control-sm input_name text-left" id="floatingName" v-model="name" placeholder="Entrer votre nom" />
                        <label for="floatingName">Nom complet</label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-floating">
                        <input type="email" class="form-control form-control-sm input_email text-left" id="floatingEamil" v-model="email" placeholder="Entrer votre Email" />
                        <label for="floatingEamil">Email</label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-floating">
                        <input type="text" class="form-control form-control-sm input_login text-left" id="floatingLogin" v-model="login" placeholder="Entrer votre Login" />
                        <label for="floatingLogin">Login</label>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-floating">
                        <input type="password" class="form-control form-control-sm input_password text-left" id="floatingPassword" v-model="password" placeholder="Entrer votre mot de passe" value="password" />
                        <label for="floatingPassword">Mot de passe</label>
                    </div>
                  </div>
                  <!-- Bouton avec loading -->
                  <button type="submit" class="btn btn-success btn-md w-25 d-flex align-items-center justify-content-center gap-2" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>{{ loading ? 'Vérification en cours...' : 'Enregistrer' }}</span>
                  </button>
                </form>
            </div>
        </div>
    </Layout>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
import { useToastAlert } from '@/function/ToastAlert';
import { usePreloaderStore } from '@/stores/preloader';
import { useToast } from 'primevue/usetoast';
// import { useGlobalFn } from '@/plugins/global.js';
import Layout from '@/layout/applayout.vue';
import axios from '@/services/axios';
import { initSession } from '@/stores/useSession'

const toast = useToast();
const preloader = usePreloaderStore();
const { showToast, removeAllToasts, removeAllExcept } = useToastAlert();
// const { numberTel, numberTelLimit } = useGlobalFn();

const name = ref('')
const email = ref('')
const login = ref('')
const password = ref('')
const loading = ref(false)

async function fn_verifier() {

  if (!name.value || !email.value || !login.value || !password.value) {
    showToast('warn', 'Alerte', 'Veuillez remplir tous les champs');
    return;
  }

  loading.value = true;

  try {

    const res = await axios.post('/api/register', {
      login: login.value,
      password: password.value,
      email: email.value,
      name: name.value,
    }, {
      validateStatus: (s) => s >= 200 && s < 500
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

}

function fn_resetFrom() {
  name.value = '';
  email.value = '';
  login.value = '';
  password.value = '';
}

const internalInstance = getCurrentInstance()
const stopSync = internalInstance.appContext.config.globalProperties.$syncLoadingStore(loading)

onMounted(async () => {
  // const sessionOk = await initSession()
  // if (!sessionOk) return

  preloader.hide()
  await nextTick()
})

onUnmounted(() => stopSync())
</script>

