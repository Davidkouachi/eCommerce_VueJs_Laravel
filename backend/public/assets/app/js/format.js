$(document).ready(function () {

    window.formatDate = function (dateString) {

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
    }

    window.formatDatenum= function (dateString) {

        if (!dateString || dateString.length !== 8) return dateString; // Vérification de la validité

        let year = dateString.substring(0, 4);
        let month = dateString.substring(4, 6);
        let day = dateString.substring(6, 8);

        return `${day}/${month}/${year}`;
    }

    window.formatDateHeure = function (dateString) {

        const date = new Date(dateString);
            
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
    }

    window.calculAge = function (dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();

        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        let dayDiff = today.getDate() - birthDate.getDate();

        // Ajustement pour les mois et jours
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            ageYears--;
            monthDiff += 12; // Compte les mois restants de l'année précédente
        }

        // Ajustement des jours pour éviter des mois incomplets
        if (dayDiff < 0) {
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Dernier jour du mois précédent
            dayDiff += prevMonth.getDate();
            monthDiff--;
        }

        // Si l'âge est inférieur à un an, retourner les mois et jours
        if (ageYears === 0) {
            if (monthDiff === 0) {
                return `${dayDiff} jour${dayDiff > 1 ? 's' : ''}`; // Retourne les jours si < 1 mois
            }
            return `${monthDiff} mois${dayDiff > 0 ? ` et ${dayDiff} jour${dayDiff > 1 ? 's' : ''}` : ''}`;
        }

        // Retourne l'âge en années
        return `${ageYears} an${ageYears > 1 ? 's' : ''}`;
    };

    window.timeAgo = function (date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const intervals = [
            { label: "an", seconds: 31536000 },
            { label: "mois", seconds: 2592000 },
            { label: "semaine", seconds: 604800 },
            { label: "jour", seconds: 86400 },
            { label: "heure", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "seconde", seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `Il y a ${count} ${interval.label}${count > 1 ? "" : ""}`;
            }
        }
        return "À l'instant";
    }

    window.numberTel = function (id) {
        var inputElement = $(id); // Sélectionner l'élément avec son ID

        // Permettre uniquement les chiffres lors de la saisie
        inputElement.on('keypress', function (event) {
            const key = event.which || event.keyCode; // Récupérer le code de la touche
            // Vérifier si la touche n'est pas un chiffre ou les touches spéciales (backspace, delete, tab, etc.)
            if (
                (key < 48 || key > 57) && // Chiffres (0-9)
                key !== 8 && // Backspace
                key !== 46 && // Delete
                key !== 9 // Tab
            ) {
                event.preventDefault();
            }
        });

        // Écouter l'événement 'input' pour valider et nettoyer la saisie
        inputElement.on('input', function () {
            $(this).val($(this).val().replace(/[^0-9]/g, '')); // Remplacer tout ce qui n'est pas un chiffre
        });
    };

    window.numberTelLimit = function (id) {
        var inputElement = $(id); // Sélectionner l'élément avec son ID

        inputElement.on('input', function () {
            let value = $(this).val(); // Récupérer la valeur actuelle
            if (value.length > 10) {
                value = value.substring(0, 10); // Limiter à 10 caractères
            }
            $(this).val(value); // Mettre à jour la valeur nettoyée et limitée
        });
    };

    window.formatPrice = function (prix) {
        if (!prix) return '';

        // Supprime tout sauf les chiffres et la virgule
        prix = prix.toString().replace(/[^\d,]/g, '');

        // Remplace la virgule par un point pour la conversion
        prix = prix.replace(',', '.');

        // Convertit en nombre flottant
        let number = parseFloat(prix);

        if (isNaN(number)) {
            return '';
        }

        // Arrondit à l'entier le plus proche
        number = Math.round(number);

        // Retourne formaté avec des points comme séparateurs de milliers (français)
        return number.toLocaleString('fr-FR');
    }

    window.preloader = function (count) {

        if (count == 0) {
            let preloader_ch = `
                <div id="preloader_ch">
                    <div class="spinner_preloader_ch">
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
            `;
            $("body").append(preloader_ch);
        } else if (count == 1) {
            $('#preloader_ch').remove();
        }

        
    }

    window.preloaderBar = function () {

        let preloader_ch = `
            <div id="preloader_ch">
                <div class="bg-white p-2 rounded d-flex flex-column align-items-center justify-content-center" style="width:300px;">  
                    <strong class="text-info me-1 fw-bold" >Chargement des données...</strong>
                    <strong id="progressTextdata" class="text-info me-1 fw-bold" ></strong>
                    <div class="progress w-75 mt-2">
                        <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-info"
                             role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                    <span id="progressText" class="mt-2 text-info fw-bold">0%</span>
                </div>
            </div>
        `;
        $("body").append(preloader_ch);
    };

    window.preloaderBarContenu = function (progress, totalProcessed, totalCount) {

        $("#progressTextdata").text(totalProcessed + " / " + totalCount + " données trouvées").stop(true, true).slideDown();

        if (progress >= 100) {
            $("#progressBar").css("width", progress + "%").attr("aria-valuenow", progress);
            $("#progressText").text(progress + "% terminé");
            // Attendre 1 seconde avant de supprimer le loader
            setTimeout(function () {
                $("#preloader_ch").remove();
            }, 1000); // 1000 ms = 1 seconde
        } else {
            $("#progressBar").css("width", progress + "%").attr("aria-valuenow", progress);
            $("#progressText").text(progress + "%");
        }
    };

    window.determinePerPage = function (total) {
        if (total <= 50) return 10;
        if (total > 50 && total <= 200) return 25;
        if (total > 200 && total <= 1000) return 50;
        return 100;
    }

    window.select_annee = function (id) 
    {
        const selectElement = $(id);
        selectElement.empty();
        selectElement.append($('<option>', {
            value: '',
            text: '',
        }));
        
        const currentYear = new Date().getFullYear();
        const startYear = 2010;

        // Ajouter les années en ordre décroissant
        for (let year = currentYear; year >= startYear; year--) {
            const option = $('<option>', {
                value: year,
                text: year,
                // selected: year === currentYear
            });

            selectElement.append(option);
        }
    };

    window.confirmAction = function (title = "Confirmation requise", text = "Cette opération est irréversible. Êtes-vous sûr de vouloir effectuer cette action ? .")
    {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non"
        });
    }

    window.pageloader = function (id) {
        let $loaderContainer = $("#page_lorder");

        if (id === 0) {
            let loader = `
                <div id="pageloader_content" class="d-flex align-items-center justify-content-center">
                    <button class="btn btn-warning" type="button" disabled>
                        <span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>
                        Chargement en cours...
                    </button>
                </div>
            `;

            // Ne pas ajouter les classes ici, car le loader contient déjà les bonnes classes
            $loaderContainer
                .addClass("d-flex align-items-center justify-content-center")
                .html(loader);
        } else if (id === 1) {
            // Supprimer le contenu du loader
            $loaderContainer.removeClass("d-flex align-items-center justify-content-center");
            $("#pageloader_content").remove();
        }
    }

    window.formatDateEtAge = function (dateIso) {
        if (!dateIso) return "Date invalide";

        const dateObj = new Date(dateIso);
        if (isNaN(dateObj)) return "Date invalide";

        // Format d/m/Y
        const jour = String(dateObj.getDate()).padStart(2, '0');
        const mois = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois = 0 à 11
        const annee = dateObj.getFullYear();
        const dateFormatee = `${jour}/${mois}/${annee}`;

        // Calcul âge
        const aujourdHui = new Date();
        let age = aujourdHui.getFullYear() - annee;
        const moisActuel = aujourdHui.getMonth();
        const jourActuel = aujourdHui.getDate();
        if (
            moisActuel < dateObj.getMonth() ||
            (moisActuel === dateObj.getMonth() && jourActuel < dateObj.getDate())
        ) {
            age--;
        }

        return `${dateFormatee} (${age} ans)`;
    }

    window.calculerAgeNumber = function (dateNaissance) {
        const aujourdHui = new Date();
        const naissance = new Date(dateNaissance);
        let age = aujourdHui.getFullYear() - naissance.getFullYear();
        const mois = aujourdHui.getMonth() - naissance.getMonth();

        if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
            age--;
        }

        return age;
    }

    window.OffClick = function (selector, fonction) {
        $(document).off('click', selector).on('click', selector, fonction);
    }

    window.OffChange = function (selector, fonction) {
        $(document).off('change', selector).on('change', selector, fonction);
    }

    window.overDisplay = function (mode) {

        if (mode === 0) {
            // Créer et afficher l'overlay si non présent
            if ($('#global-spinner-overlay').length === 0) {
                $('body').append(`
                    <div id="global-spinner-overlay" style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(255, 255, 255, 0);
                        z-index: 9999;
                        cursor: not-allowed;
                    "></div>
                `);
            }
        } else {
            // Supprimer l'overlay
            $('#global-spinner-overlay').remove();
        }
    }

    window.spinerButton = function (mode, buttonId, label, icon = 0, iconLabel = '') {
        const $button = $(buttonId);

        if (mode === 0) {
            // Mode avec spinner
            $button.html(`
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                ${label}...
            `);
            overDisplay(0);

        } else if (icon === 1) {
            // Mode avec icône
            $button.html(`
                <i class="fa fa-${iconLabel} me-2"></i>
                ${label}
            `);
            overDisplay(1);

        } else {
            // Mode simple (juste le texte)
            $button.html(`${label}`);
            overDisplay(1);
        }
    }

});
