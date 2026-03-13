<template>
    <div class="mb-6">
        <Menubar >
            <template #start>
                <img
                    src="@/assets/img/commande.avif"
                    alt="Produit"
                    class="w-[3rem] h-full object-cover"
                />
            </template>
            <template #content>
                
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <!-- <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full md:w-56" />
                    <InputText placeholder="Commande" type="text" class="w-32 sm:w-auto" /> -->
                    <Button icon="pi pi-search" aria-label="Save" />
                </div>
            </template>
        </Menubar>
    </div>
    <div class="card mb-0 h-full">
        <Tabs value="0">
            <TabList class="flex-nowrap items-center overflow-x-auto" >
                <Tab value="0" as="div" class="flex items-center gap-2">
                    <i class="pi pi-clock text-orange-500 !text-xl" />
                    <span class="font-bold whitespace-nowrap">En cours</span>
                    <Badge value="2" />
                </Tab>
                <Tab value="1" as="div" class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-500 !text-xl" />
                    <span class="font-bold whitespace-nowrap">Livrées</span>
                    <Badge value="2" />
                </Tab>
                <Tab value="2" as="div" class="flex items-center gap-2">
                    <i class="pi pi-times-circle text-red-500 !text-xl" />
                    <span class="font-bold whitespace-nowrap">Annulées</span>
                    <Badge value="2" />
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="flex flex-col gap-3">
                        <div v-for="i in 5" :key="i" class="order-card">
                            <div class="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                <!-- Icône / preview -->
                                <div class="flex items-center justify-center">
                                    <!-- <div class="flex items-center justify-center w-16 h-16 rounded bg-surface-400 dark:bg-surface-800 shrink-0">
                                        <i class="pi pi-shopping-bag !text-[2rem] text-white"></i>
                                    </div> -->
                                    <div class="flex items-center justify-center w-16 h-16 rounded bg-surface-400 dark:bg-surface-800 shrink-0 overflow-hidden">
                                        <img
                                            src="@/assets/img/commande.avif"
                                            alt="Produit"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <!-- Infos commande -->
                                <div class="flex flex-col flex-1 gap-1">
                                    <!-- Ligne 1 -->
                                    <div class="flex flex-wrap items-center gap-3">
                                        <span class="font-semibold text-base">
                                            Commande #386879487
                                        </span>
                                        <Tag severity="success" value="Livrée"></Tag>
                                        <span class="text-sm text-surface-500">
                                            3 articles
                                        </span>
                                    </div>
                                    <!-- Ligne 2 -->
                                    <div class="text-sm text-surface-500">
                                        Passée le 10 mars 2026
                                    </div>
                                    <!-- Ligne 3 -->
                                    <div class="text-sm text-surface-600">
                                        Livré entre le jeudi 12 mars et le vendredi 13 mars
                                    </div>
                                </div>
                                <!-- Prix + action -->
                                <div class="flex flex-col md:items-end gap-3">
                                    <!-- Prix -->
                                    <div class="flex flex-col items-start md:items-end">
                                        <span class="text-lg font-bold text-primary">
                                            25 000 FCFA
                                        </span>
                                        <span class="text-sm text-surface-500 line-through">
                                            30 000 FCFA
                                        </span>
                                    </div>
                                    <!-- Action -->
                                    <Button label="Voir" icon="pi pi-eye" severity="info" size="small" class="w-full md:w-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-3">
                        <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]">
                            <template #start="slotProps">
                                Page: {{ slotProps.state.page }}
                                First: {{ slotProps.state.first }}
                                Rows: {{ slotProps.state.rows }}
                            </template>
                            <template #end>
                                <Button type="button" icon="pi pi-search" />
                            </template>
                        </Paginator>
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    Livrer
                </TabPanel>
                <TabPanel value="2">
                    Annuler
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToastAlert } from '@/function/function/ToastAlert';
import axios from '@/function/services/axios';

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
</script>
