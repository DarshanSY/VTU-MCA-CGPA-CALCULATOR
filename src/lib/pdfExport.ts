import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subject } from './types';
import { getGradeInfo, calculateSGPA, calculateCGPA } from './gradeUtils';
import { semesterMeta } from './semesterData';

export function exportToPDF(
  allSemSubjects: Subject[][],
  specialization: string | null
) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('VTU MCA GPA Calculator (2026 Scheme)', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 28, { align: 'center' });

  if (specialization) {
    doc.text(`Specialization: ${specialization}`, 105, 34, { align: 'center' });
  }

  let yPos = specialization ? 42 : 36;

  // Per-semester tables
  for (let i = 0; i < allSemSubjects.length; i++) {
    const subjects = allSemSubjects[i];
    const meta = semesterMeta[i];
    const sgpa = calculateSGPA(subjects);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${meta.name} (${meta.totalCredits} Credits)`, 14, yPos);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`SGPA: ${sgpa > 0 ? sgpa.toFixed(2) : 'N/A'}`, 180, yPos, { align: 'right' });

    yPos += 4;

    const tableData = subjects
      .filter((s) => !s.isNCMC)
      .map((sub) => {
        const info = getGradeInfo(sub.marks, sub.credits, sub.maxMarks ?? 100);
        const maxM = sub.maxMarks ?? 100;
        return [
          sub.name,
          sub.credits.toString(),
          sub.marks !== null ? `${sub.marks}${maxM !== 100 ? '/' + maxM : ''}` : '-',
          sub.marks !== null ? info.grade : '-',
          sub.marks !== null ? info.gradePoint.toString() : '-',
          sub.marks !== null ? info.creditPoints.toString() : '-',
        ];
      });

    autoTable(doc, {
      startY: yPos,
      head: [['Subject', 'Credits', 'Marks', 'Grade', 'GP', 'CP']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 18, halign: 'center' },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 18, halign: 'center' },
        5: { cellWidth: 18, halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPos = (doc as any).lastAutoTable.finalY + 10;

    if (yPos > 250 && i < allSemSubjects.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  }

  // CGPA Summary
  const cgpa = calculateCGPA(allSemSubjects);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');

  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  doc.text(`CGPA: ${cgpa > 0 ? cgpa.toFixed(2) : 'N/A'}`, 105, yPos + 5, { align: 'center' });

  doc.save('VTU_MCA_GPA_Report.pdf');
}
