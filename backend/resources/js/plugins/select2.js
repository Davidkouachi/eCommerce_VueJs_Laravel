// 📁 resources/js/plugins/select2.js
export function initSelect2(selector) {
  console.log('⚙️ Initialisation Select2...')

  if (!window.$) {
    console.error('❌ jQuery non chargé')
    return
  }

  const $select = window.$(selector)
  if (!$select.length) {
    console.error('❌ Select non trouvé pour le sélecteur', selector)
    return
  }

  // 🔹 Détruire l'ancien Select2 s'il existe
  if ($select.hasClass('select2-hidden-accessible')) {
    $select.select2('destroy')
    console.log('♻️ Ancien Select2 détruit')
  }

  // 🔹 Réinitialiser et appliquer Select2 proprement
  setTimeout(() => {
    $select.select2({
      placeholder: 'Sélectionner',
      allowClear: true,
      width: '100%',
      language: {
        noResults: () => 'Aucun résultat trouvé',
      },
    })

    console.log('✅ Select2 initialisé sur', selector)
  }, 0)
}
