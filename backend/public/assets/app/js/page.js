$(document).ready(function () {

	window.divMatriculeAdherent = function () {

		const div = `
            <div class="card rounded-0 div_matricule">
                <div class="card-header">
                    <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
                        <div class="form-floating">
                            <input type="text" class="form-control form-control-sm input_matricule text-center" id="floatingPassword" value="S00061001769301">
                            <label for="floatingPassword">Matricule de l'assuré</label>
                        </div>
                        <a class="btn btn-success btn_recherche_matricule">
                            <i class="fa fa-search me-2"></i>
                            Vérification
                        </a>
                    </div>
                </div>
            </div>
        `;

        return div;
        
    }

    window.divNumBon = function () {

		const div = `
            <div class="card rounded-0">
                <div class="card-header">
                    <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
                        <div class="form-floating">
                            <input type="text" class="form-control form-control-sm input_numerobon text-center" id="floatingPassword" maxlength="7" placeholder="">
                            <label for="floatingPassword">Numéro du bon</label>
                        </div>
                        <a class="btn btn-success btn_recherche_numerobon">
                            <i class="fa fa-search me-2"></i>
                            Vérification du Bon
                        </a>
                    </div>
                </div>
            </div>
        `;

        return div;
        
    }

    window.divMedecinAffection = function () {

		const div = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title">
                                    Médécin & Affection
                                </h5>
                            </div><!-- end card-header -->
                            <div class="card-body">
                                <div action="#">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center">
                                                    <p class="mb-1 fw-bold text-muted">Selectionnez le médecin</p>
                                                    <select class="form-control select2 select_medecin text-center" data-toggle="select2"></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
                                                    <p class="mb-1 fw-bold text-muted">Selectionnez l'affection</p>
                                                    <select class="form-control select2 select_codeaffection text-center" data-toggle="select2">
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

        return div;
        
    }

    window.divDemandePrescription = function () {

		const div = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title">
                                    Informations sur la prescription des médicaments
                                </h5>
                            </div><!-- end card-header -->
                            <div class="card-body">
                                <div action="#">
                                    <div class="row justify-content-center">
                                        <div class="col-md-6 card_prescription">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center">
                                                    <p class="mb-1 fw-bold text-muted">
                                                        Le médecin a t-il fait une prescription sur le bon ?
                                                    </p>
                                                    <select class="form-control select2 select_medicament_prescrit text-center" data-toggle="select2">
                                                        <option></option>
                                                        <option value="0" >Oui</option>
                                                        <option value="1" >Non</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 card_complementaire" style="display:none;">
                                            <div class="mb-3">
                                                <div class="card-body d-flex flex-column gap-3 align-items-center justify-content-center mb-n3">
                                                    <p class="mb-1 fw-bold text-muted">
                                                        Le bon est-il accompagné d'un bon complémentaire ? :
                                                    </p>
                                                    <select class="form-control select2 select_complementaire text-center" data-toggle="select2">
                                                        <option></option>
                                                        <option value="0" >Oui, MUGEFCI ou CMU</option>
                                                        <option value="1" >Non, Bon simple</option>
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

        return div;
        
    }

    window.divNumRecuPartClient = function () {

		const div = `
            <div class="card rounded-0" >
                <div class="row">
                    <div class="col-md-12">
                        <div class="">
                            <div class="card-header d-flex align-items-center justify-content-center">
                                <h5 class="card-title">
                                    Informations sur la part de l'assuré
                                </h5>
                            </div><!-- end card-header -->
                            <div class="card-body">
                                <div class="div_alert_montant"></div>
                                <div action="#">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control form-control-sm input_num_recu text-center" id="numRecu" placeholder="numéro">
                                                    <label for="numRecu">Numéro du reçu de caisse</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <div class="form-floating">
                                                    <input type="tel" class="form-control form-control-sm input_prix_recu text-center" id="prixPayerAssure" value="0">
                                                    <label for="prixPayerAssure">Montant payé par l'assuré (Fcfa)</label>
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

        return div;
        
    }

    window.divSelectMedocs = function () {

		const maxRows = 3;
        let rowsHtml = '';

        for (let i = 1; i <= maxRows; i++) {
            rowsHtml += `
                <tr>
                    <th scope="row">${i}</th>
                    <td>
                        <select class="form-control select2_medoc text-center" id="select_medoc_${i}"></select>
                    </td>
                    <td>
                        <select class="form-control form-control-sm text-center select_medoc_qte" id="select_medoc_qte_${i}">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </td>
                    <td>
                        <a href="#" class="btn btn-icon btn-sm btn-soft-danger rounded-pill btn_supprimer_ligne" data-index="${i}">
                            <i class="ti ti-trash"></i>
                        </a>
                    </td>
                </tr>
            `;
        }

        const div = `
            <div class="card rounded-0">
                <div class="card-header d-flex align-items-center justify-content-center">
                    <h5 class="card-title">Médicaments Préscrits</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-info text-bg-info alert-dismissible" role="alert">
                        <i class="fa fa-info-circle fs-14 text-white"></i>
                        <strong>Informations :</strong>
                        Un bon de prescription ne peut contenir que <strong>3 médicaments au maximum</strong>. 
                        Chaque médicament peut être prescrit pour <strong>une quantité maximale de 3</strong>. 
                        Si vous devez prescrire plus de 3 médicaments ou des quantités supérieures, veuillez créer un <strong>nouveau bon</strong>.
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered mb-0 table_medocs">
                            <thead>
                                <tr>
                                    <th style="width:1%">N°</th>
                                    <th style="width:80%">Dénomination</th>
                                    <th style="width:14%">Quantité</th>
                                    <th style="width:5%">Action</th>
                                </tr>
                            </thead>
                            <tbody>${rowsHtml}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        return div;
        
    }

});