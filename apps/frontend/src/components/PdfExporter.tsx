import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

interface PdfExporterProps {
  refToExport: React.RefObject<HTMLDivElement> | null;
  isProUser: boolean;
}

const PdfExporter: React.FC<PdfExporterProps> = ({ refToExport, isProUser }) => {
  const exportPDF = async () => {
    if (!refToExport.current) return;

    const input = refToExport.current;

    const pdf = new jsPDF('p', 'pt', 'a4');
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#003934',
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.setTextColor(0, 57, 52, 0.3);
    pdf.setFontSize(50);
    pdf.text('NoteZ AI', pdfWidth / 2, pdfHeight / 2, { align: 'center', angle: 45 });

    pdf.save('NoteZAI_Transcript_Summary.pdf');
  };

  if (!isProUser) return null;

  return (
    <motion.button
      onClick={exportPDF}
      className="mt-6 bg-gradient-to-br from-white to-[#fffef0] text-[#003934] px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition-all duration-300"
    >
      📄 Export PDF
    </motion.button>
  );
};

export default PdfExporter;
