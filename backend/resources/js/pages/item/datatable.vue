<template>
  <Layout>
    <div class="content pb-0 mb-3">
      <div class="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-0">
        <div class="flex-grow-1">
          <h4 class="fw-bold mb-0">Patients List</h4>
        </div>
        <div class="text-end d-flex">
          <button
            class="btn btn-warning ms-2 fs-13 btn-md"
            :disabled="loading"
            @click="reloadTable"
          >
            <i class="ti ti-refresh me-1"></i>
            Actualiser
          </button>
        </div>
      </div>
      <div class="card rounded-0">
        <div class="card-body">
          <!-- 🔹 Spinner / chargement -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0">Chargement des données...</p>
          </div>

          <!-- === Table === -->
          <div v-else class="table-responsive">
            <table ref="dataTable" class="table datatable table-nowrap table_style_primary" id="maTable" dt-export-title >
              <thead  >
                <tr>
                  <th>N°</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Login</th>
                  <th>Statut</th>
                  <th style="width:30px;"></th>
                </tr>
              </thead>

              <tbody>
                <!-- 🔹 Cas 1 : données disponibles -->
                <tr v-for="(user, index) in donnees" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="avatar bg-primary rounded-circle me-1">
                        <i class="ti ti-user fs-24"></i>
                      </span>
                      <a href="#" class="text-dark fw-semibold">
                        {{ user.name }}
                        <span class="text-body fs-13 fw-normal d-block">{{ user.email }}</span>
                      </a>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.login }}</td>
                  <td>
                    <span class="badge badge-success text-white rounded bg-success fs-13 fw-medium">
                      Disponible
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-1">
                      <a
                        href="javascript:void(0);"
                        class="shadow-sm fs-14 border rounded-2 p-1 me-1"
                        data-bs-toggle="dropdown"
                      >
                        <i class="ti ti-dots-vertical"></i>
                      </a>
                      <ul class="dropdown-menu p-2">
                        <li>
                          <a href="#" class="dropdown-item d-flex align-items-center edit-btn text-info" :data-id="user.id">
                            <i class="ti ti-edit fs-20 mx-1"></i>
                            <span>Mise à jour</span>
                          </a>
                        </li>
                        <li>
                          <a href="#" class="dropdown-item d-flex align-items-center justify-content-left view-btn text-warning" @click="openModal(user, $event)" :data-id="user.id">
                            <i class="ti ti-eye fs-20 mx-1"></i>
                            <span>Détails</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>

                <!-- 🔹 Cas 2 : aucune donnée -->
                <tr v-if="donnees.length === 0">
                  <td colspan="6" class="text-center py-3 text-danger">
                    <i class="ti ti-database-off fs-2"></i>
                    <p class="mt-1 mb-0">Aucune donnée disponible</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- === MODAL === -->
    <div v-if="showModal">
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title text-white">Détails de l'utilisateur</h5>
              <button type="button" class="btn-close text-white" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li class="list-group-item"><strong>Nom :</strong> {{ userSelected.name }}</li>
                <li class="list-group-item"><strong>Email :</strong> {{ userSelected.email }}</li>
                <li class="list-group-item"><strong>Login :</strong> {{ userSelected.login }}</li>
              </ul>
            </div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
            </div> -->
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
    
  </Layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Layout from '@/layout/applayout.vue'
import { usePreloaderStore } from '@/stores/preloader'
import axios from 'axios'
import initDataTable from '@/plugins/datatable.js'
import { pdfListeUser } from '@/data/pdf/pdf_liste_user.js'
import { useToastAlert } from '@/function/ToastAlert'
import { useAuthStore } from '@/stores/auth'
import { initSession } from '@/stores/useSession'
import { showPreloader } from '@/function/showPreloader';

const auth = useAuthStore()
const preloader = usePreloaderStore()
const dataTable = ref(null)
const { showToast } = useToastAlert()

const donnees = ref([])
const loading = ref(true)
const showModal = ref(false)
const userSelected = ref({})
const searchTerm = ref('')

async function fetchEmployes() {
  loading.value = true
  donnees.value = []

  // Détruire DataTable si existant
  if (dataTable.value && window.$.fn.DataTable.isDataTable(window.$(dataTable.value))) {
    window.$(dataTable.value).DataTable().destroy(true)
  }

  await nextTick()

  try {

    // Appel API
    const res = await axios.get('/api/liste_user')
    donnees.value = res.data?.data || []

  } catch (err) {
    console.error('Erreur lors du chargement :', err)
    showToast('error', 'Erreur', 'Impossible de charger les données utilisateurs')
  } finally {
    loading.value = false
    await nextTick()

    if (donnees.value.length > 0) {
      const tableElement = document.querySelector('#maTable');

      // 🔁 Fonction unique pour récupérer les données filtrées
      const getDonneesFiltrees = () => {
        const editButtons = tableElement.querySelectorAll('.view-btn[data-id]');
        const idsDansTableau = Array.from(editButtons).map(btn => parseInt(btn.getAttribute('data-id')));
        const donneesFiltrees = donnees.value.filter(user => idsDansTableau.includes(user.id));

        return donneesFiltrees.filter(u =>
          u.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          u.login.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      };

      // 🔁 Fonction utilitaire pour l’export (PDF ou Excel)
      const handleExport = (type) => {

        const donneesRecherchees = getDonneesFiltrees();

        if (donneesRecherchees.length === 0) {
          showToast('warn', 'Alerte', "Aucune donnée à exporter.");
          return;
        }

        const message = type === 'pdf'
          ? 'Chargement du fichier PDF...'
          : 'Chargement du fichier Excel...';

        const exportFunc = type === 'pdf'
          ? pdfListeUser
          : exportExcel;

        showPreloader(message, () => {
          exportFunc(donneesRecherchees);
        }, 1000);
      };

      // ⚙️ Initialisation du tableau avec les callbacks propres
      initDataTable('#maTable', true, {
        pdf: () => handleExport('pdf'),
        // excel: () => handleExport('excel'),
      });
    }

  }
}

const reloadTable = async () => {
  // Empêche l'appel si on est déjà en train de charger
  if (loading.value) return;

  // Optionnel : réinitialiser le champ de recherche
  searchTerm.value = '';

  // Détruire DataTable s'il existe (même méthode que dans fetchEmployes)
  if (dataTable.value && window.$.fn.DataTable.isDataTable(window.$(dataTable.value))) {
    try {
      window.$(dataTable.value).DataTable().destroy(true);
    } catch (err) {
      console.warn('Erreur lors de la destruction du DataTable:', err);
    } finally {
      dataTable.value = null;
    }
  }

  // Recharger les données
  await fetchEmployes();
};

const openModal = (user) => {
  userSelected.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  userSelected.value = {}
}

onMounted(async () => {
  // const sessionOk = await initSession()
  // if (!sessionOk) return
  preloader.hide()
  await nextTick()

  await fetchEmployes()
})

onBeforeUnmount(() => {
  if (dataTable.value && window.$.fn.DataTable.isDataTable(window.$(dataTable.value))) {
    window.$(dataTable.value).DataTable().destroy(true)
  }
})
</script>


