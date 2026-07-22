import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import type { CustomQuestionnaire } from '../../../services/customQuestionnaireService';
import { LoadingAnimation } from '../../Loader';

interface CompanyCustomAssessmentsLibraryProps {
  customTemplates: CustomQuestionnaire[];
  isLoadingCustomTemplates: boolean;
  onEditCustomTemplate: (template: CustomQuestionnaire) => void;
  onDeleteCustomTemplate: (templateId: string) => void | Promise<void>;
}

const formatCreatedAt = (value: string) => new Date(value).toLocaleDateString('pt-BR');

export const CompanyCustomAssessmentsLibrary = ({
  customTemplates,
  isLoadingCustomTemplates,
  onEditCustomTemplate,
  onDeleteCustomTemplate,
}: CompanyCustomAssessmentsLibraryProps) => (
  <div className="space-y-3">
    {isLoadingCustomTemplates ? (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <LoadingAnimation message="Buscando sua biblioteca de testes." />
      </div>
    ) : customTemplates.length === 0 ? (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff]">
          <FileText size={24} />
        </div>
        <p className="text-[13px] font-semibold text-[#343241]">Nenhum question?rio cadastrado</p>
        <p className="mt-2 max-w-md text-[12px] font-medium leading-relaxed text-slate-500">
          Voc? ainda n?o possui question?rios customizados. Crie o primeiro para usar em processos seletivos futuros.
        </p>
      </div>
    ) : (
      <>
        <div className="hidden lg:block">
          <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_180px] items-center gap-4 px-5 pb-3 text-[11px] font-semibold text-slate-500">
            <span>Question?rio</span>
            <span className="text-center">Perguntas</span>
            <span className="text-center">Criado em</span>
            <span className="text-right">A??es</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
            <div className="divide-y divide-slate-100">
              {customTemplates.map((template) => (
                <div key={template.id} className="grid grid-cols-[1.5fr_0.8fr_0.8fr_180px] items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fbfaff]">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#343241]">{template.title}</p>
                    <p className="mt-1 truncate text-[12px] font-medium text-slate-400">Question?rio customizado</p>
                  </div>
                  <span className="flex items-center justify-center gap-2 text-[12px] font-medium text-slate-500">
                    <MessageSquare size={14} className="text-[#940dff]" />
                    {template.questions?.length || 0}
                  </span>
                  <span className="text-center text-[12px] font-medium text-slate-500">
                    {formatCreatedAt(template.createdAt)}
                  </span>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCustomTemplate(template)}
                      className="h-8 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomTemplate(template.id)}
                      className="flex h-8 w-10 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14"
                      title="Excluir question?rio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.035)] lg:hidden">
          <div className="divide-y divide-slate-100">
            {customTemplates.map((template) => (
              <article key={template.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#343241]">{template.title}</p>
                    <p className="mt-1 text-[12px] font-medium text-slate-400">Question?rio customizado</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/70 bg-[#fbfaff] px-3 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Perguntas</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-slate-600">
                      <MessageSquare size={13} className="text-[#940dff]" />
                      {template.questions?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Criado em</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-600">{formatCreatedAt(template.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => onEditCustomTemplate(template)}
                    className="h-8 flex-1 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCustomTemplate(template.id)}
                    className="flex h-8 w-10 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14"
                    title="Excluir question?rio"
                    aria-label="Excluir question?rio"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
);
