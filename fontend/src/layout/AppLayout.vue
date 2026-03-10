<template>
    <div class="layout-wrapper" :class="containerClass">
        <div v-if="preloaderSpinner.loadingSpiner" 
             class="preloaderS-overlay" 
             :style="{ backgroundColor: preloaderSpinner.backgroundColor }">
            <ProgressSpinner
                style="width: 30px; height: 30px"
                strokeWidth="8"
                fill="transparent"
                animationDuration=".5s"
            />
            <p class="preloaderS-message">{{ preloaderSpinner.messageSpiner }}</p>
        </div>
        <!-- confimrpopup pour le tableau sur les bouttons -->
        <ConfirmPopup></ConfirmPopup>
        <!-- ConfirmDialog pour la position -->
        <ConfirmDialog group="positioned"></ConfirmDialog>
        <!-- ConfirmDialog avec le point d'interrogation -->
        <ConfirmDialog group="headless" :style="{ width: '25rem' }" :dismissableMask="false">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
                    <div class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                        <i class="pi pi-question !text-4xl"></i>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button severity="success" label="Oui" @click="acceptCallback"></Button>
                        <Button severity="danger" label="Non" variant="outlined" @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <!-- afficher modal pour session expirer -->
        <Dialog :dismissableMask="false" :visible="visibleAuth" pt:root:class="!border-0 !bg-transparent" pt:mask:class="backdrop-blur-sm bg-black/50 !pointer-events-auto">
            <template #container="{ closeCallback }">
                <div style="border-radius: 10px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%)" >
                    <div class="w-[25rem] bg-surface-0 dark:bg-surface-900 py-10 px-2 sm:px-5" style="border-radius: 7px">
                        <form autocomplete="off" @submit.prevent="verifLoginForm">
                            <div class="text-center">
                                <Avatar icon="pi pi-user" class="block mx-auto mb-4 bg-primary" size="xlarge" shape="circle" style="background-image: radial-gradient(circle at left top, var(--p-primary-400), var(--p-primary-700)); color:white;"/>
                                <div class="text-surface-900 dark:text-surface-0 text-xl font-medium mb-4">{{ auth.user?.name || '' }}</div>
                                <span class="text-muted-color font-medium">Votre session a expiré. Veuillez saisir votre mot de passe pour continuer votre travail</span>
                            </div>
                            <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl">
                                <div class="inline-flex flex-col gap-2">
                                    <FloatLabel variant="on">
                                        <Password inputId="password1" v-model="passwordAuth" :toggleMask="true" fluid :feedback="false" size="large"/>
                                        <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium text-xl">Mot de passe</label>
                                    </FloatLabel>
                                </div>
                                <div class="inline-flex flex-col gap-2">
                                    <Button
                                        size="large"
                                        type="submit"
                                        class="w-full"
                                        :loading="loadingAuth"
                                        severity="success"
                                        :disabled="loadingAuth"
                                        :label="loadingAuth ? 'Vérification en cours...' : 'Verfier'"
                                    />
                                    <Button
                                        size="large"
                                        class="w-full"
                                        severity="primary"
                                        :disabled="loadingAuth"
                                        label="Fermer"
                                        @click="hideModalAuthSession"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </template>
        </Dialog>
        <!-- afficher modal pour les recherches produit -->
        <Dialog 
            v-model:visible="dialogUse.loading"
            modal
            :position="dialogUse.position"
            :style="{ width: dialogUse.width }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="flex items-center gap-2">
                    <Avatar v-if="dialogUse.icon" :icon="dialogUse.icon" class="mr-2" size="large" shape="circle" />
                    <span class="font-bold">{{dialogUse.header}}</span>
                </div>
            </template>
            <component
              v-if="dialogUse.component"
              :is="dialogUse.component"
              v-bind="dialogUse.props"
              :ref="el => dialogUse.setComponentRef(el)"
            />
            <!-- <template #footer v-if="dialogUse.propsBtnFotter"> -->
            <template #footer v-if="dialogUse.propsBtnFotter.footerBtn?.length">
                <div class="flex items-center justify-center gap-2 w-full">
                    <Button
                        v-for="item in dialogUse.propsBtnFotter.footerBtn"
                        :key="item.id"
                        :id="item.id"
                        :label="dialogUse.footerLoadingId === item.id && item.loadingLabel
                                ? item.loadingLabel
                                : item.label"
                        :icon="item.icon"
                        :loading ="dialogUse.footerLoadingId === item.id"
                        class="flex-auto"
                        :variant="item.variant"
                        :severity="item.severity"
                        @click="item.command"
                    />
                </div>
            </template>
        </Dialog>
        <!-- afficher modal pour les authentification -->
        <Dialog 
            v-model:visible="authComptes.loading"
            modal
            :dismissableMask="false"
            :closable="false"
            :position="authComptes.position"
            :style="{ width: authComptes.width }">
            <template #header>
                <div class="flex items-center gap-2">
                    <Avatar v-if="authComptes.icon" :icon="authComptes.icon" class="mr-2" size="large" shape="circle" />
                    <span class="font-bold">{{authComptes.header}}</span>
                </div>
            </template>
            <component
              v-if="authComptes.component"
              :is="authComptes.component"
              v-bind="authComptes.props"
              :ref="el => authComptes.setComponentRef(el)"
            />
            <!-- <template #footer v-if="authComptes.propsBtnFotter"> -->
            <template #footer v-if="authComptes.propsBtnFotter.footerBtn?.length">
                <div class="flex items-center justify-center gap-2 w-full">
                    <Button
                        v-for="item in authComptes.propsBtnFotter.footerBtn"
                        :key="item.id"
                        :id="item.id"
                        :label="authComptes.footerLoadingId === item.id && item.loadingLabel
                                ? item.loadingLabel
                                : item.label"
                        :icon="item.icon"
                        :loading ="authComptes.footerLoadingId === item.id"
                        class="flex-auto"
                        :variant="item.variant"
                        :severity="item.severity"
                        @click="item.command"
                    />
                </div>
            </template>
        </Dialog>
        <Drawer
            v-model:visible="drawerUse.loading"
            :position="drawerUse.position"
            :dismissableMask="false"
            :style="{ width: drawerUse.width }">
            <template #header>
                <div class="flex items-center gap-2">
                    <Avatar v-if="drawerUse.icon" :icon="drawerUse.icon" class="mr-2" size="large" shape="circle" />
                    <span class="font-bold">{{drawerUse.header}}</span>
                </div>
            </template>
            <component
              v-if="drawerUse.component"
              :is="drawerUse.component"
              v-bind="drawerUse.props"
              :ref="el => drawerUse.setComponentRef(el)"
            />
            <!-- <template #footer v-if="drawerUse.propsBtnFotter"> -->
            <template #footer v-if="drawerUse.propsBtnFotter.footerBtn?.length">
                <div class="flex items-center gap-2">
                    <Button
                        v-for="item in drawerUse.propsBtnFotter.footerBtn"
                        :key="item.id"
                        :id="item.id"
                        :label="drawerUse.footerLoadingId === item.id && item.loadingLabel
                                ? item.loadingLabel
                                : item.label"
                        :icon="item.icon"
                        :loading ="drawerUse.footerLoadingId === item.id"
                        class="flex-auto"
                        :variant="item.variant"
                        :severity="item.severity"
                        @click="item.command"
                    />
                </div>
            </template>
        </Drawer>
        <app-sidebar ></app-sidebar>
        <div class="layout-main-container" >
            <app-topbar ></app-topbar>
            <div class="layout-main">
                <div v-if="preloader.loading" class="cardPreloader" style="position: relative; min-height: 70vh;">
                    <!-- Preloader -->
                    <div class="contentPreloader active" id="pageLoader">
                        <div class="loader-overlay"></div>
                        <div class="facebook-spinner">
                            <div class="spinner-block block-1"></div>
                            <div class="spinner-block block-2"></div>
                            <div class="spinner-block block-3"></div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <!-- <div class="py-2 mb-1">
                        <nav class="breadcrumb">
                            <span v-for="(item, i) in breadcrumbMenu.items" :key="i">
                              <i :class="item.icon" v-if="item.icon"></i>
                              {{ item.label }}
                              <span class="mx-1" v-if="i < breadcrumbMenu.items.length - 1 ">
                                >
                                </span>
                            </span>
                        </nav>
                    </div> -->
                    <router-view v-slot="{ Component }">
                        <KeepAlive include="ProduitList">
                            <component :is="Component" />
                        </KeepAlive>
                    </router-view>
                </div>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
