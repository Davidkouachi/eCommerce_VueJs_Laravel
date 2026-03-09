<template>
  <Layout>
    <div class="content pb-0 align-items-center justify-content-center">
      <div class="d-flex align-items-sm-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 class="fw-bold mb-0">Tableau de Bord</h4>
        </div>
        <div class="d-flex align-items-center flex-wrap gap-2">
          <button 
            :disabled="loading" 
            @click="verifierMatricule" 
            class="btn btn-primary d-inline-flex align-items-center">
            <i v-if="!loading" class="fa fa-plus me-1"></i>
            <i v-else class="fa fa-search me-2"></i>
            {{ loading ? "Chargement..." : "Bouton test" }}
          </button>
          <a href="#" class="btn btn-warning d-inline-flex align-items-center"
            :disabled="loading2"
            @click="reloadWinget"
          >
            <i class="ti ti-calendar-time me-1"></i>{{ loading2 ? "Chargement..." : "Actualiser" }}
          </a>
        </div>
      </div>

      <div class="row">
        <!-- Exemple 1 -->
        <div class="col-xl-3 col-md-6">
          <div class="position-relative border card rounded-2 shadow-sm">
            <img src="@/assets/img/bg/bg-01.svg" alt="img" class="position-absolute start-0 top-0">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="avatar bg-primary rounded-circle"><i class="ti ti-user fs-24"></i></span>
                <div v-if="!loadingUserCount" class="text-end">
                  <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+5%</span>
                  <p class="fs-13 mb-0">Cette semaine</p>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="mb-1">Utilisateurs</p>
                  
                  <!-- Spinner si en chargement -->
                  <h3 v-if="loadingUserCount" class="fw-bold mb-0 text-warning">
                    <div class="spinner-border spinner-border-sm text-warning" role="status"></div>
                  </h3>

                  <!-- Nombre d'utilisateurs sinon -->
                  <h3 v-else class="fw-bold mb-0 text-truncate">
                    {{ userCount }}
                  </h3>

                </div>
                <div>
                  <div id="s-col" class="chart-set"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exemple 2 : Patients (tu pourras remplacer l’API plus tard) -->
        <div class="col-xl-3 col-md-6">
          <div class="position-relative border card rounded-2 shadow-sm">
            <img src="@/assets/img/bg/bg-02.svg" alt="img" class="position-absolute start-0 top-0">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="avatar bg-danger rounded-circle"><i class="ti ti-heart fs-24"></i></span>
                <div class="text-end">
                  <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+12%</span>
                  <p class="fs-13 mb-0">in last 7 Days</p>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="mb-1">Patients</p>
                  <h3 class="fw-bold mb-0">4178</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exemple 3 -->
        <div class="col-xl-3 col-md-6">
          <div class="position-relative border card rounded-2 shadow-sm">
            <img src="@/assets/img/bg/bg-03.svg" alt="img" class="position-absolute start-0 top-0">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="avatar bg-info rounded-circle"><i class="ti ti-calendar fs-24"></i></span>
                <div class="text-end">
                  <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">-15%</span>
                  <p class="fs-13 mb-0">in last 7 Days</p>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <p class="mb-1">Appointments</p>
                  <h3 class="fw-bold mb-0">12178</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exemple 4 -->
        <div class="col-xl-3 col-md-6">
          <div class="position-relative border card rounded-2 shadow-sm">
            <img src="@/assets/img/bg/bg-04.svg" alt="img" class="position-absolute start-0 top-0">
            <div class="card-body">
              <div class="d-flex align-items-center mb-2 justify-content-between">
                <span class="avatar bg-success rounded-circle"><i class="ti ti-cash fs-24"></i></span>
                <div class="text-end">
                  <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                  <p class="fs-13 mb-0">in last 7 Days</p>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between overflow-hidden">
                <div>
                  <p class="mb-1">Revenue</p>
                  <h3 class="fw-bold mb-0 text-truncate">$55,1240</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-header">
            <h5 class="fw-bold mb-0">Vitals</h5> 
        </div>
        <div class="card-body">

            <h3 v-if="loadingUserCount" class="fw-bold mb-0 text-warning text-center">
              <div class="spinner-border spinner-border-sm text-warning" role="status"></div>
            </h3>
            <!-- row start -->
            <div v-else class="row row-gap-3 row-cols-1 row-cols-xl-6 row-cols-md-3 row-cols-sm-2">

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/weight.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1">Weight</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">100</span> Kg</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/rotate-left.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1">Height</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">154</span> Cm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/user-cirlce-add.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1">BMI</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">19.2</span> kg/cm</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/driver-2.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1">Pulse</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">97%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/wind.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1">SPO2</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">98%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

                <!-- col start -->
                <div class="col d-flex">
                    <div class="p-3 border shadow-sm flex-fill w-100 rounded-2">
                        <div class="d-flex align-items-center">
                            <span class="avatar bg-primary rounded-circle flex-shrink-0"><img src="@/assets/img/icons/sun.svg" alt="img" class="w-auto h-auto"></span>
                            <div class="ms-1">
                                <p class="mb-1 text-truncate">Temprature</p>
                                <p class="text-truncate"><span class="fs-18 fw-bold text-dark">101</span> C</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- col end -->

            </div>
            <!-- row end -->

        </div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { usePreloaderStore } from '@/stores/preloader'
import { useToastAlert } from '@/function/ToastAlert'
import { useSwalAlert } from '@/function/SwalAlert'
import Layout from '@/layout/applayout.vue'
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { initSession } from '@/stores/useSession'

// --- Stores & alerts
const preloader = usePreloaderStore()
const { showSwal } = useSwalAlert()

// --- Loading global (bouton)
const loading = ref(false)
const loading2 = ref(false)

// --- Données dashboard
const userCount = ref(0)
const loadingUserCount = ref(true)

// --- API count utilisateurs
async function fetchUserCount(load) {
  loading2.value = load
  loadingUserCount.value = true
  try {
    // Rafraîchir le token CSRF
    const csrfRes = await axios.get('/refresh-csrf')
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfRes.data.csrf_token

    // Appel API (à adapter si ton endpoint est différent)
    const res = await axios.get('/api/users/count')
    userCount.value = res.data?.count || 0
  } catch (err) {
    console.error('Erreur lors du chargement du nombre d’utilisateurs :', err)
    userCount.value = 0
  } finally {
    loadingUserCount.value = false
    loading2.value = false
  }
}

async function reloadWinget() {
  await fetchUserCount(true)
}

// --- Exemple bouton test
function verifierMatricule() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSwal({
      icon: 'success',
      title: 'Succès',
      text: 'Connexion réussie.',
    })
  }, 2000)
}

// --- Synchronisation & montage
const internalInstance = getCurrentInstance()
const stopSync = internalInstance.appContext.config.globalProperties.$syncLoadingStore(loading)
const stopSync2 = internalInstance.appContext.config.globalProperties.$syncLoadingStore(loading2)

onMounted(async () => {
  // const sessionOk = await initSession()
  // if (!sessionOk) return
  preloader.hide()
  await nextTick()

  await fetchUserCount(false)
})

onUnmounted(() => {
  stopSync()
  stopSync2()
})
</script>
