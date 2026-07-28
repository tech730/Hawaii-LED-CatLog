import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  drawingElementId: string;
  filename?: string;
  projectInfo: {
    brandName: string;
    sceneName: string;
    pitch: string;
    widthCols: number;
    heightRows: number;
    totalWidthM: string;
    totalHeightM: string;
    resW: number;
    resH: number;
    totalUnits: number;
    processor: string;
    powerSupply: string;
    totalWeightKg: string;
    powerMaxW: string;
  };
}

export interface MultiViewPDFExportOptions extends PDFExportOptions {
  captureAllViews: (capturePage: (viewTitle: string, pageNum: number, totalPages: number) => Promise<void>) => Promise<void>;
}

export async function exportMultiPageTechnicalDrawingPDF(
  options: PDFExportOptions,
  viewCaptures: { title: string; element: HTMLElement }[]
): Promise<void> {
  const { filename = 'hawaii-led-technical-drawing.pdf', projectInfo } = options;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    for (let pageIdx = 0; pageIdx < viewCaptures.length; pageIdx++) {
      const view = viewCaptures[pageIdx];

      if (pageIdx > 0) {
        pdf.addPage('a4', 'landscape');
      }

      // Render view element to high resolution canvas
      const canvas = await html2canvas(view.element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');

      // 1. Draw Outer Engineering Frame & Header
      pdf.setFillColor(15, 23, 42); // #0f172a
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Blueprint Border Lines
      pdf.setDrawColor(56, 189, 248); // Cyan border #38bdf8
      pdf.setLineWidth(0.5);
      pdf.rect(5, 5, pdfWidth - 10, pdfHeight - 10);
      pdf.rect(6, 6, pdfWidth - 12, pdfHeight - 12);

      // Header Title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`HAWAII LED ARCHITECTURAL BLUEPRINT - ${view.title.toUpperCase()}`, 12, 14);

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(148, 163, 184);
      pdf.text(`Official Technical Spec Sheet | Sheet ${pageIdx + 1} of ${viewCaptures.length} | Generated: ${new Date().toLocaleDateString()}`, 12, 19);

      // 2. Add Captured View Image
      const imgX = 10;
      const imgY = 24;
      const maxImgWidth = 277;
      const maxImgHeight = 135;

      const imgProps = pdf.getImageProperties(imgData);
      const canvasRatio = imgProps.width / imgProps.height;
      const boxRatio = maxImgWidth / maxImgHeight;

      let renderW = maxImgWidth;
      let renderH = maxImgHeight;
      if (canvasRatio > boxRatio) {
        renderH = maxImgWidth / canvasRatio;
      } else {
        renderW = maxImgHeight * canvasRatio;
      }

      const renderX = imgX + (maxImgWidth - renderW) / 2;
      const renderY = imgY + (maxImgHeight - renderH) / 2;

      pdf.addImage(imgData, 'PNG', renderX, renderY, renderW, renderH);

      // 3. Bottom Title Block (Engineering Spec Table & Signature Box)
      const tbY = 162;
      const tbH = 42;
      const tbW = pdfWidth - 20; // 277mm

      pdf.setFillColor(30, 41, 59); // #1e293b
      pdf.rect(10, tbY, tbW, tbH, 'F');
      pdf.setDrawColor(56, 189, 248);
      pdf.rect(10, tbY, tbW, tbH, 'D');

      const col1W = 100;
      const col2W = 100;

      pdf.line(10 + col1W, tbY, 10 + col1W, tbY + tbH);
      pdf.line(10 + col1W + col2W, tbY, 10 + col1W + col2W, tbY + tbH);

      // Column 1: System Specs
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(56, 189, 248);
      pdf.text('SYSTEM SPECIFICATIONS', 14, tbY + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(226, 232, 240);
      pdf.text(`Product / Scene: ${projectInfo.brandName} ${projectInfo.sceneName}`, 14, tbY + 12);
      pdf.text(`Pixel Pitch: P${projectInfo.pitch} mm`, 14, tbY + 18);
      pdf.text(`Screen Resolution: ${projectInfo.resW} x ${projectInfo.resH} Pixels`, 14, tbY + 24);
      pdf.text(`Total Dimensions: ${projectInfo.totalWidthM}m (W) x ${projectInfo.totalHeightM}m (H)`, 14, tbY + 30);
      pdf.text(`Cabinet/Module Count: ${projectInfo.widthCols} Cols x ${projectInfo.heightRows} Rows (${projectInfo.totalUnits} Units)`, 14, tbY + 36);

      // Column 2: Electrical & Structure Specs
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(56, 189, 248);
      pdf.text('ELECTRICAL & STRUCTURE HARDWARE', 14 + col1W, tbY + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(226, 232, 240);
      pdf.text(`Video Controller: ${projectInfo.processor}`, 14 + col1W, tbY + 12);
      pdf.text(`Power Supplies: ${projectInfo.powerSupply}`, 14 + col1W, tbY + 18);
      pdf.text(`Max Load: ${projectInfo.powerMaxW} W (~ ${(Number(projectInfo.powerMaxW) / 230).toFixed(1)} A) | Weight: ${projectInfo.totalWeightKg} kg`, 14 + col1W, tbY + 24);
      pdf.text(`Structure Depth: 80 mm | GI Sheet 2mm + MS Tube 40x20 & 50x25mm`, 14 + col1W, tbY + 30);
      pdf.text(`Magnet Mounts: 4x Per Module | Cable: Shielded Cat6`, 14 + col1W, tbY + 36);

      // Column 3: Approval / Sign-off Title Block
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(56, 189, 248);
      pdf.text('ENGINEERING APPROVAL', 14 + col1W + col2W, tbY + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('DRAWN BY: HAWAII LED CAD SYSTEM', 14 + col1W + col2W, tbY + 14);
      pdf.text('APPROVED BY: ___________________', 14 + col1W + col2W, tbY + 22);
      pdf.text(`SHEET: ${pageIdx + 1} OF ${viewCaptures.length} | SCALE: N.T.S`, 14 + col1W + col2W, tbY + 30);
      pdf.text('STATUS: FINAL PRODUCTION SPEC', 14 + col1W + col2W, tbY + 36);
    }

    // Save Multi-Page PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export multi-page PDF drawing:', error);
  }
}
