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
                :globalFilterFields="Object.keys(lists[0] || {})"
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
                            <!-- <Button type="button" icon="pi pi-filter-slash" label="Filtre" @click="initFilters" severity="primary"/> -->
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

                <Column sortable field="id" header="N°" style="width:5%">
                    <template #body="{ index }">
                        <Skeleton v-if="loading" width="2rem" height="1rem"/>
                        <span v-else>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</span>
                    </template>
                </Column>

                <Column sortable field="code" header="Code" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.code ?? '-' }}</span>
                    </template>
                </Column>

                <Column sortable field="nom" header="Nom complet" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="10rem" height="1rem"/>
                        <span v-else>
                            {{ data.signe }}.
                            {{ data.nom?.toUpperCase() }}
                            {{ data.prenom
                                ? data.prenom.charAt(0).toUpperCase() + data.prenom.slice(1).toLowerCase()
                                : '' }}
                        </span>
                    </template>
                </Column>

                <Column sortable field="numero_ordre" header="Numéro d'ordre" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.numero_ordre ?? '-' }}</span>
                    </template>
                </Column>

                <Column sortable field="specialite" header="Spécialité" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="12rem" height="1rem"/>
                        <span v-else>{{ data?.specialite ?? '-' }}</span>
                    </template>
                </Column>

                <Column sortable field="statut" header="Statut" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span
                            v-else
                            :class="actionClass(data?.statut)"
                            class="font-bold px-2 py-1 rounded text-sm"
                        >
                          {{ data?.statut_label ?? '-' }}
                        </span>
                    </template>
                </Column>

                <Column sortable field="created_at" header="Date de création" style="min-width: 10rem">
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
                                severity="warn" 
                                type="button" 
                                icon="pi pi-eye" 
                                label=""
                                @click="viewTable(data)"
                            />
                            <Button
                                v-if="data.statut === 1"
                                severity="info" 
                                type="button" 
                                icon="pi pi-pencil" 
                                label="" 
                                @click="updateTable(data)"
                            />
                            <Button
                                type="button" 
                                :severity="data.statut === 1 ? 'danger' : 'success'"
                                :icon="data.statut === 1 ? 'pi pi-lock' : 'pi pi-unlock'"
                                label=""
                                @click="changeStatut(data.uid, data.statut === 1 ? 0 : 1)"
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

</template>

<script setup>
import { ref, onMounted, computed,nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const actionClass = (action) => {
    switch (action) {
        case 1:
            return 'bg-green-500 text-white'
        case 0:
            return 'bg-red-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

const {
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
        dynamicComponent,
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
} = useScript();

onMounted(async () => {
    await nextTick();
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