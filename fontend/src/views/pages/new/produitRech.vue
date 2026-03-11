<template>
    <Fluid>
        <div class="flex flex-col gap-6 p-0 w-full min-w-0">
            <div class="hidden md:flex flex-col justify-center items-start gap-1">
                <label class="block mb-2 font-medium">Mode d'affichage</label>
                <SelectButton 
                    v-model="localLayout" 
                    :options="['grid','list']" 
                    :allowEmpty="false"
                    class="w-full min-w-0">
                    <template #option="{ option }">
                        <i :class="[option === 'list' ? 'pi pi-list' : 'pi pi-th-large']" />
                    </template>
                </SelectButton>
            </div>
            <!-- Recherche texte -->
            <div>
                <label class="block mb-2 font-medium">Recherche</label>
                <input v-model="localSearchQuery" type="text" placeholder="Nom ou catégorie..." class="w-full px-4 py-2 border rounded-lg" />
            </div>
            <!-- Catégories -->
            <div>
                <label class="block mb-2 font-medium">Choisir une catégorie</label>
                    <!-- <SelectButton 
                        v-model="localSelectedCategory" 
                        :options="props.categoryOptions()" 
                        optionLabel="label" 
                        optionValue="value" 
                        :allowEmpty="true"
                        class="w-full min-w-0"
                        :pt="{ 
                            root: { class: 'flex flex-col gap-2 w-full' }, 
                            button: { class: 'w-full text-left justify-start' } 
                        }" /> -->
                    <Select
                        v-model="localSelectedCategory"
                        :options="props.categoryOptions()"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Choisir une catégorie"
                        filter
                        class="w-full"
                    />
            </div>
            <!-- Filtre par prix -->
            <div class="flex flex-col gap-0">
                <label class="block mb-2 font-medium">Montant</label>
                <div class="flex flex-row gap-2 justify-between min-w-0">
                    <IftaLabel>
                        <InputText
                            v-model="localMinPrix"
                            id="min-price"
                            type="number"
                            inputmode="numeric"
                            class="w-full"
                            placeholder="Min"
                        />
                        <label for="min-price">Min</label>
                    </IftaLabel>

                    <IftaLabel>
                        <InputText
                            v-model="localMaxPrix"
                            id="max-price"
                            type="number"
                            inputmode="numeric"
                            class="w-full"
                            placeholder="Max"
                        />
                        <label for="max-price">Max</label>
                    </IftaLabel>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-medium">Statut Stock</label>
                <!-- <SelectButton 
                    v-model="localSelectedStock" 
                    :options="props.stockOptions()" 
                    optionLabel="label" 
                    optionValue="value" 
                    :allowEmpty="true"
                    class="w-full min-w-0"
                    :pt="{ 
                        root: { class: 'flex flex-row gap-1 w-full' }, 
                        button: { class: 'w-full text-center justify-center' } 
                    }" /> -->
                <Select
                    v-model="localSelectedStock"
                    :options="props.stockOptions()"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choisir un statut"
                    class="w-full"
                />
            </div>
            <div>
                <label class="block mb-2 font-medium">Mode de livraison</label>
                <!-- <SelectButton 
                    v-model="localSelectedLivraison" 
                    :options="props.livraisonOptions()" 
                    optionLabel="label" 
                    optionValue="value" 
                    :allowEmpty="true"
                    class="w-full min-w-0"
                    :pt="{ 
                        root: { class: 'flex flex-row gap-1 w-full' }, 
                        button: { class: 'w-full text-center justify-center' } 
                    }" /> -->
                <Select
                    v-model="localSelectedLivraison"
                    :options="props.livraisonOptions()"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Mode de livraison"
                    class="w-full"
                />
            </div>
        </div>
    </Fluid>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useDialogStore } from '@/function/stores/dialog';

const props = defineProps({
    searchQuery: String,
    minPrix: Number,
    maxPrix: Number,
    selectedLivraison: Number,
    selectedCategory: Number,
    selectedStock: Number,
    layout: String,
    categoryOptions: Function,
    livraisonOptions: Function,
    stockOptions: Function,
    applyFilters: Function,
    reloadloadProducts: Function,
})

const dialogUse = useDialogStore();

// --- refs locales pour éviter readonly
const localSearchQuery = ref(props.searchQuery)
const localSelectedCategory = ref(props.selectedCategory ?? 0)
const localSelectedLivraison = ref(props.selectedLivraison ?? 0)
const localSelectedStock = ref(props.selectedStock ?? 0)
const localLayout = ref(props.layout)
const localMinPrix = ref(props.minPrix ?? 0)
const localMaxPrix = ref(props.maxPrix ?? 1000000)

// --- form submit
const formSubmit = () => {

    props.applyFilters?.({
        searchQuery: localSearchQuery.value,
        selectedCategory: localSelectedCategory.value,
        layout: localLayout.value,
        minPrix: localMinPrix.value,
        maxPrix: localMaxPrix.value,
        selectedLivraison: localSelectedLivraison.value,
        selectedStock: localSelectedStock.value
    })

    dialogUse.hide()
}

const resetSubmit = () => {

    localSearchQuery.value = ''
    localSelectedCategory.value = 0
    localSelectedLivraison.value = 0
    localSelectedStock.value = 0
    localLayout.value = 'grid'
    localMinPrix.value = 0
    localMaxPrix.value = 1000000

    props.reloadloadProducts?.()
    dialogUse.hide()
}

// Watch pour corriger min/max et supprimer les zéros initiaux
watch([localMinPrix, localMaxPrix], ([min, max]) => {
    let minVal = Number(min)
    let maxVal = Number(max)

    // Supprimer les zéros initiaux
    if (!isNaN(minVal)) localMinPrix.value = minVal
    if (!isNaN(maxVal)) localMaxPrix.value = maxVal

    // Ajuster si min > max
    if (minVal > maxVal) localMaxPrix.value = minVal
    if (maxVal < minVal) localMinPrix.value = maxVal
})

// --- exposer submit pour drawer
defineExpose(
    { 
        submit: formSubmit,
        reset: resetSubmit
    }
)
</script>