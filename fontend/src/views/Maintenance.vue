<template>
  <Layout>
    <div class="content pb-0 d-flex align-items-center justify-content-center">
      <div class="card rounded-0 div_centrale">
        <div class="container-fuild">
          <div class="w-100 position-relative flex-wrap d-block ">
            <!-- start row -->
            <div class="row justify-content-center align-items-center p-5">
              <div class="col-12">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <div class="error-images mb-3 pb-3">
                    <img src="@/assets/img/bg/under-maintanence.svg" height="500" width="150" class="img-fluid">
                  </div>
                  <div class="text-center">
                    <h5 class="fw-bold mb-1">En cours de maintenance ...</h5>
                    <p class="fs-16 text-center">
                      Veuillez patienter ou revenir plutard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
import { usePreloaderStore } from '@/stores/preloader';
import Layout from '@/layout/applayout.vue';

const preloader = usePreloaderStore();

onMounted(async () => {

  preloader.hide()
  await nextTick()
})

// onUnmounted(() => stopSync())
</script>

<style scoped>

.div_centrale {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
