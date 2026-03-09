<template>
    <TitrePage />

    <Fluid>

        <form @submit.prevent="submitForm" class="">

            <div class="card flex flex-col items-center justify-center" v-if="loadingPage">
                <ProgressSpinner 
                    style="width: 30px; height: 30px" 
                    strokeWidth="8" fill="transparent"
                    animationDuration=".5s" aria-label="Custom ProgressSpinner" 
                />
                <div class="mt-[1rem] text-[1rem] font-bold text-gray-500">
                    Chargement en cours ...
                </div>
            </div>

            <div v-else>

                <div class="card">
                    <Fieldset legend="Niveau de configuration">
                        <ProgressBar
                            :value="configLevel"
                            :showValue="true"
                            :valueColor="getConfigColor(configLevel)"
                        ></ProgressBar>
                        <p class="text-center mt-2">{{ configLevel }}% complété</p>
                    </Fieldset>
                </div>

                <div class="card">
                    <Fieldset legend="Logo">
                        <div class="flex flex-col items-center gap-4">
                            <img
                                v-if="logoPreview"
                                :src="logoPreview"
                                class="border-[0.1rem] shadow-md h-[10rem] w-[10rem] rounded-full"
                            />
                            <img
                                v-else
                                src="@/assets/img/camera.jpg"
                                class="border-[0.1rem] shadow-md h-[10rem] w-[10rem] rounded-full"
                            />
                            <FileUpload mode="basic" accept="image/png,image/jpeg,image/webp" customUpload auto @select="onLogoChange" class="p-button-outlined" choose-label="Choisir" />
                            <label class="mt-2 text-center text-gray-600">
                                Importer le logo (PNG, JPG, WEBP – max 1Mo)
                            </label>
                            <label class="text-center text-gray-600">
                                Le logo apparaîtra sur tous les documents générés, exportés ou imprimés par le logiciel.
                            </label>
                        </div>
                    </Fieldset>
                </div>

                <div class="card">
                    <Fieldset legend="Identité">

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex flex-col grow gap-2">
                                <label>Nom de la clinique *</label>
                                <InputText v-model="form.nom" variant="filled"/>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4  mt-4">
                            <div class="flex flex-col grow gap-2">
                                <label>Sigle / Abréviation</label>
                                <InputText v-model="form.sigle" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Type de structure *</label>
                                <Select
                                    v-model="form.type_structure"
                                    :options="types"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Sélectionner"
                                    variant="filled"
                                />
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Numéro d’agrément</label>
                                <InputText v-model="form.numero_agrement" variant="filled"/>
                            </div>
                        </div>

                    </Fieldset>
                </div>

                <div class="card">
                    <Fieldset legend="Localisation & contact">
                        <div class="flex flex-col md:flex-row gap-4">

                            <div class="flex flex-col grow gap-2">
                                <label>Pays *</label>
                                <InputText v-model="form.pays" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Ville *</label>
                                <InputText v-model="form.ville" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Commune / Quartier</label>
                                <InputText v-model="form.commune" variant="filled"/>
                            </div>

                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-4">
                            <div class="flex flex-col grow gap-2">
                                <label>Adresse complète</label>
                                <InputText v-model="form.adresse" variant="filled"/>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-4">
                            <div class="flex flex-col grow gap-2">
                                <label>Téléphone principal *</label>
                                <InputMask id="telephone1" v-model="form.telephone1" size="" class="w-full" mask="9999999999" inputmode="numeric" pattern="[0-9]*" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Téléphone secondaire</label>
                                <InputMask id="telephone2" v-model="form.telephone2" size="" class="w-full" mask="9999999999" inputmode="numeric" pattern="[0-9]*" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Email officiel</label>
                                <InputText v-model="form.email" type="email" variant="filled"/>
                            </div>
                        </div>
                    </Fieldset>
                </div>

                <div class="card">
                    <Fieldset legend="Paramètres généraux">
                        <div class="flex flex-col md:flex-row gap-4">

                            <div class="flex flex-col grow gap-2">
                                <label>Devise *</label>
                                <Select
                                    v-model="form.devise"
                                    :options="currencies"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Sélectionner"
                                    size="large"
                                    variant="filled"
                                />
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Heure d’ouverture</label>
                                <InputText type="time" v-model="form.heure_ouverture" variant="filled"/>
                            </div>

                            <div class="flex flex-col grow gap-2">
                                <label>Heure de fermeture</label>
                                <InputText type="time" v-model="form.heure_fermeture" variant="filled"/>
                            </div>

                        </div>
                    </Fieldset>
                </div>

                <div class="card">
                    <div class="flex flex-wrap gap-2 justify-center">
                        <Button
                            icon="pi pi-save"
                            severity="success"
                            :loading="loading"
                            type="submit"
                            :label="loading ? 'Opération en cours...' : 'Enregistrer'"
                            :fluid="false"
                        />
                    </div>
                </div>
            </div>

        </form>

    </Fluid>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/function/services/axios';
