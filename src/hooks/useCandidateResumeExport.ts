import { useRef, useState } from 'react';

interface UseCandidateResumeExportParams {
  candidateName?: string;
  onError: (message: string) => void;
}

export const useCandidateResumeExport = ({
  candidateName,
  onError,
}: UseCandidateResumeExportParams) => {
  const [isExporting, setIsExporting] = useState(false);
  const resumePrintRef = useRef<HTMLDivElement>(null);

  const handleDownloadResume = async () => {
    if (!resumePrintRef.current) {
      console.error('Resume reference not found');
      return;
    }

    setIsExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const element = resumePrintRef.current;

      const originalStyle = element.getAttribute('style') || '';
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-9999';
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.background = 'white';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: "Inter", system-ui, -apple-system, sans-serif !important;
            }
            svg { fill: currentColor !important; }
            :root {
              --primary-600: #7c3aed !important;
              --slate-900: #0f172a !important;
              --slate-600: #475569 !important;
              --slate-400: #94a3b8 !important;
            }
            .text-primary-600 { color: #7c3aed !important; }
            .bg-primary-600 { background-color: #7c3aed !important; }
            .bg-primary-50 { background-color: #f5f3ff !important; }
            .text-slate-900 { color: #0f172a !important; }
            .text-slate-800 { color: #1e293b !important; }
            .text-slate-500 { color: #64748b !important; }
            .text-slate-400 { color: #94a3b8 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-white { background-color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
          `;
          clonedDoc.head.appendChild(style);

          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const computed = window.getComputedStyle(htmlEl);

            const colorProps = ['color', 'backgroundColor', 'borderColor'] as const;
            colorProps.forEach((prop) => {
              const val = computed[prop];
              if (val && (val.includes('oklch') || val.includes('oklab'))) {
                if (prop === 'backgroundColor') {
                  htmlEl.style.backgroundColor = '#ffffff';
                } else if (prop === 'borderColor') {
                  htmlEl.style.borderColor = '#000000';
                } else {
                  htmlEl.style.color = '#000000';
                }
              }
            });

            const styleAttr = htmlEl.getAttribute('style') || '';
            if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
              const newStyle = styleAttr.replace(/(oklch|oklab)\([^)]+\)/g, '#7c3aed');
              htmlEl.setAttribute('style', newStyle);
            }
          });
        },
      });

      element.setAttribute('style', originalStyle);

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Curriculo_${(candidateName || 'Candidato').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      onError('Houve um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    resumePrintRef,
    handleDownloadResume,
  };
};
