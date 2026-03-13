<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container items-center">
            <button
                v-if="auth.isAuthenticated && ['administrateur'].includes(auth.user.role)"
                class="layout-menu-button layout-topbar-action"
                @click="toggleMenu"
            >
              <i class="pi pi-bars"></i>
            </button>
            <div class="mt-0 flex items-start left-0 gap-2 ">
                <router-link to="/" class="layout-topbar-logo xl:hidden">
                    <img src="@/assets/img/logo.jpg" class="w-[8rem] shrink-0" alt="Logo">
                </router-link>
                <!-- <span class="font-semibold text-[1.5rem]" v-if="breadcrumbMenu.items.length">
                    {{ breadcrumbMenu.items[breadcrumbMenu.items.length - 1].label }}
                </span> -->
            </div>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu mt-1">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <div class="relative hidden md:block mt-1">
                <div class="flex flex-row gap-2">
                    <Chip :label="tempsToken" icon="pi pi-bell" removable />
                    <Chip :label="tempsInactivite" icon="pi pi-bell" removable />
                </div>
            </div>

            <div class="relative mt-1" >
                <button class="btnBell" @click="showNotifications">
                    <OverlayBadge value="9+" severity="danger" size="small">
                        <i class="pi pi-bell"></i>
                    </OverlayBadge>
                </button>
            </div>

            <div class="relative mt-1">
                <button class="btnBell" @click="showNotifications">
                    <OverlayBadge value="9+" severity="danger" size="small">
                        <i class="pi pi-shopping-cart" id="global-cart-icon"></i>
                    </OverlayBadge>
                </button>
            </div>

            <div class="relative">
                <button
                    class="layout-topbar-action"
                    v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                >
                    <!-- <i class="pi pi-user"></i> -->
                    <img src="@/assets/img/user.png" class="w-[3rem] shrink-0 border rounded-full" alt="Logo">
                </button>

                <div
                    id="user-menu-panel"
                    class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-0 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]"
                >
                    <div class="flex justify-center border-0">
                        <template v-if="!auth.isAuthenticated" >
                            <Menu :model="itemsNonConnecter" class="w-full" appendTo="body">
                                <template #item="{ item, props }">
                                    <a v-ripple class="flex items-center" v-bind="props.action" :id="item.id" @click="handleItemClick(item)">
                                        <span :class="item.icon" />
                                        <span>{{ item.label }}</span>
                                        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                                        <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                                    </a>
                                </template>
                            </Menu>
                        </template>
                        <template v-else>
                            <Menu :model="itemsConnecter" class="w-full" appendTo="body">
                                <template #start>
                                    <button v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                                        <img src="@/assets/img/user.png" class="w-[3rem] shrink-0 mr-2 border rounded-full" alt="Logo">
                                        <span class="inline-flex flex-col items-start">
                                            <span class="font-bold text-lg">{{ auth.user?.email || 'Invité' }}</span>
                                            <span class="text-md">
                                                {{ auth.user?.role || 'Inconnu' }}
                                            </span>
                                        </span>
                                    </button>
                                </template>
                                <template #submenulabel="{ item }">
                                    <span class="text-primary font-bold">{{ item.label }}</span>
                                </template>
                                <template #item="{ item, props }">
                                    <a 
                                        v-ripple 
                                        class="flex items-center" 
                                        v-bind="props.action" 
                                        :id="item.id" 
                                        @click="handleItemClick(item)">
                                        <span :class="item.icon" />
                                        <span>{{ item.label }}</span>
                                        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                                        <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                                    </a>
                                </template>
                            </Menu>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted, defineComponent, markRaw } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/function/stores/auth';
import { useDrawerStore } from '@/function/stores/drawer';
import { usePreloaderSpinner } from '@/function/function/showPreloader';
import { useToastAlert } from '@/function/function/ToastAlert';
import { useConfirm } from "primevue/useconfirm";
import { useBreadcrumbMenuStore } from '@/function/stores/breadcrumbMenu';
import { useAuthCompteStore } from '@/function/stores/auth/compte';
import { useAuthDialogStore } from '@/function/stores/auth/authDialog'

import NotificationList from "@/components/perso/NotificationList.vue";
import authConnexion from "@/layout/authCompte/connexion.vue";

const auth = useAuthStore();
const { showToast, removeAllToasts } = useToastAlert();
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const preloaderSpinner = usePreloaderSpinner();
const confirm = useConfirm();
const drawerUse = useDrawerStore();
const breadcrumbMenu = useBreadcrumbMenuStore();
const authComptes = useAuthCompteStore();
const authDialog = useAuthDialogStore()

const router = useRouter()
const route = useRoute()

const itemsConnecter = computed(() => {
    const menu = [
        {
            separator: true
        },
        {
            label: 'Compte',
            items: [
                {
                    label: 'Profil',
                    icon: 'pi pi-user',
                },
                {
                    label: 'Vos commandes',
                    icon: 'pi pi-shopping-bag',
                    badge: 2,
                    command: () => {
                        router.push({
                            name: 'element_mescomandes',
                        })
                    }
                },
                {
                    label: 'Favoris',
                    icon: 'pi pi-heart',
                    badge: 2,
                },
                {
                    label: 'Sécurité',
                    icon: 'pi pi-shield',
                },
            ]
        }
    ];

    // 👉 Ajout du menu configuration si administrateur
    // if (auth.user?.role === 'administrateur') {
    //     menu.push({
    //         label: 'Configuration',
    //         items: [
    //             {
    //                 label: 'Utilisateurs',
    //                 icon: 'pi pi-users',
    //             },
    //             {
    //                 label: 'Paramètres',
    //                 icon: 'pi pi-cog',
    //             }
    //         ]
    //     });
    // }

    // menu de fin
    menu.push(
        { separator: true },
        {
            id: 'logout',
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
        }
    );

    return menu;
});

