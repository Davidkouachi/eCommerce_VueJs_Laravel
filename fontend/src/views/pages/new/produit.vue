<template>
    <div class="flex flex-col" ref="productTop">

        <Toolbar class="!bg-surface-0">
            <template #start>
                <div class="flex justify-center items-center">
                    <div class="font-bold text-2xl text-surface-600">Produits</div>
                </div>
            </template>

            <template #center>
                <div class="hidden md:flex justify-center items-center">
                    <SelectButton 
                        v-model="layout" 
                        :options="options" 
                        :allowEmpty="false"
                    >
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-list' : 'pi pi-th-large']" />
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #end>
                <div class="flex justify-center items-center bg-surface-0 rounded-full">
                    <Button
                        type="button" 
                        icon="pi pi-search" 
                        label="" 
                        @click="openDialogRech()" 
                        severity="warn"
                        variant=""
                        :disabled="products.length === 0"
                    />
                </div>
            </template>
        </Toolbar>
        
        <div v-if="loading" class="flex flex-col gap-4">
            <!-- GRID Skeleton -->
            <div v-if="layout === 'grid'">
                <div class="grid grid-cols-12 gap-2">
                    <div 
                        v-for="i in 20" 
                        :key="i" 
                        class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 p-2">
                        <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <Skeleton width="6rem" height="2rem" />
                                <Skeleton width="3rem" height="1rem" />
                            </div>
                            <div class="flex flex-col items-center gap-4 py-8">
                                <Skeleton width="75%" height="10rem" />
                                <Skeleton width="8rem" height="2rem" />
                                <Skeleton width="6rem" height="1rem" />
                            </div>
                            <div class="flex items-center justify-between">
                                <Skeleton width="4rem" height="2rem" />
                                <Skeleton width="6rem" height="1rem" shape="circle" size="3rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LIST Skeleton -->
            <div v-else>
                <div class="flex flex-col">
                    <div v-for="i in 6" :key="i">
                        <div class="flex flex-col xl:flex-row xl:items-start p-6 gap-6" :class="{ 'border-t border-surface-200 dark:border-surface-700': i !== 0 }">
                            <Skeleton class="!w-9/12 sm:!w-64 xl:!w-40 !h-24 mx-auto" />
                            <div class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-6">
                                <div class="flex flex-col items-center sm:items-start gap-4">
                                    <Skeleton width="8rem" height="2rem" />
                                    <Skeleton width="6rem" height="1rem" />
                                    <div class="flex items-center gap-4">
                                        <Skeleton width="6rem" height="1rem" />
                                        <Skeleton width="3rem" height="1rem" />
                                    </div>
                                </div>
                                <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                                    <Skeleton width="4rem" height="2rem" />
                                    <Skeleton size="3rem" shape="circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DataView 
            v-else 
            :value="products"
            :layout="layout" 
            :emptyMessage="''" 
            :pt="{
                content: { class: '!bg-transparent' },
                root: { class: '!bg-transparent border-none' }
            }">

            <!-- <template #header>

            </template> -->

            <template #grid="slotProps">
                <div class="carousel-grid mt-6">
                    <div 
                        v-for="(item, index) in slotProps.items || []" 
                        :key="index" 
                        class="bg-surface-0 dark:bg-surface-700 rounded m-0 p-0"
                        :id="'product-' + item.code">
                        <div class="p-3 border border-surface-0 dark:border-surface-900 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full" >
                            <div class="bg-surface-0 flex justify-center rounded p-0">
                                <div class="relative h-60 overflow-hidden border-[0.1rem] rounded">
                                    <img
                                        :id="`product-image-${item.code}`"
                                        class="w-full h-full object-cover object-center rounded"
                                        :src="`https://primefaces.org/cdn/primevue/images/product/${item.img}`"
                                        :alt="item.nom"
                                        @click="goToProduct(item)"
                                    />
                                    <!-- <Tag
                                        v-if="item.qte >= 0"
                                        :value="utilsStore.getStockInfo(item).label"
                                        :class="['absolute border-none !text-white',utilsStore.getStockInfo(item).class]"
                                        style="left: 4px; top: 4px"
                                    /> -->
                                    <div class="absolute bg-surface-100 p-0 rounded-[5rem]" style="right: 4px; top: 4px">
                                        <div class="flex items-center justify-center gap-2 justify-center py-1 px-2">
                                            <span class="text-surface-900 font-medium text-[0.9rem]">
                                                {{ item.eval }}
                                            </span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                    </div>
                                    <!-- <div class="absolute p-1 rounded-[5rem]"
                                        style="right: 4px; top: 30px"
                                        :class="item.livraison == 1 ? 'bg-green-500' : 'bg-red-500'">
                                        <div class="flex items-center justify-center gap-2 p-1">
                                            <i class="pi pi-truck" :class="item.livraison == 1 ? 'text-white' : 'text-white'"></i>
                                        </div>
                                    </div> -->
                                    <div class="absolute flex items-center justify-center w-14 h-14 rounded-full bg-surface-100 border-surface-200"
                                      style="{right: '4px',bottom: '4px',}" >
                                        <i class="pi pi-shop font-bold text-surface-0"></i>
                                    </div>
                                    <div class="absolute p-1 rounded-full bg-blue-500 w-12 h-12 flex items-center justify-center"
                                        style="right: 4px; bottom: 4px"
                                        @click="openDialogBoutique">
                                            <i class="pi pi-shop font-normal text-surface-0 !text-[2rem]"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="pt-6 flex flex-col flex-1" @click="goToProduct(item)">
                                <div class="flex flex-row justify-between items-start gap-2 mb-1">
                                    <div class="flex-1">
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm" >
                                            {{ item.category }}
                                        </span>
                                        <div class="text-md font-medium mt-1 line-clamp-1 break-words ">
                                            {{ item.nom }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-start gap-0 mt-auto mb-0">

                                    <!-- Si réduction existe -->
                                    <template v-if="item.prixReduc">

                                        <!-- Nouveau prix -->
                                        <span class="text-lg font-bold text-red-600">
                                            {{ utilsStore.formatXOF(item.prixReduc) }}
                                        </span>

                                        <!-- Ancien prix barré -->
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm line-through text-blue-800">
                                                {{ utilsStore.formatXOF(item.prix) }}
                                            </span>
                                            <Badge
                                                v-if="utilsStore.getDiscountPercent(item) > 0"
                                                :value="`-${utilsStore.getDiscountPercent(item)}%`"
                                                size="large"
                                                :severity="utilsStore.getDiscountSeverity(utilsStore.getDiscountPercent(item))"
                                            />
                                        </div>

                                    </template>

                                    <!-- Sinon prix normal -->
                                    <template v-else>
                                        <span class="text-lg font-bold text-blue-800">
                                            {{ utilsStore.formatXOF(item.prix) }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                            
                            <div class="flex flex-col flex-1 "> 
                                <div class="flex flex-col gap-2 mt-auto">

                                    <div class="flex flex-col items-start gap-0 mt-0 mb-0">

                                        <!-- <span class="text-sm text-gray-600">
                                            Livraison rapide garantie sous 3 jours ouvrables
                                        </span> -->

                                    </div>

                                    <div class="flex gap-2">
                                        <Button
                                            :severity="item.qte === 0 ? `danger` : `success`"
                                            :icon="item.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                            :label="item.qte === 0 ? `indisponible` : `Ajouter`"
                                            :disabled="item.qte === 0"
                                            class="flex-auto whitespace-nowrap"
                                            @click="addToCart(item)"
                                        />
                                        <!-- <Button
                                            label=""
                                            severity="warn"
                                            icon="pi pi-eye"
                                            @click="goToProduct(item)"
                                        /> -->
                                        <Button
                                            :icon="favoriteStore.check(item.code) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                            variant="outlined"
                                            :outlined="!favoriteStore.check(item.code)"
                                            class="favorite-btn"
                                            @click="favoriteStore.toggle(item.code)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </template>

            <template #list="slotProps">
                <div class="flex flex-col mt-2">
                    <div 
                        v-for="(item, index) in slotProps.items || []" 
                        :key="index"
                        :id="'product-' + item.code">
                        <div class="flex flex-col md:flex-row md:items-center p-2 gap-4 bg-surface-0 dark:bg-surface-900 rounded my-2" :class="{ 'border-t border-surface': index !== 0 }" @click="goToProduct(item)">
                            <div class="md:w-40 relative border-[0.1rem] rounded">
                                <img
                                    :id="`product-image-${item.code}`"
                                    class="block xl:block mx-auto rounded w-full" 
                                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.img}`" 
                                    :alt="item.nom" />
                                <!-- <div class="absolute p-1 rounded-[5rem]"
                                    style="left: 4px; top: 4px"
                                    :class="item.livraison == 1 ? 'bg-green-500' : 'bg-red-500'">
                                    <div class="flex items-center justify-center gap-2 p-1">
                                        <i class="pi pi-truck" :class="item.livraison == 1 ? 'text-white' : 'text-white'"></i>
                                    </div>
                                </div> -->
                            </div>
                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-2">
                                <div class="flex flex-row md:flex-col justify-between items-start gap-1">
                                    <div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                        <div class="text-lg font-medium mt-1">{{ item.nom }}</div>
                                    </div>
                                    <div class="flex flex-row justify-center items-left gap-1 mt-1">
                                        <div class="bg-surface-0 flex items-center justify-center gap-2 justify-center py-1 px-2 text-[0.9rem] border-[0.1rem] border-yellow-500 rounded-[0.5rem]">
                                            <span class="text-surface-900 font-medium ">{{ item.eval }}</span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                        <!-- <Tag
                                            v-if="item.qte >= 0"
                                            :value="utilsStore.getStockInfo(item).label"
                                            :class="[
                                                'border-none !text-white !text-[0.9rem]',
                                                utilsStore.getStockInfo(item).class
                                            ]"
                                        /> -->
                                    </div>
                                </div>
                                <div class="flex flex-col md:items-end gap-8">
                                    <div class="flex flex-col items-start gap-0 mt-auto mb-0">

                                        <!-- Si réduction existe -->
                                        <template v-if="item.prixReduc">

                                            <!-- Nouveau prix -->
                                            <span class="text-lg font-bold text-red-600">
                                                {{ utilsStore.formatXOF(item.prixReduc) }}
                                            </span>

                                            <!-- Ancien prix barré -->
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm line-through text-blue-800">
                                                    {{ utilsStore.formatXOF(item.prix) }}
                                                </span>
                                                <Badge
                                                    v-if="utilsStore.getDiscountPercent(item) > 0"
                                                    :value="`-${utilsStore.getDiscountPercent(item)}%`"
                                                    size="large"
                                                    :severity="utilsStore.getDiscountSeverity(utilsStore.getDiscountPercent(item))"
                                                />
                                            </div>

                                        </template>

                                        <!-- Sinon prix normal -->
                                        <template v-else>
                                            <span class="text-lg font-bold text-blue-800">
                                                {{ utilsStore.formatXOF(item.prix) }}
                                            </span>
                                        </template>

                                    </div>
                                    <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <Button
                                            :icon="favoriteStore.check(item.code) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                            variant="outlined"
                                            :outlined="!favoriteStore.check(item.code)"
                                            class="favorite-btn"
                                            @click="favoriteStore.toggle(item.code)"
                                        />
                                        <!-- <Button
                                            label=""
                                            severity="warn"
                                            icon="pi pi-eye"
                                            @click="goToProduct(item)"
                                        /> -->
                                        <Button
                                            :severity="item.qte === 0 ? `danger` : `success`"
                                            :icon="item.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                            :label="item.qte === 0 ? `indisponible` : `Ajouter`"
                                            :disabled="item.qte === 0"
                                            class="flex-auto whitespace-nowrap"
                                            @click="addToCart(item)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="px-3 py-2 mt-6 rounded-[0.5rem] bg-surface-0 dark:bg-surface-900 flex flex-col gap-3 w-full justify-center items-center">
                    <div class="flex justify-center items-center">
                        <div class="font-bold text-lg text-red-600">
                            Aucun produit n'a été trouver
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <Button 
                            type="button" 
                            icon="pi pi-refresh" 
                            label="Réinitialiser" 
                            @click="reloadProducts()" 
                            severity="warn"
                        />
                    </div>
                </div>
            </template>

        </DataView>

        <!-- Pagination -->
        <!-- <div v-if="totalPages > 1" class="flex justify-center gap-2 py-6">
            <button 
                class="px-4 py-2 border rounded disabled:opacity-50"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)">
                Précédent
            </button>

            <span class="px-4 py-2">Page {{ currentPage }} / {{ totalPages }}</span>

            <button 
                class="px-4 py-2 border rounded disabled:opacity-50"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)">
                Suivant
            </button>
        </div> -->

        <Paginator
            :rows="limit"
            :totalRecords="totalProducts"
            :first="first"
            @page="onPageChange"
            :rowsPerPageOptions="[18,36,54]"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            class="mt-6"
        />

    </div>
</template>

<script setup>

defineOptions({
    name: 'ProduitList'
})

import { ProductService } from '@/service/ProductList'
import { ref, computed, onMounted, onActivated, watch, markRaw, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useDialogStore } from '@/function/stores/dialog'
import { useFavoriteStore } from '@/function/stores/product/favories'
import { useProductUtilsStore } from '@/function/stores/product/utils'
import { useFlyingCartStore } from '@/function/stores/product/flyingCart'
import { useProductListStore } from '@/function/stores/product/productListStore'

import { useAuthDialogStore } from '@/function/stores/auth/authDialog'

import rechOption from './produitRech.vue'
import dialogBoutique from './dialogBoutique.vue'

const router = useRouter()
const route = useRoute()

const authDialog = useAuthDialogStore()
const dialogUse = useDialogStore()
const favoriteStore = useFavoriteStore()
const utilsStore = useProductUtilsStore()
const flyingCart = useFlyingCartStore()
const productStore = useProductListStore()

/* ---------------------------------------------
   STATE
--------------------------------------------- */

const productTop = ref(null)

const products = computed(() => productStore.products)
const totalProducts = computed(() => productStore.totalProducts)
const currentPage = computed(() => productStore.currentPage)

const loading = ref(false)
const limit = productStore.limit
// const first = ref(productStore.first)

// Pour que la pagination reste sur la bonne page quand on revient
const first = ref((productStore.currentPage - 1) * limit)

const layout = ref(productStore.filters.layout)
const options = ref(productStore.options)

const searchQuery = ref(productStore.filters.searchQuery)
const selectedCategory = ref(productStore.filters.selectedCategory)
const minPrix = ref(productStore.filters.minPrix)
const maxPrix = ref(productStore.filters.maxPrix)
const selectedLivraison = ref(productStore.filters.livraison)
const selectedStock = ref(productStore.filters.stock)

/* ---------------------------------------------
   OPTIONS
--------------------------------------------- */

const livraisonOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'Gratuite', value: 1 },
    { label: 'Payante', value: 2 }
])

const categoryOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'Accessories', value: 1 },
    { label: 'Shoes', value: 2 },
    { label: 'Fashion', value: 3 },
    { label: 'Electronics', value: 4 }
])

const stockOptions = ref([
    { label: 'Tous', value: 0 },
    { label: 'En stock', value: 1 },
    { label: 'Stock faible', value: 2 },
    { label: 'Rupture', value: 3 }
])

/* ---------------------------------------------
   CART ANIMATION
--------------------------------------------- */

async function addToCart(item) {

    const logged = await authDialog.requireLogin()

    if (!logged) {
        return
    }

    flyingCart.flyToCart(
        `#product-image-${item.code}`,
        '#global-cart-icon',
        { startSize: 50, endSize: 20 }
    )

}

