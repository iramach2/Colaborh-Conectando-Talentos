import React from 'react';
import { motion } from 'motion/react';
import { X as CloseIcon, ChevronUp, ChevronDown, Trash2, Check, GripVertical, Plus, ClipboardList } from 'lucide-react';
import type { CompanyApplicant, CompanyJob } from '../../../types/companyDashboard';
import { getCurrentJobStages, getCurrentJobStageTests } from '../../../utils/companyDashboardUtils';
import type { CustomQuestionnaire } from '../../../services/customQuestionnaireService';

interface ManageStagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: CompanyJob | null;
  jobApplicants: CompanyApplicant[];
  customTemplates?: CustomQuestionnaire[];
  onAddNewStage: (stageName: string) => void;
  onReorderStages: (newStages: string[]) => void;
  onDeleteStage: (stageName: string) => void;
  onUpdateStageTests: (jobId: string, newStageTests: Record<string, string[]>) => Promise<unknown>;
}

const availableTests = [
  { key: 'disc', label: 'DISC', color: 'text-[#533af6] bg-[#533af6]/10 border-[#533af6]/18' },
  { key: 'mbti', label: 'MBTI', color: 'text-[#940dff] bg-[#f3e5ff] border-[#940dff]/16' },
  { key: 'temperamentos', label: 'Temperamentos', color: 'text-[#ffa303] bg-[#ffc24b]/16 border-[#ffc24b]/30' },
  { key: 'perguntas', label: 'Perguntas', color: 'text-[#40b87f] bg-[#63e1a5]/14 border-[#63e1a5]/25' },
  { key: 'customizado', label: 'Customizado', color: 'text-[#ff4b8c] bg-[#ff4b8c]/10 border-[#ff4b8c]/20' },
];

type ParsedStageTestConfig = {
  key: string;
  templateId?: string | null;
  trigger: 'auto' | 'manual';
};

const parseStageTestConfig = (value: string): ParsedStageTestConfig => {
  const [key, second, third] = value.split(':');
  if (key === 'customizado' && third) {
    return { key, templateId: second, trigger: third === 'manual' ? 'manual' : 'auto' };
  }
  return { key, templateId: null, trigger: second === 'manual' ? 'manual' : 'auto' };
};

const serializeStageTestConfig = (key: string, templateId?: string | null) => (
  key === 'customizado' && templateId ? `${key}:${templateId}:auto` : `${key}:auto`
);

