export default function initDataTable(selector, withExport = false, exportFunctions = null) {

  if (!window.$ || !window.$.fn.DataTable) {
    console.error('❌ DataTables non chargé ou jQuery manquant')
    return
  }

  const $tables = window.$(selector)
  if (!$tables.length) {
    console.error('❌ Table non trouvée pour le sélecteur', selector)
    return
  }

  $tables.each(function () {
    const $table = window.$(this)

    // 🔹 Détruire l'ancienne instance si elle existe
    if ($.fn.DataTable.isDataTable($table)) {
      $table.DataTable().destroy()
      console.log('♻️ Ancienne instance DataTable détruite pour', selector)
    }

    // 🔹 Ne pas initialiser si tbody est vide
    if (!$table.find('tbody tr').length) {
      console.warn('⚠️ Table vide, DataTable non initialisée pour', selector)
      return
    }

    // 🔹 DOM selon export ou non
    const defaultDOM = withExport
      ? `
        <"row align-items-center justify-content-between mb-2"
          <"col-md-6 text-start"<"datatable-filter d-flex align-items-center"f>>
          <"col-md-6 text-end"<"dt-export-buttons d-flex align-center mb-2 mb-sm-0"<"dt-export-title d-block d-md-inline-block">B>>
        >
        <"datatable-wrap"t>
        <"row align-items-center mt-3"
          <"col-md-6"l>
          <"col-md-6 text-end"p>
        >
        <"row"
          <"col-12"i>
        >
      `
      : `
        <"row justify-content-center mb-2"
          <"col-md-6"<"datatable-filter d-flex justify-content-center"f>>
        >
        <"datatable-wrap"t>
        <"row align-items-center mt-3"
          <"col-md-6"l>
          <"col-md-6 text-end"p>
        >
        <"row"
          <"col-12"i>
        >
      `

    const defaultOptions = {
      responsive: true,
      autoWidth: false,
      scrollX: false,
      pagingType: 'simple_numbers',
      dom: defaultDOM,
      language: {
        search: '',
        searchPlaceholder: 'Recherche',
        lengthMenu: "<span class='d-block d-sm-inline-block'>Afficher</span><div class='form-control-select'> _MENU_ </div> éléments",
        info: "_START_ - _END_ sur _TOTAL_ Page(s)",
        infoEmpty: '0',
        infoFiltered: '(Total _MAX_)',
        paginate: { first: 'Premier', last: 'Dernier', next: '>', previous: '<' },
        zeroRecords: "<div class='text-center no-data'>Aucune donnée trouvée</div>",
        emptyTable: "<div class='text-center no-data'>Aucune donnée disponible</div>"
      },
      order: []
    }

    // if (withExport) {
    //   defaultOptions.buttons = [
    //     // { extend: 'copy', text: '<i class="pi pi-copy"></i> Copier' },
    //     // { extend: 'csv', text: '<i class="pi pi-file"></i> CSV' },
    //     { extend: 'excel', text: '<i class="pi pi-file-excel"></i> Excel' },
    //     { 
    //       text: `<button type="button" class="btn btn-danger btn-sm">
    //         <i class="pi pi-file-pdf me-1"></i>
    //         PDF
    //       </button>`,
    //       className: 'dt-button', // garde la compatibilité DataTables
    //       action: function (e, dt, node, config) {
    //         if (!pdfFunction) return console.warn('Aucune fonction PDF définie !');

    //         // const data = dt.rows({ search: 'applied' }).data().toArray();
    //         // console.log('📄 Données exportées vers PDF :', data);

    //         // Ici tu appelles ta fonction PDF avec les données
    //         // pdfFunction(data);
    //         pdfFunction();
    //       }
    //     },
    //     // { extend: 'print', text: '<i class="pi pi-print"></i> Imprimer' }
    //   ]
    // }

    console.log(withExport)
    console.log(exportFunctions)

    if (withExport && exportFunctions) {
      defaultOptions.buttons = [];

      // PDF
      if (exportFunctions.pdf) {
        console.log('pdf')
        defaultOptions.buttons.push({
          text: `<button type="button" class="btn btn-outline-danger btn-sm"><i class="pi pi-file-pdf me-1"></i> PDF</button>`,
          className: 'dt-button',
          action: function () {
            exportFunctions.pdf();
          }
        });
      }

      // Excel
      if (exportFunctions.excel) {
        console.log('excel')
        defaultOptions.buttons.push({
          text: `<button type="button" class="btn btn-outline-success btn-sm"><i class="pi pi-file-excel me-1"></i> Excel</button>`,
          className: 'dt-button',
          action: function () {
            exportFunctions.excel();
          }
        });
      }

      // Ajouter d’autres formats si nécessaire
    }

    // 🔹 Initialisation sécurisée
    try {
      $table.DataTable(defaultOptions)
      console.log('✅ DataTable initialisé sur', selector)
    } catch (err) {
      console.error('❌ Erreur lors de l\'initialisation de DataTable :', err)
    }
  })
}