</template>

<script setup>

import { getSecureItem } from "@/function/stores/secureStorage";
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useLayout } from '@/layout/composables/layout';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import { computed, ref, watch, onMounted, nextTick, watchEffect } from 'vue';
import { useAuthStore } from '@/function/stores/auth';
import { useSwalAlert } from '@/function/function/SwalAlert';
import { usePreloaderStore } from '@/function/stores/preloader';
import { useDrawerStore } from '@/function/stores/drawer';
import { useDialogStore } from '@/function/stores/dialog';
import { useAuthCompteStore } from '@/function/stores/auth/compte';
import { useToastAlert } from '@/function/function/ToastAlert';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/function/services/axios';
import { useBreadcrumbMenuStore } from '@/function/stores/breadcrumbMenu';
import { model, findBreadcrumb } from '@/layout/composables/menuUtils';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const route = useRoute();   // route active
const router = useRouter(); // pour naviguer si besoin
const outsideClickListener = ref(null);
const breadcrumbMenu = useBreadcrumbMenuStore();

const auth = useAuthStore();
const { showSwal } = useSwalAlert();
const { showToast, removeAllToasts, removeAllExcept } = useToastAlert();
const preloader = usePreloaderStore();
const preloaderSpinner = usePreloaderSpinner();
const drawerUse = useDrawerStore();
const dialogUse = useDialogStore();
const authComptes = useAuthCompteStore();

