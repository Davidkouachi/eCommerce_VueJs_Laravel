import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/pages/auth/login.vue';
import User from '@/pages/User.vue';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import Select2 from '@/pages/item/select2.vue';
import DataTable from '@/pages/item/datatable.vue';

import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/authentification', name: 'Login', component: Login, meta: { title: 'Login' } },
  { path: '/', name: 'Home', component: Home, meta: { title: 'Accueil', requiresAuth: true } },
  { path: '/user', name: 'User', component: User, meta: { title: 'Utilisateurs', requiresAuth: true } },
  { path: '/about', name: 'About', component: About, meta: { title: 'À propos', requiresAuth: true } },
  { path: '/select2', name: 'Select2', component: Select2, meta: { title: 'Select2', requiresAuth: true } },
  { path: '/datatable', name: 'DataTable', component: DataTable, meta: { title: 'DataTable', requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // ✅ Tente de restaurer la session si non chargée
  if (!auth.expired) {
    await auth.restoreSession();
  }

  // 🟢 Si connecté et qu’on tente d’aller sur /authentification
  if (to.name === 'Login' && auth.isAuthenticated) {
    return next({ name: 'Home' });
  }

  // 🔒 Si la route est protégée et l’utilisateur non authentifié
  if (to.meta?.requiresAuth && (!auth.isAuthenticated || auth.expired)) {
    auth.logoutLocal(true);
    return next({ name: 'Login' });
  }

  // 🏷️ Mise à jour du titre
  document.title = `${to.meta?.title ?? 'Page'} | Sogamad Santé`;

  next();
});

export default router;
