// $(document).ready(function () {
//     let pageTimeout = null;

//     const decodedData = atob(window.encodedUserData); // décode base64
//     const presta = JSON.parse(decodedData);
//     const codpresta = presta.user_codpresta;
//     const prestaprofil = presta.user_profil_id;

//     // function scrollToMenu(page) {
//     //     // Trouve le lien menu correspondant au data-page
//     //     const $menuLink = $(`[data-page="${page}"]`);
//     //     if ($menuLink.length) {
//     //         // Scroll vertical jusqu’à la position du lien, moins un offset (ex: 20px)
//     //         const offset = 20;
//     //         const position = $menuLink.offset().top - offset;

//     //         // Anime le scroll
//     //         $('html, body').animate({ scrollTop: position }, 500);
//     //     }
//     // }

//     function showPage(page, updateHistory = true) {
//         if (!page) return;

//         pageloader(0);

//         $('[data-pages]').hide();

//         // Si un timer précédent existe, on l'annule
//         if (pageTimeout) clearTimeout(pageTimeout);

//         pageTimeout = setTimeout(function () {
//             $(`[data-pages="${page}"]`).show();

//             // nouvelle consultation
//                 // $('.input_matricule').val(null);
//                 $('.div_result_assure').empty();
//                 $('.div_choix_prestation').empty();
//                 $('.div_montant_prestation').empty();
//                 $('.div_medecin_affection').empty();

//             pageloader(1);
//             pageTimeout = null; // nettoyage

//             // Charger JS spécifique si défini
//             loadScriptForPage(page);

//             // Scroll vers le menu actif quand la page est affichée
//             // scrollToMenu(page);
//         }, 1000);

//         const titleMap = {
//             clinique_dashboard: "Tableau de bord",
//             clinique_nouvelle_consultation: "Nouvelle Consultation",
//             clinique_facturation_interne: "Facturation Interne",
//             clinique_facturation_mensuelle: "Facturation Mensuelle",
//         };

//         const urlMap = {
//             clinique_dashboard: "/?page=clinique_dashboard",
//             clinique_nouvelle_consultation: "/?page=clinique_nouvelle_consultation",
//             clinique_facturation_interne: "/?page=clinique_facturation_interne",
//             clinique_facturation_mensuelle: "/?page=cliniquefacturation_mensuelle",
//         };

//         const newTitle = titleMap[page] ?? "Page";
//         const newUrl = urlMap[page] ?? "/";

//         document.title = newTitle + " | Sogamad Santé";

//         if (updateHistory) {
//             // On ajoute une nouvelle entrée d’historique seulement si on ne vient pas d’un popstate
//             window.history.pushState({ page: page }, newTitle, newUrl);
//         }

//         // if (updateHistory) localStorage.setItem("lastVisitedPage", page);

//         if (updateHistory) {
//             localStorage.setItem("lastVisitedPage", `${page}|${codpresta}`);
//         }

//         // Mettre à jour le menu actif ici (à décommenter et adapter si tu veux)
//         // updateActiveMenu(page);
//     }

//     // Fonction pour récupérer le paramètre page depuis l'URL
//     function getPageFromUrl() {
//         const params = new URLSearchParams(window.location.search);
//         return params.get("page");
//     }

//     // Au chargement, afficher la page correspondant au paramètre ?page=xxx
//     function loadPageFromUrl() {
//         let page = getPageFromUrl();

//         const validPages = [
//             "clinique_dashboard",
//             "clinique_facturation_interne",
//             "clinique_facturation_mensuelle",
//             "clinique_nouvelle_consultation",
//         ];

//         if (!page || !validPages.includes(page)) {
//             let defaultPage = null;
//             let savedPage = null;

//             // Définir la page par défaut selon le profil
//             switch (prestaprofil) {
//                 case 13:
//                     defaultPage = "clinique_dashboard";
//                     break;
//                 // case 14:
//                 //     defaultPage = "chu_dashboard";
//                 //     break;
//                 // case 15:
//                 //     defaultPage = "pharma_dashboard";
//                 //     break;
//                 // ajoute ici d’autres cas si besoin
//                 // default:
//                 //     defaultPage = "default_dashboard";
//             }

//             // Tentative de récupération depuis localStorage
//             const lastVisited = localStorage.getItem("lastVisitedPage");

//             if (lastVisited) {
//                 const [storedPage, storedCodpresta] = lastVisited.split("|");

