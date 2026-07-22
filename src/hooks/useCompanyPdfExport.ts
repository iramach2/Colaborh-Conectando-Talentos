import { type CSSProperties, type RefObject, useRef, useState } from 'react';
import type { CompanyApplicant } from '../types/companyDashboard';

type LegacyCssProperties = CSSProperties & {
  msTransform?: string;
};

const parseOklch = (oklchStr: string): string => {
  const match = oklchStr.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
  if (!match) return oklchStr;

  let l = parseFloat(match[1]);
  if (match[1].includes('%')) l /= 100;

  const c = parseFloat(match[2]);
  const hDeg = parseFloat(match[3]);
  const h = (hDeg * Math.PI) / 180;
  let alpha = 1;
  if (match[4]) {
    alpha = parseFloat(match[4]);
    if (match[4].includes('%')) alpha /= 100;
  }

  const ab = c * Math.cos(h);
  const bb = c * Math.sin(h);
  const l_ = Math.pow(l + 0.3963377774 * ab + 0.2158037573 * bb, 3);
  const m_ = Math.pow(l - 0.1055613458 * ab - 0.0638541728 * bb, 3);
  const s_ = Math.pow(l - 0.0894841775 * ab - 1.2914855480 * bb, 3);

  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const toSRGB = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    return clamped > 0.0031308
      ? 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
      : 12.92 * clamped;
  };

  const red = Math.round(toSRGB(r) * 255);
  const green = Math.round(toSRGB(g) * 255);
  const blue = Math.round(toSRGB(b) * 255);

  return alpha === 1 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const parseOklab = (oklabStr: string): string => {
  const match = oklabStr.match(/oklab\(\s*([\d.]+%?)\s+([+-]?[\d.]+)\s+([+-]?[\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i);
  if (!match) return oklabStr;

  let l = parseFloat(match[1]);
  if (match[1].includes('%')) l /= 100;

  const ab = parseFloat(match[2]);
  const bb = parseFloat(match[3]);
  let alpha = 1;
  if (match[4]) {
    alpha = parseFloat(match[4]);
    if (match[4].includes('%')) alpha /= 100;
  }

  const l_ = Math.pow(l + 0.3963377774 * ab + 0.2158037573 * bb, 3);
  const m_ = Math.pow(l - 0.1055613458 * ab - 0.0638541728 * bb, 3);
  const s_ = Math.pow(l - 0.0894841775 * ab - 1.2914855480 * bb, 3);

  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const toSRGB = (value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    return clamped > 0.0031308
      ? 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
      : 12.92 * clamped;
  };

  const red = Math.round(toSRGB(r) * 255);
  const green = Math.round(toSRGB(g) * 255);
  const blue = Math.round(toSRGB(b) * 255);

  return alpha === 1 ? `rgb(${red}, ${green}, ${blue})` : `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const createStyleProxy = (style: CSSStyleDeclaration) => new Proxy(style, {
  get(target, prop) {
    const value = Reflect.get(target, prop, target);

    if (prop === 'getPropertyValue') {
      return function getPropertyValue(propertyName: string) {
        const originalValue = target.getPropertyValue(propertyName);
        if (typeof originalValue === 'string') {
          if (originalValue.includes('oklch')) return parseOklch(originalValue);
          if (originalValue.includes('oklab')) return parseOklab(originalValue);
        }
        return originalValue;
      };
    }

    if (typeof value === 'string') {
      if (value.includes('oklch')) return parseOklch(value);
      if (value.includes('oklab')) return parseOklab(value);
    }

    if (typeof value === 'function') {
      return value.bind(target);
    }

    return value;
  },
});

type UseCompanyPdfExportParams = {
  selectedResumeApplicant: CompanyApplicant | null;
};

export const useCompanyPdfExport = ({ selectedResumeApplicant }: UseCompanyPdfExportParams) => {
  const [isExportingResume, setIsExportingResume] = useState(false);
  const [isExportingTestPDF, setIsExportingTestPDF] = useState(false);
  const resumePrintRef = useRef<HTMLDivElement>(null);
  const discModalRef = useRef<HTMLDivElement>(null);
  const mbtiModalRef = useRef<HTMLDivElement>(null);
  const temperamentosModalRef = useRef<HTMLDivElement>(null);
  const customTestModalRef = useRef<HTMLDivElement>(null);
  const questionsModalRef = useRef<HTMLDivElement>(null);

  const handleDownloadResume = async () => {
    if (!resumePrintRef.current || !selectedResumeApplicant) {
      console.error('Resume reference or active candidate not found');
      return;
    }

    setIsExportingResume(true);
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
      element.style.height = 'auto';
      element.style.minHeight = '297mm';
      element.style.overflow = 'visible';

      const captureWidth = element.scrollWidth || element.offsetWidth;
      const captureHeight = element.scrollHeight || element.offsetHeight;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: captureWidth,
        height: captureHeight,
        windowWidth: captureWidth,
        windowHeight: captureHeight,
      });

      element.setAttribute('style', originalStyle);

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`Curriculo_${(selectedResumeApplicant.candidate_name || 'Candidato').replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Houve um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsExportingResume(false);
    }
  };

  const handleExportModalToPDF = async (elementRef: RefObject<HTMLDivElement>, fileName: string) => {
    if (!elementRef.current) {
      console.error('Element reference not found');
      return;
    }

    setIsExportingTestPDF(true);
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function patchedGetComputedStyle(element, pseudoElement) {
      const style = originalGetComputedStyle.call(window, element, pseudoElement);
      return createStyleProxy(style);
    };

    const element = elementRef.current;
    const origSvgs = element.querySelectorAll('svg');
    origSvgs.forEach((svg) => {
      const rect = svg.getBoundingClientRect();
      svg.setAttribute('data-real-width', rect.width.toString());
      svg.setAttribute('data-real-height', rect.height.toString());
    });

    const origRecharts = element.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
    origRecharts.forEach((chart) => {
      const rect = chart.getBoundingClientRect();
      chart.setAttribute('data-real-width', rect.width.toString());
      chart.setAttribute('data-real-height', rect.height.toString());
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, clonedEl) => {
          if (clonedDoc.defaultView) {
            const originalIframeGetComputedStyle = clonedDoc.defaultView.getComputedStyle;
            clonedDoc.defaultView.getComputedStyle = function patchedIframeGetComputedStyle(element, pseudoElement) {
              const style = originalIframeGetComputedStyle.call(clonedDoc.defaultView, element, pseudoElement);
              return createStyleProxy(style);
            };
          }

          if (!clonedEl) return;

          clonedEl.style.transform = 'none';
          clonedEl.style.webkitTransform = 'none';
          (clonedEl.style as LegacyCssProperties).msTransform = 'none';
          clonedEl.style.transition = 'none';
          clonedEl.style.animation = 'none';
          clonedEl.style.maxHeight = 'none';
          clonedEl.style.height = 'auto';
          clonedEl.style.overflow = 'visible';

          const clonedBodyEl = (clonedEl.querySelector('.overflow-y-auto') || clonedEl.querySelector('.no-scrollbar')) as HTMLElement;
          if (clonedBodyEl) {
            clonedBodyEl.style.maxHeight = 'none';
            clonedBodyEl.style.height = 'auto';
            clonedBodyEl.style.overflow = 'visible';
          }

          const buttons = clonedEl.querySelectorAll('button');
          buttons.forEach((button) => {
            const text = (button.innerText || button.textContent || '').toLowerCase();
            if (text.includes('baixar') || text.includes('fechar') || button.querySelector('svg')) {
              button.style.display = 'none';
            }
          });

          clonedEl.querySelectorAll('svg').forEach((svg) => {
            const realWidth = svg.getAttribute('data-real-width');
            const realHeight = svg.getAttribute('data-real-height');
            if (realWidth && realHeight) {
              svg.setAttribute('width', realWidth);
              svg.setAttribute('height', realHeight);
            }
          });

          clonedEl.querySelectorAll('.recharts-wrapper, .recharts-responsive-container').forEach((chart) => {
            const realWidth = chart.getAttribute('data-real-width');
            const realHeight = chart.getAttribute('data-real-height');
            if (realWidth && realHeight) {
              const htmlChart = chart as HTMLElement;
              htmlChart.style.width = `${realWidth}px`;
              htmlChart.style.height = `${realHeight}px`;
            }
          });

          clonedEl.querySelectorAll('*').forEach((clonedNode) => {
            const htmlCloned = clonedNode as HTMLElement;
            const styleAttr = htmlCloned.getAttribute('style') || '';
            if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
              let newStyle = styleAttr;
              (styleAttr.match(/oklch\([^)]+\)/g) || []).forEach((match) => {
                newStyle = newStyle.replace(match, parseOklch(match));
              });
              (styleAttr.match(/oklab\([^)]+\)/g) || []).forEach((match) => {
                newStyle = newStyle.replace(match, parseOklab(match));
              });
              htmlCloned.setAttribute('style', newStyle);
            }
          });

          const containerRect = clonedEl.getBoundingClientRect();
          const pageHeightPx = (containerRect.width * 297) / 210;
          let contentArea = clonedBodyEl || clonedEl;

          const findVerticalWrapper = (parent: HTMLElement): HTMLElement => {
            if (!parent) return parent;
            if ((parent.classList.contains('space-y-6') || parent.classList.contains('space-y-4')) && parent.children.length > 1) return parent;
            const children = Array.from(parent.children);
            for (const child of children) {
              const htmlChild = child as HTMLElement;
              if ((htmlChild.classList.contains('space-y-6') || htmlChild.classList.contains('space-y-4')) && htmlChild.children.length > 1) return htmlChild;
            }
            for (const child of children) {
              const htmlChild = child as HTMLElement;
              if (htmlChild.children.length > 1) return htmlChild;
            }
            return parent;
          };

          contentArea = findVerticalWrapper(contentArea);
          const children = Array.from(contentArea.children);
          let offsetAccumulated = 0;

          children.forEach((child) => {
            const htmlChild = child as HTMLElement;
            const rect = htmlChild.getBoundingClientRect();
            const relativeTop = (rect.top - containerRect.top) + offsetAccumulated;
            const childHeight = rect.height;
            const pageOfTop = Math.floor(relativeTop / pageHeightPx) + 1;
            const pageOfBottom = Math.floor((relativeTop + childHeight) / pageHeightPx) + 1;

            if (pageOfTop !== pageOfBottom && childHeight < pageHeightPx) {
              const nextPageTop = pageOfTop * pageHeightPx;
              const pushAmount = (nextPageTop - relativeTop) + 35;
              const style = window.getComputedStyle(htmlChild);
              const originalMarginTop = parseFloat(style.marginTop) || 0;
              htmlChild.style.marginTop = `${originalMarginTop + pushAmount}px`;
              offsetAccumulated += pushAmount;
            }
          });
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas rendering dimensions are invalid');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName.replace(/\s+/g, '_').toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(`Houve um erro ao gerar o PDF do teste.\nDetalhes: ${errMsg}`);
    } finally {
      window.getComputedStyle = originalGetComputedStyle;
      origSvgs.forEach((svg) => {
        svg.removeAttribute('data-real-width');
        svg.removeAttribute('data-real-height');
      });
      origRecharts.forEach((chart) => {
        chart.removeAttribute('data-real-width');
        chart.removeAttribute('data-real-height');
      });
      setIsExportingTestPDF(false);
    }
  };

  return {
    isExportingResume,
    isExportingTestPDF,
    resumePrintRef,
    discModalRef,
    mbtiModalRef,
    temperamentosModalRef,
    customTestModalRef,
    questionsModalRef,
    handleDownloadResume,
    handleExportModalToPDF,
  };
};
