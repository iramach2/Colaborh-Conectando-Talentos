import { RefObject } from 'react';
import { AlertTriangle, Check, Clock, FileText, Loader2, Thermometer, X as CloseIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TEMPERAMENTOS_PROFILES, TEMPERAMENTOS_QUESTIONS } from '../../data/assessmentProfiles';
import type { AssessmentAnswer, TemperamentosReportResult } from '../../types/companyDashboard';
import { formatDate } from '../../utils/companyDashboardUtils';

interface CompanyTemperamentosReportModalProps {
  isOpen: boolean;
  result: TemperamentosReportResult | null;
  modalRef: RefObject<HTMLDivElement>;
  activeTab: 'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA';
  setActiveTab: (tab: 'PERFIL' | 'DISTRIBUICAO' | 'AUDITORIA') => void;
  isExportingPDF: boolean;
  onExportPDF: (ref: RefObject<HTMLElement>, filename: string) => void;
  onClose: () => void;
}

const tabLabels = {
  PERFIL: 'Análise de Perfil',
  DISTRIBUICAO: 'Gráfico de Distribuição',
  AUDITORIA: 'Auditoria de Respostas',
};

const colorMap: Record<string, string> = {
  I: 'bg-[#ffc24b]/16 text-[#ffa303] border-[#ffc24b]/30',
  C: 'bg-[#63e1a5]/14 text-[#2f9f6b] border-[#63e1a5]/20',
  O: 'bg-[#533af6]/10 text-[#533af6] border-[#533af6]/15',
  A: 'bg-[#ff4b8c]/10 text-[#ff4b8c] border-[#ff4b8c]/15',
};

const getProfileData = (type: string) => {
  if (!type) return null;
  if (TEMPERAMENTOS_PROFILES[type]) return TEMPERAMENTOS_PROFILES[type];
  if (type.includes(' + ')) {
    const parts = type.split(' + ');
    const inverted = `${parts[1]} + ${parts[0]}`;
    if (TEMPERAMENTOS_PROFILES[inverted]) return TEMPERAMENTOS_PROFILES[inverted];
  }
  return TEMPERAMENTOS_PROFILES[type.charAt(0)] || null;
};

