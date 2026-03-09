import { useAuthStore } from '@/stores/auth'
import { usePreloaderStore } from '@/stores/preloader'
import { nextTick } from 'vue'

export async function initSession() {
  const auth = useAuthStore()
  const preloader = usePreloaderStore()

  // // ✅ Attendre la restauration complète de la session
  // const sessionOk = await auth.restoreSession()

  // // ⛔ Si la session n’est pas valide, on marque expired et on stoppe
  // if (!sessionOk) {
  //   auth.expired = true
  //   return false
  // }

  // ✅ Session OK, cacher le preloader et stabiliser le DOM
  preloader.hide()
  await nextTick()

  return true
}
