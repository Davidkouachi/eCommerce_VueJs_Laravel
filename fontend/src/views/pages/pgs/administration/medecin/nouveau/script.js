import { ref, onMounted, computed,nextTick, watch } from 'vue';
import axios from 'axios';
import { useToastAlert } from '@/function/function/ToastAlert';
import { useAuthStore } from '@/function/stores/auth';
import { formaDateHeure } from '@/function/services/format';
import { onlyNumbers, onlyUppercase } from '@/function/format';

export function useScript() {

	const auth = useAuthStore();
	const { showToast } = useToastAlert();

	const nom = ref('')
	const prenom = ref('')
	const email = ref('')
	const telephone = ref('')
	const titre_id = ref(null)
	const specialite_id = ref(null)
	const numero_ordre = ref('')
	const ajouterAcces = ref(false)
	const login = ref('')
	const password = ref('')
	const cpassword = ref('')

	const accesOptions = [
	    { label: 'Oui', value: true },
	    { label: 'Non', value: false }
	]

	const titresOptions = ref([])
	const specialiteOptions = ref([])

	const checked = ref(false);
	const loadingForm = ref(false);
	const loadingSelectSpecialite = ref(false);
	const loadingSelectSpecialiteRefresh = ref(false);
	const loadingSelectTitre = ref(false);
	const loadingSelectTitreRefresh = ref(false);
	const submitted = ref(false)

	const fetchSpecialite = async (refresh) => {
		if(refresh) loadingSelectSpecialiteRefresh.value = true
		loadingSelectSpecialite.value = true

	    try {
	        const res = await axios.get('/api/v1/select_specialite')
	        specialiteOptions.value = res.data.data.map(r => ({
	            label: r.nom,
	            value: r.id
	        }))
	    } catch (e) {
	        showToast('error', 'Erreur', 'Impossible de charger les données')
	    } finally {
	    	loadingSelectSpecialite.value = false
	    	if(refresh) loadingSelectSpecialiteRefresh.value = false
	    }
	}

	const fetchTitre= async (refresh) => {
		if(refresh) loadingSelectTitreRefresh.value = true
		loadingSelectTitre.value = true

	    try {
	        const res = await axios.get('/api/v1/select_tritremedecin')
	        titresOptions.value = res.data.data.map(r => ({
	            label: r.nom,
	            value: r.id
	        }))
	    } catch (e) {
	        showToast('error', 'Erreur', 'Impossible de charger les données')
	    } finally {
	    	loadingSelectTitre.value = false
	    	if(refresh) loadingSelectTitreRefresh.value = false
	    }
	}

	const formSubmit = async () => {

	    /* =========================
	       1️⃣ Vérifications de base
	    ========================== */
	    submitted.value = true

	    if (
	        !nom.value ||
	        !prenom.value ||
	        !email.value ||
	        !telephone.value ||
	        !titre_id.value ||
	        !specialite_id.value
	    ) {
	        showToast('warn', 'Alerte', 'Veuillez remplir tous les champs obligatoires')
	        return
	    }

	    /* =========================
	       2️⃣ Gestion des accès
	    ========================== */
	    if (ajouterAcces.value) {

	        if (!login.value) {
	            showToast('warn', 'Alerte', 'Le login est obligatoire')
	            return
	        }

	        // En création OU si password saisi en édition
	        if (!cpassword.value || password.value) {

	            if (
	                !isPasswordValid(password.value) ||
	                !isPasswordValid(cpassword.value)
	            ) {
	                showToast(
	                    'warn',
	                    'Mot de passe invalide',
	                    'Min 8 caractères, majuscule, minuscule et chiffre'
	                )
	                return
	            }

	            if (password.value !== cpassword.value) {
	                showToast(
	                    'warn',
	                    'Mot de passe incorrect',
	                    'Les mots de passe ne correspondent pas'
	                )
	                return
	            }
	        }
	    }

	    /* =========================
	       3️⃣ Confirmation utilisateur
	    ========================== */
	    if (!checked.value) {
	        showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
	        return
	    }

	    loadingForm.value = true

	    try {
	        /* =========================
	           4️⃣ Payload intelligent
	        ========================== */
	        const payload = {
	            nom: nom.value,
	            prenom: prenom.value,
	            email: email.value,
	            telephone: telephone.value,
	            titre_id: titre_id.value,
	            specialite_id: specialite_id.value,
	            numero_ordre: numero_ordre.value || null,
	            ajouterAcces: ajouterAcces.value
	        }

	        if (ajouterAcces.value) {
	            payload.login = login.value

	            if (password.value) {
	                payload.password = password.value
	            }
	        }

	        console.log(payload)

            const res = await axios.post(
                `/api/v1/api_insert_medecins`,
                payload
            )

	        /* =========================
	           5️⃣ Feedback utilisateur
	        ========================== */
	        if (res.status === 200) {
	            showToast('success', 'Succès', res.data.msg)
	            resetForm()
	        } else {
	            showToast('warn', 'Alerte', res.data.msg)
	        }

	    } catch (err) {
	        showToast(
	            'error',
	            'Erreur',
	            err.response?.data?.msg || 'Erreur serveur'
	        )
	    } finally {
	        loadingForm.value = false
	        submitted.value = false
	    }
	}

	const resetForm = () => {
	    // Champs texte
	    nom.value = ''
	    prenom.value = ''
	    email.value = ''
	    telephone.value = null
	    numero_ordre.value = ''

	    // Selects
	    titre_id.value = null
	    specialite_id.value = null
	    ajouterAcces.value = false

	    // Accès
	    login.value = ''
	    password.value = ''
	    cpassword.value = ''

	    // États
	    checked.value = false

	    loadingForm.value = false
	    submitted.value = false // 🔹 reset validation
	}

	const isPasswordValid = (pw = '') => {
	    return (
	        pw.length >= 8 &&
	        /[a-z]/.test(pw) &&
	        /[A-Z]/.test(pw) &&
	        /\d/.test(pw)
	    )
	}

	return {
	    // ------------------ Formulaire édition
	    formSubmit,
	    checked,
	    loadingForm,
	    loadingSelectSpecialite,
	    loadingSelectSpecialiteRefresh,
	    loadingSelectTitre,
	    loadingSelectTitreRefresh,
	    submitted,

	    // ------------------ Méthodes API
	    fetchSpecialite,
	    fetchTitre,
	    resetForm,

	    // ------------------ Formulaire champ
	    nom,
		prenom,
		email,
		telephone,
		titre_id,
		specialite_id,
		numero_ordre,
		ajouterAcces,
		login,
		password,
		cpassword,
	    titresOptions,
	    accesOptions,
	    specialiteOptions,

	    // ------------------------- format
	    onlyUppercase,
	    onlyNumbers,
	};


}   