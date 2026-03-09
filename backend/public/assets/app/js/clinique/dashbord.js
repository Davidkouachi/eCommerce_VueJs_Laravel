$(document).ready(function() {
    const globalePage = $('.contenu_clinique');
    const url = $('#url').attr('content');
    const decodedData = atob(window.encodedUserData);
    const presta = JSON.parse(decodedData);

    initStart();

    function initStart() 
    {
        afficherCard();
        afficherCardPlacholder();
    }

    // if (globalePage.data('page') === 'dashbord') {
    //     afficherCard();
    //     afficherCardPlacholder();
    // }

    // debut reset div section
    // fin reset div section
    // debut affiche div section
    function afficherCard() {

        const div_card = `
            <div class="row">
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                        <img src="assets/img/bg/bg-01.svg" alt="img" class="position-absolute start-0 top-0">
                       <div class="card-body">
                           <div class="d-flex align-items-center mb-2 justify-content-between">
                              <span class="avatar bg-primary rounded-circle"><i class="ti ti-calendar-heart fs-24"></i></span>
                              <div class="text-end">
                                <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+95%</span>
                                <p class="fs-13 mb-0">in last 7 Days </p>
                              </div>
                           </div>
                           <div class="d-flex align-items-center justify-content-between">
                               <div>
                                 <p class="mb-1">Doctors</p>
                                 <h3 class="fw-bold mb-0">247</h3>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
                <!-- end col -->
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                        <img src="assets/img/bg/bg-02.svg" alt="img" class="position-absolute start-0 top-0">
                       <div class="card-body">
                           <div class="d-flex align-items-center mb-2 justify-content-between">
                              <span class="avatar bg-danger rounded-circle"><i class="ti ti-calendar-heart fs-24"></i></span>
                              <div class="text-end">
                                <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                                <p class="fs-13 mb-0">in last 7 Days </p>
                              </div>
                           </div>
                           <div class="d-flex align-items-center justify-content-between">
                               <div>
                                 <p class="mb-1">Patients</p>
                                 <h3 class="fw-bold mb-0">4178</h3>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
                <!-- end col -->
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                        <img src="assets/img/bg/bg-03.svg" alt="img" class="position-absolute start-0 top-0">
                       <div class="card-body">
                           <div class="d-flex align-items-center mb-2 justify-content-between">
                              <span class="avatar bg-info rounded-circle"><i class="ti ti-calendar-heart fs-24"></i></span>
                              <div class="text-end">
                                <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-danger">-15%</span>
                                <p class="fs-13 mb-0">in last 7 Days </p>
                              </div>
                           </div>
                           <div class="d-flex align-items-center justify-content-between">
                               <div>
                                 <p class="mb-1">Appointment</p>
                                 <h3 class="fw-bold mb-0">12178</h3>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
                <!-- end col -->
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                        <img src="assets/img/bg/bg-04.svg" alt="img" class="position-absolute start-0 top-0">
                       <div class="card-body">
                           <div class="d-flex align-items-center mb-2 justify-content-between">
                              <span class="avatar bg-success rounded-circle"><i class="ti ti-calendar-heart fs-24"></i></span>
                              <div class="text-end">
                                <span class="badge px-2 py-1 fs-12 fw-medium d-inline-flex mb-1 bg-success">+25%</span>
                                <p class="fs-13 mb-0">in last 7 Days </p>
                              </div>
                           </div>
                           <div class="d-flex align-items-center justify-content-between overflow-hidden">
                               <div>
                                 <p class="mb-1">Revenue</p>
                                 <h3 class="fw-bold mb-0 text-truncate">$55,1240</h3>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
                <!-- end col -->
            </div>
        `;
        // Insertion juste après .titre_head
        // $('.contenu_clinique .titre_head').after(div_matricule);
        globalePage.append(div_card);
    }

    function afficherCardPlacholder() {

        const div_cardPlacholder = `
            <div class="row div_cardPlacholder">
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                       <div class="card-body">
                           <div id="pageloader_content" class="d-flex align-items-center justify-content-center">
                                <div class="spinner-border text-primary m-2" role="status"></div>
                            </div>
                       </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                       <div class="card-body">
                           <div id="pageloader_content" class="d-flex align-items-center justify-content-center">
                                <div class="spinner-border text-primary m-2" role="status"></div>
                            </div>
                       </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                       <div class="card-body">
                           <div id="pageloader_content" class="d-flex align-items-center justify-content-center">
                                <div class="spinner-border text-primary m-2" role="status"></div>
                            </div>
                       </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="position-relative border card rounded-2 shadow-sm">
                       <div class="card-body">
                           <div id="pageloader_content" class="d-flex align-items-center justify-content-center">
                                <div class="spinner-border text-primary m-2" role="status"></div>
                            </div>
                       </div>
                    </div>
                </div>
            </div>
        `;
        // Insertion juste après .titre_head
        // $('.contenu_clinique .titre_head').after(div_matricule);
        globalePage.append(div_cardPlacholder);
    }
    // fin affiche div section
});