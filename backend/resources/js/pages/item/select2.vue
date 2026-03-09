<template>
  <Layout>
    <div class="content pb-0 align-items-center justify-content-center">
      <div class="card rounded-0 div_select">
        <div class="card-header text-center">
          <h5 class="mb-0">Page Select2 avec API</h5>
        </div>

        <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-3">
          <!-- Select2 alimenté par API -->
          <select
            id="mySelect"
            ref="selectElement"
            class="form-select form-select-sm select2 w-100"
            data-toggle="select2"
            data-placeholder="Sélectionner"
          >
            <option value="">
              <!-- Affiche le texte de chargement -->
              {{ selectLoading ? 'Chargement en cours...' : 'Sélectionner' }}
            </option>

            <!-- Afficher les options uniquement si elles sont chargées -->
            <option
              v-for="item in options"
              :key="item.id"
              :value="item.id"
            >
              {{ item.nom }}
            </option>
          </select>

          <button
            class="btn btn-success btn_recherche_matricule"
            :disabled="loading"
            @click="verifier"
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

      <!-- 🔹 Composants dynamiques -->
      <MatriculeForm
        v-if="showMatricule"
        :loading="loadingMatricule"
        @demande-verification="verifierMatricule"
      />
      <selectStep v-if="showselectStep" />
    </div>
  </Layout>
</template>

<script setup>
import axios from 'axios'
import { usePreloaderStore } from '@/stores/preloader'
import { useLoadingStore } from '@/stores/loading'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Layout from '@/layout/applayout.vue'
import { useToastAlert } from '@/function/ToastAlert'
import MatriculeForm from '@/pages/compo/MatriculeStep.vue'
import selectStep from '@/pages/compo/selectStep.vue'
import { initSelect2 } from '@/plugins/select2.js'
import { useAuthStore } from '@/stores/auth'
import { initSession } from '@/stores/useSession'

const auth = useAuthStore()
const preloader = usePreloaderStore()
const loadingStore = useLoadingStore()
const { showToast, removeAllToasts } = useToastAlert()

// Refs
const loading = ref(false)
const loadingMatricule = ref(false)
const selectElement = ref(null)
const showMatricule = ref(false)
const showselectStep = ref(false)
const options = ref([])
const selectLoading = ref(true)

async function chargerOptions() {
  try {
    selectLoading.value = true
    options.value = []

    // const token = localStorage.getItem('jwt_token')
    // if (!token) {
    //   showToast('warn', 'Alerte', 'Session expirée, veuillez vous reconnecter')
    //   return
    // }

    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const response = await axios.get('/api/liste_user')
    const data = response.data.data || []

    options.value = data.map(item => ({
      id: item.id,
      nom: item.name
    }))

    selectLoading.value = false
    await nextTick()
    initSelect2('#mySelect')
  } catch (error) {
    console.error(error)
    showToast('error', 'Erreur', "Impossible de charger les données.")
    selectLoading.value = false
  }
}

function verifier() {
  const selectedValue = selectElement.value?.value

  if (!selectedValue) {
    showToast('warn', 'Alerte', 'Veuillez sélectionner un élément')
    return
  }

  if (window.$) {
    window.$('.div_matricule, .div_select2').slideUp('slow')
  }

  loadingStore.startLoading()
  loading.value = true

  setTimeout(async () => {
    loading.value = false
    loadingStore.stopLoading()
    removeAllToasts()
    showToast('success', 'Succès', 'Connexion réussie')

    if (window.$ && selectElement.value) {
      window.$(selectElement.value).val(null).trigger('change')
    }

    showMatricule.value = true
    showselectStep.value = false

    await nextTick()
    if (window.$) window.$('.div_matricule').hide().slideDown('slow')
  }, 2000)
}

async function verifierMatricule() {
  if (window.$) window.$('.div_select2').slideUp('slow')

  loadingStore.startLoading()
  loadingMatricule.value = true

  setTimeout(async () => {
    loadingMatricule.value = false
    loadingStore.stopLoading()
    removeAllToasts()
    showToast('success', 'Succès', 'Matricule vérifié avec succès')

    showselectStep.value = true
    await nextTick()
    if (window.$) window.$('.div_select2').hide().slideDown('slow')
  }, 2000)
}

onMounted(async () => {
  // const sessionOk = await initSession()
  // if (!sessionOk) return
  preloader.hide()
  await nextTick()

  // ✅ 3️⃣ Maintenant on initialise et charge les données
  initSelect2('#mySelect')
  await chargerOptions()
})

onBeforeUnmount(() => {
  if (!window.$) return
  const $select = window.$(selectElement.value || '#mySelect')
  if ($select.length && $select.hasClass('select2-hidden-accessible')) {
    $select.select2('destroy')
    console.log('🧹 Select2 détruit proprement avant démontage')
  }
})
</script>

