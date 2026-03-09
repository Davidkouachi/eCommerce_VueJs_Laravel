<script setup>
defineProps({
  data: Array
});

// Fonction couleur du badge
const getBadgeColor = (badge) => {
  if (!badge) return "bg-gray-400";

  switch (badge.toLowerCase()) {
    case "danger":
      return "bg-red-500";     
    case "primary":
      return "bg-blue-500";    
    case "orange":
      return "bg-orange-500";  
    case "info":
      return "bg-gray-500";    
    case "success":
      return "bg-green-600";   
    case "warning":
      return "bg-yellow-500"; 
    default:
      return "bg-gray-400"; 
  }
};

// Fonction couleur de l'icône
const getIconColor = (badge) => {
  if (!badge) return "text-gray-600";

  switch (badge.toLowerCase()) {
    case "danger":
      return "text-red-600";     
    case "primary":
      return "text-blue-600";    
    case "orange":
      return "text-orange-600";  
    case "info":
      return "text-gray-600";    
    case "success":
      return "text-green-600";   
    case "warning":
      return "text-yellow-600"; 
    default:
      return "text-gray-600"; 
  }
};

// Fonction couleur de fond de l'icône
const getIconBgColor = (badge) => {
  if (!badge) return "bg-gray-100";

  switch (badge.toLowerCase()) {
    case "danger":
      return "bg-red-100";     
    case "primary":
      return "bg-blue-100";    
    case "orange":
      return "bg-orange-100";  
    case "info":
      return "bg-gray-100";    
    case "success":
      return "bg-green-100";   
    case "warning":
      return "bg-yellow-100"; 
    default:
      return "bg-gray-100"; 
  }
};
</script>

<template>
  <div class="flex flex-col justify-center gap-3 w-full">

    <!-- Si notifications non vides -->
    <template v-if="data.length > 0">
      <div
        v-for="n in data"
        :key="n.id + '-' + n.time"
        class="p-3 rounded-xl shadow-sm border flex gap-3 items-start bg-transparent"
      >
        <!-- Icône avec couleur dynamique -->
        <div :class="['w-10 h-10 flex items-center justify-center rounded-full', getIconBgColor(n.badge)]">
          <i :class="[n.icon, getIconColor(n.badge), 'text-xl']"></i>
        </div>

        <div class="flex-1">
          <div class="font-semibold flex justify-between items-center">
            <span>{{ n.title }}</span>

            <span
              v-if="n.badge"
              :class="['px-2 py-0.5 text-xs rounded-md text-white', getBadgeColor(n.badge)]">
              {{ n.badgeName }}
            </span>
          </div>

          <div class="text-sm text-gray-600 mt-1">{{ n.message }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ n.time }}</div>
        </div>
      </div>
    </template>

    <!-- Si notifications vides -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 text-center text-red-600 gap-3">
        <i class="fa-solid fa-bell-slash text-4xl"></i>
        <p>Aucune notification disponible</p>
      </div>
    </template>

  </div>
</template>