/* ---------------------------------------------
   NAVIGATION PRODUIT
--------------------------------------------- */

const goToProduct = async (product) => {
    // Sauvegarde le code du produit dans le store
    productStore.saveLastProduct(product.code)

    // Attend que le DOM soit prêt (utile si la page est KeepAlive ou en cours de rendu)
    await nextTick()

    // Puis navigue vers la page détail
    router.push({
        name: 'element_produit_detail',
        params: { code: product.code }
    })
}

/* ---------------------------------------------
   LOAD PRODUCTS
--------------------------------------------- */

const loadProducts = async (page = 1) => {

    loading.value = true

    const offset = (page - 1) * limit

    const filters = {
        searchQuery: searchQuery.value,
        selectedCategory: selectedCategory.value,
        minPrix: minPrix.value,
        maxPrix: maxPrix.value,
        livraison: selectedLivraison.value,
        stock: selectedStock.value,
        layout: layout.value
    }

    const result = await ProductService.getProductsPaginated(
        offset,
        limit,
        filters
    )

    productStore.products = result.products
    productStore.totalProducts = result.total
    productStore.currentPage = page

    productStore.filters = filters
    productStore.loaded = true

    loading.value = false
}

const reloadProducts = async () => {
    loading.value = true

    // Réinitialise la pagination
    const page = 1
    first.value = 0

    const offset = (page - 1) * limit

    // Tu peux soit réutiliser les filtres actuels, soit remettre les valeurs par défaut
    const filters = {
        searchQuery: '',       // ou '' si tu veux reset
        selectedCategory: 0, // ou 0
        minPrix: 0,               // ou 0
        maxPrix: 1000000,               // ou 1000000
        livraison: 0,   // ou 0
        stock: 0,           // ou 0
        layout: 'grid'                  // ou 'grid'
    }

    const result = await ProductService.getProductsPaginated(
        offset,
        limit,
        filters
    )

    // Mise à jour du store
    productStore.products = result.products
    productStore.totalProducts = result.total
    productStore.currentPage = page
    productStore.filters = filters
    productStore.loaded = true

    // Mise à jour du state local
    loading.value = false

    // Si tu veux remettre le scroll en haut après reload
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------------------------------------------
   PAGINATION
--------------------------------------------- */

const totalPages = computed(() => {
    return Math.ceil(totalProducts.value / limit)
})

const onPageChange = async (event) => {
    productStore.resetScroll()
    first.value = event.first
    const page = event.page + 1
    await loadProducts(page)
}

/* ---------------------------------------------
   SCROLL
--------------------------------------------- */

const scrollY = ref(0)  // 🔥 stocke la position du scroll

// Fonction qui met à jour scrollY
const updateScroll = () => {
  scrollY.value = window.scrollY || document.documentElement.scrollTop
}

// On écoute le scroll au montage du composant
onMounted(() => {
  window.addEventListener('scroll', updateScroll)
})

// On nettoie l'écouteur quand le composant est détruit
onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
})

