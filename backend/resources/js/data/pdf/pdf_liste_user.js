export function pdfListeUser(users) {
  if (!users || !users.length) {
    // alert("Aucun utilisateur à exporter !");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const leftMargin = 15;
  let yPos = 15;

  doc.setFontSize(16);
  doc.setFont("Helvetica", "bold");
  doc.text("Liste des utilisateurs", 105, yPos, { align: 'center' });

  yPos += 10;

  // Création du tableau avec autoTable
  doc.autoTable({
    startY: yPos,
    head: [["Nom", "Email", "Login", "Statut"]],
    body: users.map(user => [
      user.name,
      user.email,
      user.login,
      user.statut || "Disponible"
    ]),
    theme: "grid",
    headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
    styles: { fontSize: 10 }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  const footerY = doc.internal.pageSize.getHeight() - 5;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} sur ${pageCount}`, 105, footerY, { align: 'center' });
    doc.text("Exporté le : " + new Date().toLocaleDateString(), leftMargin, footerY);
  }

  const logoutPreloader = document.getElementById('preloaderLogout');
  if (logoutPreloader) logoutPreloader.remove();
  
  doc.output('dataurlnewwindow');
}
