import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Clock, Loader2, X as CloseIcon, CheckCircle2 } from 'lucide-react';
import type { CustomQuestionnaire } from '../../../services/customQuestionnaireService';
import type { CompanyApplicant, CompanyJob, CustomQuestionItem } from '../../../types/companyDashboard';
import { parseCandidatePhoneData, formatDate, getCustomQuestionsFromJobDescription } from '../../../utils/companyDashboardUtils';
import { findCustomQuestionnaireByResponseIds } from '../../../utils/customAssessmentResult';

interface CustomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: CompanyApplicant | null;
  selectedJob: CompanyJob | null;
  onExportPDF: (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => Promise<void>;
  isExportingPDF: boolean;
  customTemplates?: CustomQuestionnaire[];
}

export const CustomQuestionsModal = ({
  isOpen,
  onClose,
  applicant,
  selectedJob,
  onExportPDF,
  isExportingPDF,
  customTemplates = [],
}: CustomQuestionsModalProps) => {
  const customTestModalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !applicant) return null;

  const parsedData = parseCandidatePhoneData(applicant.candidate_phone || '');
  let customQuestionsList: CustomQuestionItem[] = [];
  let responses: Record<string, string | number> = {};
  let reportTitle = 'Questionário Customizado';

  if (parsedData.customTest) {
    if (parsedData.customTest.includes(':::')) {
      const parts = parsedData.customTest.split(':::');
      const jsonPart = parts.slice(1).join(':::');
      try {
        const parsedObj = JSON.parse(jsonPart);
        customQuestionsList = parsedObj.questions || [];
        responses = parsedObj.responses || {};
        reportTitle = parsedObj.title || reportTitle;
      } catch (e) {
        console.error('Erro ao ler JSON do teste customizado:', e);
      }
    } else if (parsedData.customTest.startsWith('COMPLETED===')) {
      const jobDesc = selectedJob?.description || '';
      customQuestionsList = getCustomQuestionsFromJobDescription(jobDesc);
      try {
        const jsonContent = parsedData.customTest.replace('COMPLETED===', '');
        const parsedObj = JSON.parse(jsonContent);
        responses = parsedObj.responses || parsedObj || {};
      } catch (e) {
        console.error('Erro ao ler respostas customizadas legadas:', e);
      }
    }
  }

  if (customQuestionsList.length === 0 && Object.keys(responses).length > 0) {
    const matchingTemplate = findCustomQuestionnaireByResponseIds(responses, customTemplates);

    if (matchingTemplate) {
      customQuestionsList = matchingTemplate.questions;
      reportTitle = matchingTemplate.title || reportTitle;
    }
  }

  const handleDownload = () => {
    const title = reportTitle.replace(/\s+/g, '_');
    onExportPDF(customTestModalRef, `${title}_${applicant.candidate_name || applicant.name}`);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      <motion.div 
        ref={customTestModalRef}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-slate-100"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#fbf9ff]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#63e1a5]/14 rounded-2xl flex items-center justify-center text-[#40b87f] shadow-sm shrink-0 border border-[#63e1a5]/20" style={{ borderColor: 'rgba(99, 225, 165, 0.22)' }}>
              <FileText size={22} className="text-[#40b87f]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-[#343241] leading-tight">
                {reportTitle}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                <p className="text-[12px] font-medium text-slate-400 pb-0.5">
                  Candidato: {applicant.candidate_name || applicant.name}
                </p>
                <span className="text-[10px] text-slate-300 font-bold">•</span>
                <p className="text-[12px] font-medium text-[#533af6] flex items-center gap-1">
                  <Clock size={10} /> Realizado em: {formatDate(applicant.completedAt || applicant.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleDownload}
              disabled={isExportingPDF}
              className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#8200e6] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {isExportingPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              {isExportingPDF ? 'Gerando...' : 'Baixar PDF'}
            </button>
            <button 
              onClick={onClose} 
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95 cursor-pointer"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left font-sans bg-[#fbf9ff]">
          {customQuestionsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3">
                <FileText size={20} />
              </div>
              <p className="text-sm font-semibold text-[#343241]">Perguntas não encontradas</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">Nenhuma pergunta customizada está associada a esta vaga no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 mb-4">
                Respostas do Candidato ({customQuestionsList.length} Perguntas)
              </h3>
              
              <div className="space-y-5">
                {customQuestionsList.map((q, index) => {
                  const questionId = String(q.id ?? index);
                  const candidateAnswer = responses[questionId] ?? 'Sem resposta.';

                  return (
                    <div 
                      key={questionId} 
                      className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="flex items-center justify-center w-6 h-6 rounded-xl text-[11px] font-semibold shrink-0 text-white" 
                          style={{ backgroundColor: '#63e1a5' }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                            {q.question}
                          </h4>
                          <span className={`inline-block px-1.5 py-0.5 rounded-xl text-[7px] font-semibold mt-1 ${
                            q.type === 'choice' 
                              ? 'bg-primary-50 text-primary-600' 
                              : 'bg-[#ffc24b]/16 text-[#ffa303]'
                          }`}>
                            {q.type === 'choice' ? 'Múltipla Escolha' : 'Texto Aberto'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="pl-9 border-l-2 border-slate-100 mt-2 space-y-2">
                        {q.type === 'choice' ? (
                          <div className="space-y-1.5">
                            {(q.options || []).map((opt: string, oIdx: number) => {
                              const isSelected = opt === candidateAnswer;
                              return (
                                <div 
                                  key={oIdx} 
                                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                    isSelected 
                                      ? 'bg-[#63e1a5]/14 border-[#63e1a5]/25 text-[#2f9f6b] font-extrabold' 
                                      : 'bg-[#fbf9ff] border-slate-100 text-slate-500'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-xl flex items-center justify-center text-[9px] font-bold ${
                                      isSelected 
                                        ? 'bg-[#63e1a5] text-white' 
                                        : 'bg-white border border-slate-200 text-slate-400'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    {opt}
                                  </span>
                                  {isSelected && <CheckCircle2 size={14} className="text-[#63e1a5] shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-[#fbf9ff] p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                              {candidateAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#fbf9ff] flex justify-center items-center shrink-0">
          <p className="text-[11px] font-medium text-slate-400 text-center">
            Questionário Customizado da Vaga
          </p>
        </div>
      </motion.div>
    </div>
  );
};