export const ManageStagesModal = ({
  isOpen,
  onClose,
  job,
  jobApplicants,
  customTemplates = [],
  onAddNewStage,
  onReorderStages,
  onDeleteStage,
  onUpdateStageTests
}: ManageStagesModalProps) => {
  const [expandedStages, setExpandedStages] = React.useState<Record<string, boolean>>({});
  const [stagesOrder, setStagesOrder] = React.useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (job) {
      setStagesOrder(getCurrentJobStages(job));
    }
  }, [job]);
  React.useEffect(() => {
    if (!isOpen || !job?.id) return;

    const current = getCurrentJobStageTests(job);
    let hasManualTrigger = false;
    const normalized = Object.entries(current).reduce<Record<string, string[]>>((acc, [stageName, tests]) => {
      acc[stageName] = tests.map((test) => {
        const parsed = parseStageTestConfig(test);
        if (parsed.trigger !== 'auto') hasManualTrigger = true;
        return serializeStageTestConfig(parsed.key, parsed.templateId);
      });
      return acc;
    }, {});

    if (hasManualTrigger) {
      onUpdateStageTests(job.id, normalized).catch((error) => {
        console.error('Error normalizing stage test triggers:', error);
      });
    }
  }, [isOpen, job, onUpdateStageTests]);

  if (!isOpen || !job) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    if (index === 0 || draggedIndex === 0) return;

    const newStages = [...stagesOrder];
    const draggedItem = newStages[draggedIndex];
    newStages.splice(draggedIndex, 1);
    newStages.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setStagesOrder(newStages);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    await onReorderStages(stagesOrder);
  };

  const toggleStageExpanded = (stageName: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageName]: !prev[stageName]
    }));
  };

  const currentStagesList = getCurrentJobStages(job);
  const allCols = stagesOrder;
  const currentStageTests = getCurrentJobStageTests(job);

  const toggleStageTest = async (colName: string, testKey: string) => {
    const current = currentStageTests[colName] || [];
    const existing = current.find(t => parseStageTestConfig(t).key === testKey);
    const updated = existing
      ? current.filter(t => parseStageTestConfig(t).key !== testKey)
      : [...current, serializeStageTestConfig(testKey)];
    const newStageTests = { ...currentStageTests, [colName]: updated };
    await onUpdateStageTests(job.id, newStageTests);
  };

  const toggleCustomTemplateStageTest = async (colName: string, templateId: string) => {
    const current = currentStageTests[colName] || [];
    const existing = current.find((test) => {
      const parsed = parseStageTestConfig(test);
      return parsed.key === 'customizado' && parsed.templateId === templateId;
    });
    const withoutCustomTemplates = current.filter((test) => parseStageTestConfig(test).key !== 'customizado');
    const updated = existing
      ? withoutCustomTemplates
      : [...withoutCustomTemplates, serializeStageTestConfig('customizado', templateId)];
    const newStageTests = { ...currentStageTests, [colName]: updated };
    await onUpdateStageTests(job.id, newStageTests);
  };


  const handleAddStage = () => {
    const input = document.getElementById('popup-new-stage-input') as HTMLInputElement;
    if (input?.value.trim()) {
      onAddNewStage(input.value.trim());
      input.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/80 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(57,39,96,0.20)]"
      >
        <header className="shrink-0 px-6 pb-4 pt-5 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Configurações das etapas</h3>
              <p className="mt-0.5 truncate text-[12px] font-medium leading-tight text-slate-400">
                {job.title || 'Vaga sem título'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
              title="Fechar configurações"
            >
              <CloseIcon size={17} className="stroke-[2.4]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]">
                <Plus size={17} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#343241]">Adicionar etapa</h4>
                <p className="text-[12px] font-medium text-slate-400">Crie uma nova fase para este processo seletivo.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nome da etapa"
                id="popup-new-stage-input"
                className="h-8 min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-medium text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.currentTarget;
                    if (target.value.trim()) {
                      onAddNewStage(target.value.trim());
                      target.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddStage}
                className="flex h-8 items-center justify-center rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Adicionar
              </button>
            </div>
          </section>

          <section className="mt-4">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <ClipboardList size={15} className="text-slate-400" />
                <h4 className="text-sm font-semibold text-[#343241]">Etapas do processo</h4>
              </div>
              <span className="text-[12px] font-semibold text-slate-400">{allCols.length} etapas</span>
            </div>

            <div className="space-y-3">
              {allCols.map((colName, stageIdx) => {
                const defaultStage = currentStagesList[0] || 'Triagem';
                const count = jobApplicants.filter(applicant => {
                  const currentStatus = applicant.status;
                  const normalizedStatus = (!currentStatus || currentStatus === 'Triagem' || !allCols.includes(currentStatus))
                    ? defaultStage
                    : currentStatus;
                  return normalizedStatus === colName;
                }).length;

                const isSpecial = false;
                const isCadastro = stageIdx === 0 && colName === 'Cadastro';
                const activeTestsCount = (currentStageTests[colName] || []).length;

                return (
                  <article
                    key={colName}
                    draggable={!isCadastro}
                    onDragStart={(e) => handleDragStart(e, stageIdx)}
                    onDragOver={(e) => handleDragOver(e, stageIdx)}
                    onDragEnd={handleDragEnd}
                    className={`overflow-hidden rounded-2xl border bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.035)] transition-all ${
                      isCadastro ? 'border-[#940dff]/18' : 'border-slate-200/70 hover:border-[#940dff]/20'
                    } ${draggedIndex === stageIdx ? 'border-dashed border-[#940dff] opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {!isCadastro && !isSpecial && (
                          <div
                            className="-ml-1 rounded-lg p-1 text-slate-300 transition-colors hover:text-slate-500 cursor-grab active:cursor-grabbing"
                            title="Segure e arraste para reordenar"
                          >
                            <GripVertical size={16} />
                          </div>
                        )}

                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[12px] font-semibold ${
                          isCadastro ? 'bg-[#940dff] text-white' : 'bg-[#f3e5ff] text-[#940dff]'
                        }`}>
                          {stageIdx + 1}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="truncate text-sm font-semibold text-[#343241]">{colName}</h5>
                            {isCadastro && (
                              <span className="rounded-lg bg-[#f3e5ff] px-2 py-1 text-[10px] font-semibold text-[#940dff]">
                                Obrigatória
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] font-medium text-slate-400">
                            {count} {count === 1 ? 'candidato' : 'candidatos'} nesta etapa
                          </p>
                        </div>
                      </div>

                      {!isSpecial && !isCadastro && (
                        <button
                          type="button"
                          title={count > 0 ? 'Não é possível excluir uma etapa com candidatos' : 'Excluir etapa'}
                          disabled={count > 0}
                          onClick={() => onDeleteStage(colName)}
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                            count > 0
                              ? 'cursor-not-allowed bg-slate-50 text-slate-200'
                              : 'bg-[#ff4b8c]/10 text-[#ff4b8c] hover:bg-[#ff4b8c] hover:text-white active:scale-95'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {!isSpecial && !isCadastro && (
                      <div className="border-t border-slate-100/80 px-4 pb-4 pt-3">
                        <button
                          type="button"
                          onClick={() => toggleStageExpanded(colName)}
                          className={`flex h-8 w-full items-center justify-between rounded-xl px-3 text-[12px] font-semibold transition-all active:scale-[0.99] ${
                            expandedStages[colName]
                              ? 'bg-[#940dff] text-white shadow-[0_10px_22px_rgba(148,13,255,0.18)]'
                              : 'border border-[#940dff]/12 bg-[#f3e5ff] text-[#940dff] hover:border-[#940dff]/22'
                          }`}
                        >
                          <span>Testes da etapa</span>
                          <span className="flex items-center gap-2">
                            {activeTestsCount > 0 && (
                              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${
                                expandedStages[colName] ? 'bg-white text-[#940dff]' : 'bg-white text-[#940dff]'
                              }`}>
                                {activeTestsCount} {activeTestsCount === 1 ? 'ativo' : 'ativos'}
                              </span>
                            )}
                            {expandedStages[colName] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </button>

                        {expandedStages[colName] && (
                          <div className="mt-3 space-y-2">
                            {availableTests.map(test => {
                              const stageTests = currentStageTests[colName] || [];
                              const matched = stageTests.find((t) => parseStageTestConfig(t).key === test.key);
                              const isSelected = !!matched;

                              if (test.key === 'customizado') {
                                const selectedTemplate = stageTests
                                  .map(parseStageTestConfig)
                                  .find((parsed) => parsed.key === 'customizado');

                                return (
                                  <div
                                    key={test.key}
                                    className={`rounded-2xl border p-3 transition-all ${
                                      isSelected ? `${test.color} shadow-[0_8px_20px_rgba(15,23,42,0.035)]` : 'border-slate-200/70 bg-white text-slate-500'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex min-w-0 items-center gap-3 text-left">
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                          isSelected
                                            ? 'border-[#63e1a5] bg-[#63e1a5] text-white'
                                            : 'border-slate-300 bg-white text-transparent'
                                        }`}>
                                          <Check size={12} className="stroke-[3]" />
                                        </span>
                                        <div className="min-w-0">
                                          <span className="block truncate text-[12px] font-semibold">{test.label}</span>
                                          <span className="block truncate text-[11px] font-medium text-slate-400">
                                            Selecione um questionario cadastrado
                                          </span>
                                        </div>
                                      </div>

                                      {selectedTemplate?.templateId && (
                                        <span className="inline-flex h-8 shrink-0 items-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[11px] font-semibold text-[#940dff]">
                                          Automatico
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-3">
                                      {customTemplates.length === 0 ? (
                                        <p className="rounded-xl bg-white/80 px-3 py-2 text-[12px] font-medium text-slate-400">
                                          Nenhum questionario customizado cadastrado ainda.
                                        </p>
                                      ) : customTemplates.map((template) => {
                                        const isTemplateSelected = selectedTemplate?.templateId === template.id;
                                        return (
                                          <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => toggleCustomTemplateStageTest(colName, template.id)}
                                            className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.99] ${
                                              isTemplateSelected
                                                ? 'border-[#940dff]/22 bg-white text-[#940dff]'
                                                : 'border-slate-200/70 bg-white/80 text-slate-500 hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff]'
                                            }`}
                                          >
                                            <span className="min-w-0">
                                              <span className="block truncate text-[12px] font-semibold">{template.title}</span>
                                              <span className="block text-[11px] font-medium text-slate-400">
                                                {template.questions.length} {template.questions.length === 1 ? 'pergunta' : 'perguntas'}
                                              </span>
                                            </span>
                                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                              isTemplateSelected
                                                ? 'border-[#63e1a5] bg-[#63e1a5] text-white'
                                                : 'border-slate-300 bg-white text-transparent'
                                            }`}>
                                              <Check size={12} className="stroke-[3]" />
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={test.key}
                                  className={`rounded-2xl border p-3 transition-all ${
                                    isSelected ? `${test.color} shadow-[0_8px_20px_rgba(15,23,42,0.035)]` : 'border-slate-200/70 bg-white text-slate-500'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleStageTest(colName, test.key)}
                                      className="group flex min-w-0 items-center gap-3 text-left"
                                    >
                                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                        isSelected
                                          ? 'border-[#63e1a5] bg-[#63e1a5] text-white'
                                          : 'border-slate-300 bg-white text-transparent group-hover:border-[#940dff]/30'
                                      }`}>
                                        <Check size={12} className="stroke-[3]" />
                                      </span>
                                      <span className="truncate text-[12px] font-semibold">{test.label}</span>
                                    </button>

                                    {isSelected && (
                                      <span
                                        className="inline-flex h-8 shrink-0 items-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[11px] font-semibold text-[#940dff]"
                                        title="Disparo automatico ao mover candidato para esta etapa"
                                      >
                                        Automatico
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {isCadastro && (
                      <div className="border-t border-slate-100/80 px-4 pb-4 pt-3 text-[12px] font-medium text-slate-400">
                        A etapa inicial não solicita testes automaticamente.
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};