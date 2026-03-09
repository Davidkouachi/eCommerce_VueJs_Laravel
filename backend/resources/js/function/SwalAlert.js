import Swal from 'sweetalert2';

export function useSwalAlert() {
  
  function showSwal({ icon = 'info', title = '', text = '', confirmButtonText = 'OK', cancelButtonText = 'Annuler', showCancelButton = false }) {
    return Swal.fire({
      icon,
      title,
      text,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false, // ⛔ clic extérieur désactivé
      allowEscapeKey: false     // ⛔ touche Échap désactivée
    });
  }

  function confirmDelete(text = 'Voulez-vous vraiment supprimer cet élément ?') {
    return Swal.fire({
      icon: 'warning',
      title: 'Confirmation',
      text,
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      allowOutsideClick: false, // ⛔ clic extérieur désactivé
      allowEscapeKey: false     // ⛔ touche Échap désactivée
    });
  }

  return {
    showSwal,
    confirmDelete
  };
}
