import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/function/stores/auth';
import { getSecureItem } from "@/function/stores/secureStorage";

/* ===========================================================
   ROUTES — regroupées par sections pour plus de clarté
   =========================================================== */

// 🌟 Pages principales
const corePages = [
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: 'Dashboard', requiresAuth: true } },
];

// 🌟 Pages personnalisées (ton projet)
const customPages = [
    { path: '/Nouvel_utilisateur', name: 'Nouvel_utilisateur', component: () => import('@/views/pages/new/newUser.vue'), meta: { title: 'Nouvel utilisateur', requiresAuth: true } },
    { path: '/List_utilisateur', name: 'List_utilisateur', component: () => import('@/views/pages/new/listUser.vue'), meta: { title: 'Liste des utilisateurs', requiresAuth: true } },
    { path: '/element_basic', name: 'element_basic', component: () => import('@/views/pages/new/element.vue'), meta: { title: 'Element', requiresAuth: true } },
    { path: '/element_chart', name: 'element_chart', component: () => import('@/views/pages/new/graphique.vue'), meta: { title: 'Graphique', requiresAuth: true } },
    { path: '/element_calendrier', name: 'element_calendrier', component: () => import('@/views/pages/new/calendrier.vue'), meta: { title: 'Calendrier', requiresAuth: true } },
    { path: '/element_carte', name: 'element_carte', component: () => import('@/views/pages/new/carte.vue'), meta: { title: 'Carte', requiresAuth: true } },
    { path: '/', name: 'element_produit', component: () => import('@/views/pages/new/produit.vue'), meta: { title: 'Produit' } },
    { path: '/element_produit_detail/:code', name: 'element_produit_detail', component: () => import('@/views/pages/new/produitDetail.vue'), meta: { title: 'Détail Produit' } },
    { path: '/element_mescomandes/', name: 'element_mescomandes', component: () => import('@/views/pages/new/mescomandes.vue'), meta: { title: 'Mes Commandes', requiresAuth: true } },

];

const pgsPagesAdministration = [
    // assurance
    { 
        path: '/assurances', 
        name: 'assurances', 
        component: () => import('@/views/pages/pgs/administration/assurance/index.vue'), 
        meta: { title: 'assurances', requiresAuth: true } 
    },

    // medecin
    { 
        path: '/medecins/formulaire', 
        name: 'medecins_nouveau', 
        component: () => import('@/views/pages/pgs/administration/medecin/nouveau/index.vue'), 
        meta: { title: 'nouveau medecin', requiresAuth: true } 
    },
    { 
        path: '/medecins', 
        name: 'medecins_liste', 
        component: () => import('@/views/pages/pgs/administration/medecin/liste/index.vue'), 
        meta: { title: 'liste medecin', requiresAuth: true } 
    },
    { 
        path: '/medecins/specialites', 
        name: 'medecins_specialites', 
        component: () => import('@/views/pages/pgs/administration/medecin/specialite/index.vue'), 
        meta: { title: 'specialites', requiresAuth: true } 
    },
];
    // configurations
const pgsPagesConfiguration = [
    { 
        path: '/configurations/utilisateurs', 
        name: 'configuration_users', 
        component: () => import('@/views/pages/pgs/configurations/users/index.vue'), 
        meta: { title: 'Utilisateurs', requiresAuth: true } 
    },
    { 
        path: '/configurations/roles', 
        name: 'configuration_roles', 
        component: () => import('@/views/pages/pgs/configurations/roles/index.vue'), 
        meta: { title: 'Rôles', requiresAuth: true } 
    },
    { 
        path: '/configurations/historiques/activites', 
        name: 'configuration_historiques', 
        component: () => import('@/views/pages/pgs/configurations/historique/index.vue'), 
        meta: { title: 'Historiques', requiresAuth: true } 
    },
    { 
        path: '/configurations/parametres', 
        name: 'configuration_parametre', 
        component: () => import('@/views/pages/pgs/configurations/parametre/index.vue'), 
        meta: { title: 'Parametres', requiresAuth: true } 
    },
];

const boutiquePages = [
    { 
        path: '/Categories', 
        name: 'categories', 
        component: () => import('@/views/pages/boutique/categories/index.vue'), 
        meta: { 
            title: 'Categories', 
            requiresAuth: true 
        } 
    },
];

// Routes principales
const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            ...corePages,
            ...customPages,
            ...boutiquePages,
            ...pgsPagesAdministration,
            ...pgsPagesConfiguration,
        ]
    },

    {
        path: '/maintenance',
        name: 'Maintenance',
        component: () => import('@/views/Maintenance.vue'),
        meta: { title: 'Maintenance' }
    },

    {
        path: '/authentification',
        name: 'Authentification',
        component: () => import('@/views/pages/auth/Login.vue'),
        meta: { title: 'Login' }
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { title: 'Page introuvable' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    // // Restaurer session depuis secureStorage si nécessaire
    if (!auth.token) {
        await auth.restoreSession(); // <-- attendre
    }

    // // Rediriger vers Home si déjà connecté et tente d’aller sur login
    // if (to.name === 'Authentification' && auth.isAuthenticated) {
    //     return next({ name: 'element_produit' });
    // }

    // // Protéger les routes nécessitant l’auth
    if (to.meta?.requiresAuth && !auth.isAuthenticated) {
        auth.logoutLocal(true);
        return next({ name: 'element_produit' });
    }

    // Mettre à jour le titre de la page
    document.title = `${to.meta?.title ?? 'Page'} | PGS`;

    next();
});



export default router;
