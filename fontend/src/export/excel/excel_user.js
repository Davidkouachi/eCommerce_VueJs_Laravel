import { usePreloaderSpinner } from '@/function/function/showPreloader';
const preloaderSpinner = usePreloaderSpinner();

export async function excelUser(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Facturation");

    // --- Infos société (en haut du fichier) ---
    worksheet.addRow(["JOB OPTIQUE"]);
    worksheet.addRow(["Siège social : Marcory Konankro face à l'école EPP TSF - 27 BP 659 Abidjan 27"]);
    worksheet.addRow(["Email: joboptique@gmail.com - Compte Bancaire : 121383458001 ecobank"]);
    worksheet.addRow(["Tél.: +225 2720230558 / Cel.: +2250172972505 - RC No : CI-ABJ-2019-B-7745"]);
    worksheet.addRow([]);
    worksheet.addRow(["FACTURE N°", "12345"]);
    worksheet.addRow(["Date", new Date().toLocaleDateString()]);
    worksheet.addRow(["Assurance", "SOGEMAD"]);
    worksheet.addRow(["Société", "SOGEMAD"]);
    worksheet.addRow([]);
    worksheet.addRow(["RECAPITULATIF"]);

    // --- En-tête du tableau ---
    const headerRow = worksheet.addRow(["DATE", "MATRICULE", "NOM", "MONTANT"]);
    headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '01ADE8' } }; // Fond bleu
        cell.font = { bold: true, color: { argb: 'FFFFFF' } }; // Texte blanc
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
    });

    // --- Lignes de facturation ---
    data.forEach(item => {
        worksheet.addRow([
            new Date(item.created_at).toLocaleDateString(),
            item.name,
            item.login,
            item.email
        ]);
    });

    // Ajuster la largeur des colonnes
    worksheet.columns = [
        { width: 15 },
        { width: 20 },
        { width: 30 },
        { width: 15 }
    ];

    // --- Générer le fichier ---
    preloaderSpinner.hideSpiner();
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Facturation_N°_12345.xlsx";
    link.click();
}