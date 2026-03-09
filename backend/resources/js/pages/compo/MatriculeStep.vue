<template>
  <div class="card rounded-0 div_matricule">
    <div class="card-header">
      <h5 class="mb-0 text-center">Vérification du Matricule</h5>
    </div>
    <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-3">
      <div class="form-floating">
        <input
          type="text"
          class="form-control form-control-sm input_matricule text-center"
          value="S00061001769301"
          readonly
        />
        <label>Matricule de l'assuré</label>
      </div>
      <button
        class="btn btn-success btn_recherche_matricule"
        :disabled="loading"
        @click="$emit('demande-verification')"
      >
        <i v-if="!loading" class="fa fa-search me-2"></i>
        <span v-else class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ loading ? "Chargement..." : "Vérification" }}
      </button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
