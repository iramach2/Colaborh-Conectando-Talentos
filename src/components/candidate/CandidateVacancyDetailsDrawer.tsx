import { Building, Clock, DollarSign, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CompanyApplication, CompanyJob } from '../../types/companyDashboard';
import { getCurrentJobStages } from '../../utils/companyDashboardUtils';

interface CandidateVacancyDetailsDrawerProps {
  job: CompanyJob | null;
  applications: CompanyApplication[];
  appliedJobIds: string[];
  isApplying: string | null;
  cleanEmojiFromText: (text: string) => string;
  cleanDescription: (description: string) => string;
  getRequirementsList: (job: CompanyJob) => string[];
  getBenefitsList: (job: CompanyJob) => string[];
  onClose: () => void;
  onApply: (job: CompanyJob) => void;
}

export function CandidateVacancyDetailsDrawer({
  job,
  applications,
  appliedJobIds,
  isApplying,
  cleanEmojiFromText,
  cleanDescription,
  getRequirementsList,
  getBenefitsList,
  onClose,
  onApply,
}: CandidateVacancyDetailsDrawerProps) {
  const candidateApp = job ? applications.find((app) => app.job_id === job.id) : null;
  const currentStatus = candidateApp ? (candidateApp.status || 'Triagem') : null;
  const stagesList = job ? getCurrentJobStages(job) : [];
  const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !stagesList.includes(currentStatus))
    ? (stagesList[0] || 'Triagem')
    : currentStatus;
  const currentStageIndex = stagesList.indexOf(normalizedStatus);
  const isApplied = job?.id ? appliedJobIds.includes(job.id) : false;
  const isCurrentApplying = job ? isApplying === job.id : false;

  return (
    <AnimatePresence>
      {job && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[600px] bg-white shadow-2xl z-[100] flex flex-col rounded-l-[24px] rounded-r-none border-l border-slate-100 overflow-hidden"
          >
            <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm inline-block mb-3">
                  {cleanEmojiFromText(job.modality || '')}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-snug">
                  {cleanEmojiFromText(job.title || '')}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Empresa Parceira • {job.city && job.state ? `${cleanEmojiFromText(job.city)}, ${cleanEmojiFromText(job.state)}` : cleanEmojiFromText(job.modality || 'Remoto')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-full hover:bg-slate-100 cursor-pointer border-0 bg-transparent"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-white shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Salário Proposto</p>
                    <p className="text-xs font-bold text-slate-700">{cleanEmojiFromText(job.salary || 'A combinar')}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-white shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Idade Mínima</p>
                    <p className="text-xs font-bold text-slate-700">{job.min_age || job.minAge || 18} anos</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-white shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                    <Building size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Regime</p>
                    <p className="text-xs font-bold text-slate-700">{cleanEmojiFromText(job.contract_type || 'CLT')}</p>
                  </div>
                </div>
              </div>

              {candidateApp && (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80 text-left">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Minha Jornada nesta Vaga</h4>
                  <div className="relative border-l-2 border-slate-200/60 pl-6 ml-3 space-y-5">
                    {stagesList.map((stageName: string, idx: number) => {
                      const isCurrent = idx === currentStageIndex;
                      const isCompleted = idx < currentStageIndex;

                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[32.5px] top-1 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                            isCurrent
                              ? 'bg-[#533af6] border-[#533af6] scale-110 shadow-md shadow-[#533af6]/20'
                              : isCompleted
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-white border-slate-300'
                          }`}>
                            {isCompleted && (
                              <svg className="w-2.5 h-2.5 text-white stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isCurrent && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            )}
                          </div>

                          <div>
                            <h5 className={`text-xs font-black uppercase tracking-tight ${
                              isCurrent
                                ? 'text-[#533af6]'
                                : isCompleted
                                  ? 'text-emerald-600'
                                  : 'text-slate-500'
                            }`}>
                              {cleanEmojiFromText(stageName)}
                            </h5>
                            <p className="text-[8.5px] font-black uppercase tracking-widest mt-0.5" style={{ color: isCurrent ? '#533af6' : isCompleted ? '#10b981' : '#94a3b8' }}>
                              {isCurrent ? 'Você está aqui' : isCompleted ? 'Concluído' : 'Pendente'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Descrição da Vaga</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-medium">
                  {cleanEmojiFromText(cleanDescription(job.description || ''))}
                </p>
              </div>

              {getRequirementsList(job).length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Requisitos</h4>
                  <ul className="grid grid-cols-1 gap-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {getRequirementsList(job).map((requirement: string, index: number) => (
                      <li key={index} className="text-xs text-slate-600 flex items-start gap-2 font-medium">
                        <span className="text-primary-500 font-bold shrink-0">•</span>
                        <span>{cleanEmojiFromText(requirement)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {getBenefitsList(job).length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Benefícios Oferecidos</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {getBenefitsList(job).map((benefit: string, index: number) => (
                      <li key={index} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        <span>{cleanEmojiFromText(benefit)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[9px] cursor-pointer border-0 bg-transparent"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(job);
                  onClose();
                }}
                disabled={isApplied || isCurrentApplying}
                className={`px-10 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg transition-all cursor-pointer ${
                  isApplied
                    ? 'bg-emerald-500 text-white cursor-default shadow-emerald-100 border-0'
                    : 'bg-[#8959f5] hover:bg-[#7747e0] text-white shadow-primary-500/10 border-0'
                }`}
              >
                {isApplied ? 'Candidatado' : 'Confirmar Candidatura'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