import { useToastAlert } from '@/function/function/ToastAlert';
import TitrePage from '@/layout/elements/TitrePage.vue';
// import './style.css';

const { showToast } = useToastAlert();
const loading = ref(false);
const loadingPage = ref(false);
const configLevel = ref(0); // valeur pour la ProgressBar (0 à 100)

const form = ref({
    nom: '',
    sigle: '',
    type_structure: null,
    numero_agrement: '',
    pays: '',
    ville: '',
    commune: '',
    adresse: '',
    telephone1: '',
    telephone2: '',
    email: '',
    heure_ouverture: '',
    heure_fermeture: '',
    devise: '',
});

const types = [
    { label: 'Clinique', value: 'clinique' },
    { label: 'Cabinet', value: 'cabinet' },
    { label: 'Hôpital', value: 'hopital' },
    { label: 'Centre de santé', value: 'centre de santé' },
    { label: 'Centre médical', value: 'centre médical' },
];

const currencies = [
    { label: 'XOF', value: 'XOF' },
    { label: 'EUR', value: 'EUR' },
    { label: 'USD', value: 'USD' },
];

const paymentMethods = [
    'Espèces',
    'Mobile Money',
    'Carte bancaire',
    'Virement',
    'Chèque',
    'Tiers payant'
];

const MAX_LOGO_SIZE = 1024 * 1024; // 1 Mo
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const logoFile = ref(null);
const logoPreview = ref(null);

// Gestion du changement de fichier
const onLogoChange = (event) => {
    const file = event.files[0];
    if (!file) return;

    // Vérification type
    if (!ALLOWED_TYPES.includes(file.type)) {
        showToast(
            'warn',
            'Format non autorisé',
            'Formats acceptés : PNG, JPG, JPEG, WEBP'
        );
        resetLogo();
        return;
    }

    // Vérification taille
    if (file.size > MAX_LOGO_SIZE) {
        showToast(
            'warn',
            'Fichier trop volumineux',
            'La taille maximale autorisée est de 1 Mo'
        );
        resetLogo();
        return;
    }

    logoFile.value = file;

    // Aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
        logoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const resetLogo = () => {
    logoFile.value = null;
    logoPreview.value = null;
};

const requiredFields = {
    nom: 'Nom de la clinique',
    type_structure: 'Type de structure',

    pays: 'Pays',
    ville: 'Ville',

    telephone1: 'Téléphone principal',
    email: 'Email officel',

    devise: 'Devise',
};

const validateForm = () => {

    // 🔴 Vérification du logo
    if (!logoFile.value && !logoPreview.value) {
        showToast(
            'warn',
            'Logo manquant',
            'Veuillez importer le logo de la clinique'
        );
        return false;
    }

    // 🔴 Vérification des champs obligatoires
    for (const [key, label] of Object.entries(requiredFields)) {
        const value = form.value[key];

        if (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
        ) {
            showToast(
                'warn',
                'Champs manquants',
                `Veuillez renseigner : ${label}`
            );
            return false;
        }
    }

    // 🔴 Vérification logique des heures (si les deux champs sont remplis)
    if (form.value.heure_ouverture && form.value.heure_fermeture) {
        if (form.value.heure_ouverture >= form.value.heure_fermeture) {
            showToast(
                'warn',
                'Heures invalides',
                'L’heure de fermeture doit être postérieure à l’heure d’ouverture'
            );
            return false;
        }
    }

    // 🔴 Vérification email (si renseigné)
    if (form.value.email && form.value.email.trim() !== '') {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(form.value.email)) {
            showToast(
                'warn',
                'Email invalide',
                'Veuillez saisir une adresse email valide'
            );
            return false;
        }
    }

    return true;
};

