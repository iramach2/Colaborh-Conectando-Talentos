import type { ReactNode } from 'react';
import { Briefcase, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface CandidateVacancyFilterDrawerProps {
  isOpen: boolean;
  brazilStates: string[];
  vacancyStateFilter: string;
  setVacancyStateFilter: (value: string) => void;
  vacancyCityFilter: string;
  setVacancyCityFilter: (value: string) => void;
  vacancyCitiesList: string[];
  isLoadingVacancyCities: boolean;
  vacancyModalityFilter: string;
  setVacancyModalityFilter: (value: string) => void;
  vacancyContractFilter: string;
  setVacancyContractFilter: (value: string) => void;
  clearVacancyFilters: () => void;
  onClose: () => void;
}

const modalityOptions = ['Remoto', 'Presencial', 'H\u00edbrido'];
const contractOptions = ['CLT', 'PJ', 'Est\u00e1gio', 'Tempor\u00e1rio'];

export function CandidateVacancyFilterDrawer({
  isOpen,
  brazilStates,
  vacancyStateFilter,
  setVacancyStateFilter,
  vacancyCityFilter,
  setVacancyCityFilter,
  vacancyCitiesList,
  isLoadingVacancyCities,
  vacancyModalityFilter,
  setVacancyModalityFilter,
  vacancyContractFilter,
  setVacancyContractFilter,
  clearVacancyFilters,
  onClose,
}: CandidateVacancyFilterDrawerProps) {
  const hasActiveFilters = Boolean(vacancyModalityFilter || vacancyContractFilter || vacancyStateFilter || vacancyCityFilter);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99] bg-slate-900/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 210 }}
            className="company-dashboard-surface fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-2xl border-l border-slate-200/70 bg-[#fbf9ff] text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold tracking-tight text-[#343241]">Filtros de vagas</h2>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">Refine sua busca por local, modelo e contrato.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-400 shadow-sm transition-all hover:text-[#940dff] active:scale-95"
                aria-label="Fechar filtros"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                <div className="mb-4 flex items-center gap-2 text-[#343241]">
                  <MapPin size={17} className="text-[#940dff]" />
                  <h3 className="text-[14px] font-semibold">Local da vaga</h3>
                </div>

                <div className="space-y-4">
                  <FilterSelect label="Estado">
                    <select
                      value={vacancyStateFilter}
                      onChange={(event) => setVacancyStateFilter(event.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-[#343241] outline-none transition-all focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10"
                    >
                      <option value="">Todos os estados</option>
                      {brazilStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </FilterSelect>

                  <FilterSelect label="Cidade">
                    <select
                      value={vacancyCityFilter}
                      onChange={(event) => setVacancyCityFilter(event.target.value)}
                      disabled={!vacancyStateFilter || isLoadingVacancyCities}
                      className="h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-[#343241] outline-none transition-all focus:border-[#940dff]/30 focus:ring-4 focus:ring-[#940dff]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        {isLoadingVacancyCities
                          ? 'Carregando cidades...'
                          : !vacancyStateFilter
                            ? 'Selecione um estado primeiro'
                            : 'Todas as cidades'}
                      </option>
                      {vacancyCitiesList.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </FilterSelect>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                <div className="mb-4 flex items-center gap-2 text-[#343241]">
                  <Briefcase size={17} className="text-[#940dff]" />
                  <h3 className="text-[14px] font-semibold">Formato da oportunidade</h3>
                </div>

                <div className="space-y-4">
                  <FilterChips
                    label="Modalidade"
                    options={modalityOptions}
                    value={vacancyModalityFilter}
                    onChange={setVacancyModalityFilter}
                  />

                  <FilterChips
                    label="Tipo de contrato"
                    options={contractOptions}
                    value={vacancyContractFilter}
                    onChange={setVacancyContractFilter}
                  />
                </div>
              </section>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-slate-200/70 bg-white/75 px-6 py-4">
              <button
                type="button"
                onClick={clearVacancyFilters}
                disabled={!hasActiveFilters}
                className="h-8 rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95"
              >
                Aplicar filtros
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterSelect({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[12px] font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function FilterChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(isActive ? '' : option)}
              className={`h-8 rounded-xl border px-4 text-[12px] font-semibold transition-all ${
                isActive
                  ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff] shadow-sm'
                  : 'border-slate-200/80 bg-white text-slate-500 hover:border-[#940dff]/20 hover:text-[#940dff]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}