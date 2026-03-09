<template>
  <header class="navbar-header">
    <div class="page-container topbar-menu">
        <div class="d-flex align-items-center gap-2">

            <!-- Logo -->
            <a href="#" class="logo">

                <!-- Logo Normal -->
                <span class="logo-light">
                    <span class="logo-lg">
                        <img src="@/assets/img/logo.png" alt="logo">
                    </span>
                    <span class="logo-sm">
                        <img src="@/assets/img/logo.png" alt="small logo">
                    </span>
                </span>

                <!-- Logo Dark -->
                <span class="logo-dark">
                    <span class="logo-lg">
                        <img src="@/assets/img/logo.png" alt="dark logo">
                    </span>
                </span>
            </a>

            <!-- Sidebar Mobile Button -->
            <a id="mobile_btn" class="mobile-btn" href="#sidebar">
                <i class="ti ti-menu-deep fs-24"></i>
            </a>

            <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn2"> 
                <i class="ti ti-arrow-right"></i>
            </button> 
            
            <!-- Search -->
            <div class="me-auto d-flex align-items-center header-search d-lg-flex d-none">
                <div class="input-icon-start position-relative me-2">
                    <span class="input-icon-addon">
                        <i class="ti ti-search"></i>
                    </span>
                   <input type="text" class="form-control shadow-sm" placeholder="Search">
                   <span class="input-icon-addon text-dark shadow fs-18 d-inline-flex p-0 header-search-icon"><i class="ti ti-command"></i></span>
                </div>
            </div>
            
        </div>

        <!-- <div class="d-flex align-items-center w-100 me-2" >
            <div class="marquee">
              <p>Bon(s) en stock : | Bon(s) utilisé(s) :</p>
            </div>

        </div> -->

        <div class="d-flex align-items-center">
            
            <!-- AI Assistance -->
            <!-- <a href="javascript:void(0);" class="btn btn-liner-gradient me-3 d-lg-flex d-none">
                AI Assistance
                <i class="ti ti-chart-bubble-filled ms-1"></i>
            </a> -->
            <!-- AI Assistance -->  

            <!-- 🧭 Temps du token -->
            <a class="btn btn-liner-gradient me-3 d-lg-flex d-none">
              Token : {{ tempsToken }}
            </a>

            <!-- ⏳ Temps d’inactivité -->
            <a class="btn btn-outline-secondary me-3 d-lg-flex d-none">
              Inactivité : {{ tempsInactivite }}
            </a>                

            <!-- Light/Dark Mode Button -->
            <!-- <div class="header-item d-none d-sm-flex me-2">
                <button class="topbar-link btn btn-icon topbar-link" id="light-dark-mode" type="button">
                    <i class="fa fa-moon fs-16"></i>
                </button>
            </div> -->
            
            <!-- Notification Dropdown -->
            <div class="header-item">
                <div class="dropdown me-3">
                
                    <button class="topbar-link btn btn-icon topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
                        <i class="fa fa-bell fs-16 animate-ring"></i>
                        <span class="notification-badge"></span>
                    </button>
                    
                    <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style="min-height: 300px;">
                    
                        <div class="p-2 border-bottom">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="m-0 fs-16 fw-semibold"> Notifications</h6>
                                </div>
                            </div>
                        </div>
                        <div class="notification-body position-relative z-2 rounded-0" data-simplebar>
                            <div class="dropdown-item notification-item py-3 text-wrap border-bottom" id="notification-1">
                                <div class="d-flex">
                                    <div class="me-2 position-relative flex-shrink-0">
                                        <img src="@/assets/img/doctors/doctor-01.jpg" class="avatar-md rounded-circle" alt="">
                                    </div>
                                    <div class="flex-grow-1">
                                        <p class="mb-0 fw-medium text-dark">Dr. Smith</p>
                                        <p class="mb-1 text-wrap">
                                            updated the <span class="fw-medium text-dark">surgery</span> schedule. 
                                        </p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="fs-12"><i class="ti ti-clock me-1"></i>4 min ago</span>
                                            <div class="notification-action d-flex align-items-center float-end gap-2">
                                                <a href="javascript:void(0);" class="notification-read rounded-circle bg-danger" data-bs-toggle="tooltip" title="" data-bs-original-title="Make as Read" aria-label="Make as Read"></a>
                                                <button class="btn rounded-circle p-0" data-dismissible="#notification-1">
                                                    <i class="ti ti-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                                   
                        </div>
                        
                        <div class="p-2 rounded-bottom border-top text-center">
                            <a href="notifications.html" class="text-center text-decoration-underline fs-14 mb-0">
                                View All Notifications
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>

            <!-- Contact Dropdown -->
            <div class="header-item">
                <div class="dropdown me-3">
                
                    <button class="topbar-link btn btn-icon topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
                        <i class="fa fa-phone fs-16"></i>
                    </button>
                    
                    <!-- <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style="min-height: 300px;"> -->
                    <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                    
                        <div class="p-2 border-bottom">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="m-0 fs-16 fw-semibold">Contactez nous</h6>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Notification Body -->
                        <!-- <div class="notification-body position-relative z-2 rounded-0" data-simplebar> -->
                        <div class="notification-body position-relative z-2 rounded-0">
                         
                            <!-- Item-->
                            <div class="dropdown-item notification-item py-3 text-wrap border-bottom" id="notification-1">
                                <div class="card-body d-flex flex-column align-items-start justify-content-center">
                                    <div class="alert alert-danger text-bg-danger d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Direction Technique : (+225) 01 72 59 53 18
                                        </div>
                                    </div>
                                    <div class="alert alert-danger text-bg-primary d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Médecin Conseil : (+225) 01 70 66 49 21
                                        </div>
                                    </div>
                                    <div class="alert alert-danger text-bg-danger d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Validation de bons : (+225) 01 52 10 81 12
                                        </div>
                                    </div>
                                    <div class="alert alert-danger text-bg-primary d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Informatique : (+225) 07 57 35 95 19
                                        </div>
                                    </div>
                                    <div class="alert alert-danger text-bg-danger d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Factures : (+225) 01 41 25 31 32
                                        </div>
                                    </div>
                                    <div class="alert alert-danger text-bg-primary d-flex align-items-center justify-content-start p-1 fs-12 w-100" role="alert">
                                        <i class="fa fa-phone f-12 me-2"></i>
                                        <div>
                                            Chèques : (+225) 01 41 25 31 32
                                        </div>
                                    </div>
                                </div>
                            </div>
                             
                        </div>                          
                    </div>
                </div>
            </div>
            
            <!-- User Dropdown -->
            <div class="dropdown profile-dropdown d-flex align-items-center justify-content-center">
                <a href="#" class="topbar-link dropdown-toggle drop-arrow-none position-relative" data-bs-toggle="dropdown" data-bs-offset="0,22" aria-haspopup="false" aria-expanded="false">
                    <img src="@/assets/img/user.png" width="34" class="rounded-circle d-flex border border-2" alt="user-image">
                    <span class="online text-success">
                        <i class="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white"></i>
                    </span>
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                
                    <div class="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                        <img src="@/assets/img/user.png" class="rounded-circle" width="42" height="42" alt="">
                        <div class="ms-2">
                            <p class="fw-medium text-dark mb-0" style="font-size: 12px;">
                              {{ user?.name || 'Invité' }}
                            </p>
                            <span class="d-block fs-13">{{ user?.name || 'Invité' }}</span>
                        </div>
                    </div>

                    <!-- Item-->
                    <a href="profile-settings.html" class="dropdown-item">
                        <i class="ti ti-user-circle me-1 align-middle"></i>
                        <span class="align-middle">Profil</span>
                    </a>

                    <!-- Item-->
                    <a href="account-settings.html" class="dropdown-item">
                        <i class="ti ti-settings me-1 align-middle"></i>
                        <span class="align-middle">Sécurité</span>
                    </a>

                    <!-- item -->
                    <div class="form-check form-switch form-check-reverse d-flex align-items-center justify-content-between dropdown-item mb-0">
                        <label class="form-check-label" for="notify"><i class="ti ti-bell me-1"></i>Notifications</label>
                        <input class="form-check-input me-0" type="checkbox" role="switch" id="notify">
                    </div>                                        
                    
                    <!-- Item-->
                    <div class="pt-2 mt-2 border-top">
                        <a id="btn_deconnecter" href="#" class="dropdown-item text-danger" @click.prevent="logout">
                            <i class="ti ti-logout me-1 fs-17 align-middle"></i>
                            <span class="align-middle">Se déconnecté</span>
                        </a>
                    </div>
                </div>
            </div>
                
        </div>
    </div>
</header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { showPreloader } from '@/function/showPreloader';
import { useToastAlert } from '@/function/ToastAlert';
import { computed } from 'vue';

const auth = useAuthStore();
const user = computed(() => auth.user);
const { removeAllToasts } = useToastAlert();

// 🔁 formatteur de temps (mm:ss)
function formatTime(seconds) {
  if (!seconds || seconds < 0) seconds = 0;
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

const tempsToken = computed(() => formatTime(auth.tempsRestant));
const tempsInactivite = computed(() => formatTime(auth.inactivityRestant));

function logout() {
  console.log('🚪 Déconnexion manuelle depuis Topbar');
  removeAllToasts();
  showPreloader('Déconnexion en cours...', () => {
    auth.logoutServer();
  }, 1000);
}
</script>





