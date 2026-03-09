export function useGlobalFn() {
  
  // 🔹 Fonction : n'autoriser que les chiffres
  function numberTel(id) {
    const inputElement = $(id); // Sélectionner l'élément avec son sélecteur

    if (!inputElement.length) {
      console.warn(`⚠️ Aucun élément trouvé pour le sélecteur ${id}`);
      return;
    }

    // Permettre uniquement les chiffres lors de la saisie
    inputElement.on('keypress', function (event) {
      const key = event.which || event.keyCode;
      if (
        (key < 48 || key > 57) && // Pas un chiffre
        key !== 8 && // Backspace
        key !== 46 && // Delete
        key !== 9 // Tab
      ) {
        event.preventDefault();
      }
    });

    // Nettoyer la valeur automatiquement
    inputElement.on('input', function () {
      $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });
  }

  // 🔹 Fonction : limiter le nombre de caractères
  function numberTelLimit(id, max = 10) {
    const inputElement = $(id);

    if (!inputElement.length) {
      console.warn(`⚠️ Aucun élément trouvé pour le sélecteur ${id}`);
      return;
    }

    inputElement.on('input', function () {
      let value = $(this).val();
      if (value.length > max) {
        value = value.substring(0, max);
      }
      $(this).val(value);
    });
  }

  // ✅ On retourne les fonctions ici !
  return {
    numberTel,
    numberTelLimit
  };
}