// Watch pour afficher en temps réel
watch(scrollY, (newVal) => {
    productStore.scrollY = newVal
})

/* ---------------------------------------------
   FILTRES
--------------------------------------------- */
const getFooterButtons = () => [
    {
        id: 'logout',
        label: 'Fermer',
        icon: 'pi pi-times',
        variant: 'outlined',
        severity: 'danger',
        command: () => dialogUse.hide()
    },
    {
        id: 'resetDrawer',
        label: 'Réinitialiser',
        icon: 'pi pi-refresh',
        severity: 'warn',
        command: () => dialogUse.callComponentMethod('reset')
    },
    {
        id: 'submitDrawer',
        label: 'Valider',
        icon: 'pi pi-check',
        severity: 'success',
        command: () => dialogUse.callComponentMethod('submit')
    }
]

const openDialogRech = () => {

    dialogUse.show(
        "Filtre",
        null,
        'top',
        "25rem",
        markRaw(rechOption),
        {

            searchQuery,
            minPrix,
            maxPrix,
            selectedLivraison,
            selectedCategory,
            selectedStock,
            layout,

            categoryOptions: () => categoryOptions.value,
            livraisonOptions: () => livraisonOptions.value,
            stockOptions: () => stockOptions.value,

            applyFilters: ({ 
                searchQuery: newSearch,
                selectedCategory: newCategory,
                layout: newLayout,
                minPrix: newMinPrix,
                maxPrix: newMaxPrix,
                selectedLivraison: newLivraison,
                selectedStock: newStock
            }) => {

                searchQuery.value = newSearch
                selectedCategory.value = newCategory
                layout.value = newLayout
                minPrix.value = newMinPrix
                maxPrix.value = newMaxPrix
                selectedLivraison.value = newLivraison
                selectedStock.value = newStock

                loadProducts(1)

            }

        },
        { footerBtn: getFooterButtons() },
        {
            '1199px': '50rem',
            '575px': '30rem'
        }
    )

}

