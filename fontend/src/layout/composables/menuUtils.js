import { ref, onMounted } from 'vue';

export const model = ref([

    // ===================== MENU PRINCIPAL =====================
    {
        label: 'Menu',
        permissions: ['administrateur', 'user'],
        items: [{ 
            label: 'Tableau de Bord', 
            icon: 'pi pi-fw pi-home', 
            to: '/dashboard', 
            permissions: [
                'administrateur', 
                'user'], 
            },
            { 
                label: 'Produit', 
                icon: 'pi pi-table', 
                to: '/', 
                permissions: [
                    'administrateur', 
                    'client'], 
            },
        ]
    },


    // ================= COMMANDES =================
    {
        label: 'Commandes',
        items: [{
                label: 'Toutes les commandes',
                icon: 'pi pi-shopping-bag',
                to: '/orders'
            },
            {
                label: 'En attente',
                icon: 'pi pi-clock',
                to: '/orders/pending'
            },
            {
                label: 'Expédiées',
                icon: 'pi pi-send',
                to: '/orders/shipped'
            },
            {
                label: 'Retours / Remboursements',
                icon: 'pi pi-refresh',
                to: '/orders/refunds'
            }
        ]
    },


    // ================= PRODUITS =================
    {
        label: 'Produits',
        items: [{
                label: 'Tous les produits',
                icon: 'pi pi-box',
                to: '/products'
            },
            {
                label: 'Ajouter un produit',
                icon: 'pi pi-plus',
                to: '/products/create'
            },
            {
                label: 'Catégories',
                icon: 'pi pi-tags',
                to: '/Categories'
            },
            {
                label: 'Stock',
                icon: 'pi pi-database',
                to: '/inventory'
            }
        ]
    },


    // ================= CLIENTS =================
    {
        label: 'Clients',
        items: [{
                label: 'Liste des clients',
                icon: 'pi pi-users',
                to: '/customers'
            },
            {
                label: 'Avis clients',
                icon: 'pi pi-star',
                to: '/reviews'
            }
        ]
    },


    // ================= MARKETING =================
    {
        label: 'Marketing',
        items: [{
                label: 'Coupons / Promotions',
                icon: 'pi pi-percentage',
                to: '/discounts'
            },
            {
                label: 'Campagnes email',
                icon: 'pi pi-envelope',
                to: '/marketing/email'
            },
            {
                label: 'Produits recommandés',
                icon: 'pi pi-megaphone',
                to: '/marketing/recommendations'
            }
        ]
    },


    // ================= ANALYTICS =================
    {
        label: 'Statistiques',
        items: [{
                label: 'Ventes',
                icon: 'pi pi-chart-line',
                to: '/analytics/sales'
            },
            {
                label: 'Produits populaires',
                icon: 'pi pi-chart-bar',
                to: '/analytics/products'
            },
            {
                label: 'Trafic boutique',
                icon: 'pi pi-chart-pie',
                to: '/analytics/traffic'
            }
        ]
    },


    // ================= BOUTIQUE =================
    {
        label: 'Boutique',
        items: [{
                label: 'Apparence',
                icon: 'pi pi-palette',
                to: '/store/theme'
            },
            {
                label: 'Pages',
                icon: 'pi pi-file',
                to: '/store/pages'
            },
            {
                label: 'Navigation',
                icon: 'pi pi-sitemap',
                to: '/store/menu'
            }
        ]
    },


    // ================= PARAMETRES =================
    {
        label: 'Paramètres',
        items: [{
                label: 'Informations boutique',
                icon: 'pi pi-shop',
                to: '/settings/store'
            },
            {
                label: 'Paiements',
                icon: 'pi pi-credit-card',
                to: '/settings/payments'
            },
            {
                label: 'Livraisons',
                icon: 'pi pi-truck',
                to: '/settings/shipping'
            },
            {
                label: 'Utilisateurs',
                icon: 'pi pi-user-edit',
                to: '/settings/users'
            }
        ]
    }


]);

export function findBreadcrumb(menu, to, path = []) {
  for (const item of menu) {
    const currentPath = [...path, { label: item.label, icon: item.icon, to: item.to }];
    if (item.to === to) return currentPath;
    if (item.items) {
      const found = findBreadcrumb(item.items, to, currentPath);
      if (found) return found;
    }
  }
  return null;
}

export function filterMenuByRole(menu, role) {

    return menu
        .map(item => {
            const newItem = { ...item };

            // Filtrage récursif des enfants si existants
            if (Array.isArray(newItem.items)) {
                newItem.items = filterMenuByRole(newItem.items, role);
            }

            const hasChildren = Array.isArray(newItem.items) && newItem.items.length > 0;
            const isAllowed = hasPermission(newItem, role);

            // Cas 1 : item sans label → conteneur technique
            if (!newItem.label) {
                return hasChildren ? newItem : null;
            }

            // Cas 2 : item avec permissions définies
            if (Array.isArray(newItem.permissions) && newItem.permissions.length > 0) {
                return isAllowed ? newItem : null;
            }

            // Cas 3 : item sans permissions → visible pour tous
            // On le garde si : il n'a pas de permissions ou si il a des enfants visibles
            if (hasChildren || !newItem.permissions || newItem.permissions.length === 0) {
                return newItem;
            }

            // Sinon on le supprime
            return null;
        })
        .filter(Boolean);
}

// Vérifie si le rôle a accès à l'item
function hasPermission(item, role) {
    if (!Array.isArray(item.permissions) || item.permissions.length === 0) {
        // Pas de permissions → accessible pour tous
        // console.log(`      🔍 "${item.label || '(sans label)'}" n'a pas de permissions, donc accessible ✅`);
        return true;
    }

    const result = item.permissions.includes(role);
    // console.log(`      🔍 Vérification permission pour "${item.label}":`, result);
    return result;
}

