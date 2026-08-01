import { type Dispatch, type MouseEvent, type SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Building, Check, Plus, Trash2, User } from 'lucide-react';
import type { CompanyRecord } from '../../services/companyService';

interface CompanyCompaniesTabProps {
  companies: CompanyRecord[];
  selectedCompanyId: string;
  setSelectedCompanyId: Dispatch<SetStateAction<string>>;
  resetCompanyForm: () => void;
  setIsRegisteringCompany: Dispatch<SetStateAction<boolean>>;
  handleEditCompany: (company: CompanyRecord, event: MouseEvent) => void;
  handleDeleteCompany: (id: string, event: MouseEvent) => void | Promise<void>;
}

const getCompanyInitials = (company: CompanyRecord) => {
  const name = company.nomeFantasia || company.razaoSocial || 'Empresa';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const getPlanMeta = (plan?: string | null) => {
  if (plan === 'enterprise') return { label: 'Ilimitado', className: 'border-[#ffc24b]/25 bg-[#ffc24b]/16 text-[#ffa303]' };
  if (plan === 'growth') return { label: 'Profissional', className: 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]' };
  return { label: plan || 'Gratuito', className: 'border-slate-200/70 bg-white text-slate-500' };
};

export const CompanyCompaniesTab = ({
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  resetCompanyForm,
  setIsRegisteringCompany,
  handleEditCompany,
  handleDeleteCompany
}: CompanyCompaniesTabProps) => (
  <motion.div
    key="empresas"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className="company-dashboard-surface w-full space-y-5 text-left"
  >
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#63e1a5]" />
        <p className="text-[12px] font-semibold text-slate-500">
          <span className="text-[#343241]">{companies.length}</span> {companies.length === 1 ? 'empresa cadastrada' : 'empresas cadastradas'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedCompanyId('new');
          resetCompanyForm();
          setIsRegisteringCompany(true);
        }}
        className="hidden h-8 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 sm:flex"
      >
        <Plus size={14} className="stroke-[2.5]" />
        Cadastrar empresa
      </button>
    </div>

    {companies.length > 0 ? (
      <div className="w-full overflow-visible text-left">
        <div className="hidden xl:grid grid-cols-[minmax(260px,1fr)_minmax(150px,0.65fr)_minmax(130px,0.55fr)_110px_320px] items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <span>Empresa</span>
          <span className="inline-flex items-center justify-center gap-1.5"><User size={12} /> Responsável</span>
          <span className="inline-flex items-center justify-center gap-1.5"><Building size={12} /> Atuação</span>
          <span className="text-center">Plano</span>
          <span className="sr-only">Ações</span>
        </div>

        <div className="overflow-visible rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_28px_rgba(15,23,42,0.035)] divide-y divide-slate-200/80">
          {companies.map((company, index) => {
            const isActive = selectedCompanyId === company.id;
            const plan = getPlanMeta(company.plan);

            return (
              <motion.div
                key={company.id}
                whileHover={{ y: -2 }}
                className={`group relative px-4 py-3 backdrop-blur-md transition-all duration-300 hover:bg-white ${index % 2 === 0 ? 'bg-white/95' : 'bg-slate-50/60'}`}
              >
                <div className="xl:hidden">
                  <button
                    type="button"
                    onClick={() => setSelectedCompanyId(company.id)}
                    className="flex min-w-0 items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff] select-none">
                      {company.logo ? (
                        <img src={company.logo} alt={company.nomeFantasia} className="h-full w-full object-cover" />
                      ) : (
                        getCompanyInitials(company)
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold tracking-tight text-[#343241] transition-colors group-hover:text-[#940dff]">
                        {company.nomeFantasia || 'Empresa sem nome'}
                      </p>
                      <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                        {company.razaoSocial || 'Razão social não informada'}
                      </p>
                    </div>
                  </button>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Responsável</p>
                      <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{company.solicitante || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Atuação</p>
                      <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{company.sector || 'Geral'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Plano</p>
                      <span className={
                        'mt-1 inline-flex h-8 items-center justify-center rounded-xl border px-3 text-[12px] font-semibold ' + plan.className
                      }>
                        {plan.label}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</p>
                      <p className="mt-2 text-[12px] font-semibold text-slate-500">{isActive ? 'Selecionada' : 'Disponível'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCompanyId(company.id)}
                        className="flex h-8 flex-1 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                      >
                        Selecionar
                      </button>
                    ) : (
                      <div className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#63e1a5]/20 bg-[#63e1a5]/14 px-4 text-[12px] font-semibold text-[#2f9f6b]">
                        <Check size={13} className="stroke-[2.5]" /> Selecionada
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(event) => handleEditCompany(company, event)}
                      className="flex h-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff]"
                      title="Editar configurações"
                    >
                      Editar
                    </button>

                    {company.id !== '1' && (
                      <button
                        type="button"
                        onClick={(event) => handleDeleteCompany(company.id, event)}
                        className="flex h-8 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14"
                        title="Excluir empresa"
                      >
                        <Trash2 size={13} className="stroke-[2.4]" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden gap-3 xl:grid xl:grid-cols-[minmax(260px,1fr)_minmax(150px,0.65fr)_minmax(130px,0.55fr)_110px_320px] xl:items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedCompanyId(company.id)}
                    className="flex min-w-0 items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff] select-none">
                      {company.logo ? (
                        <img src={company.logo} alt={company.nomeFantasia} className="h-full w-full object-cover" />
                      ) : (
                        getCompanyInitials(company)
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-[15px] font-semibold tracking-tight text-[#343241] transition-colors group-hover:text-[#940dff]">
                          {company.nomeFantasia || 'Empresa sem nome'}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                        {company.razaoSocial || 'Razão social não informada'}
                      </p>
                    </div>
                  </button>

                  <span className="truncate text-center text-[12px] font-medium text-slate-500">
                    {company.solicitante || 'Não informado'}
                  </span>

                  <span className="truncate text-center text-[12px] font-medium text-slate-500">
                    {company.sector || 'Geral'}
                  </span>

                  <div className="flex justify-center">
                    <span className={`inline-flex h-8 items-center justify-center rounded-xl border px-3 text-[12px] font-semibold ${plan.className}`}>
                      {plan.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 min-w-0">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => setSelectedCompanyId(company.id)}
                        className="flex h-8 shrink-0 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                      >
                        Selecionar
                      </button>
                    ) : (
                      <div className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#63e1a5]/20 bg-[#63e1a5]/14 px-4 text-[12px] font-semibold text-[#2f9f6b]">
                        <Check size={13} className="stroke-[2.5]" /> Selecionada
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(event) => handleEditCompany(company, event)}
                      className="flex h-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff]"
                      title="Editar configurações"
                    >
                      Editar
                    </button>

                    {company.id !== '1' && (
                      <button
                        type="button"
                        onClick={(event) => handleDeleteCompany(company.id, event)}
                        className="flex h-8 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14"
                        title="Excluir empresa"
                      >
                        <Trash2 size={13} className="stroke-[2.4]" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-20 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#940dff]/12 bg-[#f3e5ff] text-[#940dff]">
          <Building size={24} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-[#343241]">Nenhuma empresa cadastrada</h3>
        <p className="mx-auto mt-1 max-w-md text-sm font-medium leading-relaxed text-slate-400">
          Cadastre uma empresa para gerenciar vagas, candidatos e processos seletivos.
        </p>
      </div>
    )}


    <button
      type="button"
      onClick={() => {
        setSelectedCompanyId('new');
        resetCompanyForm();
        setIsRegisteringCompany(true);
      }}
      className="fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-[0_14px_30px_rgba(148,13,255,0.28)] transition-all hover:bg-[#8200e6] active:scale-95 sm:hidden"
      title="Cadastrar empresa"
      aria-label="Cadastrar empresa"
    >
      <Plus size={22} className="stroke-[2.5]" />
    </button>
  </motion.div>
);
