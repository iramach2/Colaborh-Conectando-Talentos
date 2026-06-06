import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Clock, Loader2, X as CloseIcon, CheckCircle2 } from 'lucide-react';
import { parseCandidatePhoneData, formatDate, getCustomQuestionsFromJobDescription } from '../../../utils/companyDashboardUtils';

interface CustomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: any;
  selectedJob: any;
  onExportPDF: (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => Promise<void>;
  isExportingPDF: boolean;
}

export const CustomQuestionsModal = ({
  isOpen,
  onClose,
  applicant,
  selectedJob,
  onExportPDF,
  isExportingPDF
}: CustomQuestionsModalProps) => {
  const customTestModalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !applicant) return null;

  const parsedData = parseCandidatePhoneData(applicant.candidate_phone || '');
  let customQuestionsList: any[] = [];
  let responses: Record<string, string> = {};

  if (parsedData.customTest) {
    if (parsedData.customTest.includes(':::')) {
      const parts = parsedData.customTest.split(':::');
      const jsonPart = parts.slice(1).join(':::');
      try {
        const parsedObj = JSON.parse(jsonPart);
        customQuestionsList = parsedObj.questions || [];
        responses = parsedObj.responses || {};
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

  const getTitle = () => {
    if (parsedData.customTest && parsedData.customTest.includes(':::')) {
      try {
        const parts = parsedData.customTest.split(':::');
        const parsedObj = JSON.parse(parts.slice(1).join(':::'));
        return parsedObj.title || 'Questionário Customizado';
      } catch (e) {}
    }
    return 'Questionário Customizado';
  };

  const handleDownload = () => {
    const title = getTitle().replace(/\s+/g, '_');
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
        className="relative w-full max-w-3xl bg-white rounded-[5px] shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-slate-100"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0 border border-emerald-100" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <FileText size={22} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                {getTitle()}
              </h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-0.5">
                  Candidato: {applicant.candidate_name || applicant.name}
                </p>
                <span className="text-[10px] text-slate-300 font-bold">•</span>
                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Realizado em: {formatDate(applicant.completedAt || applicant.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleDownload}
              disabled={isExportingPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#533af6] hover:bg-[#432ec4] text-white rounded-full font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer border-0 outline-none whitespace-nowrap"
            >
              {isExportingPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              {isExportingPDF ? 'Gerando...' : 'Baixar PDF'}
            </button>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-all cursor-pointer border border-slate-100 hover:scale-105 active:scale-95 shadow-sm outline-none flex items-center justify-center w-9 h-9"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
          {customQuestionsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <FileText size={20} />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perguntas não encontradas</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">Nenhuma pergunta customizada está associada a esta vaga no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Respostas do Candidato ({customQuestionsList.length} Perguntas)
              </h3>
              
              <div className="space-y-5">
                {customQuestionsList.map((q: any, index: number) => {
                  const candidateAnswer = responses[q.id] || 'Sem resposta.';

                  return (
                    <div 
                      key={q.id} 
                      className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white" 
                          style={{ backgroundColor: '#10b981' }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                            {q.question}
                          </h4>
                          <span className={`inline-block px-1.5 py-0.5 rounded-[5px] text-[7px] font-black uppercase tracking-wider mt-1 ${
                            q.type === 'choice' 
                              ? 'bg-primary-50 text-primary-600' 
                              : 'bg-amber-50 text-amber-600'
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
                                  className={`p-2.5 rounded-[5px] border text-xs font-semibold flex items-center justify-between ${
                                    isSelected 
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold' 
                                      : 'bg-slate-50/50 border-slate-100 text-slate-500'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                      isSelected 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-white border border-slate-200 text-slate-400'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    {opt}
                                  </span>
                                  {isSelected && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-slate-50/50 p-4 rounded-[5px] border border-slate-100">
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
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center items-center shrink-0">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">
            Questionário Customizado da Vaga
          </p>
        </div>
      </motion.div>
    </div>
  );
};