const openDialogBoutique = () => {

    dialogUse.show(
        'DavCarto',
        null,
        'center',
        "25rem",
        markRaw(dialogBoutique),
        {},
        {},
        {
            '1199px': '50rem',
            '575px': '30rem'
        }
    )

}

/* ---------------------------------------------
   MOUNT
--------------------------------------------- */

onMounted(async () => {

    await nextTick()
    if (!productStore.loaded) {
        await loadProducts(productStore.currentPage)
    }
})

// // Après chargement des produits
// watch(
//     () => productStore.products,
//     async (products) => {
//         if (productStore.loaded && products.length) {
//             await nextTick()
//             productStore.restoreScroll()        // scroll normal si tu revenais de la page produit
//             // productStore.scrollToLastProduct() // scroll vers le produit cliqué
//         }
//     }
// )

/* ---------------------------------------------
   KEEPALIVE RETURN
--------------------------------------------- */

onActivated(async () => {
    // attendre nextTick garantit que le DOM est prêt
    await nextTick()
    console.log('revenu')
    productStore.restoreScroll()
})

/* ---------------------------------------------
   WATCH
--------------------------------------------- */

// watch(
//     () => loading.value,
//     async (isLoading) => {

//         if (!isLoading) {

//             await nextTick()

//         }
//     }
// )

// Comme tu utilises un store Pinia, il vaut mieux synchroniser first.
watch(currentPage, (page) => {
    first.value = (page - 1) * limit
})

</script>

<style>

.carousel-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 640px) {
    .carousel-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .carousel-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 1280px) {
    .carousel-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}
.carousel-grid > div {
    height: 100%;
}
.carousel-grid > div {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.carousel-grid > div:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}



.flying-item {
    position: fixed;
    z-index: 9999;
    transition: all 0.7s cubic-bezier(.22,1,.36,1);
    pointer-events: none;
}



.product-highlight {
    animation: flash 1.5s ease;
}

@keyframes flash {
    0% { background: #fff3cd; }
    100% { background: transparent; }
}
</style>