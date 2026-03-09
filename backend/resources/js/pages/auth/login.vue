<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import Swal from 'sweetalert2'
import { useLoginForm } from '@/services/authLogin'
import { useToastAlert } from '@/function/ToastAlert';
import { useRoute } from 'vue-router';
import { 
  removeLogoutPreloaderAndToast, 
  initTogglePassword, 
  destroyTogglePassword 
} from '@/appGlobal';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const { showToast, removeAllToasts, removeAllExcept } = useToastAlert();

const login = ref('')
const password = ref('')
const checked = ref(false)

const backgroundImage = new URL('@/assets/img/plan1.jpg', import.meta.url).href

const { loading, loginUser } = useLoginForm(login, password, checked, showToast, removeAllToasts, removeAllExcept)

const internalInstance = getCurrentInstance()
const stopSync = internalInstance.appContext.config.globalProperties.$syncLoadingStore(loading)

onMounted(() => {
  Swal.close();

  const logoutPreloader = document.getElementById('preloaderLogout');
  if (logoutPreloader) logoutPreloader.remove();

  if (route.name === 'Login' && auth.manualLogout === true) {
    removeLogoutPreloaderAndToast(showToast);
  }
  initTogglePassword();
})

onUnmounted(() => {
  stopSync()
  destroyTogglePassword();
});

</script>

<template>
  <div id="authBackground" class="main-wrapper auth-bg position-relative overflow-hidden" :style="{
      backgroundImage: `url(${backgroundImage})`,
    }">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.5); z-index:0;"></div>

        <!-- Start Content -->
    <div class="container-fuild position-relative z-1">
      <div class="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
          <div class="col-xxl-3 col-lg-4 col-md-6 col-sm-8 col-12 mx-auto">
            <form id="form_login" @submit.prevent="loginUser" class="d-flex justify-content-center align-items-center">
              <div class="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                <div class="card border-1 p-lg-3 shadow-md rounded-3 mb-4">
                  <div class="card-body">
                    <div class="mx-auto mb-4 text-center">
                      <img height="100" width="140" src="@/assets/img/logo.gif" class="img-fluid mx-auto" alt="Logo">
                    </div>
                    <div class="text-center mb-3">
                      <h5 class="mb-1 fs-20 fw-bold">Bienvenue ! 👋</h5>
                      <p class="mb-0">Plateforme de gestion santé</p>
                    </div>
                    <div class="mb-3">
                      <label class="form-label text-primary">Login</label>
                      <div class="input-group">
                        <span class="input-group-text border-end-0 bg-white">
                          <i class="fa fa-user fs-14 text-primary"></i>
                        </span>
                        <input v-model="login" type="text" id="login" class="form-control border-start-0 ps-0" placeholder="Entrer votre Login" autocomplete="off">
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label text-primary">Mot de passe</label>
                      <div class="pass-group input-group position-relative border rounded">
                        <span class="input-group-text bg-white border-0">
                          <i class="fa fa-lock text-primary fs-14"></i>
                        </span>
                        <input v-model="password" type="password" class="pass-input form-control ps-0 border-0" placeholder="**********" id="password" autocomplete="off">
                        <span class="input-group-text bg-white border-0">
                          <i class="ti toggle-password ti-eye-off text-primary fs-14"></i>
                        </span>
                      </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <div class="form-check form-check-md mb-0">
                        <input v-model="checked" class="form-check-input border-primary" id="remember_me" type="checkbox">
                        <label for="remember_me" class="form-check-label mt-0 text-primary">
                          Se souvenir de moi
                        </label>
                      </div>
                    </div>

                    <div class="mb-4 text-center">
                      <button
                        type="submit"
                        class="loading-btn btn btn-success fs-15 w-100 btn_connexion d-flex align-items-center justify-content-center gap-2"
                        :disabled="loading"
                      >
                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>{{ loading ? 'Connexion en cours...' : 'Connexion' }}</span>
                      </button>
                    </div>

                    <!-- ... autres éléments ... -->

                  </div>
                </div>
              </div>
            </form>
            <p class="text-white text-center">
              Direction Technique : (+225) 01 72 59 53 18 | Médecin Conseil : (+225) 01 70 66 49 21 | Validation de bons : (+225) 01 52 10 81 12 | Informatique : (+225) 07 57 35 95 19 | Factures : (+225) 01 41 25 31 32 | Chèques : (+225) 01 41 25 31 32
            </p>
          </div><!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>
    <!-- End Content -->

    </div>
</template>
