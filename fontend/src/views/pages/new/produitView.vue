<template>
    <div class="p-4 space-y-4">
        <!-- Informations principales -->
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 p-2 flex flex-col gap-2">
                <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 100%">
                    <template #item="slotProps">
                        <img
                            class="relative w-full h-full object-cover"
                            imageClass="w-full h-full object-cover"
                            :src="slotProps.item.itemImageSrc" 
                            :alt="slotProps.item.alt">
                            <Badge
                                :value="props.getStockInfo(props.data).label"
                                :class="['absolute border-none !text-white',props.getStockInfo(props.data).class]"
                                size="xlarge"
                                style="left: 4px; top: 4px"
                            />
                        </img>
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
                    </template>
                </Galleria>
            </div>
            <div class="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 p-2 flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-md text-surface-500">
                        {{ props.data?.category ?? '-' }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-lg text-surface-500">
                        #{{ props.data?.code ?? '-' }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="font-normal text-4xl text-surface-700">
                        {{ props.data?.nom ?? '-' }}
                    </div>
                </div>
                <div class="flex flex-col gap-2">

                    <div class="flex flex-col items-start gap-2 mt-auto mb-0">

                        <!-- Si réduction existe -->
                        <template v-if="props.data.prixReduc">

                            <!-- Nouveau prix -->
                            <span class="font-bold text-3xl text-orange-500">
                                {{ props.data?.prixReduc != null ? props.formatXOF(props.data.prixReduc) : '0 Fcfa' }}
                            </span>

                            <!-- Ancien prix barré -->
                            <div class="flex items-center gap-2">
                                <span class="font-normal text-xl line-through text-surface-500">
                                    {{ props.data?.prix != null ? props.formatXOF(props.data.prix) : '0 Fcfa' }}
                                </span>
                                <Badge
                                    v-if="props.getDiscountPercent(props.data) > 0"
                                    :value="`-${props.getDiscountPercent(props.data)}%`"
                                    size="large"
                                    :severity="props.getDiscountSeverity(props.getDiscountPercent(props.data))"
                                />
                            </div>

                        </template>

                        <!-- Sinon prix normal -->
                        <template v-else>
                            <span class="text-3xl font-bold text-orange-500">
                                {{ props.data?.prix != null ? props.formatXOF(props.data.prix) : '0 Fcfa' }}
                            </span>
                        </template>

                    </div>
                </div>
                <!-- <div class="flex flex-col gap-2 pb-1">
                    <div class="font-normal text-4xl text-surface-800">
                        <Badge
                            :value="props.getStockInfo(props.data).label"
                            :class="['border-none !text-white',props.getStockInfo(props.data).class]"
                            size="xlarge"
                        />
                    </div>
                </div> -->
                <div class="flex flex-row gap-2 items-center">
                    <div class="font-normal text-4xl text-surface-800">
                        <div class="flex items-center gap-1">
    
                            <template v-for="(star, index) in stars" :key="index">

                                <!-- étoile pleine -->
                                <i
                                    v-if="star === 'full'"
                                    class="pi pi-star-fill text-orange-400 text-xl"
                                ></i>

                                <!-- demi étoile -->
                                <i
                                    v-else-if="star === 'half'"
                                    class="pi pi-star-half text-orange-400 text-xl"
                                ></i>

                                <!-- étoile vide -->
                                <i
                                    v-else
                                    class="pi pi-star text-gray-300 text-xl"
                                ></i>

                            </template>

                        </div>
                    </div>
                    <div class="font-bold text-2xl text-orange-400">
                        {{ props.data?.eval ?? '0' }}/5
                    </div>
                    <span class="text-sm text-gray-500">
                        (128 avis)
                    </span>
                </div>
                <div class="flex flex-col gap-2 pb-1">
                    <div class="flex gap-2">
                        <Button
                            :severity="props.data.qte === 0 ? `danger` : `success`"
                            :icon="props.data.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                            :label="props.data.qte === 0 ? `indisponible` : `Ajouter`"
                            :disabled="props.data.qte === 0"
                            class="flex-auto whitespace-nowrap"
                        />
                        <Button
                            :icon="favoriteStore.check(props.data.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                            variant="outlined"
                            :outlined="!favoriteStore.check(props.data.id)"
                            class="favorite-btn"
                            @click="favoriteStore.toggle(props.data.id)"
                        />
                    </div>
                </div>
                <div class="border-t pt-5 pb-5">
                    <Fieldset>
                        <template #legend>
                            <div class="flex items-center">
                                <span class="font-bold p-2">A savoir</span>
                            </div>
                        </template>
                        <div class="text-surface-800 flex items-left m-0">
                            <ul class="m-0 list-none surface rounded p-0 flex flex-col gap-1 w-full">
                                <li
                                    v-for="item in desc"
                                    class="p-2 rounded transition-all duration-200 flex items-center justify-content-between" >

                                    <div class="flex flex-1 items-center gap-2">
                                        <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: item.color }">
                                            <i :class="item.icon"></i>
                                        </span>
                                        <span class="font-bold">{{ item.label }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Fieldset>
                </div>
                <div class="flex flex-col gap-2 ">
                    <Message severity="info">
                        <template #icon>
                            <i class="pi pi-info-circle" ></i>
                        </template>
                        <span class="ml-2">
                            Besoin d'aide pour commander ou Signaler des informations incorrectes liées au produit, appelez nous au 25 20 00 61 61
                        </span>
                    </Message>
                </div>  
            </div>
            <div class="col-span-12">
                <div class="card !bg-orange-500" >
                    <div class="flex justify-center items-center mb-6">
                        <div class="font-bold text-2xl text-surface-0">
                            Articles similaires
                        </div>
                    </div>
                    <div class="relative">

                        <!-- bouton gauche -->
                        <button class="nav-btn left" @click="scrollLeft">
                            <i class="pi pi-angle-left"></i>
                        </button>

                        <!-- slider -->
                        <div ref="slider" class="carousel-slider">
                            <div
                                v-for="product in products"
                                :key="product.id"
                                class="product-card !bg-surface-0"
                            >
                                <div class="mb-4">
                                    <div class="relative mx-auto">
                                        <img
                                            :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image"
                                            :alt="product.name"
                                            class="w-full rounded"
                                        />

                                        <Tag
                                            :value="product.inventoryStatus"
                                            :severity="getSeverity(product.inventoryStatus)"
                                            class="absolute"
                                            style="left:5px; top:5px"
                                        />
                                    </div>
                                </div>

                                <div class="mb-4 font-medium">
                                    {{ product.name }}
                                </div>

                                <div class="flex justify-between items-center">
                                    <div class="font-semibold text-xl">
                                        ${{ product.price }}
                                    </div>

                                    <span>
                                        <Button icon="pi pi-heart" severity="secondary" variant="outlined"/>
                                        <Button icon="pi pi-shopping-cart" class="ml-2"/>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- bouton droite -->
                        <button class="nav-btn right" @click="scrollRight">
                            <i class="pi pi-angle-right"></i>
                        </button>

                    </div>
                </div>
            </div>
            <div class="col-span-12">
                <div class="card !bg-surface-0 flex flex-col gap-4">

                    <div class="flex justify-center items-center mb-4">
                        <div class="font-bold text-4xl text-surface-700">
                            Chers clients
                        </div>
                    </div>

                    <Fieldset
                        v-for="(section,index) in consignes"
                        :key="index"
                        class="!bg-surface-0"
                    >

                        <template #legend>
                            <div class="flex items-center gap-2 text-lg text-surface-700 font-bold">
                                <i :class="[section.icon, section.color, '']"></i>
                                <span class="font-bold">
                                    {{ section.title }}
                                </span>
                            </div>
                        </template>

                        <ul class="flex flex-col gap-2">

                            <li
                                v-for="(item,i) in section.items"
                                :key="i"
                                class="flex flex-row items-center justify-start gap-3 p-1"
                            >

                                <i :class="[item.icon,'text-surface-600 mt-0']"></i>

                                <span class="text-surface-700 font-medium">
                                    {{ item.label }}
                                </span>

                            </li>

                        </ul>

                    </Fieldset>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { PhotoService } from '@/service/ProductListDetail';
import { useFavoriteStore } from '@/function/stores/product/favories'

const favoriteStore = useFavoriteStore()

const props = defineProps({
    data: Object,
    getStockInfo: Function,
    getDiscountPercent: Function,
    getDiscountSeverity: Function,
    formatXOF: Function,
});

const evaluation = ref(props.data.eval ?? 0);
const stars = computed(() => {
    const rating = evaluation.value
    const result = []

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            result.push('full')
        } else if (rating >= i - 0.5) {
            result.push('half')
        } else {
            result.push('empty')
        }
    }

    return result
})