// Soumission du formulaire
const submitForm = async () => {

    // ⛔ STOP si validation échoue
    if (!validateForm()) return;

    loading.value = true;

    try {
        const payload = new FormData();

        // Ajoute tous les champs du formulaire
        for (const key in form.value) {
            const value = form.value[key];
            if (value !== null && value !== undefined) {
                payload.append(key, value);
            }
        }

        // Ajoute le fichier logo s'il existe
        if (logoFile.value) {
            payload.append('logo', logoFile.value);
        }

        // Pour vérifier le contenu de FormData
        for (let pair of payload.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        const response = await axios.post(
            '/api/v1/api_insert_parametre',
            payload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const res = response.data;

        if (response.status === 200) {
            showToast('success', 'Succès', res.msg);
            console.log('Données enregistrées :', res.data);

            const parametres = res.data?.data || res.data || {};
            configLevel.value = calculateConfigLevel(parametres);

        } else {
            showToast('warn', 'Attention', res.msg);
        }

    } catch (e) {
        if (e.response?.status === 422) {
            showToast('warn', 'Validation', 'Formulaire incomplet');
            console.log(e.response.data.errors);
        } else {
            showToast('error', 'Erreur', e.response?.data?.msg || e.message);
        }
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const loadParametres = async () => {
    loadingPage.value = true;

    try {
        const response = await axios.get('/api/v1/api_get_parametre'); // crée cette route dans Laravel

        if (response.status === 200 && response.data.data) {
            const data = response.data.data;

            // Remplir le formulaire
            for (const key in form.value) {
                if (data[key] !== undefined && data[key] !== null) {
                    form.value[key] = data[key];
                }
            }

            // Prévisualisation du logo si existant
            if (data.logo) {
                logoPreview.value = `${axios.defaults.baseURL}/storage/${data.logo}`;
                console.log(logoPreview.value);
            }

            // Calculer le niveau de configuration
            configLevel.value = calculateConfigLevel(data);

        } else {
            // showToast('warn', 'Attention', 'Impossible de charger les paramètres');
        }

    } catch (e) {
        // showToast('error', 'Erreur', e.response?.data?.msg || e.message);
        console.error(e);
    } finally {
        loadingPage.value = false;
    }
};

const calculateConfigLevel = (data) => {
    const fields = [
        'nom', 'sigle', 'type_structure', 'numero_agrement',
        'pays', 'ville', 'commune', 'adresse',
        'telephone1', 'telephone2', 'email',
        'heure_ouverture', 'heure_fermeture', 'devise', 'logo'
    ];

    let filled = 0;

    fields.forEach((field) => {
        if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
            filled++;
        }
    });

    const percentage = Math.round((filled / fields.length) * 100);
    return percentage;
};

const getConfigColor = (percentage) => {
    if (percentage <= 25) return '#f44336';    // rouge
    if (percentage <= 50) return '#ff9800';    // orange
    if (percentage <= 75) return '#ffeb3b';    // jaune
    return '#4caf50';                           // vert
};

onMounted(() => {
    loadParametres();
});


</script>
