<template>
    <Fluid>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col justify-center items-center">
                <img height="100" width="100" src="@/assets/img/fiche.png" />
            </div>
        </div>
        <form id="medecinForm" @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full mt-6">
            <div class="grid grid-cols-1 gap-5">
                <!-- Nom -->
                <FloatLabel variant="on">
                    <InputText id="nom" v-model="nom" size="large" class="w-full" variant="filled" :invalid="submitted && !nom" @input="nom = nom.toUpperCase()"/>
                    <label for="nom">Assurance</label>
                </FloatLabel>
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
  	fetchLists: Function,
  	updateRowById: Function,
  	addRow: Function,
  	editMode: Boolean,
  	editUid: [Number, String]
})

const drawerUse = useDrawerStore();
const { showToast } = useToastAlert();

const editMode = ref(false);
const editUid = ref(null);

const nom = ref('')
const checked = ref(false);
const loadingForm = ref(false);
const submitted = ref(false)

const reset = () => {
   	editMode.value = false;
    editUid.value = null;
    nom.value = '';
    checked.value = false;
    submitted.value = false;
};

const formSubmit = async () => {

    submitted.value = true

    if (!nom.value) {
        showToast('warn', 'Alerte', 'Formulaire incomplet')
        return
    }

    if (!checked.value) {
        showToast('warn', 'Alerte', 'Veuillez confirmer les informations');
        return;
    }

    drawerUse.setFooterLoading('DrawerBtn')

   try {

      	const payload = {
	        nom: nom.value,
	    };

	    let res;

	    if (editMode.value) {
	        // UPDATE
	        res = await axios.put(
	            `/api/v1/api_update_assurances/${editUid.value}`,
	            payload
	        );
	    } else {
	        // INSERT
	        res = await axios.post(
	            `/api/v1/api_insert_assurances`,
	            payload
	        );
	    }

	    if (res.status === 200) {

	    	if (editMode.value) {
		    	props.updateRowById?.(editUid.value, {
		            nom: nom.value,
		        })
	        } else {
			    props.addRow?.(res.data.data)
			}

	        showToast('success', 'Succès', res.data.msg);
	        reset()
        	drawerUse.hide()

	    } else {

	        showToast('warn', 'Alerte', res.data.msg);

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

  	nom.value = val.nom;

  }
}, { immediate: true })

watch(() => props.editMode, (val) => {
  editMode.value = val ?? false
}, { immediate: true })

watch(() => props.editUid, (val) => {
  editUid.value = val ?? null
}, { immediate: true })

</script>

