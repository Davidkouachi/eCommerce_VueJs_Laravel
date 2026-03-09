<template>
    <Topbar />
    <Menu />
    <div class="page-wrapper">

      <div
        :style="{ display: preloader.loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }"
        class="content"
      >
        <div id="pageLoader active">
          <div class="loader-overlay"></div>
          <div class="facebook-spinner">
            <div class="spinner-block block-1"></div>
            <div class="spinner-block block-2"></div>
            <div class="spinner-block block-3"></div>
          </div>
        </div>
      </div>

      <div :style="{ display: preloader.loading ? 'none' : 'block' }">
        <slot />
      </div>

      <Footer />
    </div>
</template>

<script setup>
import Menu from '@/composants/Menu.vue';
import Topbar from '@/composants/Topbar.vue';
import Footer from '@/composants/Footer.vue';
import { useAuthStore } from '@/stores/auth';
import { usePreloaderStore } from '@/stores/preloader';
import { useToastAlert } from '@/function/ToastAlert';
import { useSwalAlert } from '@/function/SwalAlert';
import { onMounted, watch, nextTick } from 'vue';
import router from "@/route/index";
import { showPreloader } from '@/function/showPreloader';

const auth = useAuthStore();
const preloader = usePreloaderStore();
const { removeAllExcept } = useToastAlert();
const { showSwal } = useSwalAlert();

let swalShown = false;

onMounted(async () => {
  preloader.show();
  removeAllExcept("1");

  // 🔸 Si la session est déjà expirée dans le localStorage
  if (localStorage.getItem("session_expired") === "true") {
    auth.setExpired();
  }

  preloader.hide();
  await nextTick();
});

// 🕑 Surveille expiration du token
watch(
  () => auth.expired,
  async (val) => {
    if (!val || swalShown || auth.manualLogout) return;
    swalShown = true;

    auth.logoutServer(false)

    const result = await showSwal({
      icon: 'warning',
      title: 'Session expirée',
      text: 'Votre session a expiré. Veuillez vous reconnecter.',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (result.isConfirmed) {
      showPreloader('Rédirection en cours...', () => {
        auth.logoutLocal(true);
      }, 1000);
    }

    swalShown = false;
  }
);
</script>

<style scoped>
#pageLoader {
  position: fixed;
  inset: 0;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
  z-index: 9999;
}
#pageLoader.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
}
.loader-overlay {
  position: absolute;
  inset: 0;
  /*background: rgba(0, 0, 0, 0.15);*/
  backdrop-filter: blur(2px);
}
.facebook-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrage parfait */
  display: flex;
  gap: 8px;
}
.spinner-block {
  width: 8px;
  height: 32px;
  border-radius: 4px;
  background: linear-gradient(180deg, #2E37A4, #42a5f5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: fb-bounce 1s infinite ease-in-out;
  transform-origin: center bottom;
}
.block-1 { animation-delay: 0s; }
.block-2 { animation-delay: 0.15s; }
.block-3 { animation-delay: 0.3s; }
@keyframes fb-bounce {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50%      { transform: scaleY(0.5); opacity: 0.5; }
}
</style>