//                 if (
//                     storedPage &&
//                     storedCodpresta &&
//                     storedCodpresta === presta.codpresta &&
//                     validPages.includes(storedPage)
//                 ) {
//                     savedPage = storedPage;
//                     console.log("Page restaurée depuis localStorage :", savedPage);
//                 } else {
//                     console.log("Page ou codpresta invalide, on reste sur la page par défaut");
//                 }
//             }

//             // Choisir la bonne page
//             page = savedPage || defaultPage;

//             // Met à jour l'URL sans ajouter une entrée d’historique
//             const newUrl = `/?page=${page}`;
//             window.history.replaceState({ page: page }, "", newUrl);
//         }

//         // Afficher la page sans pushState (car c’est l’état actuel)
//         showPage(page, false);

//         // Mettre à jour menu actif en simulant clic
//         $(`[data-page="${page}"]`).trigger("click");
//     }

//     // Gérer les clics sur les liens de menu
//     $("[data-page]").on("click", function (e) {
//         e.preventDefault();
//         const page = $(this).data("page");
//         showPage(page);
//     });

//     // Clic sur les liens normaux
//     $("ul li > a").not(".submenu > a").on("click", function () {
//         const page = $(this).data("page");

//         $("ul li > a").removeClass("active");
//         $(".submenu > a").removeClass("active subdrop");
//         $(".submenu ul a").removeClass("active");
//         $(this).addClass("active");

//         // showPage(page);
//     });

//     // Clic sur sous-menu
//     $(".submenu ul a").on("click", function () {
//         const page = $(this).data("page");

//         $("ul li > a").removeClass("active");
//         $(".submenu > a").removeClass("active subdrop");
//         $(".submenu ul a").removeClass("active");

//         $(this).addClass("active");
//         $(this).closest(".submenu").children("a").addClass("active subdrop");

//         // showPage(page);
//     });

//     // Gestion du bouton retour/avant navigateur
//     window.addEventListener("popstate", function (event) {

//         // Définir la page par défaut selon le profil
//         switch (prestaprofil) {
//             case 13:
//                 page = "clinique_dashboard";
//                 break;
//             // case 14:
//             //     defaultPage = "chu_dashboard";
//             //     break;
//             // case 15:
//             //     defaultPage = "pharma_dashboard";
//             //     break;
//             // ajoute ici d’autres cas si besoin
//             // default:
//             //     defaultPage = "default_dashboard";
//         }


//         if (event.state && event.state.page) {
//             page = event.state.page;
//         } else {
//             page = getPageFromUrl() || page;
//         }

//         // Afficher la page sans pousser une nouvelle entrée historique
//         showPage(page, false);

//         // Mettre à jour menu actif en simulant clic
//         $(`[data-page="${page}"]`).trigger("click");
//     });

//     // Chargement initial
//     loadPageFromUrl();

//     function loadScriptForPage(page) {
//         const scriptMap = {
//             clinique_nouvelle_consultation: [
//                 "/assets/app/js/clinique/validation.js",
//             ],
//         };

//         const scripts = scriptMap[page];
//         if (!scripts) return;

//         scripts.forEach(scriptUrl => {
//             // Évite de charger deux fois le même script
//             if ($(`script[src="${scriptUrl}"]`).length > 0) return;

//             const script = document.createElement("script");
//             script.src = scriptUrl;
//             script.async = true;
//             script.onload = () => {
//                 console.log(`Script ${scriptUrl} chargé pour la page ${page}`);
//             };
//             script.onerror = () => {
//                 console.error(`Erreur de chargement du script: ${scriptUrl}`);
//             };
//             document.body.appendChild(script);
//         });
//     }

// });

// $(document).ready(function () {
//     let pageTimeout = null;

//     const decodedData = atob(window.encodedUserData); // décode base64
//     const presta = JSON.parse(decodedData);
//     const codpresta = presta.user_codpresta;
//     const prestaprofil = presta.user_profil;

//     const validPages = [
//         "clinique_dashboard",
//         "clinique_facturation_interne",
//         "clinique_facturation_mensuelle",
//         "clinique_nouvelle_consultation",
//     ];

//     const titleMap = {
//         clinique_dashboard: "Tableau de bord",
//         clinique_nouvelle_consultation: "Nouvelle Consultation",
//         clinique_facturation_interne: "Facturation Interne",
//         clinique_facturation_mensuelle: "Facturation Mensuelle",
//     };

//     const urlMap = {
//         clinique_dashboard: "/?page=clinique_dashboard",
//         clinique_nouvelle_consultation: "/?page=clinique_nouvelle_consultation",
//         clinique_facturation_interne: "/?page=clinique_facturation_interne",
//         clinique_facturation_mensuelle: "/?page=clinique_facturation_mensuelle",
//     };

