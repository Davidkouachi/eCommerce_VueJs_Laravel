<template>
    <div class="sidebar" id="sidebar">
            
        <!-- Start Logo -->
        <div class="sidebar-logo d-flex flex-column justify-cintent-center align-items-center border-0">
            <div>
                <!-- Logo Normal -->
                <a href="#" class="logo logo-normal">
                  <img height="50" width="50" src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>

                <!-- Logo Small -->
                <a href="#" class="logo-small">
                  <img src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>

                <!-- Logo Dark -->
                <a href="#" class="dark-logo">
                  <img height="40" width="50" src="@/assets/img/logo.png" alt="Logo">
                  <!-- <span class="avatar rounded-circle flex-shrink-0 p-0">
                    <img src="@/assets/img/home1.jpg" alt="img">
                  </span> -->
                </a>
            </div>

            <!-- Sidebar Menu Close -->
            <button class="sidenav-toggle-btn btn border-0 p-0 active" id="toggle_btn"> 
                <i class="ti ti-arrow-left"></i>
            </button>
            <button class="sidebar-close">
                <i class="ti ti-x align-middle"></i>
            </button>              
        </div>
        <!-- End Logo -->

        <!-- Sidenav Menu -->
        <div class="sidebar-inner" data-simplebar>                
            <div id="sidebar-menu" class="sidebar-menu">
                <div class="sidebar-top shadow-sm p-2 rounded-1 mb-3 dropend bg-danger">
                    <a href="javascript:void(0);" class="drop-arrow-none">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <span class="avatar rounded-circle flex-shrink-0 p-0">
                                    <img src="@/assets/img/home1.jpg" alt="img">
                                </span>
                                <div class="ms-2">
                                    <h6 class="fs-14 fw-semibold mb-0 text-white">
                                        ESPACE MEDICALE
                                    </h6>
                                    <!-- <p class="fs-10 mb-0 text-white">
                                      {{ user?.login || 'Invité' }}
                                    </p> -->
                                    <p class="fs-10 mb-0 text-white">
                                      {{ auth.user?.email || 'Invité' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <!-- <div class="alert alert-warning text-bg-warning" role="alert">
                    <strong>
                        Bon(s) en stock : 
                        <br> 
                        Bon(s) uilisé(s) : 
                    </strong>
                </div> -->
                <ul>
                  <li class="menu-title"><span>Menu</span></li>

                  <li>
                    <ul>
                      <template v-for="(item, index) in filteredMenu" :key="index">
                        <li v-if="!item.children">
                          <router-link :to="item.to" active-class="active">
                            <i :class="item.icon"></i><span>{{ item.label }}</span>
                          </router-link>
                        </li>

                        <li v-else class="submenu">
                          <a href="javascript:void(0);">
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                            <span class="menu-arrow"></span>
                          </a>
                          <ul>
                            <template v-for="(child, cIndex) in item.children" :key="cIndex">
                              <li v-if="!child.children">
                                <router-link :to="child.to" active-class="active">{{ child.label }}</router-link>
                              </li>
                              <li v-else class="submenu submenu-two">
                                <a href="javascript:void(0);">
                                  {{ child.label }}<span class="menu-arrow inside-submenu"></span>
                                </a>
                                <ul>
                                  <li v-for="(subChild, scIndex) in child.children" :key="scIndex">
                                    <router-link :to="subChild.to" active-class="active">{{ subChild.label }}</router-link>
                                  </li>
                                </ul>
                              </li>
                            </template>
                          </ul>
                        </li>
                      </template>
                    </ul>
                  </li>
                </ul>
                   
            </div>
            <div class="sidebar-footer border-top mt-3">
                <div class="trial-item mt-0 p-3 text-center">
                    <div class="trial-item-icon rounded-4 mb-3 p-2 text-center shadow-sm d-inline-flex">
                        <img height="60" width="110" src="@/assets/img/logo.png" alt="img">
                    </div>
                    <div>
                        <span class="badge bg-danger ms-2 badge-md rounded-2 fs-12 fw-semibold p-1 mb-2">
                            Version 1.07.25
                        </span>
                        <p class="fs-13 mb-0">
                            Aucune information sensible ou à caractère personnel n’est exploitée.
                        </p>
                    </div>
                    <a href="javascript:void(0);" class="close-icon shadow-sm">
                        <i class="ti ti-x"></i>
                    </a>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

// Menu principal avec permissions
const menuItems = [
  {
    label: 'Home',
    icon: 'fa fa-th-large',
    to: '/',
    permissions: ['admin', 'user'],
  },
  {
    label: 'User',
    icon: 'fa fa-user',
    to: '/User',
    permissions: ['admin', 'user'],
  },
  {
    label: 'About',
    icon: 'fa fa-th-large',
    to: '/about',
    permissions: ['admin', 'user'],
  },
  {
    label: 'Items',
    icon: 'ti ti-apps',
    permissions: ['admin', 'user'],
    children: [
      { label: 'Select2', to: '/select2', permissions: ['admin', 'user'] },
      { label: 'DataTable', to: '/datatable', permissions: ['admin', 'user'] },
    ],
  },
  {
    label: 'Applications',
    icon: 'ti ti-apps',
    permissions: ['user'],
    children: [
      { label: 'Chat', to: '/', permissions: ['user'] },
      {
        label: 'Calls',
        permissions: ['user'],
        children: [
          { label: 'Voice Call', to: '/', permissions: ['user'] },
        ],
      },
      { label: 'Search Result', to: '/', permissions: ['user'] },
    ],
  },
];

// Fonction récursive pour filtrer le menu selon les rôles
function filterMenu(items, userRoles) {
  return items
    .map(item => {
      const newItem = { ...item };

      // Filtrage des enfants
      if (newItem.children) {
        newItem.children = filterMenu(newItem.children, userRoles);
      }

      const hasPermission =
        !newItem.permissions || newItem.permissions.some(p => userRoles.includes(p));
      const hasVisibleChildren = newItem.children && newItem.children.length > 0;

      return hasPermission || hasVisibleChildren ? newItem : null;
    })
    .filter(Boolean);
}

// Computed pour le menu filtré
const filteredMenu = computed(() => {
  if (!auth.user || !auth.user.roles) return [];

  // On récupère un tableau de rôles depuis l'utilisateur
  const roles = Array.isArray(auth.user.roles) ? auth.user.roles : [auth.user.roles];

  return filterMenu(menuItems, roles);
});

// Sidebar interaction (slide toggle)
function init() {
  $('.sidebar-menu').on('click', 'a', function (e) {
    const $link = $(this);
    const $parentLi = $link.parent('li');

    if ($parentLi.hasClass('submenu')) {
      e.preventDefault();
      const $submenu = $link.next('ul');

      if (!$link.hasClass('subdrop')) {
        $parentLi.siblings('li').find('ul:visible').slideUp(250);
        $parentLi.siblings('li').find('a.subdrop').removeClass('subdrop');
        $submenu.slideDown(250);
        $link.addClass('subdrop');
      } else {
        $submenu.slideUp(250);
        $link.removeClass('subdrop');
      }
    }
  });

  $('.sidebar-menu ul li.submenu a.active')
    .parents('ul')
    .prev('a')
    .addClass('subdrop')
    .next('ul')
    .show();
}

onMounted(() => {
  init();
});

</script>
