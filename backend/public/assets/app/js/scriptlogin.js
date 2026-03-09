$(document).ready(function () {

    // // Liste des images
    // const backgroundImages = [
    //     "assets/img/plan1.jpg",
    //     "assets/img/plan2.jpg",
    //     "assets/img/plan3.jpg"
    // ];

    // // Choisir une image au hasard
    // const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    // const selectedImage = backgroundImages[randomIndex];

    // // Appliquer l'image avec une superposition sombre
    // $('#authBackground').css('background-image', `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0,0,0,0.4)), url('${selectedImage}')`);

    // Gestionnaire pour le formulaire de login
    $("#form_login").on("submit", function (event) {
        event.preventDefault();

        let login = $("#login").val().trim();
        let password = $("#password").val().trim();
        let remember_me = $('#remember_me').val().trim();

        if (!login || !password) {
            // showAlert("Alert","Veuillez bien vérifier le Login et le Mot de passe s'il vous plaît !!!","warning");
            showAlert2(
                ".div_alert",
                "info-circle",
                "Veuillez bien vérifier le Login et le Mot de passe s'il vous plaît !!!",
                "warning",
                "0",
                );
            return false;
        }

        // preloader(0);

        spinerButton(0, '.btn_connexion', 'Vérification');

        $(".div_alert").empty();

        // Première requête : rafraîchir le token CSRF
        $.ajax({
            url: $('#url').attr('content') + "/refresh-csrf",
            method: "GET",
            success: function (response_crsf) {
                $('meta[name="csrf-token"]').attr("content", response_crsf.csrf_token);

                // Deuxième requête : authentification
                $.ajax({
                    url: $('#url').attr('content') + "/api/traitement_login",
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": response_crsf.csrf_token,
                    },
                    data: {
                        login: login,
                        password: password,
                        remember_me: remember_me,
                    },
                    success: function (response) {

                        // preloader(1);
                        spinerButton(1, '.btn_connexion', 'Connexion');

                        if (response.success) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "success",
                                "0",
                            );

                            $('.div_form').hide();             

                            window.location.href = $('#url').attr('content') + "/";

                        } else if (response.user_connecter) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "info",
                                "0",
                            );
                        } else if (response.user_introuvable) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "warning",
                                "0",
                            );
                        } else if (response.user_inactif) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "info",
                                "0",
                            );
                        } else if (response.error_identifiant) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "danger",
                                "0",
                            );
                        } else if (response.user_profil_refuser) {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                response.message,
                                "danger",
                                "0",
                            );
                        } else {
                            showAlert2(
                                ".div_alert",
                                "info-circle",
                                "Désolé, une erreur est survenue. Veuillez rafraîchir la page ou revenir plus tard.",
                                "danger",
                                "0",
                            );
                        }
                    },
                    error: function () {
                        // preloader(1);
                        spinerButton(1, '.btn_connexion', 'Connexion');
                        showAlert("Erreur", "Erreur lors de l'authentification.", "error");
                    },
                });
            },
            error: function () {
                // preloader(1);
                spinerButton(1, '.btn_connexion', 'Connexion');
                showAlert("Erreur", "Une erreur est survenue lors de la recupération du token.", "error");
            },
        });
    });

    // Fonction pour gérer la redirection après authentification
    function redirectTo(login) {
        let userLogin = login;

        // Récupérer ou initialiser le tableau userPages
        let userPages = JSON.parse(localStorage.getItem("userPages")) || [];

        // Trouver l'utilisateur dans le tableau
        let userIndex = userPages.findIndex((user) => user.login === userLogin);

        if (userIndex !== -1) {
            window.location.href = userPages[userIndex].lastUrl;
        } else {
            window.location.href = $('#url').attr('content') + "/";
        }
    }

});
