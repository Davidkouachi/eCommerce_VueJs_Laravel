// $(document).ready(function () {
//     function showPage(page, updateHistory = true) {
//         if (!page) return;

//         // Cacher toutes les pages
//         $('[data-pages]').hide();

//         // Afficher la page demandée
//         $(`[data-pages="${page}"]`).show();

//         // Mettre à jour le titre
//         const titleMap = {
//             clinique_dashboard: "Tableau de bord",
//             clinique_page1: "Page 1",
//         };
//         const newTitle = titleMap[page] ?? "Page";
//         document.title = newTitle + " | Sogamad Santé";

//         // Sauvegarder la page visitée
//         if (updateHistory) localStorage.setItem("lastVisitedPage", page);

//         // Mettre à jour les classes actives du menu
//         updateActiveMenu(page);
//     }

//     function updateActiveMenu(page) {
//         $("ul li > a").removeClass("active subdrop");
//         $(".submenu ul").slideUp(0);

//         const $link = $(`[data-page="${page}"]`);
//         if ($link.length) {
//             $link.addClass("active");

//             const $submenu = $link.closest(".submenu");
//             if ($submenu.length) {
//                 $submenu.children("a").addClass("active subdrop");
//                 $submenu.find("ul").slideDown(0);
//             }
//         }
//     }

//     // Gérer les clics sur les liens de menu
//     $("[data-page]").on("click", function (e) {
//         e.preventDefault();
//         const page = $(this).data("page");
//         showPage(page);
//     });

//     // Toggle sous-menus
//     $(".submenu > a").on("click", function (e) {
//         e.preventDefault();

//         const $submenu = $(this).next("ul");
//         const $parent = $(this).parent();

//         if ($submenu.is(":visible")) {
//             $submenu.slideUp(200);
//             $(this).removeClass("active subdrop");
//         } else {
//             $(".submenu ul").slideUp(200);
//             $(".submenu > a").removeClass("active subdrop");

//             $submenu.slideDown(200);
//             $(this).addClass("active subdrop");
//         }
//     });

//     // Afficher la dernière page visitée ou la page par défaut
//     const lastPage = localStorage.getItem("lastVisitedPage") || "dashboard";
//     showPage(lastPage, false);
// });
