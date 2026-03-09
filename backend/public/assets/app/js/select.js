$(document).ready(function () {

    window.select_server = function (id,id_server) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        $.ajax({
            url: $('#url').attr('content') + '/api/select_server',
            method: 'GET',
            success: function(response) {
                let data = response.data;

                // Vérifier si data est une chaîne et la convertir
                // if (typeof data === 'string') {
                //     data = JSON.parse(data);
                // }

                data.forEach(function(item, index) {
                    selectElement2.append($('<option>', {
                        value: item.id,
                        text: item.name,
                        selected: id_server != 0 && item.id == id_server,
                        'data-name': item.name,
                        'data-host': item.ip,
                        'data-database': item.bd,
                        'data-username': item.username,
                        'data-password': item.password
                    }));
                });
            },
            error: function() {
                console.error('Erreur lors du chargement des serveurs.');
            }
        });
    }

    window.select_users = function (id,id_font) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        $.ajax({
            url: $('#url').attr('content') + '/api/list_users',
            method: 'GET',
            success: function(response) {
                let data = response.data;

                data.forEach(function(item, index) {
                    selectElement2.append($('<option>', {
                        value: item.id,
                        text: item.name,
                        selected: id_font != 0 && item.id == id_font,
                        'data-name': item.name,
                        'data-login': item.login,
                        'data-g_users': item.g_users,
                        'data-g_servers': item.g_servers,
                        'data-actif': item.actif
                    }));
                });
            },
            error: function() {
                console.error('Erreur lors du chargement des serveurs.');
            }
        });
    }

    window.select_client= function (id) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: 'tout',
            text: 'Tout',
        }));

        var host = $("#db_host").val();
        var db = $("#db_database").val();
        var user = $("#db_username").val();
        var mdp = $("#db_password").val();

        $.ajax({
            url: $('#url').attr('content') + '/api/select_client',
            method: 'GET',
            data: {
                host: host,
                db: db,
                user: user,
                mdp: mdp,
            },
            success: function(response) {
                const data = response.data;

                data.forEach(function(item) {
                    selectElement2.append($('<option>', {
                        value: item.numcli,
                        text: item.nomcli,
                    }));
                });
            },
            error: function() {
                // showAlert('danger', 'Impossible de generer le code automatiquement');
            }
        });
    }

    window.select_recap_souscrit_client= function (id) 
    {
        const selectElement2 = $(id);
        selectElement2.empty();
        selectElement2.append($('<option>', {
            value: '',
            text: '',
        }));

        var host = $("#db_host").val();
        var db = $("#db_database").val();
        var user = $("#db_username").val();
        var mdp = $("#db_password").val();

        $.ajax({
            url: $('#url').attr('content') + '/api/liste_recap_souscrit_client',
            method: 'GET',
            data: {
                host: host,
                db: db,
                user: user,
                mdp: mdp,
            },
            success: function(response) {
                const data = response.data;

                data.forEach(function(item) {
                    selectElement2.append($('<option>', {
                        value: item.numcli,
                        text: item.nomcli,
                    }));
                });
            },
            error: function() {
                // showAlert('danger', 'Impossible de generer le code automatiquement');
            }
        });
    }

    window.select_annee = function (id) 
    {
        const selectElement = $(id);
        selectElement.empty();
        
        const currentYear = new Date().getFullYear();
        const startYear = 2000;

        // Ajouter les années en ordre décroissant
        for (let year = currentYear; year >= startYear; year--) {
            const option = $('<option>', {
                value: year,
                text: year,
                selected: year === currentYear
            });

            selectElement.append(option);
        }
    };

    window.selectRefresh = function () 
    {

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };

    window.afficherPrestations = function (prestations, targetId) 
    {

        const $select = $(targetId);
        $select.empty();
        $select.append('<option></option>');

        prestations.forEach(presta => {
            const option = `<option 
                value="${presta.codgaran}"
                data-pratique="${presta.pratique}" 
                data-sexe="${presta.sexe}" 
                data-agemin="${presta.agemin}" 
                data-agemax="${presta.agemax}">
                ${presta.libgaran}
            </option>`;

            $select.append(option);
        });

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };

    window.afficherMedocs = function (medicaments, targetId, targetId2) 
    {

        const medocData = [
            { id: '', text: 'Aucun médicament' }, // Option vide en premier
            ...medicaments.map(m => ({
                id: m.pr_code,
                text: m.pr_nom
            }))
        ];

        $(targetId).select2({
            data: medocData,
            placeholder: 'Sélectionner le médicament',
            width: '100%',
            language: {
                noResults: () => "Aucun résultat trouvé"
            }
        });


        $(targetId2).select2({
            width: '100%',
        });   

    };

    window.afficherMedecinAffection = function (medecins, affections, Idmedecin, Idaffection) 
    {

        const $select1 = $(Idmedecin);
        $select1.empty();
        $select1.append('<option></option>');

        medecins.forEach(item => {
            const option = `<option 
                value="${item.codmed}"
                data-codpresta="${item.codpresta}" 
                data-etat="${item.etat}" 
                data-numordre="${item.numordre}" 
                data-specialitemed="${item.specialitemed}">
                ${item.nomedecin}
            </option>`;

            $select1.append(option);
        });

        const $select2 = $(Idaffection);
        $select2.empty();
        $select2.append('<option></option>');

        affections.forEach(item => {
            const option = `<option 
                value="${item.codeaff}"
                data-numordr="${item.numordr}">
                ${item.libaff}
            </option>`;

            $select2.append(option);
        });

        $('.select2').select2({
            placeholder: 'Sélectionner',
            width: '100%',
            language: {
                noResults: function () {
                    return "Aucun résultat trouvé";
                }
            }
        });    

    };


});