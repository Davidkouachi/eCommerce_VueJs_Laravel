$(document).ready(function () {

    const globalePage = $('.contenu_clinique');

    const url = $('#url').attr('content');
    const decodedData = atob(window.encodedUserData);
    const presta = JSON.parse(decodedData);

    // console.log(presta);

    let compteurLigne = 0;
    let maxLignes = 3;

    let infoUser = [];
    let infoNumBon = '';
    let infoTaux = 0;
    let infoPrestation = [];
    let infoMedecin = [];
    let infoAffection = [];
    let infoMedoc = [];

    initStart();

    function initStart() 
    {
        console.log('page consultation charger');
        afficherMatricule();
        pageInitConsultation();
    }

    // $(document).on('click', '[data-page="clinique_nouvelle_consultation"]', function () {
    //     let tries = 0;
    //     const maxTries = 50; // ~3 secondes max
    //     const interval = setInterval(function () {
    //         if ($('.titre_head').length === 1) {
    //             clearInterval(interval);
    //             console.log('titre_head trouvé, initialisation consultation');
    //             afficherMatricule();
    //             pageInitConsultation();
    //         } else if (tries >= maxTries) {
    //             clearInterval(interval);
    //             console.warn('titre_head non trouvé après attente');
    //         }
    //         tries++;
    //     }, 100); // vérifie toutes les 100ms
    // });

    // if (globalePage.data('page') === 'consultation') {
    //     afficherMatricule();
    //     pageInitConsultation();
    // }

    OffClick('.btn_recherche_matricule', verifier_matricule);

    function verifier_matricule()
    {
        infoUser = [];
        infoTaux = 0;
        infoPrestation = [];
        infoMedecin = [];
        infoAffection = [];
        infoMedoc = [];
    
        resetDiv();

        let matricule = $('.input_matricule');

        if (!matricule.val().trim()) {
            showAlert("Alert","Veuillez saisir le numéro matricule de l'assuré s'il vous plaît","warning");
            return;
        }

        // preloader(0);
        spinerButton(0, '.btn_recherche_matricule', 'Verification en cours');

        axios.get(url + "/api/clinique/verification_assure", 
            {
                params: {
                    matricule: matricule.val(),
                    codpresta: presta.user_codpresta,
                    codesevice: presta.user_codeservice,
                    sans_bon: presta.sans_bon,
                }
            })
            .then(function (response) {
                spinerButton(1, '.btn_recherche_matricule', 'Verification', 1, 'search');

                const data = response.data;

                if (data.success) {
                    const infodatas = data.page_data;
                    const prestations = data.prestation;
                    const medecins = data.medecins;
                    const affections = data.affections;
                    const medicaments = data.medicaments;

                    infoPrestation = prestations;
                    infoMedecin = medecins;
                    infoAffection = affections;
                    infoMedoc = medicaments;

                    // 👉 Ton traitement ici
                    // console.log('Page data:', infodatas);
                    // console.log('Prestations:', prestations);
                    // console.log('Medecin:', medecins);
                    // console.log('Affection:', affections);
                    // console.log('Medicament:', medicaments);

                    infoUser = infodatas.infos_assure;
                    infoTaux = infodatas.infosAssureHabilite.tauxpol;

                    afficherInfoAdherent(infodatas);

                    if (presta.sans_bon == 0) {

                        afficherNumBon();

                    } else if (presta.sans_bon == 1) {

                        afficherPrestationPeriode(infoPrestation);
                    }

                } else if (data.alert) {

                    showAlert("Alert",data.message,"warning");
                } else {
                    // 👉 Réponse reçue, mais succès == false (optionnel)
                    showAlert("Alert","Une erreur est survenue lors de l'opération","danger");
                    console.warn('Échec logique côté serveur');
                }

            })
            .catch(function (error) {
                // preloader(1);
                spinerButton(1, '.btn_recherche_matricule', 'Verification', 1, 'search');
                console.log(error);
            });
    }

    function verifier_bon()
    {
        
        resetDivNumBon();

        let numbon = $('.input_numerobon');
        let matricule = $('.input_matricule');

        if (!numbon.val().trim()) {
            showAlert("Alert","Veuillez saisir le numéro de bon s'il vous plaît","warning");
            return;
        }

        // si l'on agmente la taille du numbon, alors il faut modifier aussi la taille dans $all_model->formaterUnNumeroDeBon dans $all_model.php
        if (numbon.val().trim().length != 7) {
            showAlert("Alert","Veuillez saisir un numéro de bon valide","warning");
            return;
        }

        // preloader(0);

        // axios.get(url + "/api/clinique/verifier_numbon", 
        //     {
        //         params: {
        //             matricule: matricule.val() ?? infoUser.matricule,
        //             numbon: numbon.val(),
        //             codpresta: presta.user_codpresta,
        //             codesevice: presta.user_codeservice,
        //             gestion_par_service: presta.gestion_par_service,
        //         }
        //     })
        //     .then(function (response) {
        //         preloader(1);

        //         const data = response.data;

        //         if (data.success) {

                    infoNumBon = numbon.val();
                    afficherPrestationPeriode(infoPrestation);

            //     } else if (data.alert) {

            //         showAlert("Alert",data.message,"warning");
            //     } else {
            //         // 👉 Réponse reçue, mais succès == false (optionnel)
            //         showAlert("Alert","Une erreur est survenue lors de l'opération","danger");
            //         console.warn('Échec logique côté serveur');
            //     }

            // })
            // .catch(function (error) {
            //     preloader(1);
            //     console.log(error);
            // });
    }

    function verifier_prestation()
    {
    
        resetDivPrestation();

        let select = $('.select_prestation');
        let matricule = $('.input_matricule');

        const codeActe = select.val();

        if (!select.val().trim()) {
            showAlert("Alert","Veuillez choisir le type de consultation s'il vous plaît","warning");
            return;
        }

        if ((calculerAgeNumber(infoUser.datenais) > 15) && (codeActe == 'CONSPED')) {
            showAlert("Alert","L'assuré pour lequel vous souhaitez enregistrer le bon de consultation a dépassé l'age maximum requis pour les consultations en pédiatrie. Il est donc impossible d'enregistrer un bon de consultation dans cette spécialité !","warning");
            $('.select_prestation').val(null).trigger('change.select2');
            return;
        }

        const filiations_autorisees = [1, 2, 6];
        const codeFiliation = infoUser.codefiliation;

        if (!filiations_autorisees.includes(codeFiliation) && (codeActe == 'CP' || codeActe == 'CCPNSFAM')) {
            showAlert(
                "Alert",
                "L'assuré pour lequel vous souhaitez enregistrer le bon de consultation n'a pas le droit de faire une consultation dans cette spécialité.",
                "warning"
            );
            $('.select_prestation').val(null).trigger('change.select2');
            return;
        }

        if (codeFiliation !== 1 && codeFiliation !== 2 && (codeActe == 'CP' || codeActe == 'CCPNSFAM') ) {
            showAlert(
                "Alert",
                "La consultation prénatale est réservée seulement à l'adhérente et à la conjointe. Il est donc impossible d'enregistrer un bon de consultation dans cette spécialité pour cet assuré !",
                "warning"
            );
            $('.select_prestation').val(null).trigger('change.select2');
            return;
        }

        const actes_reserves_aux_femmes = ['CONSGYNE', 'CP', 'CCPNSFAM', 'CONSOBST', 'OBST'];

        if (infoUser.sexe == 1 && actes_reserves_aux_femmes.includes(codeActe)) {
            showAlert(
                "Alert",
                "La consultation que vous avez choisie est réservée seulement aux femmes. Il est donc impossible d'enregistrer un bon de consultation dans cette spécialité pour cet assuré !",
                "warning"
            );
            $('.select_prestation').val(null).trigger('change.select2');
            return;
        }

        preloader(0);

        axios.get(url + "/api/clinique/verifier_prestation", 
            {
                params: {
                    matricule: matricule.val() ?? infoUser.matricule,
                    codeacte: select.val(),
                    codpresta: presta.user_codpresta,
                    codesevice: presta.user_codeservice,
                }
            })
            .then(function (response) {
                preloader(1);

                const data = response.data;

                if (data.success) {
                    const bases = data.base;
                    const calculs = data.calcul;
                    const forfait = data.forfait;
                    const niveau_assure = data.niveau_assure;
                    const niveau_presta = data.niveau_presta;
                    const blocage_prescription = data.blocage_prescription;

                    console.log('Base:', bases);
                    console.log('Calcul:', calculs);

                    afficherMontantprestation();

                    // LE TAUX DE LA POLICE DE L'ASSURE
                    var tauxpolice = infoTaux;
                    var radiocoche = codeActe;

                    let montant_prestation;
                    let montant_base_prestation;

                    switch (radiocoche) {
                        case 'jour':
                            montant_prestation = calculs.jour * 1;
                            montant_base_prestation = bases.jour * 1;
                            break;
                        case 'jnf':
                            montant_prestation = calculs.jnf * 1;
                            montant_base_prestation = bases.jnf * 1;
                            break;
                        case 'prof':
                            montant_prestation = calculs.prof * 1;
                            montant_base_prestation = bases.prof * 1;
                            break;
                        default:
                            montant_prestation = calculs.jour * 1;
                            montant_base_prestation = bases.jour * 1;
                            break;
                    }

                    if (forfait == 0) {
                        // if (codeActe != 'SOI') {
                            $('.input_prix_prestation').attr('readonly', true);
                            $('.input_prix_assurance').attr('readonly', true);
                            $('.input_prix_adherent').attr('readonly', true);

                            // var montant_base = montant_base_prestation * 1;
                            // var montant_base_jour = bases.jour * 1;
                            // if ((montant_base_jour != '') || (montant_base != '')) {
                            //     var montant_base = montant_base_prestation * 1;
                            //     var montant = montant_prestation * 1;
                            //     if (montant >= montant_base) {
                            //         $('.input_prix_prestation').val(montant_base.toLocaleString('fr-FR'));

                            //         var partsogem = (montant_base * tauxpolice) / 100;
                            //         $('.input_prix_assurance').val((partsogem * 1).toLocaleString('fr-FR'));

                            //         var partassure = montant - ((partsogem * 1) * 1);
                            //         $('.input_prix_adherent').val(partassure.toLocaleString('fr-FR'));
                            //     } else {
                            //         $('.input_prix_prestation').val(montant_base.toLocaleString('fr-FR'));

                            //         var partsogem = ((montant_base * tauxpolice) * 1) / 100;
                            //         $('.input_prix_assurance').val((partsogem * 1).toLocaleString('fr-FR'));

                            //         var partassure = montant_base - ((partsogem * 1) * 1);
                            //         $('.input_prix_adherent').val(partassure.toLocaleString('fr-FR'));
                            //     }
                            // } else {
                            //     $('.input_prix_prestation').val(montant_base);

                            //     var montant = montant_prestation * 1;
                            //     var partsogem = (montant * tauxpolice) / 100;
                            //     $('.input_prix_assurance').val((partsogem * 1).toLocaleString('fr-FR'));

                            //     var partassure = montant - ((partsogem * 1) * 1);
                            //     $('.input_prix_adherent').val((partassure * 1).toLocaleString('fr-FR'));
                            // }

                            let montant_base = Number(montant_base_prestation);
                            let montant_base_jour = Number(bases.jour);
                            let montant = Number(montant_prestation);
                            let taux = Number(tauxpolice);

                            if (montant_base_jour !== 0 || montant_base !== 0) {
                                montant_base = Number(montant_base_prestation); // Redondant mais gardé par sécurité

                                // Si le montant payé est >= au montant de base
                                let base_utilisee = montant >= montant_base ? montant_base : montant;

                                $('.input_prix_prestation').val(base_utilisee.toLocaleString('fr-FR'));

                                let part_assurance = (base_utilisee * taux) / 100;
                                let part_adherent = base_utilisee - part_assurance;

                                $('.input_prix_assurance').val(part_assurance.toLocaleString('fr-FR'));
                                $('.input_prix_adherent').val(part_adherent.toLocaleString('fr-FR'));

                            } else {
                                // Pas de base fournie, on utilise le montant brut
                                $('.input_prix_prestation').val(montant.toLocaleString('fr-FR'));

                                let part_assurance = (montant * taux) / 100;
                                let part_adherent = montant - part_assurance;

                                $('.input_prix_assurance').val(part_assurance.toLocaleString('fr-FR'));
                                $('.input_prix_adherent').val(part_adherent.toLocaleString('fr-FR'));
                            }


                        // } 
                        // else if (codeActe == 'SOI') {
                        //     var montantSoin = prompt("Saisir le montant total des soins", "0");

                            // $('.input_prix_prestation').on('input', function() {

                            //     if (!$(this).val().trim()) {
                            //         $(this).val(0);
                            //     }

                            //     let rawValue = 0;
                            //     rawValue = parseInt($(this).val().replace(/[^0-9]/g, ''));

                            //     let partsogem = (rawValue * tauxpolice) / 100;
                            //     $('.input_prix_assurance').val((partsogem * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                            //     let partassure = rawValue - ((partsogem * 1) * 1);
                            //     $('.input_prix_adherent').val((partassure * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                            //     $('.input_prix_prestation').val((rawValue * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

                            // });

                        // }
                    } else if (forfait == 1) {

                        showAlert2(
                            ".div_alert_montant",
                            "info-circle",
                            "Saisir le ticket moderateur",
                            "warning",
                            "0",
                        );

                        $('.input_prix_prestation').attr('readonly', true);
                        $('.input_prix_assurance').attr('readonly', true);
                        $('.input_prix_adherent').attr('readonly', false);

                        // $('.input_prix_adherent').on('input', function() {

                        //     if (!$(this).val().trim()) {
                        //         $(this).val(0);
                        //     }

                        //     let rawValue = 0;
                        //     rawValue = parseInt($(this).val().replace(/[^0-9]/g, ''));

                        //     let partsogem = montant_prestation;
                        //     $('.input_prix_assurance').val(partsogem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
                        //     $('.input_prix_adherent').val(rawValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

                        //     var montSog = parseInt(partsogem);
                        //     var ticketMod = parseInt(rawValue);
                        //     var MontantTotal = montSog + ticketMod;

                        //     $('.input_prix_prestation').val(MontantTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

                        // });

                        $('.input_prix_adherent').on('input', function () {
                            let valeurChamp = $(this).val().trim();

                            // Remplacer vide par 0
                            if (!valeurChamp) {
                                valeurChamp = '0';
                            }

                            // Nettoyer et parser en nombre
                            let rawValue = parseInt(valeurChamp.replace(/\D/g, ''), 10) || 0;

                            // Reformatter les champs
                            const partsogem = parseInt(montant_prestation, 10) || 0;

                            $('.input_prix_assurance').val(partsogem.toLocaleString('fr-FR'));
                            $('.input_prix_adherent').val(rawValue.toLocaleString('fr-FR'));

                            const montantTotal = partsogem + rawValue;

                            $('.input_prix_prestation').val(montantTotal.toLocaleString('fr-FR'));
                        });

                    }

                    if (presta.new_gestion == 0) {

                        afficherMedecinaffcetion();

                        afficherPrescription();

                        afficherRecu();

                        afficherMedicament(infoMedoc);

                        $(document).off('change', '.select_medecin').on('change', '.select_medecin', function () {
                            
                            let value = $(this).val().trim();

                            let value2 = $('.select_codeaffection').val().trim();

                            if (value && value2 && !$('.div_info_prescription').is(':visible')) {
                                $('.div_info_prescription').show('slow');
                            }

                        });

                        $(document).off('change', '.select_codeaffection').on('change', '.select_codeaffection', function () {
                            
                            let value = $(this).val().trim();

                            let value2 = $('.select_medecin').val().trim();

                            if (value && value2 && !$('.div_info_prescription').is(':visible')) {
                                $('.div_info_prescription').show('slow');
                            }

                        });

                        $(document).off('change', '.select_medicament_prescrit').on('change', '.select_medicament_prescrit', function () {
                            let value = $(this).val().trim();

                            // Gestion de .div_info_recu
                            if (value == 0 && !$('.div_info_recu').is(':visible')) {
                                $('.div_info_recu').show('slow');

                                resetMedicament();
                                $('.div_info_medicament').show('slow');

                                $('.select_complementaire').val(null).trigger('change.select2');

                                $('.input_num_recu').val(null);
                                $('.input_prix_recu').val(0);

                            } else if (value == 1 && $('.div_info_recu').is(':visible')) {
                                $('.div_info_recu').hide('slow');
                                $('.div_info_medicament').hide('slow');
                            }

                            // Gestion de .card_complementaire
                            if (value == 0) {
                                $('.card_complementaire').show('slow');
                            } else {
                                $('.card_complementaire').hide('slow');
                            }

                            if ($('.div_btn').is(':empty')) {
                                afficherBtnValier();
                            } else {
                                $('.div_btn').show('slow');
                            }

                            
                        });

                    } else if (presta.sans_bon == 1) {

                        if ($('.div_btn').is(':empty')) {
                            afficherBtnValier();
                        } else {
                            $('.div_btn').show('slow');
                        }

                    }


                } else if (data.alert) {
                    $('.select_prestation').val(null).trigger('change.select2');
                    showAlert("Alert",data.message,"warning");
                } else {
                    // 👉 Réponse reçue, mais succès == false (optionnel)
                    $('.select_prestation').val(null).trigger('change.select2');
                    showAlert("Alert","Une erreur est survenue lors de l'opération","danger");
                    console.warn('Échec logique côté serveur');
                }

            })
            .catch(function (error) {
                preloader(1);
                console.log(error);
            });
    }












    // debut reset div section

    function resetDiv()
    {
        $('.div_result_assure').empty();
        $('.div_choix_prestation').empty();
        $('.div_montant_prestation').empty();
        $('.div_medecin_affection').empty();
        $('.div_numerobon').empty();
        $('.div_info_prescription').empty();
        $('.div_info_recu').empty();
        $('.div_info_medicament').empty();
        $('.div_btn').empty();
    }

    function resetDivNumBon()
    {
        $('.div_choix_prestation').empty();
        $('.div_montant_prestation').empty();
        $('.div_medecin_affection').empty();
        $('.div_info_prescription').empty();
        $('.div_info_recu').empty();
        $('.div_info_medicament').empty();
        $('.div_btn').empty();
    }

    function resetDivPrestation()
    {
        $('.div_montant_prestation').empty();
        $('.div_medecin_affection').empty();
        $('.div_info_prescription').empty();
        $('.div_info_recu').empty();
        $('.div_info_medicament').empty();
        $('.div_btn').empty();
    }

    function resetMedicament()
    {
        for (let i = 1; i <= 3; i++) {
            $(`#select_medoc_${i}`).val(null).trigger('change.select2');
            $(`#select_medoc_qte_${i}`).val(1).trigger('change.select2');
        }
    }

    // fin reset div section


    // debut affiche div section

    function afficherMatricule()
    {
        // const div_matricule = `
        //     <div class="card rounded-0 div_matricule">
        //         <div class="card-header">
        //             <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
        //                 <div class="form-floating">
        //                     <input type="text" class="form-control form-control-sm input_matricule text-center" id="floatingPassword" value="S00061001769301">
        //                     <label for="floatingPassword">Matricule de l'assuré</label>
        //                 </div>
        //                 <a class="btn btn-success btn_recherche_matricule">
        //                     <i class="fa fa-search me-2"></i>
        //                     Vérification
        //                 </a>
        //             </div>
        //         </div>
        //     </div>
        // `;

        // Insertion juste après .titre_head
        // $('.contenu_clinique .titre_head').after(div_matricule);
        globalePage.append(divMatriculeAdherent());

    }

    function afficherNumBon()
    {
        // const div_numerobon = `
        //     <div class="card rounded-0">
        //         <div class="card-header">
        //             <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
        //                 <div class="form-floating">
        //                     <input type="text" class="form-control form-control-sm input_numerobon text-center" id="floatingPassword" maxlength="7" placeholder="">
        //                     <label for="floatingPassword">Numéro du bon</label>
        //                 </div>
        //                 <a class="btn btn-success btn_recherche_numerobon">
        //                     <i class="fa fa-search me-2"></i>
        //                     Vérification du Bon
        //                 </a>
        //             </div>
        //         </div>
        //     </div>
        // `;

        $('.div_numerobon').hide();
        $('.div_numerobon').append(divNumBon());
        $('.div_numerobon').show('slow');

        OffClick('.btn_recherche_numerobon', verifier_bon);

        numberTel('.input_numerobon');
    }

    function pageInitConsultation()
    {
        globalePage.append(`
            <div class="div_result_assure"></div>
            <div class="div_numerobon"></div>
            <div class="div_choix_prestation"></div>
            <div class="div_montant_prestation"></div>
            <div class="div_medecin_affection"></div>
            <div class="div_info_prescription"></div>
            <div class="div_info_recu"></div>
            <div class="div_info_medicament"></div>
            <div class="div_btn"></div>
        `);
    }

    function afficherInfoAdherent(infodatas)
    {
        const div_result_assure = `
            <div class="card rounded-0 p-3">
                <div class="row align-items-center">
                    <div class="col-12">
                        <div class="alert alert-danger text-bg-danger text-center" role="alert">
                            <strong>
                                ${infodatas.tarificationA}
                            </strong>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar avatar-xxxl">
                                <img height="90" src="${infodatas.image_link}" alt="user-01" class="img-fluid img1 rounded border border-1">
                            </div>
                            <div class="">
                                <span class="badge badge-md text-info border border-info mb-1 fs-13 fw-medium px-2 ">
                                    ${infodatas.infosAssureHabilite.matricule} 
                                    (${infodatas.infos_assure.codefiliation == 1 ? 'Adhérent' : 'Bénéficiaire' })
                                </span>
                                <h5 class="text-dark mb-1 fw-bold"> ${infodatas.infosAssureHabilite.nomassure} </h5>
                                <p class="text-dark m-0"> 
                                    <span class="text-body"> 
                                        Produit : 
                                    </span>
                                    ${infodatas.infosAssureHabilite.libprod}
                                </p>
                                ${infodatas.infos_assure.codefiliation == 1 ? '' : `
                                    <p class="text-dark m-0"> 
                                        <span class="text-body"> 
                                            Assué principale : 
                                        </span>
                                        ${infodatas.infos_adherent_principal.nomassure}
                                    </p>
                                ` }
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="bg-light mt-3 p-3 rounded d-flex align-items-center justify-content-between">

                            <div>
                                <div class="mb-2">
                                    <h6 class="text-dark fs-14 fw-semibold mb-1">Taux de base</h6>
                                    <p class="text-body fs-13 m-0">
                                        ${infodatas.infosAssureHabilite.tauxpol} %
                                    </p>
                                </div>
                                <div>
                                    <h6 class="text-dark fs-14 fw-semibold mb-1">Souscripteur</h6>
                                    <p class="text-body fs-13 m-0">
                                        ${infodatas.infosAssureHabilite.nomcli}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div class="mb-2">
                                    <h6 class="text-dark fs-14 fw-semibold mb-1"> Genre </h6>
                                    <p class="text-body fs-13 m-0">
                                        ${infodatas.infos_assure.sexe == 1 ? 'Masculin' : 'Féminin'}
                                    </p>
                                </div>
                                <div>
                                    <h6 class="text-dark fs-14 fw-semibold mb-1"> Date de naissance </h6>
                                    <p class="text-body fs-13 m-0">
                                        ${formatDateEtAge(infodatas.infos_assure.datenais)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div class="mb-2">
                                    <h6 class="text-dark fs-14 fw-semibold mb-1"> Profession </h6>
                                    <p class="text-body fs-13 m-0">
                                        ${!infodatas.infos_assure.profession || infodatas.infos_assure.profession === 'SANS' 
                                            ? 'Non renseigné' 
                                            : infodatas.infos_assure.profession}
                                    </p>
                                </div>
                                <div>
                                    <h6 class="text-dark fs-14 fw-semibold mb-1"> Résidence </h6>
                                    <p class="text-body fs-13 m-0">
                                        ${!infodatas.infos_assure.residence || infodatas.infos_assure.residence === 'SANS' 
                                            ? 'Non renseigné' 
                                            : infodatas.infos_assure.residence}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;

        $('.div_result_assure').hide();
        $('.div_result_assure').append(div_result_assure);
        $('.div_result_assure').show('slow');
    }

    function afficherPrestationPeriode(prestations)
    {
        const div_choix_prestation = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title">
                                    Type de consultation & Période
                                </h5>
                            </div><!-- end card-header -->
                            <div class="card-body">
                                <div action="#">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center">
                                                    <p class="mb-1 fw-bold text-muted">Selectionner le type de consultation</p>
                                                    <select class="form-control select2 select_prestation text-center" data-toggle="select2"></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
                                                    <p class="mb-1 fw-bold text-muted">Selectionner la période</p>
                                                    <select class="form-control select2 select_jour text-center" data-toggle="select2">
                                                        <option selected value="jour">Jour ouvrable</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // <option value="jnf">Jour ferié, jour non ouvrable & nuit</option>
        // <option value="prof">Professeur</option>

        $('.div_choix_prestation').hide();
        $('.div_choix_prestation').append(div_choix_prestation);
        $('.div_choix_prestation').show('slow');

        afficherPrestations(prestations, ".select_prestation");

        OffChange('.select_prestation', verifier_prestation);
    }

    function afficherMontantprestation()
    {
        const div_montant_prestation = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title">
                                    Montants pour la tarification appliquée
                                </h5>
                            </div><!-- end card-header -->
                            <div class="card-body">
                                <div class="div_alert_montant"></div>
                                <div action="#">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control form-control-sm input_prix_prestation text-center" id="prixPrestation" value="0">
                                                    <label for="prixPrestation">Montant Consultation (Fcfa)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control form-control-sm input_prix_assurance text-center" id="prixAssurance" value="0">
                                                    <label for="prixAssurance">Part Assurance (Fcfa)</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control form-control-sm input_prix_adherent text-center" id="prixAdherent" value="0">
                                                    <label for="prixAdherent">Part Adhérent (Fcfa)</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- end card-body -->
                        </div><!-- end card -->
                    </div><!-- end col -->
                </div>
            </div>
        `;

        $('.div_montant_prestation').hide();
        $('.div_montant_prestation').append(div_montant_prestation);
        $('.div_montant_prestation').show('slow');
    }

    function afficherMedecinaffcetion()
    {
        // const div_medecin_affection = `
        //     <div class="card rounded-0" >
        //         <div class="row">
        //             <div class="col-md-12">
        //                 <div class="">
        //                     <div class="card-header d-flex align-items-center justify-content-center">
        //                         <h5 class="card-title">
        //                             Médécin & Affection
        //                         </h5>
        //                     </div><!-- end card-header -->
        //                     <div class="card-body">
        //                         <div action="#">
        //                             <div class="row">
        //                                 <div class="col-md-6">
        //                                     <div class="mb-3">
        //                                         <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center">
        //                                             <p class="mb-1 fw-bold text-muted">Selectionnez le médecin</p>
        //                                             <select class="form-control select2 select_medecin text-center" data-toggle="select2"></select>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <div class="col-md-6">
        //                                     <div class="mb-3">
        //                                         <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
        //                                             <p class="mb-1 fw-bold text-muted">Selectionnez l'affection</p>
        //                                             <select class="form-control select2 select_codeaffection text-center" data-toggle="select2">
        //                                                 <option selected value="jour">Jour ouvrable</option>
        //                                             </select>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // `;

        $('.div_medecin_affection').hide();
        $('.div_medecin_affection').append(divMedecinAffection());
        $('.div_medecin_affection').show('slow');

        afficherMedecinAffection(infoMedecin, infoAffection, ".select_medecin", ".select_codeaffection");
    }

    function afficherPrescription()
    {

        // const div_info_prescription = `
        //     <div class="card rounded-0" >
        //         <div class="row">
        //             <div class="col-md-12">
        //                 <div class="">
        //                     <div class="card-header d-flex align-items-center justify-content-center">
        //                         <h5 class="card-title">
        //                             Informations sur la prescription des médicaments
        //                         </h5>
        //                     </div><!-- end card-header -->
        //                     <div class="card-body">
        //                         <div action="#">
        //                             <div class="row justify-content-center">
        //                                 <div class="col-md-6 card_prescription">
        //                                     <div class="mb-3">
        //                                         <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center">
        //                                             <p class="mb-1 fw-bold text-muted">
        //                                                 Le médecin a t-il fait une prescription sur le bon ?
        //                                             </p>
        //                                             <select class="form-control select2 select_medicament_prescrit text-center" data-toggle="select2">
        //                                                 <option></option>
        //                                                 <option value="0" >Oui</option>
        //                                                 <option value="1" >Non</option>
        //                                             </select>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <div class="col-md-6 card_complementaire" style="display:none;">
        //                                     <div class="mb-3">
        //                                         <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
        //                                             <p class="mb-1 fw-bold text-muted">
        //                                                 Le bon est-il accompagné d'un bon complémentaire ? :
        //                                             </p>
        //                                             <select class="form-control select2 select_complementaire text-center" data-toggle="select2">
        //                                                 <option></option>
        //                                                 <option value="0" >Oui, MUGEFCI ou CMU</option>
        //                                                 <option value="1" >Non, Bon simple</option>
        //                                             </select>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // `;

        $('.div_info_prescription').hide();
        $('.div_info_prescription').append(divDemandePrescription());

        selectRefresh();

    }

    function afficherRecu()
    {
        // const div_info_recu = `
        //     <div class="card rounded-0" >
        //         <div class="row">
        //             <div class="col-md-12">
        //                 <div class="">
        //                     <div class="card-header d-flex align-items-center justify-content-center">
        //                         <h5 class="card-title">
        //                             Informations sur la part de l'assuré
        //                         </h5>
        //                     </div><!-- end card-header -->
        //                     <div class="card-body">
        //                         <div class="div_alert_montant"></div>
        //                         <div action="#">
        //                             <div class="row">
        //                                 <div class="col-md-6">
        //                                     <div class="mb-3">
        //                                         <div class="form-floating">
        //                                             <input type="text" class="form-control form-control-sm input_num_recu text-center" id="numRecu" placeholder="numéro">
        //                                             <label for="numRecu">Numéro du reçu de caisse</label>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <div class="col-md-6">
        //                                     <div class="mb-3">
        //                                         <div class="form-floating">
        //                                             <input type="tel" class="form-control form-control-sm input_prix_recu text-center" id="prixPayerAssure" value="0">
        //                                             <label for="prixPayerAssure">Montant payé par l'assuré (Fcfa)</label>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div><!-- end card-body -->
        //                 </div><!-- end card -->
        //             </div><!-- end col -->
        //         </div>
        //     </div>
        // `;

        $('.div_info_recu').hide();
        $('.div_info_recu').append(divNumRecuPartClient());

        $('.input_prix_recu').on('input', function () {
            const val = $(this).val();
            const formatted = formatPrice(val);
            $(this).val(formatted);
        });

        // Empêche l'appui de la barre espace
        $('.input_num_recu').on('keypress', function (e) {
            if (e.which === 32) {
                e.preventDefault();
                return false;
            }
        });

        // Supprime tout espace collé ou tapé indirectement
        $('.input_num_recu').on('input', function () {
            let val = $(this).val();
            $(this).val(val.replace(/\s/g, ''));
        });

    }

    function afficherMedicament(medicaments) 
    {
        // const maxRows = 3;
        // let rowsHtml = '';

        // for (let i = 1; i <= maxRows; i++) {
        //     rowsHtml += `
        //         <tr>
        //             <th scope="row">${i}</th>
        //             <td>
        //                 <select class="form-control select2_medoc text-center" id="select_medoc_${i}"></select>
        //             </td>
        //             <td>
        //                 <select class="form-control form-control-sm text-center select_medoc_qte" id="select_medoc_qte_${i}">
        //                     <option value="1">1</option>
        //                     <option value="2">2</option>
        //                     <option value="3">3</option>
        //                 </select>
        //             </td>
        //             <td>
        //                 <a href="#" class="btn btn-icon btn-sm btn-soft-danger rounded-pill btn_supprimer_ligne" data-index="${i}">
        //                     <i class="ti ti-trash"></i>
        //                 </a>
        //             </td>
        //         </tr>
        //     `;
        // }

        // const div_info_medicament = `
        //     <div class="card rounded-0">
        //         <div class="card-header d-flex align-items-center justify-content-center">
        //             <h5 class="card-title">Médicaments Préscrits</h5>
        //         </div>
        //         <div class="card-body">
        //             <div class="alert alert-info text-bg-info alert-dismissible" role="alert">
        //                 <i class="fa fa-info-circle fs-14 text-white"></i>
        //                 <strong>Informations :</strong>
        //                 Un bon de prescription ne peut contenir que <strong>3 médicaments au maximum</strong>. 
        //                 Chaque médicament peut être prescrit pour <strong>une quantité maximale de 3</strong>. 
        //                 Si vous devez prescrire plus de 3 médicaments ou des quantités supérieures, veuillez créer un <strong>nouveau bon</strong>.
        //                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        //             </div>
        //             <div class="table-responsive">
        //                 <table class="table table-striped table-bordered mb-0 table_medocs">
        //                     <thead>
        //                         <tr>
        //                             <th style="width:1%">N°</th>
        //                             <th style="width:80%">Dénomination</th>
        //                             <th style="width:14%">Quantité</th>
        //                             <th style="width:5%">Action</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>${rowsHtml}</tbody>
        //                 </table>
        //             </div>
        //         </div>
        //     </div>
        // `;

        $('.div_info_medicament').hide();
        $('.div_info_medicament').append(divSelectMedocs());

        afficherMedocs(medicaments, '.select2_medoc', '.select_medoc_qte');
    }

    $(document).off('click', '.btn_supprimer_ligne').on('click', '.btn_supprimer_ligne', function (e) {
        e.preventDefault();

        const index = $(this).data('index');

        // Réinitialiser les champs médicament et quantité de la ligne correspondante
        $(`#select_medoc_${index}`).val(null).trigger('change.select2'); // pour Select2
        $(`#select_medoc_qte_${index}`).val(1).trigger('change.select2');
    });

    function afficherBtnValier()
    {
        const div_btn = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title text-info">
                                    ⚠️ Veuillez bien vérifier les informations saisies dans le formulaire avant d'enregistrer les informations du bon.
                                </h5>
                            </div>
                            <div class="card-body text-center">
                                <div class="d-flex align-items-center flex-wrap gap-2 justify-content-center">
                                    <a class="btn btn-success btn-label">
                                        <i class="fa fa-check label-icon align-middle fs-16 me-2"></i>
                                        Enregistrer
                                    </a>
                                    <a class="btn btn-warning" id="openModalViewBonConsultationForm">
                                        <i class="fa fa-print label-icon align-middle fs-16 me-2"></i>
                                        Enregistrer & Imprimer
                                    </a>                              
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('.div_btn').hide();
        $('.div_btn').append(div_btn);
        $('.div_btn').show('slow');

        const fullscreenModal = `
            <div class="modal fade" id="ModalViewBonConsultationForm" tabindex="-1" aria-labelledby="ModalViewBonConsultationForm" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" >Full Screen Modal</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <a href="javascript:void(0);" class="btn btn-secondary" data-bs-dismiss="modal">Close</a>
                            <button type="button" class="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Injecter le modal dans le DOM
        $('body').append(fullscreenModal);

        // Bouton pour ouvrir le modal (doit exister dans le HTML)
        $('#openModalViewBonConsultationForm').on('click', function () {
            $('#ModalViewBonConsultationForm').modal('show');
        });
    }

    // fin affiche div section











    // const sansBon = presta.sans_bon;
    // const newGestion = presta.new_gestion;

    // const baseSteps_matricule = [
    //     { div: '.div_matricule', icon: 'fa-user' },
    //     { div: '.div_result_assure', icon: 'fa-id-card' },
    // ];

    // const baseSteps_numbon = [
    //     { div: '.div_numerobon', icon: 'fa-stethoscope' },
    // ];

    // const baseSteps_prestation = [
    //     { div: '.div_choix_prestation', icon: 'fa-stethoscope' },
    //     { div: '.div_montant_prestation', icon: 'fa-money-bill' },
    // ];

    // const baseSteps_new_gestion = [
    //     { div: '.div_medecin_affection', icon: 'fa-user-md' },
    //     { div: '.div_info_prescription', icon: 'fa-prescription-bottle' },
    //     { div: '.div_info_recu', icon: 'fa-receipt' },
    //     { div: '.div_info_medicament', icon: 'fa-pills' },
    // ];

    // const finalStep = [
    //     { div: '.div_btn', icon: 'fa-check-circle' }
    // ];

    // const steps = sansBon === 0
    //     ?   [
    //             ...baseSteps_matricule, 
    //             ...baseSteps_numbon, 
    //             ...baseSteps_prestation,
    //             ...(newGestion === 0 ? baseSteps_new_gestion : []),
    //             ...finalStep
    //         ]
    //     :   [
    //             ...baseSteps_matricule,
    //             ...baseSteps_prestation, 
    //             ...finalStep
    //         ];

    // const $wizardSteps = $('.wizard-steps').empty();

    // steps.forEach((step, index) => {
    //     const iconId = `stepIcon${index + 1}`;
    //     const $li = $(`
    //         <li>
    //             <i id="${iconId}" class="fas ${step.icon} step-icon"></i>
    //         </li>
    //     `);
    //     $wizardSteps.append($li);

    //     const $div = $(step.div);

    //     // Fonction pour mettre à jour l'état actif
    //     const updateActiveState = () => {
    //         const hasContent = $div.children().length > 0 || $div.text().trim() !== '';
    //         if (hasContent) {
    //             $li.addClass('active');
    //             $li.find('i').addClass('active');
    //         } else {
    //             $li.removeClass('active');
    //             $li.find('i').removeClass('active');
    //         }
    //     };

    //     // Lancer une détection initiale
    //     updateActiveState();

    //     // Observer les changements dans la div
    //     const observer = new MutationObserver(updateActiveState);
    //     observer.observe($div[0], {
    //         childList: true,
    //         subtree: true,
    //         characterData: true
    //     });
    // });

});
