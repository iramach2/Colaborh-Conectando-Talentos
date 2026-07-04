import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, FileText, X as CloseIcon } from 'lucide-react';
import type { CustomQuestionnaire } from '../../services/customQuestionnaireService';
import type { CompanyApplicant } from '../../types/companyDashboard';

interface CompanyCustomTemplateRequestModalProps {
  isOpen: boolean;
  applicant: CompanyApplicant | null;
  customTemplates: CustomQuestionnaire[];
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;
  onClose: () => void;
  onConfirm: (applicant: CompanyApplicant, template: CustomQuestionnaire) => void | Promise<void>;
  onGoToCreateTemplates: () => void;
}

export const CompanyCustomTemplateRequestModal = ({
  isOpen,
  applicant,
  customTemplates,
  selectedTemplateId,
  setSelectedTemplateId,
  onClose,
  onConfirm,
  onGoToCreateTemplates
}: CompanyCustomTemplateRequestModalProps) => {
  if (!isOpen || !applicant) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#533af6]/10 rounded-2xl flex items-center justify-center text-[#533af6] shadow-sm shrink-0 border border-[#533af6]/15" style={{ borderColor: 'rgba(99, 102, 241, 0.08)' }}>
                <FileText size={22} className="text-[#533af6]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                  Solicitar Questionário Customizado
                </h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[350px]">
                  Candidato: {applicant.candidate_name || applicant.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm border border-slate-100 hover:scale-105 active:scale-95 transition-all outline-none"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-left font-sans bg-slate-50/30">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Selecione um Template da Biblioteca
              </h3>

              {customTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                    <FileText size={20} />
                  </div>
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Nenhum Questionário Criado</p>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-sm leading-relaxed">
                    Você não possui questionários customizados em sua biblioteca. Vá até o menu lateral e acesse <strong>Avaliações</strong> &gt; <strong>Criar Questionário Customizado</strong> para cadastrar seu primeiro template independente de vaga.
                  </p>
                  <button
                    type="button"
                    onClick={onGoToCreateTemplates}
                    className="mt-4 px-4 py-2 bg-[#533af6] hover:bg-[#432ec4] text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 outline-none"
                  >
                    Ir para Criação de Questionários
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customTemplates.map(template => {
                    const isSelected = selectedTemplateId === template.id;

                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'bg-[#533af6]/5 border-[#533af6] shadow-sm'
                            : 'bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#533af6] bg-[#533af6] text-white'
                              : 'border-slate-350 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-extrabold text-slate-900 leading-normal mb-1">{template.title}</h4>
                          <div className="flex items-center gap-3 text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>{template.questions?.length || 0} Perguntas</span>
                            <span>•</span>
                            <span>Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer outline-none"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedTemplateId}
              onClick={() => {
                const template = customTemplates.find(item => item.id === selectedTemplateId);
                if (template) {
                  onConfirm(applicant, template);
                }
              }}
              className={`px-6 py-2.5 font-black text-[9px] uppercase tracking-widest rounded-xl shadow-lg transition-all border-0 outline-none flex items-center gap-1.5 ${
                selectedTemplateId
                  ? 'bg-[#533af6] hover:bg-[#432ec4] text-white cursor-pointer shadow-[#533af6]/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Solicitar Questionário</span>
              <ChevronRight size={10} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