const visibleAuth = ref(false);

const passwordAuth = ref('')
const loadingAuth = ref(false);

let swalShown = false;
let submitting = false;

const hideModalAuthSession = () => {
    // preloaderSpinner.showSpiner('Rédirection en cours...', () => {
    //     setTimeout(() => {
    //         window.location.reload();
    //     }, 1000);
    // });

    visibleAuth.value = false;
    auth.logoutLocal(false);
    
};

const verifLoginForm = async () => {
    if (submitting) return;   // 🔥 empêche 100% des doubles appels
    submitting = true;

    if (!passwordAuth.value) {
        showToast('warn', 'Alerte', 'Mot de passe obligatoire');
        submitting = false;
        return;
    }

    loadingAuth.value = true;

    try {

        const deviceId = getSecureItem("device_id");
        const login = getSecureItem("aL");

        const res = await axios.post('/api/login', {
            login: login,
            password: passwordAuth.value,
            device_id: deviceId,
        });

        if (res.data.success) {

            const { access_token, refresh_token, user, expires_in } = res.data;

            auth.setUserSession(user, expires_in, access_token, refresh_token, deviceId);

            const mainId = showToast(
                'success',
                'Vérification éffectuée',
                `${user.name}, nous sommes heureux de vous revoir 🤝!`,
                3000,
                '1'
            );

            visibleAuth.value = false

        } else if (res.data.info) {
            showToast('info', 'Informations', res.data.message);
        } else if (res.data.warn) {
            showToast('warn', 'Alerte', 'Mot de passe incorrect');
        } else {
            showToast('error', 'Erreur', res.data.message || 'Erreur inconnue');
        }

        loadingAuth.value = false;
        submitting = false;
    } 
    catch (err) {
        showToast('error', 'Erreur', err.message);
        auth.logoutLocal(false)
        loadingAuth.value = false;
        submitting = false;
    } 
    finally {
        loadingAuth.value = false;
        submitting = false;   // 🔥 permet à nouveau un clic, mais jamais double
        passwordAuth.value = '';
    }
};

// const containerClass = computed(() => {
//     return {
//         'layout-overlay': layoutConfig.menuMode === 'overlay',
//         'layout-static': layoutConfig.menuMode === 'static',
//         'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
//         'layout-overlay-active': layoutState.overlayMenuActive,
//         'layout-mobile-active': layoutState.staticMenuMobileActive
//     };
// });

const containerClass = computed(() => {
    // Vérifier si l'utilisateur est connecté et rôle autorisé
    const isAuthorized =
        auth.user && ['administrateur', 'user'].includes(auth.user.role);

    // Déterminer le mode de menu à appliquer
    const menuMode = isAuthorized ? 'static' : 'overlay';

    return {
        'layout-overlay': menuMode === 'overlay',
        'layout-static': menuMode === 'static',
        'layout-static-inactive':
            layoutState.staticMenuDesktopInactive && menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
    };
});

