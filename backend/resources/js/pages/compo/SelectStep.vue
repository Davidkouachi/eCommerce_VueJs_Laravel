<script setup>
import { ref, onBeforeUnmount, onMounted, getCurrentInstance, defineProps } from 'vue'
import { initSelect2 }  from '@/plugins/select2.js'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const selectElement2 = ref(null)

onMounted(() => {
  if (selectElement2.value) {
    initSelect2('#mySelect2') // ← initialisation ici
  }

})

onBeforeUnmount(() => {
  if (window.$ && typeof window.$(selectElement2.value).select2 === 'function') {
    window.$(selectElement2.value).select2('destroy')
  }
})
</script>

<template>
  <div class="card rounded-0 div_select2">
    <div class="card-header text-center">
      <h5 class="mb-0">Page Select2</h5>
    </div>

    <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-3">
      <select
        id="mySelect2"
        ref="selectElement2"
        class="form-select form-select-sm select2 w-100"
        data-toggle="select2"
        data-placeholder="Sélectionner"
      >
        <option value=""></option>
        <option value="CA">California</option>
        <option value="NV">Nevada</option>
        <option value="OR">Oregon</option>
        <option value="WA">Washington</option>
      </select>

      <button
        class="btn btn-success btn_recherche_matricule"
        :disabled="props.loading"
        @click="$emit('verifier')"
      >
        <i v-if="!props.loading" class="fa fa-search me-2"></i>
        <span v-else class="spinner-border spinner-border-sm me-2"></span>
        {{ props.loading ? "Chargement..." : "Vérification" }}
      </button>
    </div>
  </div>
</template>
