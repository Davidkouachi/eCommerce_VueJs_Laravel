<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <!-- <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Rôles
                </h3>
            </div> -->
        </template>
        <template #content>
            <DataTable
                ref="dt"
                :value="lists"
                :rows="rowsPerPage"
                :paginator="true"
                @page="onPage"
                dataKey="id"
                :rowHover="true"
                v-model:selection="selectedLists"
                v-model:filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['nom']"
                scrollable
                scrollHeight="auto"
                :rowClass="rowClass"
                >
                <div class="flex justify-center my-4">
                    <Chip 
                        label="Seules les données actuellement visibles dans le tableau seront exportées. Les filtres appliqués sont automatiquement pris en compte." 
                        icon="pi pi-info-circle" 
                        removable 
                    />
                </div>

                <template #header>
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <FloatLabel variant="in" class="flex-1">
                            <InputText 
                                id="in_label" 
                                v-if="filters.global" 
                                v-model="filters.global.value" 
                                autocomplete="off" 
                            />
                            <label for="in_label">Recherche...</label>
                        </FloatLabel>
                        <div class="flex flex-wrap gap-2 mt-2 md:mt-0">
                            <Button 
                                v-if="selectedLists.length > 0"
                                label="" 
                                icon="pi pi-trash" 
                                severity="danger" 
                                @click="showSelected"
                            />
                            <Button type="button" icon="pi pi-filter-slash" label="Filtre" @click="initFilters" severity="primary"/>
                            <Button type="button" icon="pi pi-plus" label="Ajouter" @click="insertTable()" severity="success"/>
                            <Button type="button" icon="pi pi-refresh" @click="fetchLists(true)" severity="warn" :disabled="loadingBtn" :loading="loadingBtn" :label="loadingBtn ? 'en cours...' : 'Actualiser'"/>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center text-red-600 py-4">
                        <i class="pi pi-info-circle fs-2"></i>
                        <p>Aucune donnée disponible</p>
                    </div>
                </template>

                <Column style="width:2rem" class="p-0">
                     <template #header>
                        <Checkbox
                            binary
                            :modelValue="isAllSelected"
                            :disabled="selectableRows.length === 0"
                            @update:modelValue="toggleAll"
                        />
                    </template>
                    <template #body="{ data }">
                        <Checkbox
                            binary
                            :modelValue="isSelected(data)"
                            @update:modelValue="val => toggleRow(val, data)"
                            :disabled="Number(data.nbreUser) > 0"
                        />
                    </template>
                </Column>

                <Column field="id" header="N°" style="width:5%">
                    <template #body="{ index }">
                        <Skeleton v-if="loading" width="2rem" height="1rem"/>
                        <span v-else>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</span>
                    </template>
                </Column>

                <Column field="nom" header="nom" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data.nom }}</span>
                    </template>
                </Column>

                <Column field="nbreUser" header="Nombre d'utilisateur" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data.nbreUser }}</span>
                    </template>
                </Column>

                <Column field="created_at" header="Date de création" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ formaDateHeure(data.created_at) }}</span>
                    </template>
                </Column>

                <Column header="Actions" style="width:10%">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="6rem" height="2rem" />
                        <div class="flex flex-row gap-2" v-else >
                            <Button
                                severity="info" 
                                type="button" 
                                icon="pi pi-pencil" 
                                label="" 
                                @click="updateTable(data)"
                            />
                            <Button
                                v-if="Number(data.nbreUser) === 0"
                                severity="danger" 
                                type="button" 
                                icon="pi pi-trash" 
                                label="" 
                                @click="deleteTable($event, data)"
                            />
                        </div>
                    </template>
                </Column>

                <template #footer>
                    <div class="flex justify-between items-center p-3">
                        <span>{{ totalRows.toLocaleString() }} lignes trouvées</span>

                        <span>{{ currentPage }} sur {{ totalPages.toLocaleString() }} Page(s)</span>
                    </div>
                </template>
            </DataTable>
        </template>
    </Card>

    <Drawer 
        v-model:visible="showModal" 
        header="Nouveau rôle" 
        position="full">
        <Fluid>
            <div class="flex">
                <form @submit.prevent="formSubmitInsert" class="p-6 flex flex-col gap-4 w-full">
                    <Fieldset legend="Rôle(s)">
                        <div class="p-5">

                            <div class="flex justify-center mb-5">
                                <ButtonGroup>
                                    <Button
                                        label="Ajouter"
                                        icon="pi pi-plus"
                                        severity="info"
                                        @click="ajouterRole"
                                        size="small"
                                    />
                                    <Button
                                        label="Supprimer tout"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        @click="supprimerToutRole"
                                        :disabled="roles.length === 1"
                                        size="small"
                                    />
                                </ButtonGroup>
                            </div>

                            <div class="flex flex-col gap-4">
                                <div
                                    v-for="(role, index) in roles"
                                    :key="index"
                                >
                                    <InputGroup>
                                        <FloatLabel variant="on">
                                            <InputText
                                                v-model="role.value"
                                                size="large"
                                            />
                                            <label>Rôle {{ index + 1 }}</label>
                                        </FloatLabel>

                                        <InputGroupAddon>
                                            <Button
                                                icon="pi pi-trash"
                                                severity="danger"
                                                @click="supprimerRole(index)"
                                                :disabled="roles.length === 1"
                                                size="large"
                                            />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>

                        </div>
                    </Fieldset>

                    <div class="flex items-center gap-2 mt-4">
                        <Checkbox v-model="checked" binary />
                        <span>Je confirme les informations</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <div class="col-6">
                            <Button 
                                label="Annuler" 
                                severity="secondary" 
                                @click="showModal = false"
                                size="large"
                                class="w-full"
                                :fluid="false" 
                            />
                        </div>
                        <div class="col-6">
                            <Button
                                type="submit"
                                icon="pi pi-check"
                                severity="success"
                                :loading="loadingForm"
                                :label="loadingForm ? 'Opération en cours...' : 'Enregistrer'"
                                size="large"
                                class="w-full"
                                :fluid="false"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Fluid>
    </Drawer>

    <Drawer 
        v-model:visible="showEditModal" 
        header="Mise à jour" 
        position="full">
        <Fluid>
            <div class="flex">
                <form @submit.prevent="formSubmitUpdate" class="p-6 flex flex-col gap-4 w-full">
                    <div class="flex flex-col gap-5">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                                <FloatLabel variant="on">
                                    <InputText id="role" type="text" v-model="role" autocomplete="off" size="large"/>
                                    <label for="role">rôle</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                        <Checkbox v-model="checkedEdit" binary />
                        <span>Je confirme les informations</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <div class="col-6">
                            <Button 
                                label="Annuler" 
                                severity="secondary" 
                                @click="showEditModal = false"
                                size="large"
                                class="w-full"
                                :fluid="false" 
                            />
                        </div>
                        <div class="col-6">
                            <Button
                                type="submit"
                                icon="pi pi-check"
                                severity="success"
                                :loading="loadingFormEdit"
                                :label="loadingFormEdit ? 'Opération en cours...' : 'Mettre à jour'"
                                size="large"
                                class="w-full"
                                :fluid="false"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Fluid>
    </Drawer>

</template>

<script setup>
import { ref, onMounted, computed,nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const {
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
} = useScript();

onMounted(() => {
    fetchLists();
});

</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) { font-weight: bold; }
:deep(.p-datatable-scrollable .p-frozen-column) { font-weight: bold; }
:deep(.row-connect-user) {
    background-color: #ccfbf1 !important;
}
:deep(.row-deconnect-user) {
    background-color: #fee2e2 !important;
}
</style>