import { defineStore } from 'pinia'

export const useProductUtilsStore = defineStore('productUtils', () => {

    // --- Stock
    function getStockInfo(product) {
        if (product.qte === 0) {
            return { label: 'rupture', class: '!bg-red-600' }
        }

        if (product.qte <= product.qteLimit) {
            return { label: 'stock faible', class: '!bg-orange-500' }
        }

        return { label: 'en stock', class: '!bg-green-600' }
    }

    // --- Pourcentage réduction
    function getDiscountPercent(product) {
        if (!product.prixReduc || product.prixReduc >= product.prix) return 0

        const percent = ((product.prix - product.prixReduc) / product.prix) * 100

        return Math.round(percent)
    }

    // --- Couleur promo
    function getDiscountSeverity(percent) {

        if (percent >= 50) return 'danger'
        if (percent >= 30) return 'warn'
        if (percent >= 10) return 'info'

        return 'success'
    }

    // --- Format prix
    function formatXOF(value) {

        if (!value) return '0 Fcfa'

        return new Intl.NumberFormat('fr-FR')
            .format(value)
            .replace(/,/g, '.')
            + ' Fcfa'
    }

    return {
        getStockInfo,
        getDiscountPercent,
        getDiscountSeverity,
        formatXOF
    }

})