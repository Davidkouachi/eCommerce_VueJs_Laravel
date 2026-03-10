import { defineStore } from 'pinia'
import { nextTick } from 'vue'

export const useProductListStore = defineStore('productList', {
    state: () => ({
        products: [],
        options: ['grid', 'list'],
        totalProducts: 0,
        currentPage: 1,
        first: 0,
        limit: 54,
        scrollY: 0,

        filters: {
            searchQuery: '',
            selectedCategory: 0,
            minPrix: 0,
            maxPrix: 1000000,
            livraison: 0,
            stock: 0,
            layout: 'grid', 
        },

        lastClickedProductCode: null, // 🔥 ici on garde le code du produit

        loaded: false
    }),

    actions: {
        saveScroll() {
            this.scrollY = window.pageYOffset || document.documentElement.scrollTop || 0
            console.log('saved scroll:', this.scrollY)
        },
        saveLastProduct(code) {
            this.lastClickedProductCode = code
            console.log('saved last product code:', code)
        },
        restoreScroll(init) {
            if (this.scrollY) {
                setTimeout(() => {
                    window.scrollTo({ top: this.scrollY, behavior: 'smooth', block: 'center' })
                    console.log('restored scroll:', this.scrollY)
                }, 100)
            }
        },
        resetScroll() {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }, 100)
        },
        scrollToLastProduct() {
            if (this.lastClickedProductCode) {
                setTimeout(() => {
                    const el = document.getElementById(`product-${this.lastClickedProductCode}`)
                    if (el) {
                        console.log('Scrolling to last clicked product:', this.lastClickedProductCode)
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        el.classList.add('product-highlight')
                        setTimeout(() => el.classList.remove('product-highlight'), 1500)
                        this.lastClickedProductCode = null // reset après scroll
                    }
                }, 100)
            }
        }
    }
})