import { ChevronDown, ChevronRight, Cpu, Filter, MapPin, X as CloseIcon, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface TalentFilters {
  role: string;
  minAge: number;
  maxAge: number;
  city: string;
  state: string;
  first_job: boolean;
  education: string;
  experience: string;
  modality: string;
  salary: string;
}

interface CompanyTalentFiltersDrawerProps {
  isOpen: boolean;
  filters: TalentFilters;
  setFilters: (filters: TalentFilters) => void;
  brazilStates: string[];
  cities: string[];
  isLoadingCities: boolean;
  onClose: () => void;
  onApply: () => void;
}

const emptyTalentFilters: TalentFilters = {
  role: '',
  minAge: 16,
  maxAge: 60,
  city: '',
  state: '',
  first_job: false,
  education: '',
  experience: '',
  modality: '',
  salary: '',
};

const inputClass = 'h-8 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-medium text-slate-600 outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10';
const selectClass = `${inputClass} appearance-none cursor-pointer pr-8`;

const FieldLabel = ({ children }: { children: string }) => (
  <label className="block text-[12px] font-semibold text-slate-500">{children}</label>
);

export function CompanyTalentFiltersDrawer({
  isOpen,
  filters,
  setFilters,
  brazilStates,
  cities,
  isLoadingCities,
  onClose,
  onApply,
}: CompanyTalentFiltersDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
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
            className="company-dashboard-surface relative z-10 flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/80 bg-[#fbf9ff] shadow-[0_24px_80px_rgba(57,39,96,0.20)]"
          >
            <header className="shrink-0 px-6 pb-4 pt-5 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e5ff] text-[#940dff]">
                    <Filter size={18} className="stroke-[2.4]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Filtros de talentos</h3>
                    <p className="mt-0.5 text-[12px] font-medium leading-tight text-slate-400">Refine a busca por perfil, local e preferências.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white text-slate-400 shadow-sm transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-95"
                  title="Fechar filtros"
                >
                  <CloseIcon size={17} className="stroke-[2.4]" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-6 text-left no-scrollbar">
              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <FieldLabel>Cargo desejado</FieldLabel>
                      <input
                        type="text"
                        value={filters.role}
                        onChange={(event) => setFilters({ ...filters, role: event.target.value })}
                        placeholder="Ex: Gerente de vendas"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>Escolaridade</FieldLabel>
                      <div className="relative">
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={filters.education}
                          onChange={(event) => setFilters({ ...filters, education: event.target.value })}
                          className={selectClass}
                        >
                          <option value="">Qualquer nível</option>
                          <option value="Ensino Médio Cursando">Ensino médio cursando</option>
                          <option value="Ensino Médio Completo">Ensino médio completo</option>
                          <option value="Superior Cursando">Superior cursando</option>
                          <option value="Ensino Superior Completo">Ensino superior completo</option>
                          <option value="Pós-graduação">Pós-graduação</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>Senioridade</FieldLabel>
                      <div className="relative">
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={filters.experience}
                          onChange={(event) => setFilters({ ...filters, experience: event.target.value })}
                          className={selectClass}
                        >
                          <option value="">Qualquer</option>
                          <option value="Estágio">Estágio</option>
                          <option value="Júnior">Júnior</option>
                          <option value="Pleno">Pleno</option>
                          <option value="Sênior">Sênior</option>
                          <option value="Especialista">Especialista</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>UF</FieldLabel>
                      <div className="relative">
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={filters.state}
                          onChange={(event) => setFilters({ ...filters, state: event.target.value, city: '' })}
                          className={selectClass}
                        >
                          <option value="">Todas</option>
                          {brazilStates.map((state) => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>Cidade</FieldLabel>
                      <div className="relative">
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={filters.city}
                          onChange={(event) => setFilters({ ...filters, city: event.target.value })}
                          disabled={!filters.state || isLoadingCities}
                          className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          <option value="">{isLoadingCities ? 'Carregando...' : 'Todas'}</option>
                          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <FieldLabel>Pretensão salarial máxima</FieldLabel>
                      <input
                        type="text"
                        value={filters.salary}
                        onChange={(event) => setFilters({ ...filters, salary: event.target.value })}
                        placeholder="Ex: 5000"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel>Idade mínima</FieldLabel>
                        <span className="text-[12px] font-semibold text-[#940dff]">{filters.minAge} anos</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="60"
                        value={filters.minAge}
                        onChange={(event) => setFilters({ ...filters, minAge: parseInt(event.target.value) })}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#940dff]"
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel>Modalidade de trabalho</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {['Presencial', 'Híbrido', 'Remoto'].map((modality) => (
                          <button
                            key={modality}
                            type="button"
                            onClick={() => setFilters({ ...filters, modality: filters.modality === modality ? '' : modality })}
                            className={`flex h-8 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold transition-all active:scale-95 ${
                              filters.modality === modality
                                ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]'
                                : 'border-slate-200/80 bg-white text-slate-500 hover:border-[#940dff]/18 hover:text-[#940dff]'
                            }`}
                          >
                            {modality === 'Remoto' ? <Cpu size={12} /> : modality === 'Híbrido' ? <Zap size={12} /> : <MapPin size={12} />}
                            {modality}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, first_job: !filters.first_job })}
                      className={`flex h-8 w-full items-center justify-center rounded-xl border px-4 text-[12px] font-semibold transition-all active:scale-[0.99] ${
                        filters.first_job
                          ? 'border-[#63e1a5]/20 bg-[#63e1a5]/14 text-[#2f9f6b]'
                          : 'border-slate-200/80 bg-white text-slate-500 hover:border-[#63e1a5]/20 hover:text-[#2f9f6b]'
                      }`}
                    >
                      Primeiro emprego
                    </button>
                  </div>
                </section>
              </div>
            </div>

            <footer className="flex shrink-0 items-center gap-3 border-t border-white/80 px-6 py-4">
              <button
                type="button"
                onClick={() => setFilters(emptyTalentFilters)}
                className="flex h-8 items-center justify-center rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={onApply}
                className="flex h-8 flex-1 items-center justify-center gap-2 rounded-xl bg-[#940dff] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-[0.99]"
              >
                Aplicar filtros
                <ChevronRight size={13} className="stroke-[2.5]" />
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}