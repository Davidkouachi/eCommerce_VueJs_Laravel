<template>
    <div class="flex flex-col">
        <div class="">
            <VirtualScroller 
                :items="chunkedProducts" 
                :itemSize="420"
                :loading="loading" 
                class="w-full" 
                style="height: 80vh">

                <template #header>
                    <div class="flex flex-col gap-3 w-full items-center">
                        <div class="w-full overflow-x-auto">
                            <div class="min-w-max flex justify-center">
                                <SelectButton v-model="selectedCategory" :options="categoryOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                                <template #option="{ option }">
                                    <i :class="[option === 'list' ? 'pi pi-list' : 'pi pi-th-large']" />
                                </template>
                            </SelectButton>
                        </div>
                    </div>
                </template>
                <template #item="{ item: row }">
                    <div class="grid grid-cols-12 gap-4 mt-3">
                        <div v-for="(product, index) in row" :key="index" class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 p-2">
                            <div v-if="!product">
                                <!-- <Skeleton height="400px" /> -->
                            </div>
                            <div v-else class="p-3 border rounded flex flex-col h-full">
                                <img class="w-full h-52 object-cover rounded" :src="`https://primefaces.org/cdn/primevue/images/product/${product.img}`" :alt="product.nom" loading="lazy" />
                                <div class="mt-2 text-sm text-surface-500">{{ product.category }}</div>
                                <div class="font-medium line-clamp-1">{{ product.nom }}</div>
                                <div class="mt-auto font-bold text-blue-800">
                                    {{ formatXOF(product.prixReduc || product.prix) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div> </div>
                </template>
            </VirtualScroller>
        </div>
    </div>
</template>

<script setup>
import { ProductService } from '@/service/ProductList';
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';

const layout = ref('grid');
const options = ref(['grid', 'list']);

const loading = ref(false);
const totalRecords = ref(10000); // idéalement venant du backend

const chunkedProducts = ref([]); // pour VirtualScroller (groupé par ligne)

// IMPORTANT : tableau pré-dimensionné pour VirtualScroller
const products = ref([]);

const selectedCategory = ref('all');

// Chunker les produits en lignes de 6 pour la grille
function chunkProducts(arr, size = 6) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size);
        chunks.push(chunk);
    }
    return chunks;
}

function getStockInfo(product) {
    if (!product) return { label: '', class: '' };

    if (product.qte === 0) {
        return { label: 'rupture', class: '!bg-red-600' };
    }
    if (product.qte <= product.qteLimit) {
        return { label: 'stock faible', class: '!bg-orange-500' };
    }
    return { label: 'en stock', class: '!bg-green-600' };
}

function formatXOF(value) {
    if (!value) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR')
        .format(value)
        .replace(/,/g, '.') + ' FCFA';
}

// Générer chunks filtrés pour VirtualScroller
const filteredChunks = computed(() => {
  const filtered = selectedCategory.value === 'all'
    ? products.value
    : products.value.filter(p => p.category === selectedCategory.value);
  return chunkProducts(filtered, 6);
});

const categoryOptions = computed(() => {
    const loaded = products.value.filter(p => p);
    const unique = [...new Set(loaded.map(p => p.category))];

    return [
        { label: 'Tous', value: 'all' },
        ...unique.map(cat => ({
            label: cat,
            value: cat
        }))
    ];
});

// Simuler un fetch avec delay
onMounted(async () => {
    loading.value = true;
    const allProducts = await ProductService.getProducts();
    products.value = allProducts;
    chunkedProducts.value = chunkProducts(products.value, 6);
    loading.value = false;
});

watchEffect(() => {
    const filtered = selectedCategory.value === 'all'
        ? products.value
        : products.value.filter(p => p.category === selectedCategory.value);

    chunkedProducts.value = chunkProducts(filtered, 6);
});

</script>
