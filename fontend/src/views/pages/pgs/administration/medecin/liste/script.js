import { ref, onMounted, computed,nextTick, watch, markRaw } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToastAlert } from '@/function/function/ToastAlert';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/function/stores/auth';
import { formaDateHeure } from '@/function/services/format';
import { onlyNumbers, onlyUppercase } from '@/function/format';
import viewOption from './viewOption.vue'
import updateOption from './updateOption.vue'
import { useDrawerStore } from '@/function/stores/drawer'
import { useAbortController } from '@/function/services/useAbortController'

export function useScript() {

	const controller = useAbortController()

	const auth = useAuthStore();
	const { showToast } = useToastAlert();
	const preloaderSpinner = usePreloaderSpinner();
	const confirm = useConfirm();
	const drawerUse = useDrawerStore();

	const lists = ref([]);
	const loading = ref(true);
	const loadingBtn = ref(true);
	const filters = ref({});
	const showModal = ref(false);
	const showModalView = ref(false);
	const listSelected = ref({});
	const globalFilter = ref('');
	const dt = ref(null);
	const menuRefs = ref({});
	const selectedLists = ref([]);

	// ------------------------ filtre et api -----------------------------

	function initFilters() {
	    filters.value = {
	        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	    };
	}

	const fetchLists = async (loaderBtn = false, callback) => {
	    loading.value = true;
	    loadingBtn.value = loaderBtn;

	    // Placeholder pendant le chargement
	    lists.value = new Array(10).fill({});

	    try {
	        const res = await axios.get('/api/v1/api_get_medecin',{ signal: controller.signal });

	        // Vérifie si la réponse est vide ou status 204
	        const data = res.data?.data ?? [];

	        if (!data.length) {
	            lists.value = [];
	            showToast('info', 'Info', 'Aucune données trouver.');
	        } else {
	            // Mappe chaque processus pour cloner l'objet et conserver la structure
	            lists.value = data.map(item => ({
	                ...item,
	            }));
	        }

	    } catch (err) {
	    	// 👇 Très important
	        if (err.name === 'CanceledError' || err.name === 'AbortError') {
	            // console.log('Requête annulée automatiquement')
	            return
	        }

	        console.error('Erreur API:', err);
	        lists.value = [];
	        showToast('error', 'Erreur', 'Impossible de charger les processus.');
	    } finally {
	    	// 👇 Empêche d’exécuter si annulé
        	if (controller.signal.aborted) return

	        loading.value = false;
	        loadingBtn.value = false;

	        // ⚡ Appelle le callback si défini
	        if (typeof callback === 'function') {
	            callback();
	        }

	        await nextTick();
	        initFilters(false);
	    }
	};

	const updateRowByUid = (uid, newData) => {
	  	lists.value = lists.value.map(item =>
	    	item.uid === uid ? { ...item, ...newData } : item
	  	)
	}

	// ------------------------ boutton pour imprimer-----------------------------

	const rowsPerPage = ref(10);
	const currentPage = ref(1);
	const totalRows = computed(() => lists.value.length);

	function onPage(event) {
	    currentPage.value = event.page + 1;
	    rowsPerPage.value = event.rows;   // <<< SUPER IMPORTANT
	}

	const totalPages = computed(() => {
	    return lists.value.length && rowsPerPage.value
	        ? Math.ceil(lists.value.length / rowsPerPage.value)
	        : 1;
	});

	const rowClass = (data) => {
	    // 1. Pendant le chargement du tableau → aucune couleur
	    if (loading.value) {
	        return '';
	    }
	};

	const getLignesPageCourante = () => {
	    if (!dt.value) return [];

	    // processedData contient EXACTEMENT les lignes affichées dans le tableau
	    const visible = dt.value.processedData;

	    return visible ?? [];
	};

	// ------------------------ ajouter & modifier une ligne -----------------------------
	const getFooterButtons = (isUpdate = false) => [
	  {
	    id: 'logout',
	    label: 'Fermer',
	    icon: 'pi pi-times',
	    variant: 'outlined',
	    severity: 'danger',
	    command: () => drawerUse.hide()
	  },
	  ...(isUpdate
	    ? [{
	        id: 'DrawerBtn',
	        label: 'Mise à jour',
	        loadingLabel: 'Opération en cours...',
	        icon: 'pi pi-check',
	        severity: 'primary',
	        command: () => drawerUse.callComponentMethod('submit')
	      }]
	    : [])
	]

	const openDrawer = (mode, data = null) => {

	  const isUpdate = mode === 'update'

	  drawerUse.show(
	    isUpdate ? "Mise à jour" : "Détails du médecin",
	    isUpdate ? "pi pi-pencil" : "",
	    "right",
	    isUpdate ? "50rem" : "30rem",
	    markRaw(isUpdate ? updateOption : viewOption),
	    isUpdate
	      ? { data, updateRowByUid }
	      : { data },
	    { footerBtn: getFooterButtons(isUpdate) }
	  )
	}

	const viewTable = (data) => openDrawer('view', data)

	const updateTable = (data) => openDrawer('update', data)

	// ------------------------ ajouter & supprimer une ligne -----------------------------

	const changeStatut = async (uid, statut) => {

		preloaderSpinner.showSpiner(
            'Opération en cours ...', 
            async () => { 
                
                try {

			        const res = await axios.put(
			            `/api/v1/api_statut_medecins/${uid}/${statut}`
			        )

			        if (res.status === 200) {

			            updateRowByUid(uid, {
						  	statut,
						  	statut_label: statut === 1 ? 'Actif' : 'Inactif'
						})

			            showToast('success', 'Succès', res.data.msg)

			        } else {

			        	showToast('warn', 'Attention', res.data.msg)
			        }

			    } catch (err) {

			        showToast(
			            'error',
			            'Erreur',
			            err.response?.data?.msg || 'Erreur serveur'
			        )
			    } finally {

                  	preloaderSpinner.hideSpiner();
                }
            }, 
            'rgba(255,255,255,0.9)'
        );
	}

	// ------------------------ selection des lignes du tableau -----------------------------

	const showSelected = () => {
	    const before = JSON.parse(JSON.stringify(selectedLists.value));
	    showToast('info', 'Sélection', before.length + ' ligne(s) sélectionnée(s)');
	};

	const isSelected = (row) => {
	    return selectedLists.value.some(u => u.id === row.id);
	};

	const isAllSelected = computed(() => {
	    if (!selectableRows.value.length) return false;

	    return selectableRows.value.every(u => isSelected(u));
	});

	const toggleRow = (checked, row) => {
	    if (checked) {
	        if (!isSelected(row)) {
	            selectedLists.value.push({ ...row });
	        }
	    } else {
	        selectedLists.value = selectedLists.value.filter(u => u.id !== row.id);
	    }
	};

	const toggleAll = (check) => {
	    if (check && selectableRows.value.length === 0) {
	        // Rien à sélectionner → on force décoché
	        return;
	    }

	    if (check) {
	        selectedLists.value = selectableRows.value.map(u => ({ ...u }));
	    } else {
	        selectedLists.value = [];
	    }

	    showToast(
	        'info',
	        'Sélection',
	        check
	            ? `${selectedLists.value.length} ligne(s) sélectionnée(s)`
	            : 'Sélection annulée'
	    );
	};

	const selectableRows = computed(() =>
	    lists.value
	);

	// ------------------------ verification -----------------------------

	const isPasswordValid = (pw = '') => {
	    return (
	        pw.length >= 8 &&
	        /[a-z]/.test(pw) &&
	        /[A-Z]/.test(pw) &&
	        /\d/.test(pw)
	    )
	}	

	return {
		controller,

	    // ------------------ STATE (tableau & filtres)
	    lists,
	    loading,
	    loadingBtn,
	    filters,
	    globalFilter,
	    dt,
	    menuRefs,

	    // ------------------ Pagination
	    rowsPerPage,
	    currentPage,
	    totalRows,
	    totalPages,

	    // ------------------ Sélection
	    selectedLists,
	    isSelected,
	    isAllSelected,
	    listSelected,

	    // ------------------ Formulaire édition
        drawerUse,

	    // ------------------ Méthodes API
	    fetchLists,

	    // ------------------ Filtres & table
	    initFilters,
	    onPage,
	    rowClass,
	    toggleRow,
	    toggleAll,
	    showSelected,
	    selectableRows,

	    // ------------------ Actions UI
	    updateTable,
	    viewTable,

	    // ------------------ Submit
	    changeStatut,

	    // ------------------ Utils
	    formaDateHeure,

	    // ------------------------- format
	    onlyUppercase,
	    onlyNumbers,
	};

}