<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <!-- <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Historiques des activitées
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
                            <Button type="button" icon="pi pi-filter-slash" label="Filtre" @click="initFilters" severity="primary"/>
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

                <Column field="id" header="N°" style="width:5%">
                    <template #body="{ index }">
                        <Skeleton v-if="loading" width="2rem" height="1rem"/>
                        <span v-else>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</span>
                    </template>
                </Column>

                <Column field="ip_address" header="Adresse IP" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span 
                            v-else
                            class="font-bold text-md"
                            >{{ data?.ip_address ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="login" header="Login" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span 
                            v-else
                            class="font-bold text-md"
                        >{{ data?.login ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="action" header="Action" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span
                            v-else
                            :class="actionClass(data?.action)"
                            class="font-bold px-2 py-1 rounded text-sm"
                        >
                          {{ data?.action ?? '-' }}
                        </span>
                    </template>
                </Column>

                <Column field="created_at" header="Date & Heure" style="min-width: 10rem">
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

    <Drawer v-if="showModal && listSelected" v-model:visible="showModal" header="Détails" position="right" class="!w-full md:!w-80 lg:!w-[30rem]">
        <div class="p-4 space-y-4">
            <!-- Informations principales -->
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Adresse IP :</span>
                    <span class="text-gray-700">{{ listSelected?.ip_address ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Agent :</span>
                    <span class="text-gray-700">{{ listSelected?.login ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Action :</span>
                    <span 
                        :class="actionClass(listSelected?.action)"
                        class="font-bold px-2 py-1 rounded text-sm"
                    >{{ listSelected?.action ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Table :</span>
                    <span class="text-gray-700">{{ listSelected?.model ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">ID Table:</span>
                    <span class="text-gray-700">{{ listSelected?.model_id ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Motif:</span>
                    <span class="text-gray-700">{{ listSelected?.description ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Type appareil:</span>
                    <span class="text-gray-700">{{ listSelected?.user_agent ?? '-' }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="font-bold text-gray-900">Date & Heure:</span>
                    <span class="text-gray-700">{{ formaDateHeure(listSelected.created_at) ?? '-' }}</span>
                </div>
            </div>
        </div>
    </Drawer>

</template>

<script setup>
import { ref, onMounted, computed,nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const actionClass = (action) => {
    switch (action) {
        case 'insert':
            return 'bg-green-500 text-white'
        case 'update':
            return 'bg-blue-500 text-white'
        case 'delete':
            return 'bg-red-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

const {
        fetchLists,

        // ------------------ function
        viewTable,

        // ------------------ modal
        showModal,
        listSelected,

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

        // ------------------ Filtres & table
        initFilters,
        onPage,
        rowClass,

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