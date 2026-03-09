<script setup>
</script>

<template>
  <div class="card carte-card">
    <h1 class="carte-title text-center">Carte</h1>

    <div class="map-container">
      <iframe
        src="https://www.google.com/maps?q=Abidjan+Plateau&output=embed"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>
  </div>
</template>

<style scoped>
.carte-card {
  height: 100vh; /* prend toute la hauteur de l’écran */
  display: flex;
  flex-direction: column;
}

/* Titre */
.carte-title {
  padding: 1rem;
  margin: 0;
  font-size: 2rem;
}

/* Conteneur de la carte */
.map-container {
  flex: 1; /* prend toute la hauteur restante */
}

/* Iframe Google Maps */
.map-container iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
