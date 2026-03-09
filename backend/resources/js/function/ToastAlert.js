import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';

let activeToasts = []; // on garde la liste des IDs

export function useToastAlert() {
  const toast = useToast();
  
  function showToast(severity, summary, detail, life = 3000, id = null) {
    removeAllToasts();

    if (id === null) id = Date.now() + Math.random();
    
    toast.add({ severity, summary, detail, life, id }); 
    activeToasts.push(id);
    console.log('Toast ajouté', id);

    if (id != null) removeAllExcept(id);

    return id;
  }

  function removeToast(id) {
    toast.remove({ id }); // 👈 tu passes un objet avec {id}
    activeToasts = activeToasts.filter(t => t !== id);
  }

  function removeAllToasts() {
    // console.log("Suppression de tous les toasts:", activeToasts);
    activeToasts.forEach(id => toast.remove({ id }));
    activeToasts = [];
    console.log('toast supprimer');
  }

  function removeAllExcept(idToKeep) {
    activeToasts.forEach(id => {
      if (id !== idToKeep) {
        toast.remove({ id });
      }
    });
    activeToasts = [idToKeep];
  }

  function showToast2(severity, title, message, timer = 3000) {

    let icon = severity;

    if (severity === 'warn') icon = 'warning';
    if (severity === 'info') icon = 'info';
    if (severity === 'error') icon = 'error';
    if (severity === 'success') icon = 'success';

    Swal.fire({
      icon,
      title,
      text: message,
      timer,
      timerProgressBar: false,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  }

  return { showToast, showToast2, removeToast, removeAllToasts, removeAllExcept };
}