const itemsNonConnecter = ref([
    {   
        label: 'Se connecter',
        icon: 'pi pi-sign-in',
        command: () => authDialog.requireLogin()
    },
    {   
        label: 'Créer un compte',
        icon: 'pi pi-user-plus'
    }
]);

// 🔁 formatteur de temps (mm:ss)
function formatTime(seconds) {
  if (!seconds || seconds < 0) seconds = 0;
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

const tempsToken = computed(() => formatTime(auth.tempsRestant));
const tempsInactivite = computed(() => formatTime(auth.inactivityRestant));

// Notifications de test
const fakeNotifs = [
  { id: 1, title: "Nouveau message", message: "Message de Jean.", time: "Il y a 2min", icon: "pi pi-envelope", badge: "info" , badgeName: "standart" },
  { id: 2, title: "Mise à jour", message: "MAJ dispo.", time: "Il y a 10min", icon: "pi pi-refresh", badge: "orange" , badgeName: "important" },
  { id: 3, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "danger" , badgeName: "urgent" },
  { id: 4, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "success" , badgeName: "éffectuée" },
  { id: 5, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "warning" , badgeName: "moins important" },
  { id: 6, title: "Mise à jour", message: "MAJ dispo.", time: "Il y a 10min", icon: "pi pi-refresh", badge: "primary" , badgeName: "standart" },
  { id: 1, title: "Nouveau message", message: "Message de Jean.", time: "Il y a 2min", icon: "pi pi-envelope", badge: "info" , badgeName: "standart" },
  { id: 2, title: "Mise à jour", message: "MAJ dispo.", time: "Il y a 10min", icon: "pi pi-refresh", badge: "orange" , badgeName: "important" },
  { id: 3, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "danger" , badgeName: "urgent" },
  { id: 4, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "success" , badgeName: "éffectuée" },
  { id: 5, title: "Alerte système", message: "Problème serveur 3.", time: "Hier", icon: "pi pi-exclamation-triangle", badge: "warning" , badgeName: "moins important" },
  { id: 6, title: "Mise à jour", message: "MAJ dispo.", time: "Il y a 10min", icon: "pi pi-refresh", badge: "primary" , badgeName: "standart" },
];

const Btnfoter = [
    {   
        id: 'logout',
        label: '',
        icon: 'pi pi-trash',
        variant: 'outlined',
        severity: 'warn',
        command: () => {
            drawerUse.hide();
        }
    },
    {   
        id: 'drawerBtn',
        label: 'Voir plus',
        icon: 'pi pi-eye',
        variant: '',
        severity: 'warn',
        command: () => {
            drawerUse.hide();
        }
    },
    {   
        id: 'drawerBtn',
        label: 'Valider',
        icon: 'pi pi-check',
        variant: '',
        severity: 'success',
        command: () => {
            drawerUse.hide(); 
            showToast('success','Succès',`Commande validée`)
        }
    }
];

// Fonction pour ouvrir le Drawer
function showNotifications() {
    drawerUse.show(
        "Notifications",
        "pi pi-bell",
        "right",
        "26rem",
        markRaw(NotificationList),
        { data: fakeNotifs },
        { footerBtn: Btnfoter }
    );
}

function handleItemClick (item, position = 'center') {
    // envoyer un événement global pour fermer le menu
    window.dispatchEvent(new Event('close-topbar-menu'))

    if (item.id === "logout") {
        confirm.require({
            // group: 'positioned',
            group: 'headless',
            message: 'Voulez-vous vraiment vous déconnecter ?',
            header: 'Confirmation',
            // icon: 'pi pi-info-circle',
            // position: position,
            rejectProps: {
                icon: 'pi pi-times',
                label: 'Non',
                severity: 'danger',
                outlined: false,
                size: 'normal',
            },
            acceptProps: {
                icon: 'pi pi-check',
                label: 'Oui',
                severity: 'success',
                outlined: false,
                size: 'normal',
            },
            accept: async () => {
                removeAllToasts();
                
                try {
                    await auth.logoutServer(true);

                    showToast('success', 'Succès', 'Déconnexion réussie');
                } catch (error) {
                    console.error(error);

                    showToast('error', 'Erreur', 'La déconnexion a échoué');
                }
            },
            reject: () => {
                return false;
            }
        });

    }
};

onMounted(() => {
    console.log('lancé')
})

</script>

<style scoped>

.btnBell{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--text-color);
    transition: background-color var(--element-transition-duration);
    cursor: pointer;

    &:hover {
        background-color: var(--surface-hover);
    }

    &:focus-visible {
        @include focused();
    }

    i {
        font-size: 1.5rem;
    }

    span {
        font-size: 1rem;
        display: none;
    }

    &.layout-topbar-action-highlight {
        background-color: var(--primary-color);
        color: var(--primary-contrast-color);
    }
}

</style>