//     function showPage(page, updateHistory = true) {
//         if (!page) return;

//         pageloader(0);
//         $('[data-pages]').hide();
//         if (pageTimeout) clearTimeout(pageTimeout);

//         pageTimeout = setTimeout(function () {
//             $(`[data-pages="${page}"]`).show();

//             $('.div_result_assure_consultation').empty();
//             $('.div_numerobon_consultation').empty();
//             $('.div_choix_prestation_consultation').empty();
//             $('.div_montant_prestation_consultation').empty();
//             $('.div_medecin_affection_consultation').empty();
//             $('.div_info_prescription_consultation').empty();
//             $('.div_info_recu_consultation').empty();
//             $('.div_info_medicament_consultation').empty();
//             $('.div_btn_consultation').empty();

//             pageloader(1);
//             pageTimeout = null;

//             loadScriptForPage(page);
//         }, 1000);

//         const newTitle = titleMap[page] ?? "Page";
//         const newUrl = urlMap[page] ?? "/";

//         document.title = newTitle + " | Sogamad Santé";

//         if (updateHistory) {
//             window.history.pushState({ page }, newTitle, newUrl);
//             localStorage.setItem("lastVisitedPage", `${page}|${codpresta}`);
//         }
//     }

//     function getPageFromUrl() {
//         const params = new URLSearchParams(window.location.search);
//         return params.get("page");
//     }

//     function loadPageFromUrl() {
//         let page = getPageFromUrl();
//         let defaultPage = null;
//         let savedPage = null;

//         // Définir page par défaut selon profil
//         switch (prestaprofil) {
//             case 13:
//                 defaultPage = "clinique_dashboard";
//                 break;
//             // Ajouter d'autres cas ici si besoin
//             // default:
//             //     defaultPage = "clinique_dashboard";
//         }

//         // Si page invalide ou absente
//         if (!page || !validPages.includes(page)) {
//             const lastVisited = localStorage.getItem("lastVisitedPage");

//             if (lastVisited) {
//                 const [storedPage, storedCodpresta] = lastVisited.split("|");

//                 if (
//                     storedPage &&
//                     storedCodpresta &&
//                     storedCodpresta === codpresta &&
//                     validPages.includes(storedPage)
//                 ) {
//                     savedPage = storedPage;
//                     console.log("Page restaurée depuis localStorage :", savedPage);
//                 } else {
//                     console.log("Codpresta différent ou page invalide, on reste sur la page par défaut");
//                 }
//             }

//             page = savedPage || defaultPage;
//             const newUrl = `/?page=${page}`;
//             window.history.replaceState({ page }, "", newUrl);
//         }

//         // showPage(page, false);
//         $(`[data-page="${page}"]`).trigger("click");
//     }

//     function loadScriptForPage(page) {
//         const scriptMap = {
//             clinique_nouvelle_consultation: [
//                 "/assets/app/js/clinique/validation.js",
//             ],
//         };

//         const scripts = scriptMap[page];
//         if (!scripts) return;

//         scripts.forEach(scriptUrl => {
//             if ($(`script[src="${scriptUrl}"]`).length > 0) return;

//             const script = document.createElement("script");
//             script.src = scriptUrl;
//             script.async = true;
//             script.onload = () => console.log(`Script ${scriptUrl} chargé pour ${page}`);
//             script.onerror = () => console.error(`Erreur chargement script: ${scriptUrl}`);
//             document.body.appendChild(script);
//         });
//     }

//     // Gestion clics menu principal
//     $("[data-page]").on("click", function (e) {
//         e.preventDefault();
//         const page = $(this).data("page");
//         showPage(page);
//     });

//     // Clic sur les liens normaux
//     $("ul li > a").not(".submenu > a").on("click", function () {
//         const page = $(this).data("page");

//         $("ul li > a").removeClass("active");
//         $(".submenu > a").removeClass("active subdrop");
//         $(".submenu ul a").removeClass("active");
//         $(this).addClass("active");

//         // showPage(page);
//     });

//     // Clic sur sous-menu
//     $(".submenu ul a").on("click", function () {
//         const page = $(this).data("page");

//         $("ul li > a").removeClass("active");
//         $(".submenu > a").removeClass("active subdrop");
//         $(".submenu ul a").removeClass("active");

//         $(this).addClass("active");
//         $(this).closest(".submenu").children("a").addClass("active subdrop");