const shouldLockScroll = computed(() => {
    return (
        drawerUse.loading ||
        visibleAuth.value ||
        layoutState.staticMenuMobileActive
    )
})

function hideScroll() {
    console.log('cacher')
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

function showScroll() {
    console.log('afficher')
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

function hideModal() {
    drawerUse.hide()
    dialogUse.hide()
}

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}

router.beforeEach((to, from, next) => {
    if (!auth.expired) preloader.show(); // afficher loader
    next();
});

router.afterEach(() => {
    // Ici on peut attendre un délai pour le loader
    if (!auth.expired) {
        // setTimeout(() => {
            preloader.hide();
        // }, 0.5); // 0.5s ou 2s selon ton besoin
    }
});

watchEffect(() => {
    document.body.style.overflow = shouldLockScroll.value ? 'hidden' : ''
})

// watch(shouldLockScroll, (lock) => {
//     if (lock) {
//         hideScroll()
//     } else {
//         showScroll()
//     }
// })

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

watch( () => auth.expired, async (val) => {
    if (!val || swalShown || auth.manualLogout || auth.isLoggingOut) return;
    swalShown = true;

    hideModal()

    try {
        await auth.logoutServer(true);

        showToast('info', 'Informations', 'Votre session a éxpiré veuillez-vous connecter');
    } catch (error) {
        console.error(error);
    }

    // auth.logoutServer(false);

    // const souvenir = getSecureItem('me');

    // if (souvenir) {
    //     visibleAuth.value = true;
    // } else {

    //     const result = await showSwal({
    //         icon: 'warning',
    //         title: 'Session expirée',
    //         text: 'Votre session a expiré. Veuillez vous reconnecter.',
    //         confirmButtonText: 'Ok',
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //     });

    //     // if (result.isConfirmed) {
    //     //     auth.logoutLocal(false);
    //     // }
    // }

    swalShown = false;
});

// Watcher pour la déconnexion
watch(
  () => auth.isAuthenticated,  // ou () => !!auth.user
  (isAuth) => {
    if (!isAuth) {
      // utilisateur déconnecté

      const currentRoute = router.currentRoute.value;

      // Si la route nécessite l'auth et n'est pas la page produit
      if (currentRoute.meta.requiresAuth) {
        router.replace({ path: '/' });
      }
      // sinon on ne fait rien
    }
  },
  { immediate: false } // pas besoin de trigger au montage
);

// watch(() => drawerUse.loading, (isOpen) => {
//     if (isOpen) {
//         hideScroll()
//     } else {
//         showScroll()
//     }
// });

// watch(() => visibleAuth.value, (isOpen) => {
//     console.log(isOpen)

//     if (isOpen) {
//         hideScroll()
//     } else {
//         showScroll()
//     }
// });

// watch(() => layoutState.staticMenuMobileActive, (isMobileActive) => {
//     if (isMobileActive) {
//         hideScroll()
//     } else {
//         showScroll()
//     }
//   }
// );

watch(() => route.path, (newPath) => {
        console.log('Route changée :', newPath);

        const pathItems = findBreadcrumb(model.value, newPath);
        if (pathItems) {
            breadcrumbMenu.set([
              ...pathItems
                .filter(i => i && i.label) // ⬅️ enlève les labels vides
                .map(i => ({
                  label: i.label,
                  // icon: i.icon,
                  // to: i.to,
                }))
            ]);
        }
    },
    { immediate: true }
);

</script>

<style scoped>
.cardPreloader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Important pour que le loader soit centré dedans */
}

#pageLoader {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#pageLoader.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  /* background: rgba(255, 255, 255, 0.5); optionnel pour mieux voir le loader */
}

.facebook-spinner {
  display: flex;
  gap: 8px;
}

.spinner-block {
  width: 8px;
  height: 32px;
  border-radius: 4px;
  background: linear-gradient(180deg, #2E37A4, #42a5f5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: fb-bounce 1s infinite ease-in-out;
  transform-origin: center bottom;
}

.block-1 { animation-delay: 0s; }
.block-2 { animation-delay: 0.15s; }
.block-3 { animation-delay: 0.3s; }

@keyframes fb-bounce {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50%      { transform: scaleY(0.5); opacity: 0.5; }
}

.preloaderS-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  flex-direction: column;
}
.preloaderS-message {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}
</style>