import Swal from 'sweetalert2';

// 🛠 Supprime le préloader de déconnexion s'il existe
export function removeLogoutPreloaderAndToast(showToast) {
  
    const user = localStorage.getItem('nameUser');
    if (user) {
      showToast('info', 'Compte déconnecté', `Merci de votre visite ${user} à bientôt 👋`);
      localStorage.removeItem('nameUser'); // nettoyage
    } else{
      showToast('info', 'Compte déconnecté', `Merci de votre visite, à bientôt 👋`);
    }

    console.log('♻️ Préloader de déconnexion supprimé du DOM');
}

// 🛠 Toggle Password Visibility
export function initTogglePassword() {
  if ($('.toggle-password').length > 0) {
    $(document).on('click.togglePass', '.toggle-password', function () {
      $(this).toggleClass("ti-eye-off ti-eye-slash");
      const input = $(".pass-input");
      input.attr("type", input.attr("type") === "password" ? "text" : "password");
    });
  }
}

// 🛠 Nettoyage des events toggle
export function destroyTogglePassword() {
  $(document).off('click.togglePass');
}
