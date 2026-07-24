import { RefObject } from 'react';
import { Activity, AlertTriangle, Award, Check, Clock, FileText, Loader2, X as CloseIcon, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { perfisDISC } from '../../data/assessmentProfiles';
import type { DiscReportResult } from '../../types/companyDashboard';
import { formatDate } from '../../utils/companyDashboardUtils';

interface CompanyDiscReportModalProps {
  result: DiscReportResult | null;
  modalRef: RefObject<HTMLDivElement>;
  isExportingPDF: boolean;
  onExportPDF: (ref: RefObject<HTMLElement>, filename: string) => void;
  onClose: () => void;
}

const getCombinationText = (primaryKey: string, secondaryKey: string) => {
  if ((primaryKey === 'D' && secondaryKey === 'I') || (primaryKey === 'I' && secondaryKey === 'D')) {
    return 'Líder comunicador, persuasivo e competitivo.';
  }
  if ((primaryKey === 'D' && secondaryKey === 'C') || (primaryKey === 'C' && secondaryKey === 'D')) {
    return 'Estratégico, exigente e focado em alta performance.';
  }
  if ((primaryKey === 'I' && secondaryKey === 'S') || (primaryKey === 'S' && secondaryKey === 'I')) {
    return 'Comunicador empático e colaborativo.';
  }
  if ((primaryKey === 'S' && secondaryKey === 'C') || (primaryKey === 'C' && secondaryKey === 'S')) {
    return 'Organizado, confiável e analítico.';
  }
  if ((primaryKey === 'D' && secondaryKey === 'S') || (primaryKey === 'S' && secondaryKey === 'D')) {
    return 'Liderança equilibrada e firme.';
  }
  if ((primaryKey === 'I' && secondaryKey === 'C') || (primaryKey === 'C' && secondaryKey === 'I')) {
    return 'Criativo com pensamento analítico.';
  }
  return '';
};

const getClassificationBand = (value: number) => {
  if (value <= 39) return { label: 'Baixa tendência', color: 'text-slate-400 bg-slate-50 border-slate-200' };
  if (value <= 69) return { label: 'Tendência moderada', color: 'text-[#ffa303] bg-[#ffc24b]/16 border-[#ffc24b]/30' };
  return { label: 'Perfil muito forte e predominante', color: 'text-[#40b87f] bg-[#63e1a5]/14 border-[#63e1a5]/25' };
};

export function CompanyDiscReportModal({
  result,
  modalRef,
  isExportingPDF,
  onExportPDF,
  onClose,
}: CompanyDiscReportModalProps) {
  if (!result) return null;

  const { D, I, S, C } = result;
  const scoresList = [
    { key: 'D' as const, label: 'Dominância (D)', val: D, color: 'bg-[#ff4b8c]', classColor: 'text-[#ff4b8c] bg-[#ff4b8c]/10 border-[#ff4b8c]/15', profile: perfisDISC.D },
    { key: 'I' as const, label: 'Influência (I)', val: I, color: 'bg-[#533af6]/100', classColor: 'text-[#533af6] bg-[#533af6]/10 border-[#533af6]/15', profile: perfisDISC.I },
    { key: 'S' as const, label: 'Estabilidade (S)', val: S, color: 'bg-[#63e1a5]', classColor: 'text-[#40b87f] bg-[#63e1a5]/14 border-[#63e1a5]/20', profile: perfisDISC.S },
    { key: 'C' as const, label: 'Conformidade (C)', val: C, color: 'bg-[#ffc24b]', classColor: 'text-[#ffa303] bg-[#ffc24b]/16 border-[#ffc24b]/22', profile: perfisDISC.C },
  ];
  const sortedScores = [...scoresList].sort((a, b) => b.val - a.val);
  const predominant = sortedScores[0];
  const secondary = sortedScores[1];
  const combinationText = getCombinationText(predominant.key, secondary.key);

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
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
        >
          <div className="border-b border-slate-100 bg-[#fbf9ff] p-4 sm:p-6">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff] shadow-sm sm:h-12 sm:w-12">
                  <Award size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[18px] font-semibold leading-tight tracking-tight text-[#343241] sm:text-sm">
                    Relatório DISC 5.0
                  </h4>
                  <div className="mt-2 grid gap-1 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-0.5">
                    <p className="text-[12px] font-medium leading-snug text-slate-400">
                      <span className="text-slate-400">Candidato:</span>{' '}
                      <span className="text-slate-500">{result.applicantName || 'Não informado'}</span>
                    </p>
                    <span className="hidden text-[10px] font-bold text-slate-300 sm:inline">?</span>
                    <p className="flex items-center gap-1 text-[12px] font-medium leading-snug text-[#533af6]">
                      <Clock size={10} /> Realizado em: {formatDate(result.completedAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                <button
                  onClick={() => onExportPDF(modalRef, `DISC_${result.applicantName}`)}
                  disabled={isExportingPDF}
                  className="flex h-8 flex-1 items-center justify-center gap-2 rounded-xl border border-[#940dff] bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  {isExportingPDF ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  {isExportingPDF ? 'Gerando...' : 'Baixar PDF'}
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                  aria-label="Fechar relatório"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left font-sans">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border ${predominant.classColor} text-left`}>
                  <span className="text-[9px] font-semibold opacity-80">Perfil Predominante</span>
                  <h3 className="text-lg font-semibold tracking-tight mt-1">{predominant.profile.nome}</h3>
                  <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{predominant.profile.desc}</p>
                </div>
                <div className={`p-5 rounded-xl border ${secondary.classColor} text-left`}>
                  <span className="text-[9px] font-semibold opacity-80">Perfil Secundário</span>
                  <h3 className="text-lg font-semibold tracking-tight mt-1">{secondary.profile.nome}</h3>
                  <p className="text-xs font-semibold leading-relaxed mt-2 opacity-90">{secondary.profile.desc}</p>
                </div>
              </div>

              {combinationText && (
                <div className="p-5 bg-[#533af6]/5 border border-[#533af6]/15 rounded-xl text-left">
                  <span className="text-[9px] font-semibold text-[#533af6]">Combinação de Perfil</span>
                  <h4 className="text-sm font-semibold text-[#343241] mt-1">{predominant.profile.label} + {secondary.profile.label}</h4>
                  <p className="text-xs font-bold text-[#533af6] mt-1 leading-relaxed">{combinationText}</p>
                </div>
              )}

              <div className="bg-slate-50/60 border border-slate-100 p-5 rounded-xl space-y-4">
                <h5 className="text-[10px] font-semibold text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#533af6]/100 rounded-xl" /> Equilíbrio dos Fatores (DISC)
                </h5>
                <div className="space-y-4">
                  {scoresList.map((factor) => {
                    const band = getClassificationBand(factor.val);
                    return (
                      <div key={factor.key} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{factor.label}</span>
                            <span className={`px-2 py-0.5 rounded-xl text-[10px] font-semibold border ${band.color}`}>
                              {band.label}
                            </span>
                          </div>
                          <span className="font-semibold text-xs text-[#343241]">{factor.val}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-[3px] overflow-hidden shadow-inner border border-slate-200/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.val}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full ${factor.color} rounded-[3px]`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-6 space-y-6 bg-white shadow-sm text-left">
                <h3 className="text-sm font-semibold text-[#343241] tracking-tight border-b border-slate-50 pb-2">
                  Detalhamento: {predominant.profile.label}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-semibold text-slate-400">Características</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {predominant.profile.caracteristicas.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-semibold text-[#63e1a5]">Pontos Fortes</span>
                    <div className="space-y-1.5 mt-1">
                      {predominant.profile.pontosFortes.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                          <Check className="text-[#63e1a5] shrink-0 mt-0.5" size={12} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-semibold text-[#ffc24b]">Pontos de Atenção</span>
                    <div className="space-y-1.5 mt-1">
                      {predominant.profile.pontosAtencao.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                          <AlertTriangle className="text-[#ffc24b] shrink-0 mt-0.5" size={12} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-semibold text-[#533af6]">Motivadores</span>
                    <div className="space-y-1.5 mt-1">
                      {predominant.profile.motivadores.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                          <Zap className="text-[#533af6] shrink-0 mt-0.5" size={12} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2 border-t border-slate-50 pt-3">
                    <span className="text-[9px] font-semibold text-[#ff4b8c]">Sob Pressão</span>
                    <div className="space-y-1.5 mt-1">
                      {predominant.profile.sobPressao.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-tight">
                          <Activity className="text-[#ff4b8c] shrink-0 mt-0.5" size={12} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#fbf9ff] flex justify-center items-center">
            <p className="text-[11px] font-medium text-slate-400 text-center">
              metodologia disc 5.0 • relatório comportamental
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
