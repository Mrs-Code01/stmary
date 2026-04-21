import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function generateAdmissionPDF(elementId, studentName) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Generate image seamlessly bypassing html2canvas lab/oklch bugs
    const dataUrl = await toPng(element, { 
      quality: 1, 
      pixelRatio: 2, 
      backgroundColor: '#ffffff' 
    });
    
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Get image dimensions to accurately map to PDF scaling
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
        img.onload = resolve;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0; // Stick to the top margin

    pdf.addImage(dataUrl, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Save as local file
    const safeName = (studentName || "admission").replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`${safeName}_admission_form.pdf`);

  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}
