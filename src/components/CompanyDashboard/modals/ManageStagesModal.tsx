import React from 'react';
import { motion } from 'motion/react';
import { X as CloseIcon, ChevronUp, ChevronDown, Trash2, Check, GripVertical } from 'lucide-react';
import { getCurrentJobStages, getCurrentJobStageTests } from '../../../utils/companyDashboardUtils';

interface ManageStagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  jobApplicants: any[];
  onAddNewStage: (stageName: string) => void;
  onReorderStages: (newStages: string[]) => void;
  onDeleteStage: (stageName: string) => void;
  onUpdateStageTests: (jobId: string, newStageTests: Record<string, string[]>) => Promise<any>;
}

export const ManageStagesModal = ({
  isOpen,
  onClose,
  job,
  jobApplicants,
  onAddNewStage,
  onReorderStages,
  onDeleteStage,
  onUpdateStageTests
}: ManageStagesModalProps) => {
  if (!job) return null;

  const [expandedStages, setExpandedStages] = React.useState<Record<string, boolean>>({});
  const [stagesOrder, setStagesOrder] = React.useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (job) {
      setStagesOrder(getCurrentJobStages(job));
    }
  }, [job]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Cadastro deve ser sempre o índice 0. Não permitir mover nada para antes do Cadastro e não permitir mover o Cadastro.
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

  const availableTests = [
    { key: 'disc', label: 'DISC', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { key: 'mbti', label: 'MBTI', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { key: 'temperamentos', label: 'Temperamentos', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { key: 'perguntas', label: 'Perguntas', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'customizado', label: 'Customizado', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  const toggleStageTest = async (colName: string, testKey: string) => {
    const current = currentStageTests[colName] || [];
    const existing = current.find(t => t.split(':')[0] === testKey);
    let updated: string[];
    if (existing) {
      updated = current.filter(t => t.split(':')[0] !== testKey);
    } else {
      updated = [...current, `${testKey}:auto`];
    }
    const newStageTests = { ...currentStageTests, [colName]: updated };
    await onUpdateStageTests(job.id, newStageTests);
  };

  const setStageTestTrigger = async (colName: string, testKey: string, trigger: 'auto' | 'manual') => {
    const current = currentStageTests[colName] || [];
    const updated = current.map(t => {
      if (t.split(':')[0] === testKey) {
        return `${testKey}:${trigger}`;
      }
      return t;
    });
    const newStageTests = { ...currentStageTests, [colName]: updated };
    await onUpdateStageTests(job.id, newStageTests);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative w-full max-w-md bg-white rounded-l-[24px] rounded-r-none shadow-2xl p-8 overflow-hidden flex flex-col h-full border-l border-slate-100/85 z-10"
      >
        
        <div className="flex justify-between items-center mb-6 mt-2 shrink-0">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Gerenciar Etapas</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Customize o funil de seleção desta vaga</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-100 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Adicionar Nova Etapa */}
        <div className="bg-slate-50 p-4 rounded-[5px] border border-slate-100 mb-6 shrink-0 text-left">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Adicionar Nova Etapa</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite o nome da etapa..."
              id="popup-new-stage-input"
              className="flex-1 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-full outline-none focus:border-[#8959f5]/50 focus:ring-2 focus:ring-[#8959f5]/5 transition-all"
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
              onClick={() => {
                const input = document.getElementById('popup-new-stage-input') as HTMLInputElement;
                if (input && input.value.trim()) {
                  onAddNewStage(input.value.trim());
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-[#8959f5]/15"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de Etapas (Vertical e Rolável) */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mb-6 min-h-0 pr-1 text-left">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 select-none sticky top-0 bg-white py-1 z-10">Etapas do Processo ({allCols.length})</h4>
          {(() => {
            return allCols.map((colName, stageIdx) => {
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

              return (
                <div 
                  key={colName}
                  draggable={!isCadastro}
                  onDragStart={(e) => handleDragStart(e, stageIdx)}
                  onDragOver={(e) => handleDragOver(e, stageIdx)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-xl border transition-all overflow-hidden text-left ${
                    isCadastro 
                      ? 'border-[#8959f5]/25 bg-[#8959f5]/5' 
                      : isSpecial
                      ? 'bg-slate-50/50 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                  } ${draggedIndex === stageIdx ? 'opacity-40 border-dashed border-[#8959f5]' : ''}`}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {!isCadastro && !isSpecial && (
                        <div 
                          className="text-slate-350 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 -ml-1 rounded transition-colors select-none"
                          title="Segure e arraste para reordenar"
                        >
                          <GripVertical size={14} />
                        </div>
                      )}
                      <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center font-black text-[10px] shrink-0 select-none ${
                        isCadastro ? 'bg-[#8959f5] text-white' : 'bg-slate-100 text-[#8959f5]'
                      }`}>
                        {stageIdx + 1}
                      </div>
                      <span className="text-xs font-bold truncate uppercase tracking-tight select-none">{colName}</span>
                      <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black select-none">
                        {count}
                      </span>
                    </div>

                    {!isSpecial && !isCadastro && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          title={count > 0 ? "Não é possível excluir (contém candidatos)" : "Excluir etapa"}
                          disabled={count > 0}
                          onClick={() => onDeleteStage(colName)}
                          className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                            count > 0
                              ? 'text-slate-200 cursor-not-allowed'
                              : 'hover:bg-rose-500/10 text-rose-500 hover:text-rose-650 cursor-pointer'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {isCadastro && (
                      <span className="text-[7.5px] font-black uppercase text-[#8959f5]/60 tracking-wider bg-[#8959f5]/10 rounded-full px-2 py-0.5 select-none shrink-0">
                        Obrigatória
                      </span>
                    )}
                    {isSpecial && (
                      <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-wider bg-slate-100 rounded-md px-1.5 py-0.5 select-none">
                        Sistema
                      </span>
                    )}
                  </div>

                  {/* Botão de Toggle de Testes e Lista de Testes */}
                  {!isSpecial && !isCadastro && (
                    <div className="border-t border-slate-100/60 p-3 pt-2">
                      <button
                        type="button"
                        onClick={() => toggleStageExpanded(colName)}
                        className={`w-full py-2 px-3 flex items-center justify-between rounded-lg transition-all cursor-pointer border text-[10px] font-black uppercase tracking-wider select-none outline-none ${
                          expandedStages[colName]
                            ? 'bg-[#8959f5] text-white border-[#8959f5] shadow-sm shadow-[#8959f5]/15'
                            : 'bg-[#8959f5]/8 text-[#8959f5] border-[#8959f5]/15 hover:bg-[#8959f5]/15 hover:border-[#8959f5]/30'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 font-bold">
                          Configurar Testes
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const activeCount = (currentStageTests[colName] || []).length;
                            if (activeCount > 0) {
                              return (
                                <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-black ${
                                  expandedStages[colName]
                                    ? 'bg-white text-[#8959f5]'
                                    : 'bg-[#8959f5] text-white'
                                }`}>
                                  {activeCount} {activeCount === 1 ? 'ativo' : 'ativos'}
                                </span>
                              );
                            }
                            return null;
                          })()}
                          {expandedStages[colName] ? <ChevronUp size={12} className="stroke-[2.5]" /> : <ChevronDown size={12} className="stroke-[2.5]" />}
                        </div>
                      </button>

                      {expandedStages[colName] && (
                        <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-100/60 font-sans">
                          {availableTests.map(test => {
                            const matched = (currentStageTests[colName] || []).find((t) => t.split(':')[0] === test.key);
                            const isSelected = !!matched;
                            const trigger = isSelected ? (matched.split(':')[1] || 'auto') : 'auto';

                            return (
                              <div 
                                key={test.key} 
                                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                  isSelected 
                                    ? 'bg-slate-50 border-slate-200/60 shadow-2xs' 
                                    : 'bg-white border-slate-100 hover:border-slate-200/50'
                                }`}
                              >
                                {/* Lado Esquerdo: Checkbox + Nome do Teste */}
                                <button
                                  type="button"
                                  onClick={() => toggleStageTest(colName, test.key)}
                                  className="flex items-center gap-2.5 text-left outline-none cursor-pointer group bg-transparent border-0"
                                >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    isSelected 
                                      ? 'bg-[#7b39eb] border-[#7b39eb] text-white shadow-sm shadow-[#7b39eb]/20' 
                                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                                  }`}>
                                    {isSelected && <Check size={12} className="stroke-[3]" />}
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-tight ${
                                    isSelected ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'
                                  }`}>
                                    {test.label}
                                  </span>
                                </button>

                                {/* Lado Direito: Controle de Gatilho (Automático/Manual) Maior */}
                                {isSelected && (
                                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200/60 shadow-3xs select-none">
                                    <button
                                      type="button"
                                      onClick={() => setStageTestTrigger(colName, test.key, 'auto')}
                                      className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        trigger === 'auto'
                                          ? 'bg-slate-900 text-white shadow-sm'
                                          : 'text-slate-400 hover:text-slate-700'
                                      }`}
                                      title="Disparo automático ao mover candidato para esta etapa"
                                    >
                                      Automático
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setStageTestTrigger(colName, test.key, 'manual')}
                                      className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        trigger === 'manual'
                                          ? 'bg-slate-900 text-white shadow-sm'
                                          : 'text-slate-400 hover:text-slate-700'
                                      }`}
                                      title="Disparo manual pelo recrutador nesta etapa"
                                    >
                                      Manual
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {isCadastro && (
                    <div className="px-3 pb-2.5 pt-2 text-[9.5px] text-slate-400 font-medium italic border-t border-slate-100/60 font-sans">
                      Não é possível solicitar testes na etapa inicial de Cadastro.
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#8959f5] hover:bg-[#7846e3] text-white rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#8959f5]/15"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
