<template>
  <Layout>
  <div class="content pb-0 align-items-center justify-content-center">
    <div class="card rounded-0 div_matricule">
      <div class="card-header text-center">
        <h5 class="mb-0">Page about</h5>
      </div>

      <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-3">
        <!-- Champ de saisie -->
        <div class="form-floating">
          <input
            type="text"
            class="form-control form-control-sm input_matricule text-center"
            id="floatingMatricule"
            v-model="matricule"
            placeholder="Matricule de l'assuré"
          />
          <label for="floatingMatricule">Matricule de l'assuré</label>
        </div>
        <!-- Bouton avec loading -->
        <button
          class="btn btn-success btn_recherche_matricule"
          :disabled="loading"
          @click="verifierMatricule"
        >
          <i v-if="!loading" class="fa fa-search me-2"></i>
          <span
            v-else
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ loading ? "Chargement..." : "Vérification" }}
        </button>
      </div>
    </div>
  </div>
  </Layout>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
import { useToastAlert } from '@/function/ToastAlert';
import { usePreloaderStore } from '@/stores/preloader';
import { useToast } from 'primevue/usetoast';
import Layout from '@/layout/applayout.vue';
import { initSession } from '@/stores/useSession'

const toast = useToast();
const preloader = usePreloaderStore();
const { showToast, removeAllToasts, removeAllExcept } = useToastAlert();

const matricule = ref('S00061001769301')
const loading = ref(false)

function verifierMatricule() {
  loading.value = true
  setTimeout(() => {
    loading.value = false;
    removeAllToasts();
    showToast('info', 'Informations', 'matricule : ' + matricule.value);
  }, 2000)
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

