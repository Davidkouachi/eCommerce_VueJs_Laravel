<template>
    <div class="p-4 space-y-4">
        <!-- Informations principales -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col justify-center items-center">
                    <img height="100" width="100" src="@/assets/img/log.png" />                 
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Adresse IP :</span>
                <span class="text-gray-700">{{ data?.ip_address ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Agent :</span>
                <span class="text-gray-700">{{ data?.login ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Action :</span>
                <span 
                    :class="actionClass(data?.action)"
                    class="font-bold px-2 py-1 rounded text-sm"
                >{{ data?.action ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Table :</span>
                <span class="text-gray-700">{{ data?.model ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">ID Table:</span>
                <span class="text-gray-700">{{ data?.model_id ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Motif:</span>
                <span class="text-gray-700">{{ data?.description ?? '-' }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-bold text-gray-900">Type appareil:</span>
                <span class="text-gray-700">{{ data?.user_agent ?? '-' }}</span>
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
        case 'insert':
            return 'bg-green-500 text-white'
        case 'update':
            return 'bg-blue-500 text-white'
        case 'delete':
            return 'bg-red-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

</script>