<template>
    <Fluid>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col justify-center items-center">
                <img height="100" width="100" src="@/assets/img/docteur.png" />
            </div>
        </div>
        <form id="medecinForm" @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Nom -->
                <FloatLabel variant="on">
                    <InputText id="nom" v-model="nom" size="large" class="w-full" variant="filled" :invalid="submitted && !nom" @input="nom = nom.toUpperCase()"/>
                    <label for="nom">Nom</label>
                </FloatLabel>
                <!-- Prénom -->
                <FloatLabel variant="on">
                    <InputText id="prenom" v-model="prenom" size="large" class="w-full" :invalid="submitted && !prenom" variant="filled" @input="prenom = prenom.toUpperCase()"/>
                    <label for="prenom">Prénom</label>
                </FloatLabel>
                <!-- Email -->
                <FloatLabel variant="on">
                    <InputText id="email" type="email" v-model="email" size="large" class="w-full" :invalid="submitted && !email" variant="filled" />
                    <label for="email">Email</label>
                </FloatLabel>
                <!-- Téléphone -->
                <FloatLabel variant="on">
                    <InputMask id="telephone" v-model="telephone" size="large" class="w-full" mask="9999999999" inputmode="numeric" pattern="[0-9]*" :invalid="submitted && !telephone" variant="filled" />
                    <label for="telephone">Téléphone</label>
                </FloatLabel>
                <!-- Titre (DR / Professeur) -->
                <div class="flex gap-2 w-full">
                    <FloatLabel variant="on" class="flex-1">
                        <Select v-model="titre_id" :options="titresOptions" optionLabel="label" optionValue="value" class="w-full" size="large" filter :loading="loadingSelectTitre" emptyMessage="Aucune donnée disponible" emptyFilterMessage="Aucun résultat trouvé" :invalid="submitted && !titre_id" variant="filled" />
                        <label>Titre</label>
                    </FloatLabel>
                    <Button icon="pi pi-refresh" size="large" severity="secondary" :loading="loadingSelectTitreRefresh" :disabled="loadingSelectTitreRefresh" @click="fetchTitre(true)" variant="filled" />
                </div>
                <!-- Spécialité -->
                <div class="flex gap-2 w-full">
                    <FloatLabel variant="on" class="flex-1">
                        <Select v-model="specialite_id" id="specialite_id" :options="specialiteOptions" optionLabel="label" optionValue="value" class="w-full" size="large" filter :loading="loadingSelectSpecialite" emptyMessage="Aucune donnée disponible" emptyFilterMessage="Aucun résultat trouvé" :invalid="submitted && !specialite_id" variant="filled" />
                        <label for="specialite_id">Spécialité</label>
                    </FloatLabel>
                    <Button icon="pi pi-refresh" size="large" severity="secondary" :loading="loadingSelectSpecialiteRefresh" :disabled="loadingSelectSpecialiteRefresh" @click="fetchSpecialite(true)" variant="filled" />
                </div>
                <!-- Numéro d’ordre -->
                <FloatLabel variant="on">
                    <InputText id="numero_ordre" v-model="numero_ordre" size="large" class="w-full" variant="filled" />
                    <label for="numero_ordre">Numéro d’ordre</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select v-model="ajouterAcces" :options="accesOptions" optionLabel="label" optionValue="value" class="w-full" size="large" placeholder="" variant="filled" />
                    <label>Ajouter / Modifier accès ?</label>
                </FloatLabel>
                <template v-if="ajouterAcces">
                    <!-- Login -->
                    <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                        <InputText v-model="login" size="large" class="w-full" :invalid="submitted && ajouterAcces && !login" variant="filled" @input="login = login.toUpperCase()"/>
                        <label>Login</label>
                    </FloatLabel>
                    <!-- Mot de passe -->
                    <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                        <Password id="password" v-model="password" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez votre mot de passe" size="large" autocomplete="off" variant="filled" :invalid="
                      submitted &&
                      ajouterAcces &&
                      (
                          !password ||
                          (cpassword && password !== cpassword)
                      )
                  ">
                            <template #header>
                                <div class="font-semibold text-xm mb-4">Conditions</div>
                            </template>
                            <template #footer>
                                <Divider />
                                <ul class="pl-2 my-0 leading-normal text-sm">
                                    <li>✔ 1 minuscule</li>
                                    <li>✔ 1 majuscule</li>
                                    <li>✔ 1 chiffre</li>
                                    <li>✔ 8 caractères minimum</li>
                                </ul>
                            </template>
                        </Password>
                        <label for="password">Mot de passe</label>
                    </FloatLabel>
                    <FloatLabel variant="on" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000' }">
                        <Password id="cpassword" v-model="cpassword" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Confirmer le mot de passe" size="large" autocomplete="off" variant="filled" :invalid="
                      submitted &&
                      ajouterAcces &&
                      (
                          !cpassword ||
                          password !== cpassword
                      )
                  ">
                            <template #header>
                                <div class="font-semibold text-xm mb-4">Conditions</div>
                            </template>
                            <template #footer>
                                <Divider />
                                <ul class="pl-2 my-0 leading-normal text-sm">
                                    <li>✔ 1 minuscule</li>
                                    <li>✔ 1 majuscule</li>
                                    <li>✔ 1 chiffre</li>
                                    <li>✔ 8 caractères minimum</li>
                                </ul>
                            </template>
                        </Password>
                        <label for="cpassword">Confirmer le Mot de passe</label>
                    </FloatLabel>
                </template>
            </div>
            <div class="flex items-center gap-2 mt-4">
                <Checkbox v-model="checked" binary />
                <span>Je confirme les informations</span>
            </div>
        </form>
    </Fluid>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios';
