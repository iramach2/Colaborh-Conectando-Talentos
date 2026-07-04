import { type ChangeEvent, type Dispatch, type MouseEvent, type SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building, Trash2, Upload, X as CloseIcon } from 'lucide-react';
import type { CompanyForm } from '../../hooks/useCompanyManagement';

type CompanyOption = {
  id: string;
};

interface CompanyRegistrationDrawerProps {
  isOpen: boolean;
  companyForm: CompanyForm;
  setCompanyForm: Dispatch<SetStateAction<CompanyForm>>;
  editingCompanyId: string | null;
  companies: CompanyOption[];
  selectedCompanyId: string;
  setSelectedCompanyId: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onDeleteCompany: (id: string, event: MouseEvent) => void | Promise<void>;
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const fieldClass = 'h-8 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-medium text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10';

const Field = ({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1.5">
    <label className="block text-[12px] font-semibold text-slate-500">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={fieldClass}
    />
  </div>
);

export const CompanyRegistrationDrawer = ({
  isOpen,
  companyForm,
  setCompanyForm,
  editingCompanyId,
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  onClose,
  onSave,
  onDeleteCompany,
  onLogoChange
}: CompanyRegistrationDrawerProps) => {
  const handleClose = () => {
    if (selectedCompanyId === 'new' && companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }

    onClose();
  };

  const title = editingCompanyId ? 'Editar empresa' : 'Cadastrar empresa';
  const subtitle = editingCompanyId ? 'Atualize os dados da empresa selecionada.' : 'Adicione uma nova empresa ao seu painel.';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] cursor-pointer"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="company-dashboard-surface relative z-10 flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/80 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(57,39,96,0.20)]"
          >
            <header className="shrink-0 px-6 pb-4 pt-5 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]">
                    <Building size={18} className="stroke-[2.4]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">{title}</h3>
                    <p className="mt-0.5 text-[12px] font-medium leading-tight text-slate-400">{subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                  title="Fechar cadastro de empresa"
                >
                  <CloseIcon size={17} className="stroke-[2.4]" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/12 bg-[#f3e5ff] text-[#940dff]">
                      {companyForm.logo ? (
                        <img src={companyForm.logo} alt="Logo da empresa" className="h-full w-full object-cover" />
                      ) : (
                        <Upload size={20} className="stroke-[2.4]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-[#343241]">Logotipo da empresa</h4>
                      <p className="mt-0.5 text-[12px] font-medium leading-tight text-slate-400">Use uma imagem de até 2MB, preferencialmente quadrada.</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <label className="flex h-8 items-center justify-center rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold !text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 cursor-pointer">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onLogoChange}
                            className="hidden"
                          />
                        </label>

                        {companyForm.logo && (
                          <button
                            type="button"
                            onClick={() => setCompanyForm(previous => ({ ...previous, logo: '' }))}
                            className="flex h-8 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="grid grid-cols-1 gap-3">
                    <Field
                      label="Razão social"
                      value={companyForm.razaoSocial}
                      onChange={(value) => setCompanyForm({ ...companyForm, razaoSocial: value })}
                      placeholder="Ex: Empresa de Serviços LTDA"
                    />
                    <Field
                      label="Nome fantasia"
                      value={companyForm.nomeFantasia}
                      onChange={(value) => setCompanyForm({ ...companyForm, nomeFantasia: value })}
                      placeholder="Ex: Minha Empresa"
                    />
                    <Field
                      label="Solicitante / responsável"
                      value={companyForm.solicitante}
                      onChange={(value) => setCompanyForm({ ...companyForm, solicitante: value })}
                      placeholder="Nome do responsável"
                    />
                    <Field
                      label="Setor / ramo de atuação"
                      value={companyForm.sector}
                      onChange={(value) => setCompanyForm({ ...companyForm, sector: value })}
                      placeholder="Ex: Tecnologia"
                    />
                  </div>
                </section>

                {editingCompanyId && editingCompanyId !== '1' && (
                  <section className="rounded-2xl border border-[#ff4b8c]/15 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-[#343241]">Excluir empresa</h4>
                        <p className="mt-0.5 text-[12px] font-medium text-slate-400">Remova esta empresa do painel.</p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          onDeleteCompany(editingCompanyId, event);
                          onClose();
                        }}
                        className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
                      >
                        <Trash2 size={13} className="stroke-[2.4]" />
                        Excluir
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-white/80 px-6 py-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50 active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onSave}
                className="flex h-8 items-center justify-center rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold !text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                {editingCompanyId ? 'Salvar alterações' : 'Salvar empresa'}
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};