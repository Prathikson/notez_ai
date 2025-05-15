import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

interface PdfExporterProps {
  transcription: string | null;
  summary: string | null;
  isProUser: boolean;
}

const PdfExporter: React.FC<PdfExporterProps> = ({ transcription, summary, isProUser }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!pdfRef.current) return;

    const input = pdfRef.current;

    const pdf = new jsPDF('p', 'pt', 'a4');
    const scale = 2;

    const canvas = await html2canvas(input, {
      scale,
      useCORS: true,
      scrollY: -window.scrollY,
      backgroundColor: '#003934',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save('NotezAI_Transcript_Summary.pdf');
  };

  if (!isProUser || !transcription || !summary) return null;

  return (
    <>

      <motion.button
        onClick={exportPDF}
        className="mt-6 bg-gradient-to-br from-white to-[#fffef0] text-[#003934] px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition-all duration-300"
      >
        📄 Export PDF
      </motion.button>
    </>
  );
};

export default PdfExporter;
