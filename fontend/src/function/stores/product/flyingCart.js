// stores/flyingCart.js
import { defineStore } from 'pinia';

export const useFlyingCartStore = defineStore('flyingCart', () => {
    /**
     * Anime un produit vers un icône cible
     * @param {string|HTMLElement} source - l'élément source ou son sélecteur
     * @param {string|HTMLElement} target - l'élément cible ou son sélecteur
     * @param {Object} options - options facultatives (taille, durée)
     */
    function flyToCart(source, target, options = {}) {
        const { startSize = 50, endSize = 20, duration = 900, delay = 200 } = options;

        const sourceEl = typeof source === 'string' ? document.querySelector(source) : source;
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;

        if (!sourceEl || !targetEl) return;

        const start = sourceEl.getBoundingClientRect();
        const end = targetEl.getBoundingClientRect();

        const img = document.createElement('img');
        img.src = sourceEl.src || sourceEl.dataset.src || '';
        img.className = 'flying-item';

        // 🔥 départ centre image
        img.style.left = `${start.left + start.width / 2}px`;
        img.style.top = `${start.top + start.height / 2}px`;
        img.style.transform = 'translate(-50%, -50%)';

        img.style.width = `${startSize}px`;
        img.style.height = `${startSize}px`;
        img.style.border = '1px solid white';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.style.position = 'fixed';
        img.style.transition = `all 0.8s cubic-bezier(.22,1,.36,1)`;
        img.style.zIndex = '9999';

        document.body.appendChild(img);

        setTimeout(() => {
            img.style.left = `${end.left + end.width / 2}px`;
            img.style.top = `${end.top + end.height / 2}px`;
            img.style.width = `${endSize}px`;
            img.style.height = `${endSize}px`;
            img.style.opacity = '0.5';
        }, delay);

        setTimeout(() => img.remove(), duration);
    }

    return { flyToCart };
});