export function CompanyTemperamentosReportModal({
  isOpen,
  result,
  modalRef,
  activeTab,
  setActiveTab,
  isExportingPDF,
  onExportPDF,
  onClose,
}: CompanyTemperamentosReportModalProps) {
  if (!isOpen || !result) return null;

  const profileType = result.type;
  const scores = result.scores || { I: 0, C: 0, O: 0, A: 0 };
  const answers = result.answers || [];
  const profile = getProfileData(profileType);
  const badgeColorClass = colorMap[profileType?.charAt(0)] || 'bg-slate-50 text-slate-700 border-slate-100';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-5xl bg-[#fbf9ff] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/80"
        >
          <div className="px-6 py-5 flex justify-between items-center bg-[#fbf9ff]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-[#ff4b8c] shadow-sm">
                <Thermometer size={22} className="text-[#ff4b8c]" />
              </div>
              <div>
                <h4 className="text-[20px] font-semibold tracking-tight text-[#343241] leading-tight">
                  Relatório de Temperamentos e Perfil Comportamental
                </h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-[12px] font-medium text-slate-400">
                    Candidato: {result.applicantName}
                  </p>
                  <span className="text-[10px] text-slate-300 font-bold">•</span>
                  <p className="flex items-center gap-1 text-[12px] font-medium text-[#533af6]">
                    <Clock size={10} /> Realizado em: {formatDate(result.completedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onExportPDF(modalRef, `Temperamentos_${result.applicantName}`)}
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

          <div className="flex shrink-0 gap-3 overflow-x-auto bg-[#fbf9ff] px-6 py-3 no-scrollbar">
            {(['PERFIL', 'DISTRIBUICAO', 'AUDITORIA'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-8 px-4 text-[12px] font-semibold rounded-xl transition-all whitespace-nowrap outline-none cursor-pointer border ${
                    isActive ? 'border-[#f3e5ff] bg-[#f3e5ff] text-[#940dff] shadow-sm' : 'border-white/80 bg-white text-slate-500 hover:border-[#f3e5ff] hover:text-[#940dff]'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-left bg-[#fbf9ff]">
            {activeTab === 'PERFIL' && (
              profile ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] text-left">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className={`mb-2 inline-flex rounded-xl border px-3 py-1 text-[11px] font-semibold ${badgeColorClass}`}>
                          Perfil Predominante: {profileType}
                        </span>
                        <h3 className="text-[20px] font-semibold tracking-tight text-[#343241] leading-tight">
                          {profile.name} - {profile.title}
                        </h3>
                      </div>
                      <div className="flex h-10 min-w-[76px] shrink-0 items-center justify-center rounded-xl border border-[#533af6]/15 bg-[#533af6]/10 px-4 text-sm font-semibold text-[#533af6]">
                        {profileType}
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-[13px] font-medium leading-relaxed text-slate-500">
                      {profile.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-[#2f9f6b]">
                        <span className="h-2 w-2 rounded-xl bg-[#63e1a5]" /> Pontos Fortes
                      </h4>
                      <div className="mt-4 space-y-3">
                        {profile.strengths.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-slate-500">
                            <Check className="text-[#63e1a5] shrink-0 mt-0.5" size={12} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-[#ff4b8c]">
                        <span className="h-2 w-2 rounded-xl bg-[#ff4b8c]" /> Pontos de Atenção
                      </h4>
                      <div className="mt-4 space-y-3">
                        {profile.weaknesses.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-slate-500">
                            <AlertTriangle className="text-[#ff4b8c] shrink-0 mt-0.5" size={12} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-[#533af6]">
                        <span className="h-2 w-2 rounded-xl bg-[#533af6]" /> Ambiente Ideal
                      </h4>
                      <div className="mt-4 space-y-3">
                        {profile.environments.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-slate-500">
                            <Thermometer className="text-[#533af6] shrink-0 mt-0.5" size={12} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 font-bold text-slate-500">
                  Perfil comportamental não encontrado ou tipo inválido ({profileType}).
                </div>
              )
            )}

            {activeTab === 'DISTRIBUICAO' && (() => {
  const total = Object.values(scores).reduce((acc, val) => acc + (val || 0), 0) || 25;
              const styles = [
                { label: 'Idealista / Criativo (I)', score: scores.I || 0, color: 'bg-[#ffc24b]', barBg: 'rgba(255, 194, 75, 0.16)', textColor: 'text-[#ffa303]', borderC: 'border-[#ffc24b]/30' },
                { label: 'Comunicador / Relacional (C)', score: scores.C || 0, color: 'bg-[#63e1a5]', barBg: 'rgba(99, 225, 165, 0.14)', textColor: 'text-[#2f9f6b]', borderC: 'border-[#63e1a5]/25' },
                { label: 'Organizador / Analítico (O)', score: scores.O || 0, color: 'bg-[#533af6]/100', barBg: 'rgba(139, 92, 246, 0.1)', textColor: 'text-[#533af6]', borderC: 'border-[#533af6]/20' },
                { label: 'Executor / Dominante (A)', score: scores.A || 0, color: 'bg-[#ff4b8c]', barBg: 'rgba(255, 75, 140, 0.1)', textColor: 'text-[#ff4b8c]', borderC: 'border-[#ff4b8c]/20' },
              ];

              return (
                <div className="space-y-4">
                  <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#343241]">
                    Distribuição das Respostas por Estilo
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {styles.map((style) => {
                      const pct = (style.score / total) * 100;
                      return (
                        <div key={style.label} className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] text-left">
                          <div className="flex items-center justify-between gap-4">
                            <span className={`text-sm font-semibold tracking-tight ${style.textColor}`}>
                              {style.label}
                            </span>
                            <span className={`rounded-xl border px-3 py-1 text-[11px] font-semibold ${style.textColor} ${style.borderC}`} style={{ backgroundColor: style.barBg }}>
                              {style.score} de {total} pts ({Math.round(pct)}%)
                            </span>
                          </div>

                          <div className="mt-4 h-3 w-full overflow-hidden rounded-xl border border-slate-200/50 bg-slate-100 p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-xl ${style.color}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {activeTab === 'AUDITORIA' && (
              <div className="space-y-4">
                <h3 className="mb-4 text-sm font-semibold tracking-tight text-[#343241]">
                  Auditoria Detalhada de Respostas (25 Questões)
                </h3>

                <div className="space-y-4">
                  {TEMPERAMENTOS_QUESTIONS.map((question) => {
                    const answer = answers.find((ans: AssessmentAnswer) => ans.q === question.id);
                    const selectedChoice = answer ? answer.choice : '';

                    return (
                      <div key={question.id} className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)] transition-all hover:border-[#533af6]/18 text-left">
                        <div className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-xl text-[11px] font-semibold shrink-0 text-white bg-[#940dff]">
                            {question.id}
                          </span>
                          <h4 className="pt-0.5 text-[13px] font-semibold leading-relaxed text-[#343241]">
                            {question.text}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                          {Object.entries(question.options).map(([profileKey, optionText]) => {
                            const isSelected = selectedChoice === profileKey;
                            const profileName = profileKey === 'I' ? 'Idealista (I)' : profileKey === 'C' ? 'Comunicador (C)' : profileKey === 'O' ? 'Organizador (O)' : 'Executor (A)';
                            let bgClass = 'bg-white border-slate-100 text-slate-500';
                            if (isSelected) {
                              if (profileKey === 'I') bgClass = 'bg-[#ffc24b]/16 border-[#ffc24b]/30 text-[#ffa303] shadow-2xs font-bold';
                              else if (profileKey === 'C') bgClass = 'bg-[#63e1a5]/10 border-[#63e1a5]/30 text-[#2f9f6b] shadow-2xs font-bold';
                              else if (profileKey === 'O') bgClass = 'bg-[#533af6]/10 border-[#533af6]/25 text-[#533af6] shadow-2xs font-bold';
                              else if (profileKey === 'A') bgClass = 'bg-[#ff4b8c]/10 border-[#ff4b8c]/25 text-[#ff4b8c] shadow-2xs font-bold';
                            }

                            return (
                              <div key={profileKey} className={`flex flex-col justify-between gap-1 rounded-xl border px-3 py-2.5 text-[12px] font-medium leading-relaxed transition-all ${bgClass}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <span>{optionText}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-semibold shrink-0 ${
                                    profileKey === 'I' ? 'bg-[#ffc24b]/16 text-[#ffa303]' :
                                    profileKey === 'C' ? 'bg-[#63e1a5]/20 text-[#2f9f6b]' :
                                    profileKey === 'O' ? 'bg-[#533af6]/10 text-[#533af6]' :
                                    'bg-[#ff4b8c]/15 text-[#ff4b8c]'
                                  }`}>
                                    {profileKey}
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="border-t border-slate-100/50 pt-1 text-[11px] font-medium text-slate-400">
                                    ✓ Escolha do Candidato ({profileName})
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-center border-t border-slate-100 bg-[#fbf9ff] px-6 py-3">
            <p className="text-[11px] font-medium text-slate-400 text-center">
              Mapeamento Comportamental • Método de 4 Estilos com 25 Questões
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
