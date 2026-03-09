<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useAuthStore } from '@/function/stores/auth';
import { useRouter } from 'vue-router';
import { getSecureItem } from "@/function/stores/secureStorage";
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { onPresetChange }  from '@/layout/composables/AppConfigurator.js';

onPresetChange();

const loading = ref(false);

const router = useRouter();
const auth = useAuthStore();

// réactifs pour le template
const buttonText = ref('');
const preloaderMessage = ref('');

function redirectToHome() {
    loading.value = true
    if (!auth.expired) {
        router.push('/'); // Tableau de bord
    } else {
        router.push('/authentification'); // Page login
    }
}

onMounted(async () => {
  await nextTick();

  if (!auth.expired) {
    buttonText.value = 'Retour vers le Tableau de Bord';
    preloaderMessage.value = 'Redirection vers le Tableau de bord...';
  } else {
    buttonText.value = 'Retour à la page d’authentification';
    preloaderMessage.value = 'Redirection vers la page de connexion...';
  }
});
</script>


<template>
    <FloatingConfigurator />
    <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <img height="120" width="160" src="@/assets/img/logo.png" class="mb-8 mt-8 w-23 shrink-0 mx-auto" alt="Logo">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <span class="text-primary font-bold text-3xl">404</span>
                    <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Page introuvable</h1>
                    <div class="text-surface-600 dark:text-surface-200 mb-8">La ressource demandée est introuvable.</div>

                    <router-link to="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                        <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-table !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0 block">Foire aux questions</span>
                            <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Trouvez des réponses rapidement.</span>
                        </span>
                    </router-link>

                    <router-link to="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                        <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-question-circle !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0">Centre de solutions</span>
                            <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Accédez à des guides et ressources.</span>
                        </span>
                    </router-link>

                    <router-link to="/" class="w-full flex items-center mb-8 py-8 border-surface-300 dark:border-surface-500 border-b">
                        <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
                            <i class="pi pi-fw pi-unlock !text-2xl"></i>
                        </span>
                        <span class="ml-6 flex flex-col">
                            <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0">Gestion des permissions</span>
                            <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Administrez les accès utilisateurs.</span>
                        </span>
                    </router-link>

                    <Button :loading="loading" :label="loading ? preloaderMessage : buttonText" @click="redirectToHome" class="mt-4" />
                </div>
            </div>
        </div>
    </div>
</template>
