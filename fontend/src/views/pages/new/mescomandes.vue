<template>
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
                    En cours
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


</script>