//         // showPage(page);
//     });

//     // Gestion retour navigateur
//     window.addEventListener("popstate", function (event) {
//         let page = event.state?.page || getPageFromUrl();

//         if (!page || !validPages.includes(page)) {
//             page = "clinique_dashboard";
//         }

//         showPage(page, false);
//         $(`[data-page="${page}"]`).trigger("click");
//     });

//     loadPageFromUrl();
// });

$(document).ready(function () {
    const url = $('#url').attr('content');
    let pageTimeout = null;

    const globalPage = $('.contenu_clinique');

    const decodedData = atob(window.encodedUserData); // décode base64
    const presta = JSON.parse(decodedData);
    const codpresta = presta.user_codpresta;
    const prestaprofil = presta.user_profil;

    const validPages = [
        "clinique_dashboard",
        "clinique_facturation_interne",
        "clinique_facturation_mensuelle",
        "clinique_nouvelle_consultation",
    ];

    const titleMap = {
        clinique_dashboard: "Tableau de bord",
        clinique_nouvelle_consultation: "Nouvelle Consultation",
        clinique_facturation_interne: "Facturation Interne",
        clinique_facturation_mensuelle: "Facturation Mensuelle",
    };

    const urlMap = {
        clinique_dashboard: "/?page=clinique_dashboard",
        clinique_nouvelle_consultation: "/?page=clinique_nouvelle_consultation",
        clinique_facturation_interne: "/?page=clinique_facturation_interne",
        clinique_facturation_mensuelle: "/?page=clinique_facturation_mensuelle",
    };

    const dataPage = {
        clinique_dashboard: "dashbord",
        clinique_nouvelle_consultation: "consultation",
        clinique_facturation_interne: "factInt",
        clinique_facturation_mensuelle: "factExt",
    };

    function pageInit(dataPage)
    {
        globalPage.attr('data-page', dataPage);
        globalPage.empty();
        globalPage.append(`<div class="card-body" id="page_lorder"></div>`);
        globalPage.addClass('d-flex');
        pageloader(0);
    }

    function pageInit2(titre)
    {
        globalPage.append(`
            <div class="titre_head" >
                <div class="d-flex align-items-sm-center justify-content-center flex-wrap gap-2 mb-4">
                    <div>
                        <h4 class="fw-bold mb-0">${titre}</h4>
                    </div>
                </div>
                <div class="div_alert_global" ></div>
            </div>
        `);
    }

    // function showPage(page, updateHistory = true) {
    //     if (!page) return;

    //     pageInit(dataPage[page]);

    //     // Charger une seule fois le script global
    //     if (!window.globalScriptLoaded) {
    //         const script = document.createElement("script");
    //         script.src = url + "/assets/app/js/page.js"; // <-- ton script global ici
    //         script.async = true;
    //         script.onload = () => {
    //             console.log("Script global de page chargé");
    //             window.globalScriptLoaded = true;
    //         };
    //         script.onerror = () => console.error("Erreur de chargement du script global");
    //         document.body.appendChild(script);
    //     }

    //     if (pageTimeout) clearTimeout(pageTimeout);

    //     pageTimeout = setTimeout(function () {
    //         pageInit2(titleMap[page]);

    //         pageloader(1);
    //         globalPage.removeClass('d-flex');

    //         pageTimeout = null;

    //         loadScriptForPage(page);

    //         // Si une fonction spécifique à la page existe, on l'exécute
    //         const readyCallback = window[`onPage${toPascalCase(page)}Ready`];
    //         if (typeof readyCallback === 'function') {
    //             readyCallback();
    //         }
    //     }, 1000);

    //     const newTitle = titleMap[page] ?? "Page";
    //     const newUrl = urlMap[page] ?? "/";

    //     document.title = newTitle + " | Sogamad Santé";

    //     if (updateHistory) {
    //         window.history.pushState({ page }, newTitle, newUrl);
    //         localStorage.setItem("lastVisitedPage", `${page}|${codpresta}`);
    //     }
    // }

    function showPage(page, updateHistory = true) {
        if (!page) return;

        function continuerChargement() {
            pageInit(dataPage[page]);

            if (pageTimeout) clearTimeout(pageTimeout);

            pageTimeout = setTimeout(function () {
                pageInit2(titleMap[page]);

                pageloader(1);
                globalPage.removeClass('d-flex');
                pageTimeout = null;

                loadScriptForPage(page); // script spécifique à la page

            }, 1000);

            const newTitle = titleMap[page] ?? "Page";
            const newUrl = urlMap[page] ?? "/";

            document.title = newTitle + " | Sogamad Santé";

            if (updateHistory) {
                window.history.pushState({ page }, newTitle, newUrl);
                localStorage.setItem("lastVisitedPage", `${page}|${codpresta}`);
            }
        }

        // Charger le script global UNE SEULE FOIS, puis continuer
        if (!window.globalScriptLoaded) {
            const script = document.createElement("script");
            script.src = url + "/assets/app/js/page.js"; // ton script global
            script.async = false; // important pour garantir l'ordre
            script.onload = () => {
                console.log("Script global des pages chargé");
                window.globalScriptLoaded = true;
                continuerChargement(); // on continue ici
            };
            script.onerror = () => {
                console.error("Erreur chargement script global");
            };
            document.body.appendChild(script);
        } else {
            // si déjà chargé
            continuerChargement();
        }
    }

    function getPageFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("page");
    }

    function loadPageFromUrl() {
        let page = getPageFromUrl();
        let defaultPage = null;
        let savedPage = null;

        // Définir page par défaut selon profil
        switch (prestaprofil) {
            case 13:
                defaultPage = "clinique_dashboard";
                break;
            // Ajouter d'autres cas ici si besoin
            // default:
            //     defaultPage = "clinique_dashboard";
        }

        // Si page invalide ou absente
        if (!page || !validPages.includes(page)) {
            const lastVisited = localStorage.getItem("lastVisitedPage");

            // if (lastVisited) {
            //     const [storedPage, storedCodpresta] = lastVisited.split("|");

            //     if (
            //         storedPage &&
            //         storedCodpresta &&
            //         storedCodpresta === codpresta &&
            //         validPages.includes(storedPage)
            //     ) {
            //         savedPage = storedPage;
            //         console.log("Page restaurée depuis localStorage :", savedPage);
            //     } else {
            //         console.log("Codpresta différent ou page invalide, on reste sur la page par défaut");
            //     }
            // }

            page = savedPage || defaultPage;
            const newUrl = `/?page=${page}`;
            window.history.replaceState({ page }, "", newUrl);
        }

        // showPage(page, false);
        $(`[data-page="${page}"]`).trigger("click");
    }

    function loadScriptForPage(page) {
        const scriptMap = {
            clinique_dashboard: [
                url + "/assets/app/js/clinique/dashbord.js",
            ],
            clinique_nouvelle_consultation: [
                url + "/assets/app/js/clinique/consultation.js",
            ],
        };

        // Supprimer tous les scripts déclarés dans le scriptMap
        Object.values(scriptMap).flat().forEach(scriptUrl => {
            const existingScript = $(`script[src="${scriptUrl}"]`);
            if (existingScript.length > 0) {
                existingScript.remove();
                console.log(`🗑️ Script supprimé : ${scriptUrl}`);
            }
        });

        // Charger uniquement les scripts de la page demandée
        const scripts = scriptMap[page];
        if (!scripts) return;

        scripts.forEach(scriptUrl => {
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            script.onload = () => console.log(`✅ Script chargé : ${scriptUrl}`);
            script.onerror = () => console.error(`❌ Erreur chargement script : ${scriptUrl}`);
            document.body.appendChild(script);
        });
    }



    // Gestion clics menu principal
    $("[data-page]").on("click", function (e) {
        e.preventDefault();
        const page = $(this).data("page");
        showPage(page);
    });

    // Clic sur les liens normaux
    $("ul li > a").not(".submenu > a").on("click", function () {
        const page = $(this).data("page");

        $("ul li > a").removeClass("active");
        $(".submenu > a").removeClass("active subdrop");
        $(".submenu ul a").removeClass("active");
        $(this).addClass("active");

        // showPage(page);
    });

    // Clic sur sous-menu
    $(".submenu ul a").on("click", function () {
        const page = $(this).data("page");

        $("ul li > a").removeClass("active");
        $(".submenu > a").removeClass("active subdrop");
        $(".submenu ul a").removeClass("active");

        $(this).addClass("active");
        $(this).closest(".submenu").children("a").addClass("active subdrop");

        // showPage(page);
    });

    // Gestion retour navigateur
    window.addEventListener("popstate", function (event) {
        let page = event.state?.page || getPageFromUrl();

        if (!page || !validPages.includes(page)) {
            page = "clinique_dashboard";
        }

        showPage(page, false);
        $(`[data-page="${page}"]`).trigger("click");
    });

    loadPageFromUrl();
});

