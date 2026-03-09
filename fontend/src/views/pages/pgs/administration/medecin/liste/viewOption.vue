<template>
    <div class="p-4 space-y-4">
        <!-- Informations principales -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col justify-center items-center">
                    <img height="100" width="100" src="@/assets/img/docteur.png" />
                    <div class="text-lg font-medium mt-2">
                       {{ data.signe }}.
                        {{ data.nom?.toUpperCase() }}
                        {{ data.prenom
                        ? data.prenom.charAt(0).toUpperCase() + data.prenom.slice(1).toLowerCase()
                        : '' }}
                    </div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        {{ data?.specialite ?? '-' }}
                    </span>
                    
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Code :</span>
                <span class="text-gray-700">{{ data?.code ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Numéro d'ordre :</span>
                <span class="text-gray-700">{{ data?.numero_ordre ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Contact :</span>
                <span class="text-gray-700">{{ data?.telephone ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Email :</span>
                <span class="text-gray-700">{{ data?.email ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Statut :</span>
                <span :class="actionClass(data?.statut)" class="font-bold px-2 py-1 rounded text-sm">{{ data?.statut_label ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Accès :</span>
                <span class="text-gray-700">
                    {{ data?.login ? 'Oui' : 'Non' }}
                </span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Date & Heure:</span>
                <span class="text-gray-700">{{ formaDateHeure(data.created_at) ?? '-' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>

import { formaDateHeure } from '@/function/services/format';

defineProps({
  data: Object
});

const actionClass = (action) => {
    switch (action) {
        case 1:
            return 'bg-green-500 text-white'
        case 0:
            return 'bg-red-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

</script>