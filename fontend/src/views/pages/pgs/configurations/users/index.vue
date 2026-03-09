<template>
    <TitrePage />

    <Card class="h-full" >
        <template #header>
            <!-- <div class="flex justify-center items-center mt-5">
                <h3 class="font-semibold text-center">
                    Utilisateurs
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
                                icon="pi pi-trash"
                                severity="danger"
                                @click="deleteSelected"
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-filter-slash" 
                                label="Filtre" 
                                @click="initFilters" 
                                severity="info"
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-plus" 
                                label="Ajouter" 
                                @click="insertTable()" 
                                severity="success"
                            />
                            <Button 
                                type="button" 
                                icon="pi pi-refresh" 
                                @click="fetchLists(true)" 
                                severity="warn" 
                                :disabled="loadingBtn" 
                                :loading="loadingBtn" 
                                :label="loadingBtn ? 'en cours...' : 'Actualiser'"
                            />
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
                            :disabled="auth.user && (auth.user.id === data.id || data.statut === 0)"
                        />
                    </template>
                </Column>

                <Column field="id" header="N°" style="width:5%">
                    <template #body="{ index }">
                        <Skeleton v-if="loading" width="2rem" height="1rem"/>
                        <span v-else>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</span>
                    </template>
                </Column>

                <Column field="name" header="Nom" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data?.name ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="email" header="Email" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data?.email ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="login" header="Login" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>{{ data?.login ?? '-' }}</span>
                    </template>
                </Column>

                <Column field="role" header="Rôle" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <span v-else>
                            <Tag 
                                v-if="data?.role"
                                :value="data.role"
                                severity="info"
                            />
                        </span>
                    </template>
                </Column>

                <Column field="statut" header="Compte Vérouilé" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <Tag 
                            v-else
                            :value="data.statut ? 'Non' : 'Oui'"
                            :severity="data.statut ? 'success' : 'danger'"
                        />
                    </template>
                </Column>

                <Column header="Statut" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>
                        <Tag
                            v-else
                            :value="data.is_online ? 'En ligne' : 'Hors ligne'"
                            :severity="data.is_online ? 'success' : 'secondary'"
                        />
                    </template>
                </Column>

                <Column header="Connecté depuis" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Skeleton v-if="loading" width="8rem" height="1rem"/>

                        <Tag
                            v-else-if="data.is_online"
                            :value="formatTime(getConnectedSeconds(data))"
                            severity="info"
                        />

                        <span v-else class="text-gray-400">
                            —
                        </span>
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
                            <SplitButton
                                :model="actionItems(data)" 
                                icon="" 
                                label="Actions" 
                                dropdownIcon="pi pi-cog" 
                                severity="warn" 
                                size="small"
                            />
                            <!-- <Button
                                severity="info" 
                                type="button" 
                                icon="pi pi-pencil" 
                                label="" 
                                @click="updateTable(data)"
                            /> -->
                            <Button
                                severity="danger" 
                                type="button" 
                                icon="pi pi-trash" 
                                label="" 
                                @click="deleteTable($event, data)"
                                v-if="auth.user && auth.user.id !== data.id"
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
        v-model:visible="showEditModal" 
        :header="editMode ? 'Mise à jour' : 'Nouvel utilisateur'" 
        position="full">
        <Fluid>
            <div class="flex">
                <form @submit.prevent="formSubmit" class="flex flex-col gap-4 w-full">
                    <div class="flex justify-center my-4" v-if="editMode">
                        <Chip 
                            label="Lors d’une modification, le mot de passe est facultatif. Laissez le champ vide pour conserver l’ancien mot de passe."
                            icon="pi pi-info-circle"
                            severity="info"
                        />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FloatLabel variant="on">
                            <InputText id="name" type="text" v-model="name" autocomplete="off" size="large"/>
                            <label for="name">Nom</label>
                        </FloatLabel>
                        <FloatLabel variant="on">
                            <InputText id="email" type="email" v-model="email" autocomplete="off" size="large"/>
                            <label for="email">Email</label>
                        </FloatLabel>
                        <FloatLabel variant="on">
                            <Select v-model="role_id" id="role_id" :options="rolesOptions" optionLabel="label" optionValue="value" class="w-full" size="large" filter :loading="loadingSelectRoles" :placeholder="selectPlaceholder"/>
                            <label for="role_id">Rôle</label>
                        </FloatLabel>
                        <FloatLabel variant="on">
                            <InputText id="login" type="text" v-model="login" autocomplete="off" size="large"/>
                            <label for="login">Login</label>
                        </FloatLabel>
                        <FloatLabel variant="on">
                            <Password id="password" v-model="password" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Entrez votre mot de passe" size="large"
                             autocomplete="off">
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
                        <FloatLabel variant="on">
                            <Password id="cpassword" v-model="cpassword" :toggleMask="true" class="" fluid :feedback="true" weakLabel="Petit" mediumLabel="Moyen" strongLabel="Bien" promptLabel="Confirmer le mot de passe" size="large"
                             autocomplete="off">
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
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                        <Checkbox v-model="checked" binary />
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
                                :loading="loadingForm"
                                :label="loadingForm ? 'Opération en cours...' : editMode ? 'Mettre à jour' : 'Enregistrer'"
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
import { ref, onMounted, onUnmounted, computed,nextTick, watch } from 'vue';
import TitrePage from '@/layout/elements/TitrePage.vue';

import { useScript } from './script'

const {
        auth,

        actionItems,

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
        editMode,
        editId,
        checked,
        loadingForm,
        loadingSelectRoles,
        selectPlaceholder,

        // ------------------ Méthodes API
        fetchLists,
        fetchRoles,
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
        // updateTable,
        deleteTable,
        deleteSelected,

        // ------------------ Modal
        showEditModal,

        // ------------------ Submit
        formSubmit,

        // ------------------ Formulaire champ
        name,
        login,
        email,
        password,
        cpassword,
        role_id,
        rolesOptions,

        // ------------------ Utils
        formaDateHeure
} = useScript();

const now = ref(Date.now());
let interval = null;

/* ⏱ formatage du temps */
const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}min`;
    if (m > 0) return `${m}min ${s}s`;
    return `${s}s`;
};

const getConnectedSeconds = (user) => {
    if (!user.is_online || !user.connected_since_at) return null;

    return Math.floor(
        (now.value - new Date(user.connected_since_at)) / 1000
    );
};

onMounted(async () => {
    await fetchLists();

    interval = setInterval(() => {
        now.value = Date.now(); // 1 seule variable réactive
    }, 1000);
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
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
