export function showPreloader(message, callback = null, delay = 1000) {
  // Supprimer un éventuel ancien preloader
  const oldPreloader = document.getElementById('preloaderLogout');
  if (oldPreloader) oldPreloader.remove();

  // Créer l'élément
  const modalDeco = document.createElement('div');
  modalDeco.id = 'preloaderLogout';
  modalDeco.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(255,255,255,0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  modalDeco.innerHTML = `
    <div style="text-align: center;">
      <div class="spinner-border text-danger" role="status"></div>
      <p style="margin-top: 10px; font-weight: bold;">${message}</p>
    </div>
  `;

  // Ajouter au DOM
  document.body.appendChild(modalDeco);

  // Exécuter la callback après délai si c'est une fonction
  if (typeof callback === 'function') {
    setTimeout(() => {
      callback();
    }, delay);
  }
}