const desc = ref([
    { 
        label: props.data?.livraison === 1 
            ? 'Livraison gratuite pour cet article' 
            : 'Livraison payante pour cet article', 
        icon: 'pi pi-truck',
        color: 'green'
    },
    { 
        label: 'Livraison rapide garantie sous 3 jours ouvrables', 
        icon: 'pi pi-truck',
        color: 'gray'
    }
])

const consignes = ref([
    {
        title: "Vérification obligatoire à la livraison",
        icon: "pi pi-box",
        color: "text-blue-600",
        items: [
            {
                label: "À la réception de votre colis, veuillez vérifier impérativement son contenu et son état devant le livreur.",
                icon: "pi pi-check-circle"
            },
            {
                label: "Assurez-vous que le colis est complet, intact et conforme à votre commande avant de signer le bon de livraison.",
                icon: "pi pi-check-circle"
            }
        ]
    },
    {
        title: "Délai de retour",
        icon: "pi pi-clock",
        color: "text-orange-500",
        items: [
            {
                label: "Si vous n’êtes pas satisfait, vous disposez d’un délai de X jours après réception pour effectuer le retour.",
                icon: "pi pi-arrow-right"
            },
            {
                label: "Passé ce délai, les retours ne pourront plus être acceptés.",
                icon: "pi pi-exclamation-circle"
            }
        ]
    },
    {
        title: "Conditions de retour",
        icon: "pi pi-refresh",
        color: "text-green-600",
        items: [
            {
                label: "Les articles doivent être dans leur emballage d’origine et non utilisés.",
                icon: "pi pi-check"
            },
            {
                label: "Tous les accessoires et documents doivent être inclus.",
                icon: "pi pi-check"
            }
        ]
    },
    {
        title: "Assistance",
        icon: "pi pi-headphones",
        color: "text-purple-500",
        items: [
            {
                label: "Notre service client reste disponible pour toute question ou assistance concernant votre retour.",
                icon: "pi pi-info-circle"
            }
        ]
    }
])

const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const products = ref([])
const slider = ref(null)

function scrollLeft() {
    slider.value.scrollBy({
        left: -300,
        behavior: "smooth"
    })
}

function scrollRight() {
    slider.value.scrollBy({
        left: 300,
        behavior: "smooth"
    })
}

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

onMounted(() => {
    PhotoService.getImages().then((data) => (images.value = data));
    PhotoService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
});

</script>

<style >
.carousel-slider {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    scroll-snap-type: x mandatory;
    padding: 0.5rem;
}

.carousel-slider::-webkit-scrollbar {
    display: none;
}

.product-card {
    flex: 0 0 220px;
    scroll-snap-align: start;
    background: var(--surface-0);
    border-radius: 10px;
    padding: 1rem;
}


.nav-btn {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    z-index: 10;
    background: white;
    border-radius: 50%;
    padding: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.nav-btn.left {
    left: -10px;
}

.nav-btn.right {
    right: -10px;
}
</style>