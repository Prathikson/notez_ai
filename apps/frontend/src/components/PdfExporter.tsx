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

    // Watermark text
    pdf.setTextColor(0, 57, 52, 0.3); // rgba(0,57,52,0.3)
    pdf.setFontSize(50);
    pdf.text('Notez AI', pdfWidth / 2, pdfHeight / 2, { align: 'center', angle: 45 });

    pdf.save('NotezAI_Transcript_Summary.pdf');
  };

  if (!isProUser || !transcription || !summary) return null;

  return (
    <>
      <div ref={pdfRef} className="w-full bg-[#003934] p-4 rounded-lg">
        <div className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left mb-4">
          <h2 className="text-lg font-semibold mb-2">📝 Transcription:</h2>
          <p className="whitespace-pre-wrap text-[#fffef0]/90">{transcription}</p>
        </div>

        <div className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left">
          <h2 className="text-lg font-semibold mb-2">📜 Summary and Action Items:</h2>
          <p className="font-medium text-[#fffef0]">Summary:</p>
          <p className="whitespace-pre-wrap mb-2 text-[#fffef0]/90">{summary}</p>
        </div>
      </div>

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