import { useDrawerStore } from '@/function/stores/drawer'
import { useToastAlert } from '@/function/function/ToastAlert';

const props = defineProps({
  	data: Object,
    updateRowByUid: Function,
})

const drawerUse = useDrawerStore();
const { showToast } = useToastAlert();

/* ========================
   State
======================== */

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

/* ========================
   Champs
======================== */

const editUid = ref('')
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

const init = (data) => {
    editUid.value = data.uid;

    nom.value = data?.nom ?? ''
	prenom.value = data?.prenom ?? ''
	email.value = data?.email ?? ''
	telephone.value = data?.telephone ?? ''
	titre_id.value = data?.titre_id ?? null
	specialite_id.value = data?.specialite_id ?? null
	numero_ordre.value = data?.numero_ordre ?? ''
	ajouterAcces.value = false
	login.value = ''
	password.value = ''
	cpassword.value = ''

	loadingForm.value = false
    submitted.value = false

    checked.value = false;

    fetchTitre();
	fetchSpecialite();
};

const reset = () => {
   editUid.value = '';

   nom.value = ''
	prenom.value = ''
	email.value = ''
	telephone.value = ''
	titre_id.value = null
	specialite_id.value = null
	numero_ordre.value = ''
	ajouterAcces.value = false
	login.value = ''
	password.value = ''
	cpassword.value = ''

	loadingForm.value = false
   submitted.value = false

   checked.value = false;
};

const formSubmit = async () => {

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

   if (ajouterAcces.value) {

	    if (!login.value) {
	        showToast('warn', 'Alerte', 'Le login est obligatoire') 
	        return
	    } 

	    if (!password.value || !cpassword.value) {
	        showToast('warn', 'Alerte', 'Le mot de passe est obligatoire')
	        return
	    }

	    if (!isPasswordValid(password.value) || !isPasswordValid(cpassword.value)) {
	        showToast('warn', 'Mot de passe invalide', 'Min 8 caractères, majuscule, minuscule et chiffre') 
	        return
	    }

	    if (password.value !== cpassword.value) {
	        showToast('warn', 'Mot de passe incorrect', 'Les mots de passe ne correspondent pas') 
	        return
	    }
	}

   if (!checked.value) {
      showToast('warn', 'Alerte', 'Veuillez confirmer les informations')
      return
   }

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
      payload.password = password.value
   }

    drawerUse.setFooterLoading('DrawerBtn')

   try {

      const url = `/api/v1/api_update_medecins/${editUid.value}`

      const res = await axios.put(url, payload)

      if (res.status === 200) {

        // props.fetchLists?.()

        const selectedTitre = titresOptions.value.find(t => t.value === titre_id.value) || {}
        const selectedSpecialite = specialiteOptions.value.find(t => t.value === specialite_id.value) || {}

        props.updateRowByUid?.(editUid.value, {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            telephone: telephone.value,
            titre_id: titre_id.value,
            titre:  selectedTitre.label || '',
            specialite_id: specialite_id.value,
            specialite:  selectedSpecialite.label || '',
            numero_ordre: numero_ordre.value || null,

            // ✅ Ajout dynamique du login seulement si ajouterAcces.value
            ...(ajouterAcces.value ? { login: login.value } : {}),
        })
        
        showToast('success', 'Succès', res.data.msg)
        reset()
        drawerUse.hide()

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

       drawerUse.clearFooterLoading()
   }

}

defineExpose(
    { submit: formSubmit }
)

watch(() => props.data, (val) => {
  if (val) {

  	init(val)

  }
}, { immediate: true })

</script>

