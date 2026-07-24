import { RefObject } from 'react';
import { AlertTriangle, Check, Clock, FileText, Loader2, Sparkles, X as CloseIcon } from 'lucide-react';
import { MBTI_PROFILES, MBTI_QUESTIONS } from '../../data/assessmentProfiles';
import type { AssessmentAnswer, MbtiReportResult } from '../../types/companyDashboard';
import { formatDate } from '../../utils/companyDashboardUtils';
import { AnimatePresence, motion } from 'motion/react';

interface CompanyMbtiReportModalProps {
  isOpen: boolean;
  result: MbtiReportResult | null;
  modalRef: RefObject<HTMLDivElement>;
  activeTab: 'PERFIL' | 'DIMENSOES' | 'AUDITORIA';
  setActiveTab: (tab: 'PERFIL' | 'DIMENSOES' | 'AUDITORIA') => void;
  isExportingPDF: boolean;
  onExportPDF: (ref: RefObject<HTMLElement>, filename: string) => void;
  onClose: () => void;
}

const tabLabels = {
  PERFIL: 'Análise de Perfil',
  DIMENSOES: 'Gráfico de Dimensões',
  AUDITORIA: 'Auditoria de Respostas',
};

function DimensionBar({
  leftLabel,
  leftKey,
  rightLabel,
  rightKey,
  description,
  scores,
}: {
  leftLabel: string;
  leftKey: string;
  rightLabel: string;
  rightKey: string;
  description: string;
  scores: Record<string, number>;
}) {
  const leftVal = scores[leftKey] || 0;
  const rightVal = scores[rightKey] || 0;
  const total = leftVal + rightVal;
  const pctLeft = total > 0 ? (leftVal / total) * 100 : 50;
  const pctRight = total > 0 ? (rightVal / total) * 100 : 50;
  const isLeftDominant = leftVal >= rightVal;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 text-left">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <span className="text-[9px] font-semibold text-slate-400 block">Dimensão</span>
          <span className={`text-sm font-semibold ${isLeftDominant ? 'text-[#533af6]' : 'text-slate-500'}`}>
            {leftLabel} ({leftVal} pts)
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-semibold text-slate-400 block">Dimensão</span>
          <span className={`text-sm font-semibold ${!isLeftDominant ? 'text-[#533af6]' : 'text-slate-500'}`}>
            {rightLabel} ({rightVal} pts)
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-4 w-full bg-slate-100 rounded-[3px] overflow-hidden flex border border-slate-200/50 p-0.5 gap-0.5">
          <div
            className={`h-full rounded-l-[3px] transition-all duration-500 ${isLeftDominant ? 'bg-gradient-to-r from-[#533af6] to-[#533af6]' : 'bg-slate-300'}`}
            style={{ width: `${pctLeft}%` }}
          />
          <div
            className={`h-full rounded-r-[3px] transition-all duration-500 ${!isLeftDominant ? 'bg-gradient-to-r from-[#533af6] to-[#940dff]' : 'bg-slate-300'}`}
            style={{ width: `${pctRight}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-slate-400 px-1">
          <span>{Math.round(pctLeft)}% dominante</span>
          <span>{Math.round(pctRight)}% dominante</span>
        </div>
      </div>

      <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed border-t border-slate-50 pt-2.5">
        {description}
      </p>
    </div>
  );
}

export function CompanyMbtiReportModal({
  isOpen,
  result,
  modalRef,
  activeTab,
  setActiveTab,
  isExportingPDF,
  onExportPDF,
  onClose,
}: CompanyMbtiReportModalProps) {
  if (!isOpen || !result) return null;

  const profileType = result.type;
  const scores = result.scores || { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const answers = result.answers || [];
  const profile = MBTI_PROFILES[profileType];

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
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#fbf9ff]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#533af6]/10 border border-[#533af6]/15 rounded-2xl flex items-center justify-center text-[#533af6] shadow-sm shrink-0">
                <Sparkles size={22} className="text-[#533af6]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-[#343241] leading-tight">
                  Relatório de Personalidade MBTI
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <p className="text-[12px] font-medium text-slate-400 pb-0.5">
                    Candidato: {result.applicantName}
                  </p>
                  <span className="text-[10px] text-slate-300 font-bold">•</span>
                  <p className="text-[12px] font-medium text-[#533af6] flex items-center gap-1">
                    <Clock size={10} /> Realizado em: {formatDate(result.completedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onExportPDF(modalRef, `MBTI_${result.applicantName}`)}
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

          <div className="flex border-b border-slate-100 bg-white px-6 py-2 overflow-x-auto gap-2 shrink-0 no-scrollbar">
            {(['PERFIL', 'DIMENSOES', 'AUDITORIA'] as const).map((tab) => {
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

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left font-sans bg-[#fbf9ff]">
            {activeTab === 'PERFIL' && (
              profile ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border ${profile.borderColor} bg-white shadow-sm space-y-4 text-left`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-xl text-[10px] font-semibold ${profile.classColor} mb-2`}>
                          Grupo: {profile.categoria}
                        </span>
                        <h3 className="text-2xl font-semibold text-[#343241] tracking-tight leading-tight">
                          {profile.nome} - {profile.titulo}
                        </h3>
                      </div>
                      <div className="flex items-center justify-center h-14 w-24 rounded-xl bg-gradient-to-br from-[#533af6] to-[#533af6] text-white text-xl font-black shadow-lg shrink-0">
                        {profile.nome}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {profile.desc}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-[9px] font-semibold text-slate-400">Características Chave</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.caracteristicas.map((item: string, index: number) => (
                          <span key={index} className="px-2.5 py-0.5 rounded-xl text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/50">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3">
                      <h4 className="text-sm font-semibold text-[#2f9f6b] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-xl bg-[#63e1a5]" /> Pontos Fortes
                      </h4>
                      <div className="space-y-2 mt-1">
                        {profile.pontosFortes.map((item: string, index: number) => (
                          <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                            <Check className="text-[#63e1a5] shrink-0 mt-0.5" size={12} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-3">
                      <h4 className="text-sm font-semibold text-[#ff4b8c] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-xl bg-[#ff4b8c]" /> Pontos de Atenção
                      </h4>
                      <div className="space-y-2 mt-1">
                        {profile.pontosAtencao.map((item: string, index: number) => (
                          <div key={index} className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                            <AlertTriangle className="text-[#ff4b8c] shrink-0 mt-0.5" size={12} />
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

            {activeTab === 'DIMENSOES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DimensionBar
                  leftLabel="Extroversão (E)"
                  leftKey="E"
                  rightLabel="Introversão (I)"
                  rightKey="I"
                  description="Mede como o candidato direciona sua energia. Extroversão prefere interações sociais e ação. Introversão prefere reflexão e privacidade."
                  scores={scores}
                />
                <DimensionBar
                  leftLabel="Sensação (S)"
                  leftKey="S"
                  rightLabel="Intuição (N)"
                  rightKey="N"
                  description="Mede como o candidato processa informações. Sensação foca em fatos, detalhes e realismo prático. Intuição foca em conexões, conceitos e possibilidades futuras."
                  scores={scores}
                />
                <DimensionBar
                  leftLabel="Pensamento (T)"
                  leftKey="T"
                  rightLabel="Sentimento (F)"
                  rightKey="F"
                  description="Mede como o candidato toma decisões. Pensamento decide pela lógica e consistência objetiva. Sentimento decide por valores pessoais e harmonia nos relacionamentos."
                  scores={scores}
                />
                <DimensionBar
                  leftLabel="Julgamento (J)"
                  leftKey="J"
                  rightLabel="Percepção (P)"
                  rightKey="P"
                  description="Mede como o candidato organiza o estilo de vida. Julgamento prefere regras, planos definidos e conclusão rápida. Percepção prefere flexibilidade, improviso e opções abertas."
                  scores={scores}
                />
              </div>
            )}

            {activeTab === 'AUDITORIA' && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 mb-4">
                  Auditoria Detalhada de Respostas
                </h3>

                <div className="space-y-4">
                  {MBTI_QUESTIONS.map((question) => {
                    const answer = answers.find((ans: AssessmentAnswer) => ans.q === question.id);
                    const scoreA = answer ? Number(answer.a || 0) : 0;
                    const scoreB = answer ? Number(answer.b || 0) : 0;

                    return (
                      <div
                        key={question.id}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-xl text-[11px] font-semibold shrink-0 text-white bg-[#533af6]">
                            {question.id}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                            {question.text}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                          {[
                            { label: 'A', option: question.optionA, score: scoreA },
                            { label: 'B', option: question.optionB, score: scoreB },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className={`p-3 rounded-xl border transition-all text-[11px] leading-relaxed flex flex-col justify-between gap-1.5 ${
                                item.score === 3
                                  ? 'bg-[#533af6]/10 border-[#533af6]/25 text-[#533af6] shadow-2xs'
                                  : item.score === 2
                                  ? 'bg-[#533af6]/10 border-[#533af6]/20 text-[#533af6]'
                                  : item.score === 1
                                  ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                                  : 'bg-white border-slate-100 text-slate-400'
                              }`}
                            >
                              <div className="font-bold flex justify-between items-start">
                                <span>{item.label}) {item.option.text}</span>
                                <span className="text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-lg font-semibold shrink-0 ml-1">
                                  {item.option.dimension}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100/50 font-semibold">
                                <span>Grau de Afinidade:</span>
                                <span className={item.score > 0 ? 'text-[#533af6] font-extrabold' : 'text-slate-400'}>
                                  {item.score === 3 ? '3 (Muito)' : item.score === 2 ? '2 (Razoável)' : item.score === 1 ? '1 (Pouco)' : '0 (Nada)'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#fbf9ff] flex justify-center items-center shrink-0">
            <p className="text-[11px] font-medium text-slate-400 text-center">
              método myers-briggs type indicator • mbti premium 65q
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
