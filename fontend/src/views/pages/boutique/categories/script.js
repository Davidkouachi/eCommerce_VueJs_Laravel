import { ref, onMounted, computed,nextTick, watch } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToastAlert } from '@/function/function/ToastAlert';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useConfirm } from "primevue/useconfirm";
import { useAuthStore } from '@/function/stores/auth';
import { formaDateHeure } from '@/function/services/format';

export function useScript() {

	const auth = useAuthStore();
	const { showToast } = useToastAlert();
	const preloaderSpinner = usePreloaderSpinner();
	const confirm = useConfirm();

	const lists = ref([]);
	const loading = ref(true);
	const loadingBtn = ref(true);
	const filters = ref({});
	const showModal = ref(false);
	const listSelected = ref({});
	const globalFilter = ref('');
	const dt = ref(null);
	const menuRefs = ref({});
	const selectedLists = ref([]);

	// ------------------------ filtre et api -----------------------------

	function initFilters() {

	    filters.value = {
	        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	        nom: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
	    };
	}

	const fetchLists = async (loaderBtn = false, callback) => {
	    loading.value = true;
	    loadingBtn.value = loaderBtn;

	    // Placeholder pendant le chargement
	    lists.value = new Array(10).fill({});

	    try {
	        const res = await axios.get('/api/v1/api_get_roles');

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
	        console.error('Erreur API:', err);
	        lists.value = [];
	        showToast('error', 'Erreur', 'Impossible de charger les processus.');
	    } finally {
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

	const insertTable = () => {
	    showModal.value = true;
	    roles.value = [{ value: '' }]
	    checked.value = false;
	};

	const updateTable = (data) => {
	    editId.value = data.id;

	    role.value = data.nom;
	    checkedEdit.value = false;

	    showEditModal.value = true;
	};

	// ------------------------ ajouter & supprimer une ligne -----------------------------

	const formSubmitInsert = async () => {

	    const rolesValides = roles.value.filter(
		    r => r.value && r.value.trim() !== ''
		)

		if (rolesValides.length === 0) {
		    showToast('warn', 'Alerte', 'Veuillez renseigner au moins un rôle')
		    return
		}

		if (rolesValides.length !== roles.value.length) {
		    showToast('warn', 'Alerte', 'Tous les rôles doivent être renseignés')
		    return
		}

		if (!checked.value) {
	        showToast('warn', 'Alerte', 'Veuillez confirmer les informations');
	        return;
	    }

	    loadingForm.value = true;

	    try {

	        const res = await axios.post('/api/v1/api_insert_roles', {
			    roles: rolesValides.map(r => r.value),
			})

	        if (res.status === 200) {
	            // showToast('success', 'Succès', res.data.msg);

	            let message = ''

				if (res.data.inserted.length > 0) {
				    message += `${res.data.inserted.length} rôle(s) enregistré(s)`
				}

				if (res.data.duplicates.length > 0) {
				    if (message) message += ' ; ' // séparateur
				    message += `Rôles non enregistrés (doublons) : ${res.data.duplicates.join(', ')}`
				}

				if (message) {
				    // choisir le type : success si tout inséré, warn si doublons ou mix
				    const severity = res.data.duplicates.length > 0 ? 'warn' : 'success'

				    showToast(severity, 'Attention', message)
				}

	            showModal.value = false;
	            fetchLists();
	        } else if (res.status === 201) {
	            showToast('info', 'Alerte', res.data.msg);
	        } else {
	            showToast('warn', 'Alerte', res.data.msg);
	        }

	    } catch (err) {
	        showToast('error', 'Erreur', err.response?.data?.msg || 'Erreur serveur');
	    } finally {
	        loadingForm.value = false;
	    }
	};

	const formSubmitUpdate = async () => {

	    if (!role.value) {
	        showToast('warn', 'Alerte', 'Formulaire incomplet');
	        return;
	    }

	    if (!checkedEdit.value) {
	        showToast('warn', 'Alerte', 'Veuillez confirmer les informations');
	        return;
	    }

	    loadingFormEdit.value = true;

	    try {
	        const payload = {
	            nom: role.value,
	        };

            const res = await axios.put(
                `/api/v1/api_update_roles/${editId.value}`,
                payload
            );


	        if (res.status === 200) {
	            showToast('success', 'Succès', res.data.msg);
	            showEditModal.value = false;
	    		editId.value = null;
	            fetchLists();
	        } else if (res.status === 201) {
	            showToast('info', 'Alerte', res.data.msg);
	        } else {
	            showToast('warn', 'Alerte', res.data.msg);
	        }

	    } catch (err) {
	        showToast('error', 'Erreur', err.response?.data?.msg || 'Erreur serveur');
	    } finally {
	        loadingFormEdit.value = false;
	    }
	};

	// ------------------------ supprimer une ligne -----------------------------

	const deleteTable = (event, data) => {
	    confirm.require({
	        target: event.currentTarget,
	        message: 'Voulez-vous continuer ?',
	        icon: 'pi pi-info-circle',
	        rejectProps: {
	            label: 'Non',
	            severity: 'danger',
	            outlined: true
	        },
	        acceptProps: {
	            label: 'Oui',
	            severity: 'success'
	        },
	        accept: async () => {

	            preloaderSpinner.showSpiner(
	                'Opération en cours...', 
	                async () => { 
	                    try {
                      		await deletList(data.id);
	                    } catch (error) {
	                      	console.error(error);
	                    } finally {
	                      	preloaderSpinner.hideSpiner();
	                    }
	                }
	                , 
	                'rgba(255,255,255,0.9)'
	            );
	        },
	        reject: () => {
	            // showToast('info', 'Alerte', 'Opération non éffectuée.');
	        }
	    });
	};

	async function deletList(id) {
	    try {
	        const response = await axios.delete('/api/v1/api_delete_roles/' + id);
	        const data = response.data;

	        preloaderSpinner.hideSpiner();

	        if (response.status === 200) {

	            preloaderSpinner.showSpiner(
	                'Opération terminée, actualisation des données...', 
	                async () => { 
	                    
	                    try {
                      		await fetchLists(
		                        false, 
		                        () => {
		                            preloaderSpinner.hideSpiner();
		                            showToast('success', 'Succès', 'Opération éffectuée');
		                        }
		                    );
	                    } catch (error) {
	                      	console.error(error);
	                    } finally {
	                      	preloaderSpinner.hideSpiner();
	                    }
	                }, 
	                'rgba(255,255,255,0.9)'
	            );

	        } else if (response.status === 201) {
	            showToast('info', 'Informations', data.msg);
	        } else {
	            showToast('warn', 'Attention', data.msg);
	        }
	    } catch (err) {
	        showToast('error', 'Erreur', err.msg || 'Erreur inattendue');
	    }
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
	    lists.value.filter(u => Number(u.nbreUser) === 0)
	);

	// ------------------------ Mise à jour -----------------------------

	const showEditModal = ref(false);
	const editMode = ref(false);
	const editId = ref(null);

	const roles = ref([{ value: '' }])
	const role = ref('')
	const checked = ref(false);
	const checkedEdit = ref(false);
	const loadingForm = ref(false);
	const loadingFormEdit = ref(false);

	const ajouterRole = () => {
	    roles.value.push({ value: '' })
	}

	const supprimerRole = (index) => {
	    if (roles.value.length > 1) {
	        roles.value.splice(index, 1)
	    }
	}

	const supprimerToutRole = () => {
	    roles.value = [{ value: '' }]
	}

	return {
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

	    // ------------------ Formulaire édition
	    editId,
	    role,
	    roles,
	    checked,
	    checkedEdit,
	    loadingForm,
	    loadingFormEdit,

	    // ------------------ Méthodes API
	    fetchLists,
	    deletList,

	    // ------------------ Filtres & table
	    initFilters,
	    onPage,
	    rowClass,
	    toggleRow,
	    toggleAll,
	    showSelected,
	    selectableRows,

	    // ------------------ Actions UI
	    insertTable,
	    updateTable,
	    deleteTable,

	    ajouterRole,
	    supprimerRole,
	    supprimerToutRole,

	    // ------------------ Modal
	    showModal,
	    showEditModal,

	    // ------------------ Submit
	    formSubmitInsert,
	    formSubmitUpdate,

	    // ------------------ Utils
	    formaDateHeure
	};


}