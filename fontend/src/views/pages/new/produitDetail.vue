<template>
    <div class="card flex flex-col items-center justify-center" v-if="loading">
        <ProgressSpinner 
            style="width: 30px; height: 30px" 
            strokeWidth="8" fill="transparent"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" 
        />
        <div class="mt-[1rem] text-[1rem] font-bold text-gray-500">
            Chargement en cours ...
        </div>
    </div>
    <div v-else >
        <!-- Informations principales -->
        <div class="card rounded">
            <Button
                icon="pi pi-arrow-left"
                label="Retour"
                severity="danger"
                @click="goBack"
            />
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
                                    :value="utilsStore.getStockInfo(product).label"
                                    :class="['absolute border-none !text-white',utilsStore.getStockInfo(product).class]"
                                    size="xlarge"
                                    style="left: 10px; top: 10px"
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
                            {{ product?.category ?? '-' }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="font-bold text-lg text-surface-500">
                            #{{ product?.code ?? '-' }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="font-normal text-4xl text-surface-700">
                            {{ product?.nom ?? '-' }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">

                        <div class="flex flex-col items-start gap-2 mt-auto mb-0">

                            <!-- Si réduction existe -->
                            <template v-if="product.prixReduc">

                                <!-- Nouveau prix -->
                                <span class="font-bold text-3xl text-orange-500">
                                    {{ product?.prixReduc != null ? utilsStore.formatXOF(product.prixReduc) : '0 Fcfa' }}
                                </span>

                                <!-- Ancien prix barré -->
                                <div class="flex items-center gap-2">
                                    <span class="font-normal text-xl line-through text-surface-500">
                                        {{ product?.prix != null ? utilsStore.formatXOF(product.prix) : '0 Fcfa' }}
                                    </span>
                                    <Badge
                                        v-if="utilsStore.getDiscountPercent(product) > 0"
                                        :value="`-${utilsStore.getDiscountPercent(product)}%`"
                                        size="large"
                                        :severity="utilsStore.getDiscountSeverity(utilsStore.getDiscountPercent(product))"
                                    />
                                </div>

                            </template>

                            <!-- Sinon prix normal -->
                            <template v-else>
                                <span class="text-3xl font-bold text-orange-500">
                                    {{ product?.prix != null ? utilsStore.formatXOF(product.prix) : '0 Fcfa' }}
                                </span>
                            </template>

                        </div>
                    </div>
                    <!-- <div class="flex flex-col gap-2 pb-1">
                        <div class="font-normal text-4xl text-surface-800">
                            <Badge
                                :value="utilsStore.getStockInfo(product).label"
                                :class="['border-none !text-white',utilsStore.getStockInfo(product).class]"
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
                            {{ product?.eval ?? '0' }}/5
                        </div>
                        <span class="text-sm text-gray-500">
                            (128 avis)
                        </span>
                    </div>
                    <div class="flex flex-col gap-2 pb-1">
                        <div class="flex gap-2">
                            <Button
                                :severity="product.qte === 0 ? `danger` : `success`"
                                :icon="product.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                :label="product.qte === 0 ? `indisponible` : `Ajouter`"
                                :disabled="product.qte === 0"
                                class="flex-auto whitespace-nowrap"
                            />
                            <Button
                                :icon="favoriteStore.check(product.code) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                variant="outlined"
                                :outlined="!favoriteStore.check(product.code)"
                                class="favorite-btn"
                                @click="favoriteStore.toggle(product.code)"
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
            </div>
        </div>
        <div class="card !bg-orange-500 rounded" >
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
                        v-for="prodSlider in productSlider"
                        :key="prodSlider.id"
                        class="product-card !bg-surface-0 dark:bg-surface-700 rounded m-0 p-0"
                    >
                        <div class="p-0 border border-surface-0 dark:border-surface-900 bg-surface-0 dark:bg-surface-900 rounded flex flex-col h-full">
                            <div class="bg-surface-50 flex justify-center rounded p-0 border-[0.1rem]">
                                <div class="relative w-full h-55">
                                    <img
                                        :id="`product-image-${prodSlider.code}`"
                                        class="w-full h-full object-cover"
                                        imageClass="w-full h-full object-cover"
                                        :src="`https://primefaces.org/cdn/primevue/images/product/${prodSlider.img}`"
                                        :alt="prodSlider.nom"
                                        @click="goToProduct(prodSlider)"
                                    />
                                    <Tag
                                        v-if="prodSlider.qte >= 0"
                                        :value="utilsStore.getStockInfo(prodSlider).label"
                                        :class="['absolute border-none !text-white',utilsStore.getStockInfo(prodSlider).class]"
                                        style="left: 4px; top: 4px"
                                    />
                                    <div class="absolute bg-surface-100 p-0 rounded-[5rem]" style="right: 4px; top: 4px">
                                        <div class="flex items-center justify-center gap-2 justify-center py-1 px-2">
                                            <span class="text-surface-900 font-medium text-[0.9rem]">
                                                {{ prodSlider.eval }}
                                            </span>
                                            <i class="pi pi-star-fill text-yellow-500"></i>
                                        </div>
                                    </div>
                                    <div class="absolute p-1 rounded-[5rem]"
                                        style="right: 4px; top: 30px"
                                        :class="prodSlider.livraison == 1 ? 'bg-green-500' : 'bg-red-500'">
                                        <div class="flex items-center justify-center gap-2 p-1">
                                            <i class="pi pi-truck" :class="prodSlider.livraison == 1 ? 'text-white' : 'text-white'"></i>
                                        </div>
                                    </div>
                                    <!-- <div class="absolute flex justify-center w-14 h-14 rounded-full border-[0.1rem]"
                                      :style="{
                                        right: '10px',
                                        bottom: '-25px',
                                        backgroundImage: `url(https://primefaces.org/cdn/primevue/images/product/${prodSlider.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                      }"
                                    >
                                    </div> -->
                                </div>
                            </div>
                            <div class="pt-6 flex flex-col flex-1" @click="goToProduct(prodSlider)">
                                <div class="flex flex-row justify-between items-start gap-2 mb-1">
                                    <div class="flex-1">
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm" >
                                            {{ prodSlider.category }}
                                        </span>
                                        <div class="text-md font-medium mt-1 line-clamp-1 break-words mt-auto">
                                            {{ prodSlider.nom }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-start gap-0 mt-auto mb-0">

                                    <!-- Si réduction existe -->
                                    <template v-if="prodSlider.prixReduc">

                                        <!-- Nouveau prix -->
                                        <span class="text-lg font-bold text-red-600">
                                            {{ utilsStore.formatXOF(prodSlider.prixReduc) }}
                                        </span>

                                        <!-- Ancien prix barré -->
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm line-through text-blue-800">
                                                {{ utilsStore.formatXOF(prodSlider.prix) }}
                                            </span>
                                            <Badge
                                                v-if="utilsStore.getDiscountPercent(prodSlider) > 0"
                                                :value="`-${utilsStore.getDiscountPercent(prodSlider)}%`"
                                                size="large"
                                                :severity="utilsStore.getDiscountSeverity(utilsStore.getDiscountPercent(prodSlider))"
                                            />
                                        </div>

                                    </template>

                                    <!-- Sinon prix normal -->
                                    <template v-else>
                                        <span class="text-lg font-bold text-blue-800">
                                            {{ utilsStore.formatXOF(prodSlider.prix) }}
                                        </span>
                                    </template>
                                </div>
                            </div>
                            
                            <div class="flex flex-col flex-1"> 
                                
                                <div class="flex flex-col gap-2 mt-auto">

                                    <div class="flex flex-col items-start gap-0 mt-0 mb-0">

                                        <!-- <span class="text-sm text-gray-600">
                                            Livraison rapide garantie sous 3 jours ouvrables
                                        </span> -->

                                    </div>

                                    <div class="flex gap-2">
                                        <Button
                                            :severity="prodSlider.qte === 0 ? `danger` : `success`"
                                            :icon="prodSlider.qte === 0 ? `pi pi-cart-minus` : `pi pi-shopping-cart`"
                                            :label="prodSlider.qte === 0 ? `indisponible` : `Ajouter`"
                                            :disabled="prodSlider.qte === 0"
                                            class="flex-auto whitespace-nowrap"
                                            @click="addToCart(prodSlider)"
                                        />
                                        <!-- <Button
                                            label=""
                                            severity="warn"
                                            icon="pi pi-eye"
                                            @click="goToProduct(item)"
                                        /> -->
                                        <Button
                                            :icon="favoriteStore.check(prodSlider.code) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                                            variant="outlined"
                                            :outlined="!favoriteStore.check(prodSlider.code)"
                                            class="favorite-btn"
                                            @click="favoriteStore.toggle(prodSlider.code)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- bouton droite -->
                <button class="nav-btn right" @click="scrollRight">
                    <i class="pi pi-angle-right"></i>
                </button>

            </div>
        </div>
        <div class="card rounded">
            <div class="flex flex-col gap-4">
                <div class="flex justify-center items-center mb-4">
                    <div class="font-bold text-4xl text-surface-700">
                        Chers clients
                    </div>
                </div>

                <Fieldset
                    v-for="(section,index) in consignes"
                    :key="index"
                    class="!bg-surface-0">

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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { ProductService } from '@/service/ProductList';
import { PhotoService } from '@/service/ProductListDetail';
import { useFavoriteStore } from '@/function/stores/product/favories';
import { useProductUtilsStore  } from '@/function/stores/product/utils';
import { useFlyingCartStore } from '@/function/stores/product/flyingCart'

const favoriteStore = useFavoriteStore()
const utilsStore = useProductUtilsStore()
const flyingCart = useFlyingCartStore()

const router = useRouter()
const route = useRoute()

const goToProduct = (product) => {

    router.push({
        name: 'element_produit_detail',
        params: { code: product.code },
    })
}

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push({ path: '/' }) // route par défaut
    }
}

const loading = ref(true);
const product = ref(null)
const images = ref();
const evaluation = ref(0)
const productSlider = ref([])
const slider = ref(null)

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
        label: product?.livraison === 1 
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

function addToCart(item) {
    flyingCart.flyToCart(
        `#product-image-${item.code}`,
        '#global-cart-icon',
        { startSize: 50, endSize: 20 }
    )
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

const loadProduct = async () => {

    loading.value = true
    const code = route.params.code
    // const code = route.query.fromProductCode

    const res = await ProductService.getProductById(code)

    if (!res) {
        console.log("Produit introuvable")
        return
    }

    product.value = res
    evaluation.value = res.eval ?? 0

    const imagesData = await PhotoService.getImages()
    images.value = imagesData

    const sliderData = await ProductService.getProductsSmall()
    productSlider.value = sliderData.slice(0, 9)

    loading.value = false
}

onMounted(() => {
  loadProduct()
})

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