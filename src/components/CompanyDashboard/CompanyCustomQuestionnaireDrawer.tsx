import { type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, FileText, MessageSquare, Plus, PlusCircle, Trash2, X as CloseIcon } from 'lucide-react';
import type { CustomQuestion } from '../../services/customQuestionnaireService';

interface CompanyCustomQuestionnaireDrawerProps {
  isOpen: boolean;
  editingTemplateId: string | null;
  customTestTitle: string;
  setCustomTestTitle: Dispatch<SetStateAction<string>>;
  customQuestions: CustomQuestion[];
  onClose: () => void;
  onAddQuestion: (type: 'text' | 'choice') => void;
  onRemoveQuestion: (id: string) => void;
  onUpdateQuestionText: (id: string, text: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionIndex: number) => void;
  onUpdateOptionText: (questionId: string, optionIndex: number, text: string) => void;
  onUpdateCorrectOption: (questionId: string, optionIndex: number) => void;
  onSave: () => void | Promise<void>;
}

export const CompanyCustomQuestionnaireDrawer = ({
  isOpen,
  editingTemplateId,
  customTestTitle,
  setCustomTestTitle,
  customQuestions,
  onClose,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestionText,
  onAddOption,
  onRemoveOption,
  onUpdateOptionText,
  onUpdateCorrectOption,
  onSave
}: CompanyCustomQuestionnaireDrawerProps) => createPortal(
  <AnimatePresence>
    {isOpen && (
      <div className="company-dashboard-surface fixed inset-0 z-[2147483647] flex justify-end overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1f1b2d]/35 backdrop-blur-[2px]"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative z-10 flex h-full w-full max-w-4xl flex-col overflow-hidden border-l border-white/80 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(57,39,96,0.20)]"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/70 px-7 py-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-white text-[#940dff] shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
                <FileText size={21} />
              </div>
              <div className="min-w-0">
                <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">
                  {editingTemplateId ? 'Editar questionário' : 'Criar questionário'}
                </h2>
                <p className="mt-1 text-[12px] font-medium text-slate-400">
                  Monte perguntas abertas ou de múltipla escolha para usar nos processos seletivos.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-[0_6px_16px_rgba(15,23,42,0.06)] transition-all hover:text-[#940dff] active:scale-95"
              aria-label="Fechar"
            >
              <CloseIcon size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <label className="mb-2 block text-[12px] font-semibold text-slate-500">Nome do questionário</label>
                  <input
                    type="text"
                    value={customTestTitle}
                    onChange={(event) => setCustomTestTitle(event.target.value)}
                    placeholder="Ex: Questionário técnico React ou Fit Cultural"
                    className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white px-4 text-[13px] font-medium text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/28 focus:shadow-[0_0_0_4px_rgba(148,13,255,0.08)]"
                  />
                </section>

                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#343241]">Perguntas</h3>
                      <p className="mt-1 text-[12px] font-medium text-slate-400">
                        {customQuestions.length} {customQuestions.length === 1 ? 'pergunta adicionada' : 'perguntas adicionadas'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onAddQuestion('text')}
                        className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
                      >
                        <MessageSquare size={14} />
                        Aberta
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddQuestion('choice')}
                        className="inline-flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
                      >
                        <PlusCircle size={14} />
                        Múltipla escolha
                      </button>
                    </div>
                  </div>

                  {customQuestions.length === 0 ? (
                    <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-[#fbfaff] p-8 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
                        <FileText size={24} />
                      </div>
                      <p className="text-[13px] font-semibold text-[#343241]">Nenhuma pergunta adicionada</p>
                      <p className="mt-2 max-w-sm text-[12px] font-medium leading-relaxed text-slate-500">
                        Comece adicionando uma pergunta aberta ou uma pergunta de múltipla escolha.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {customQuestions.map((question, questionIndex) => (
                        <div key={question.id} className="rounded-2xl border border-slate-200/70 bg-[#fbfaff] p-4 transition-all hover:border-[#940dff]/18">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                                {questionIndex + 1}
                              </span>
                              <span className={`inline-flex h-7 items-center rounded-xl border px-3 text-[11px] font-semibold ${
                                question.type === 'choice'
                                  ? 'border-[#533af6]/18 bg-[#533af6]/10 text-[#533af6]'
                                  : 'border-[#ffc24b]/24 bg-[#ffc24b]/16 text-[#ffa303]'
                              }`}>
                                {question.type === 'choice' ? 'Múltipla escolha' : 'Resposta aberta'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveQuestion(question.id)}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
                              title="Remover pergunta"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <label className="mb-2 block text-[12px] font-semibold text-slate-500">Enunciado da pergunta</label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(event) => onUpdateQuestionText(question.id, event.target.value)}
                            placeholder="Ex: Conte sobre uma experiência em que você resolveu um problema importante..."
                            className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white px-4 text-[13px] font-medium text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/28 focus:shadow-[0_0_0_4px_rgba(148,13,255,0.08)]"
                          />

                          {question.type === 'choice' && (
                            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-[12px] font-semibold text-slate-500">Opções de resposta</p>
                                <button
                                  type="button"
                                  onClick={() => onAddOption(question.id)}
                                  className="inline-flex h-8 items-center gap-2 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 active:scale-95"
                                >
                                  <Plus size={14} />
                                  Opção
                                </button>
                              </div>

                              <div className="space-y-2">
                                {(question.options || []).map((option: string, optionIndex: number) => {
                                  const isCorrectOption = question.correctOptionIndex === optionIndex;

                                  return (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff]">
                                        {String.fromCharCode(65 + optionIndex)}
                                      </span>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(event) => onUpdateOptionText(question.id, optionIndex, event.target.value)}
                                        placeholder={`Opção ${optionIndex + 1}`}
                                        className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-medium text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/28 focus:shadow-[0_0_0_4px_rgba(148,13,255,0.08)]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => onUpdateCorrectOption(question.id, optionIndex)}
                                        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold transition-all active:scale-95 ${
                                          isCorrectOption
                                            ? 'border-[#63e1a5]/28 bg-[#63e1a5]/14 text-[#40b87f]'
                                            : 'border-slate-200/70 bg-white text-slate-400 hover:border-[#63e1a5]/28 hover:text-[#40b87f]'
                                        }`}
                                      >
                                        {isCorrectOption && <Check size={13} />}
                                        Correta
                                      </button>
                                      {(question.options || []).length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => onRemoveOption(question.id, optionIndex)}
                                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
                                          title="Remover opção"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <h3 className="text-[14px] font-semibold text-[#343241]">Resumo</h3>
                  <div className="mt-4 space-y-3 text-[12px] font-medium text-slate-500">
                    <div className="flex items-center justify-between gap-3">
                      <span>Título</span>
                      <span className="font-semibold text-[#343241]">{customTestTitle.trim() ? 'Preenchido' : 'Pendente'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Perguntas</span>
                      <span className="font-semibold text-[#343241]">{customQuestions.length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Abertas</span>
                      <span className="font-semibold text-[#343241]">{customQuestions.filter((question) => question.type === 'text').length}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Múltipla escolha</span>
                      <span className="font-semibold text-[#343241]">{customQuestions.filter((question) => question.type === 'choice').length}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#940dff]/14 bg-[#f3e5ff] p-5 text-[12px] font-medium leading-relaxed text-[#940dff]">
                  Questionários salvos ficam disponíveis na biblioteca de testes e podem ser solicitados para candidatos na etapa de avaliações.
                </div>
              </aside>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200/70 bg-[#fbf9ff] px-7 py-5">
            <button
              type="button"
              onClick={onClose}
              className="h-8 rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/24 hover:text-[#940dff] active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-8 items-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
            >
              <Check size={14} />
              Salvar questionário
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>,
  document.body
);